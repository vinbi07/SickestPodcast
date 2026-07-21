export const BOOKING_TYPES = {
  KEYNOTE: 'keynote',
  ADVISORY: 'advisory',
  SPEAKING: 'speaking',
} as const;

export type BookingType = (typeof BOOKING_TYPES)[keyof typeof BOOKING_TYPES];

export const DEFAULT_BOOKING_TYPE: BookingType = BOOKING_TYPES.KEYNOTE;

export const BOOKING_TYPE_LABELS: Record<BookingType, string> = {
  [BOOKING_TYPES.KEYNOTE]: 'Book a Keynote',
  [BOOKING_TYPES.ADVISORY]: 'VIP Advisory',
  [BOOKING_TYPES.SPEAKING]: 'Speaking Inquiry',
};

export const BOOKING_TYPE_OPTIONS = [
  {
    value: BOOKING_TYPES.KEYNOTE,
    label: BOOKING_TYPE_LABELS[BOOKING_TYPES.KEYNOTE],
    description: 'Events, conferences, and company off-sites.',
  },
  {
    value: BOOKING_TYPES.ADVISORY,
    label: BOOKING_TYPE_LABELS[BOOKING_TYPES.ADVISORY],
    description: 'Ongoing operator support and monthly strategy calls.',
  },
  {
    value: BOOKING_TYPES.SPEAKING,
    label: BOOKING_TYPE_LABELS[BOOKING_TYPES.SPEAKING],
    description: 'Podcast interviews, panels, and media appearances.',
  },
];

export function isValidBookingType(value: string | null): value is BookingType {
  return BOOKING_TYPE_OPTIONS.some((option) => option.value === value);
}
