/**
 * Public guest list derived from the RSVP sheet. Server-only. Exposes ONLY an
 * attendee headcount and the first names of attendees who opted in — never
 * emails, phones, last names, or notes.
 */
import { readRows } from './google-sheets';
import { GUEST_COUNT_MAX, GUEST_COUNT_MIN, NAME_MAX, RSVP_STATUS_LABELS } from './validation';

export interface PublicGuest {
  firstName: string;
  /** Additional guests they're bringing (0 or 1). */
  plus: number;
}

export interface GuestList {
  /** Total headcount of attendees, including +1s and people not shown by name. */
  going: number;
  /** Opted-in attendees, most recent first. */
  guests: PublicGuest[];
}

// Sheet columns (0-based): A Timestamp … F RSVP Status, G Guest Count, J Show on Guest List.
const COL = { firstName: 1, status: 5, guestCount: 6, showOnList: 9 } as const;
const CACHE_TTL_MS = 60_000;

let cache: { value: GuestList; expiresAt: number } | null = null;

function toGuestCount(raw: string | undefined): number {
  const parsed = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(parsed)) return GUEST_COUNT_MIN;
  return Math.min(Math.max(parsed, GUEST_COUNT_MIN), GUEST_COUNT_MAX);
}

export async function getGuestList(): Promise<GuestList> {
  if (cache && cache.expiresAt > Date.now()) return cache.value;

  const rows = await readRows();
  let going = 0;
  const guests: PublicGuest[] = [];

  for (const row of rows) {
    if (row[COL.status]?.trim() !== RSVP_STATUS_LABELS.attending) continue;
    const count = toGuestCount(row[COL.guestCount]);
    going += count;

    // Only an explicit "Yes" is shown — blank (older rows) or "No" stays private.
    const firstName = row[COL.firstName]?.trim().slice(0, NAME_MAX);
    if (firstName && row[COL.showOnList]?.trim().toLowerCase() === 'yes') {
      guests.push({ firstName, plus: count - 1 });
    }
  }

  const value = { going, guests: guests.reverse() };
  cache = { value, expiresAt: Date.now() + CACHE_TTL_MS };
  return value;
}

/** Call after a successful append so the next read reflects the new RSVP. */
export function invalidateGuestList(): void {
  cache = null;
}
