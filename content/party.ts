export const PARTY = {
  name: 'The Sickest Podcast End of Season Party',
  shortName: 'End of Season Party',
  path: '/end-of-season-party',
  // Nov 6, 2026 is after DST ends (Nov 1), so Dallas is on CST (UTC-6).
  startIso: '2026-11-06T17:00:00-06:00',
  endIso: '2026-11-06T20:00:00-06:00',
  startUtc: '20261106T230000Z',
  endUtc: '20261107T020000Z',
  dateLabel: 'Friday, November 6, 2026',
  timeLabel: '5:00 PM – 8:00 PM',
  address: {
    street: '5420 Lyndon B Johnson Freeway, Frontage Rd',
    suite: 'Ste 800',
    city: 'Dallas',
    region: 'TX',
    postalCode: '75240',
  },
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=5420+Lyndon+B+Johnson+Fwy+Ste+800+Dallas+TX+75240',
} as const;

export const PARTY_ADDRESS_LINES = [
  PARTY.address.street,
  PARTY.address.suite,
  `${PARTY.address.city}, ${PARTY.address.region} ${PARTY.address.postalCode}`,
];

export const PARTY_ADDRESS_ONE_LINE = PARTY_ADDRESS_LINES.join(', ');
