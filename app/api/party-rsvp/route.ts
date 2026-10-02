import { NextResponse, type NextRequest } from 'next/server';
import { appendRow, listRegisteredEmails, SheetsError } from '../../../lib/party-rsvp/google-sheets';
import { invalidateGuestList } from '../../../lib/party-rsvp/guest-list';
import { isRateLimited } from '../../../lib/party-rsvp/rate-limit';
import { normalizeEmail, RSVP_STATUS_LABELS, validateRsvp } from '../../../lib/party-rsvp/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 8 * 1024;
const SOURCE = 'Sickest Podcast Website';
const TIMEZONE = 'America/Chicago';

const MESSAGES = {
  generic: "We couldn't complete your registration right now. Please try again.",
  malformed: 'Something went wrong with your submission. Please refresh the page and try again.',
  invalid: 'Please fix the highlighted fields and try again.',
  duplicate: "Looks like you've already registered for the End of Season Party.",
  rateLimited: 'Too many attempts. Please wait a few minutes and try again.',
  tooLarge: 'Your submission is too large. Please shorten your notes and try again.',
};

function json(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown';
}

/** e.g. "2026-10-01 2:05:12 PM CDT" in Dallas time. */
function formatTimestamp(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second} ${parts.dayPeriod} ${parts.timeZoneName}`;
}

export async function POST(request: NextRequest) {
  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: MESSAGES.tooLarge }, 413);
  }

  if (isRateLimited(clientKey(request))) {
    return json({ error: MESSAGES.rateLimited }, 429);
  }

  let payload: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, 'utf8') > MAX_BODY_BYTES) {
      return json({ error: MESSAGES.tooLarge }, 413);
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    payload = parsed as Record<string, unknown>;
  } catch {
    return json({ error: MESSAGES.malformed }, 400);
  }

  // Honeypot: bots get a convincing success and nothing is written.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json({ ok: true, status: payload.rsvpStatus === 'declined' ? 'declined' : 'attending' }, 200);
  }

  const result = validateRsvp({
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    organization: payload.organization,
    rsvpStatus: payload.rsvpStatus,
    guestCount: payload.guestCount,
    guestName: payload.guestName,
    dietaryRestrictions: payload.dietaryRestrictions,
    notes: payload.notes,
    showOnGuestList: payload.showOnGuestList,
  });

  if (!result.ok) {
    return json({ error: MESSAGES.invalid, fieldErrors: result.errors }, 422);
  }

  const rsvp = result.data;

  try {
    const existing = await listRegisteredEmails(normalizeEmail);
    if (existing.has(rsvp.email)) {
      return json({ error: MESSAGES.duplicate, code: 'duplicate' }, 409);
    }

    // Timestamp and Source are always generated here — never taken from the client.
    await appendRow([
      formatTimestamp(new Date()),
      rsvp.firstName,
      rsvp.lastName,
      rsvp.email,
      rsvp.phone,
      RSVP_STATUS_LABELS[rsvp.rsvpStatus],
      rsvp.guestCount,
      rsvp.notes,
      SOURCE,
      rsvp.showOnGuestList ? 'Yes' : 'No',
      rsvp.dietaryRestrictions,
      rsvp.guestName,
      rsvp.organization,
    ]);
    invalidateGuestList();

    return json({ ok: true, status: rsvp.rsvpStatus }, 200);
  } catch (error) {
    if (error instanceof SheetsError) {
      // Category + HTTP status only: no credentials, sheet IDs, or Google response bodies.
      console.error(`[party-rsvp] Google Sheets ${error.kind} error${error.status ? ` (HTTP ${error.status})` : ''}: ${error.message}`);
      return json({ error: MESSAGES.generic }, error.kind === 'config' ? 503 : 502);
    }
    console.error('[party-rsvp] Unexpected error:', error instanceof Error ? error.message : 'unknown');
    return json({ error: MESSAGES.generic }, 500);
  }
}
