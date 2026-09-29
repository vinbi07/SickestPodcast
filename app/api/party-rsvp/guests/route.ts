import { NextResponse } from 'next/server';
import { SheetsError } from '../../../../lib/party-rsvp/google-sheets';
import { getGuestList } from '../../../../lib/party-rsvp/guest-list';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public, read-only: headcount + opted-in first names only. */
export async function GET() {
  try {
    const { going, guests } = await getGuestList();
    return NextResponse.json(
      { available: true, going, guests },
      // Short CDN cache keeps Google Sheets reads low under traffic spikes.
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120' } },
    );
  } catch (error) {
    if (error instanceof SheetsError) {
      console.error(`[party-rsvp] Guest list unavailable: Google Sheets ${error.kind} error${error.status ? ` (HTTP ${error.status})` : ''}`);
    } else {
      console.error('[party-rsvp] Guest list unexpected error:', error instanceof Error ? error.message : 'unknown');
    }
    // The UI simply hides the guest list; nothing about the failure is exposed.
    return NextResponse.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
