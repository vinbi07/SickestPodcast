'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  GUEST_COUNT_MAX,
  NAME_MAX,
  EMAIL_MAX,
  NOTES_MAX,
  DIETARY_MAX,
  PHONE_MAX,
  validateRsvp,
  type RsvpData,
  type RsvpErrors,
  type RsvpField,
  type RsvpInput,
  type RsvpStatus,
} from '../../lib/party-rsvp/validation';
import { TIMING, useMotionPreference } from '../../motion/presets';
import styles from './Rsvp.module.css';

interface RsvpFormProps {
  onComplete: (status: RsvpStatus, data: RsvpData) => void;
}

type FormValues = Omit<RsvpInput, 'guestCount'> & { guestCount: string; website: string };

const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  rsvpStatus: '',
  guestCount: '1',
  dietaryRestrictions: '',
  notes: '',
  showOnGuestList: true,
  website: '',
};

// Order used to move focus to the first invalid field.
const FIELD_ORDER: RsvpField[] = ['rsvpStatus', 'guestCount', 'firstName', 'lastName', 'email', 'phone', 'dietaryRestrictions', 'notes'];

const GENERIC_ERROR = "We couldn't complete your registration right now. Please try again.";

type Notice = { tone: 'error' | 'info'; message: string } | null;

export default function RsvpForm({ onComplete }: RsvpFormProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const prefersReducedMotion = useMotionPreference();

  const attending = values.rsvpStatus === 'attending';

  const focusFirstInvalid = (nextErrors: RsvpErrors) => {
    const field = FIELD_ORDER.find((name) => nextErrors[name]);
    if (!field) return;
    const target = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    target?.focus();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const nextValue =
      event.target instanceof HTMLInputElement && event.target.type === 'checkbox' ? event.target.checked : value;
    setValues((prev) => ({ ...prev, [name]: nextValue }));
    if (name in errors) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as RsvpField];
        return next;
      });
    }
    if (notice) setNotice(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;

    const result = validateRsvp(values);
    if (!result.ok) {
      setErrors(result.errors);
      setNotice({ tone: 'error', message: 'Please fix the highlighted fields and try again.' });
      focusFirstInvalid(result.errors);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setErrors({});
    setNotice(null);

    try {
      const response = await fetch('/api/party-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...result.data, website: values.website }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        status?: RsvpStatus;
        error?: string;
        code?: string;
        fieldErrors?: RsvpErrors;
      };

      if (response.ok) {
        onComplete(body.status === 'declined' ? 'declined' : result.data.rsvpStatus, result.data);
        return;
      }

      if (response.status === 409 && body.code === 'duplicate') {
        setNotice({ tone: 'info', message: body.error ?? "Looks like you've already registered for the End of Season Party." });
      } else if (response.status === 422 && body.fieldErrors) {
        setErrors(body.fieldErrors);
        setNotice({ tone: 'error', message: body.error ?? 'Please fix the highlighted fields and try again.' });
        focusFirstInvalid(body.fieldErrors);
      } else {
        setNotice({ tone: 'error', message: body.error ?? GENERIC_ERROR });
      }
    } catch {
      setNotice({ tone: 'error', message: GENERIC_ERROR });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  const describedBy = (name: RsvpField, extra?: string) =>
    [extra, errors[name] ? `${name}-error` : null].filter(Boolean).join(' ') || undefined;

  const fieldError = (name: RsvpField) =>
    errors[name] ? (
      <p id={`${name}-error`} className={styles.error}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} method="post" className={styles.form} onSubmit={handleSubmit} noValidate aria-busy={submitting}>
      <fieldset className={styles.fieldset}>
        <legend id="rsvpStatus-legend" className={styles.legend}>
          Will you be there? <span className={styles.required}>Required</span>
        </legend>
        <div
          className={styles.choices}
          role="radiogroup"
          aria-labelledby="rsvpStatus-legend"
          aria-required="true"
          aria-invalid={Boolean(errors.rsvpStatus)}
          aria-describedby={describedBy('rsvpStatus')}
        >
          <label className={styles.choice}>
            <input
              type="radio"
              name="rsvpStatus"
              value="attending"
              checked={values.rsvpStatus === 'attending'}
              onChange={handleChange}
            />
            <span className={styles.choiceBody}>
              <span className={styles.choiceMark} aria-hidden="true" />
              <span className={styles.choiceTitle}>Yes, I&apos;ll be there</span>
              <span className={styles.choiceHint}>Count me in for the finale.</span>
            </span>
          </label>
          <label className={styles.choice}>
            <input
              type="radio"
              name="rsvpStatus"
              value="declined"
              checked={values.rsvpStatus === 'declined'}
              onChange={handleChange}
            />
            <span className={styles.choiceBody}>
              <span className={styles.choiceMark} aria-hidden="true" />
              <span className={styles.choiceTitle}>Unable to attend</span>
              <span className={styles.choiceHint}>I&apos;ll catch the next one.</span>
            </span>
          </label>
        </div>
        {fieldError('rsvpStatus')}
      </fieldset>

      <AnimatePresence initial={false}>
        {attending ? (
          <motion.fieldset
            key="guests"
            className={`${styles.fieldset} ${styles.guestFieldset}`}
            aria-describedby={describedBy('guestCount', 'guestCount-help')}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: TIMING.STANDARD }}
          >
            <legend className={styles.legend}>Number of Guests</legend>
            <div className={styles.pills}>
              {Array.from({ length: GUEST_COUNT_MAX }, (_, index) => String(index + 1)).map((count) => (
                <label key={count} className={styles.pill}>
                  <input
                    type="radio"
                    name="guestCount"
                    value={count}
                    checked={values.guestCount === count}
                    onChange={handleChange}
                  />
                  <span>{count === '1' ? 'Just me' : `Me + ${Number(count) - 1}`}</span>
                </label>
              ))}
            </div>
            <p id="guestCount-help" className={styles.helper}>
              Total in your party, including you. Limit one guest per registration.
            </p>
            {fieldError('guestCount')}
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="showOnGuestList"
                checked={values.showOnGuestList}
                onChange={handleChange}
              />
              <span>
                Show my first name on the guest list
                <small>Only your first name appears. Uncheck to be counted without your name.</small>
              </span>
            </label>
          </motion.fieldset>
        ) : null}
      </AnimatePresence>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            autoComplete="given-name"
            maxLength={NAME_MAX}
            required
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={describedBy('firstName')}
          />
          {fieldError('firstName')}
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            autoComplete="family-name"
            maxLength={NAME_MAX}
            required
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={describedBy('lastName')}
          />
          {fieldError('lastName')}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            value={values.email}
            onChange={handleChange}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={EMAIL_MAX}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
          />
          {fieldError('email')}
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={values.phone}
            onChange={handleChange}
            autoComplete="tel"
            maxLength={PHONE_MAX}
            required
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy('phone')}
          />
          {fieldError('phone')}
        </div>
      </div>

      {attending ? (
        <div className={styles.field}>
          <label htmlFor="dietaryRestrictions">
            Dietary Restrictions <span className={styles.optional}>Optional</span>
          </label>
          <input
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={values.dietaryRestrictions}
            onChange={handleChange}
            maxLength={DIETARY_MAX}
            placeholder="e.g. vegetarian, gluten-free, nut allergy"
            aria-invalid={Boolean(errors.dietaryRestrictions)}
            aria-describedby={describedBy('dietaryRestrictions', 'dietaryRestrictions-help')}
          />
          <p id="dietaryRestrictions-help" className={styles.helper}>
            {values.guestCount === '2' ? 'Include any for your guest too.' : 'Leave blank if none.'}
          </p>
          {fieldError('dietaryRestrictions')}
        </div>
      ) : null}

      <div className={styles.field}>
        <label htmlFor="notes">
          Notes <span className={styles.optional}>Optional</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          value={values.notes}
          onChange={handleChange}
          maxLength={NOTES_MAX}
          placeholder="Anything you'd like us to know?"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={describedBy('notes', 'notes-count')}
        />
        <p id="notes-count" className={styles.counter}>
          {values.notes.length}/{NOTES_MAX}
        </p>
        {fieldError('notes')}
      </div>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
      </div>

      <div role="alert" className={styles.alertRegion}>
        {notice ? (
          <p className={`${styles.notice} ${notice.tone === 'info' ? styles.noticeInfo : styles.noticeError}`}>
            {notice.message}
          </p>
        ) : null}
      </div>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? (
          <>
            <span className={styles.spinner} aria-hidden="true" /> Registering…
          </>
        ) : (
          'Confirm RSVP'
        )}
      </button>
    </form>
  );
}
