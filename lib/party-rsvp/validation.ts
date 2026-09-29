/**
 * Shared RSVP validation — runs in the browser for instant feedback and again on
 * the server as the source of truth. Keep this module free of server-only imports.
 */

export const RSVP_STATUSES = ['attending', 'declined'] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  attending: 'Attending',
  declined: 'Unable to Attend',
};

export const GUEST_COUNT_MIN = 1;
export const GUEST_COUNT_MAX = 2;
export const NAME_MAX = 60;
export const EMAIL_MAX = 254;
export const PHONE_MAX = 25;
export const NOTES_MAX = 500;
export const DIETARY_MAX = 200;

export interface RsvpInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: RsvpStatus | '';
  guestCount: number | string;
  dietaryRestrictions: string;
  notes: string;
  showOnGuestList: boolean;
}

export interface RsvpData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  rsvpStatus: RsvpStatus;
  guestCount: number;
  /** Attendees only; covers the registrant and their +1. */
  dietaryRestrictions: string;
  notes: string;
  /** Attendee opted in to having their first name shown on the public guest list. */
  showOnGuestList: boolean;
}

export type RsvpField = keyof RsvpInput;
export type RsvpErrors = Partial<Record<RsvpField, string>>;

export type RsvpValidationResult = { ok: true; data: RsvpData } | { ok: false; errors: RsvpErrors };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_ALLOWED = /^\+?[\d\s().-]+$/;
// Control characters (except tab/newline in notes) have no business in a sheet cell.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function cleanLine(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function cleanMultiline(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(CONTROL_CHARS, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function normalizeEmail(value: unknown): string {
  return cleanLine(value).replace(/\s+/g, '').toLowerCase();
}

export function validateRsvp(input: Partial<Record<RsvpField, unknown>>): RsvpValidationResult {
  const errors: RsvpErrors = {};

  const firstName = cleanLine(input.firstName);
  const lastName = cleanLine(input.lastName);
  const email = normalizeEmail(input.email);
  const phone = cleanLine(input.phone);
  const notes = cleanMultiline(input.notes);
  const dietaryRestrictions = cleanLine(input.dietaryRestrictions);
  const rsvpStatus = input.rsvpStatus;

  if (!firstName) errors.firstName = 'First name is required.';
  else if (firstName.length > NAME_MAX) errors.firstName = `First name must be ${NAME_MAX} characters or fewer.`;

  if (!lastName) errors.lastName = 'Last name is required.';
  else if (lastName.length > NAME_MAX) errors.lastName = `Last name must be ${NAME_MAX} characters or fewer.`;

  if (!email) errors.email = 'Email is required.';
  else if (email.length > EMAIL_MAX || !EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email address.';

  const phoneDigits = phone.replace(/\D/g, '');
  if (!phone) errors.phone = 'Phone number is required.';
  else if (
    phone.length > PHONE_MAX ||
    !PHONE_ALLOWED.test(phone) ||
    phoneDigits.length < 10 ||
    phoneDigits.length > 15
  ) {
    errors.phone = 'Please enter a valid phone number.';
  }

  const status = RSVP_STATUSES.find((value) => value === rsvpStatus);
  if (!status) errors.rsvpStatus = 'Please let us know if you can make it.';

  let guestCount = 0;
  if (status === 'attending') {
    const raw = input.guestCount;
    const parsed = typeof raw === 'number' ? raw : typeof raw === 'string' && /^\d+$/.test(raw.trim()) ? Number(raw) : NaN;
    if (!Number.isInteger(parsed) || parsed < GUEST_COUNT_MIN || parsed > GUEST_COUNT_MAX) {
      errors.guestCount = `Guest count must be between ${GUEST_COUNT_MIN} and ${GUEST_COUNT_MAX}.`;
    } else {
      guestCount = parsed;
    }
  }

  if (status === 'attending' && dietaryRestrictions.length > DIETARY_MAX) {
    errors.dietaryRestrictions = `Dietary restrictions must be ${DIETARY_MAX} characters or fewer.`;
  }

  if (notes.length > NOTES_MAX) errors.notes = `Notes must be ${NOTES_MAX} characters or fewer.`;

  if (Object.keys(errors).length > 0 || !status) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      firstName,
      lastName,
      email,
      phone,
      rsvpStatus: status,
      guestCount,
      dietaryRestrictions: status === 'attending' ? dietaryRestrictions : '',
      notes,
      // Explicit opt-in only; never shown for declines.
      showOnGuestList: status === 'attending' && input.showOnGuestList === true,
    },
  };
}
