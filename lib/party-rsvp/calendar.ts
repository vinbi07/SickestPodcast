import { PARTY, PARTY_ADDRESS_ONE_LINE } from '../../content/party';

const DESCRIPTION = 'Season one deserves a proper sendoff. See you there.';

function escapeIcs(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildPartyIcs(now = new Date()): string {
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//The Sickest Podcast//End of Season Party//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:end-of-season-party-2026@thesickestpodcast.com',
    `DTSTAMP:${stamp}`,
    `DTSTART:${PARTY.startUtc}`,
    `DTEND:${PARTY.endUtc}`,
    `SUMMARY:${escapeIcs(PARTY.name)}`,
    `DESCRIPTION:${escapeIcs(DESCRIPTION)}`,
    `LOCATION:${escapeIcs(PARTY_ADDRESS_ONE_LINE)}`,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].join('\r\n');
}

export function buildGoogleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: PARTY.name,
    dates: `${PARTY.startUtc}/${PARTY.endUtc}`,
    details: DESCRIPTION,
    location: PARTY_ADDRESS_ONE_LINE,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
