import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  BOOKING_TYPE_LABELS,
  BOOKING_TYPE_OPTIONS,
  DEFAULT_BOOKING_TYPE,
  isValidBookingType
} from '../data/booking';
import styles from './BookingPage.module.css';

const footerColumns = [
  { title: 'The Show', items: ['Episodes', 'Season 1 Guests', 'About the Show', 'Watch on YouTube'] },
  { title: 'Paden Sickles', items: ['About Paden', 'Book a Keynote', 'VIP Advisory', 'Speaking Inquiries'] },
  { title: 'SickFit', items: ['Shop SickFit', 'Brand Partners', 'Retail Inquiries', 'sickfitofficial.com'] },
  { title: 'Connect', items: ['Instagram', 'TikTok', 'LinkedIn', 'YouTube'] }
];

export default function BookingPage() {
  const bookingEndpoint = import.meta.env.VITE_BOOKING_ENDPOINT;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef(null);
  const mountedAtRef = useRef(Date.now());

  const serviceTypeFromQuery = searchParams.get('type');
  const initialType = isValidBookingType(serviceTypeFromQuery)
    ? serviceTypeFromQuery
    : DEFAULT_BOOKING_TYPE;

  const [formValues, setFormValues] = useState({
    serviceType: initialType,
    name: '',
    email: '',
    phone: '',
    organization: '',
    eventDate: '',
    timeframe: '',
    message: '',
    website: ''
  });
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    setFormValues((prev) => ({ ...prev, serviceType: initialType }));
  }, [initialType]);

  const headingText = useMemo(() => {
    return BOOKING_TYPE_LABELS[formValues.serviceType] || BOOKING_TYPE_LABELS[DEFAULT_BOOKING_TYPE];
  }, [formValues.serviceType]);

  const handleBooking = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      const firstInput = formRef.current?.querySelector('input[name="name"]');
      firstInput?.focus();
    }, 100);
  };

  const validate = () => {
    const nextErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isValidBookingType(formValues.serviceType)) {
      nextErrors.serviceType = 'Please choose a valid booking type.';
    }

    if (!formValues.name.trim()) {
      nextErrors.name = 'Name is required.';
    }

    if (!emailRegex.test(formValues.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (formValues.phone.trim().length < 7) {
      nextErrors.phone = 'Please enter a valid phone number.';
    }

    if (!formValues.organization.trim()) {
      nextErrors.organization = 'Organization is required.';
    }

    if (!formValues.eventDate.trim() && !formValues.timeframe.trim()) {
      nextErrors.eventDate = 'Please choose an event date or share a timeframe.';
      nextErrors.timeframe = 'Please choose an event date or share a timeframe.';
    }

    if (formValues.message.trim().length < 5) {
      nextErrors.message = 'Please add a short note about what you need.';
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'serviceType') {
      setSearchParams({ type: value });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitState({ status: 'error', message: 'Please fix the highlighted fields and try again.' });
      return;
    }

    if (formValues.website.trim()) {
      setSubmitState({ status: 'success', message: 'Thanks. Your request has been submitted.' });
      return;
    }

    if (Date.now() - mountedAtRef.current < 2200) {
      setSubmitState({
        status: 'error',
        message: 'Submission was too fast to verify. Please review your details and submit again.'
      });
      return;
    }

    if (!bookingEndpoint) {
      setSubmitState({
        status: 'error',
        message: 'Booking endpoint is not configured yet. Email support@sickfitofficial.com for now.'
      });
      return;
    }

    setSubmitState({ status: 'submitting', message: '' });

    try {
      const payload = new FormData();
      payload.set('serviceType', formValues.serviceType);
      payload.set('serviceTypeLabel', headingText);
      payload.set('name', formValues.name.trim());
      payload.set('email', formValues.email.trim());
      payload.set('phone', formValues.phone.trim());
      payload.set('organization', formValues.organization.trim());
      payload.set('eventDate', formValues.eventDate.trim());
      payload.set('timeframe', formValues.timeframe.trim());
      payload.set('message', formValues.message.trim());
      payload.set('sourcePath', `${location.pathname}${location.search}`);

      const response = await fetch(bookingEndpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: payload
      });

      if (!response.ok) {
        throw new Error('Unable to submit booking request.');
      }

      setSubmitState({
        status: 'success',
        message: 'Request received. You will get a response within 5-7 business days.'
      });
      setErrors({});
      setFormValues({
        serviceType: formValues.serviceType,
        name: '',
        email: '',
        phone: '',
        organization: '',
        eventDate: '',
        timeframe: '',
        message: '',
        website: ''
      });
    } catch (error) {
      setSubmitState({
        status: 'error',
        message: 'Submission failed. Please try again or email support@sickfitofficial.com.'
      });
    }
  };

  return (
    <div>
      <Navbar
        brand={{ prefix: 'THE', highlight: 'SICKEST', suffix: 'PODCAST' }}
        links={[
          { label: 'Episodes', href: '/#episodes' },
          { label: 'Guests', href: '/#guests' },
          { label: 'About', href: '/#about' }
        ]}
        onBook={handleBooking}
      />

      <main className={styles.page}>
        <section className={`container ${styles.hero}`}>
          <div className={styles.overline}>Booking</div>
          <h1>{headingText}</h1>
          <p>
            Share a few details and we will follow up with availability, fit, and next steps.
          </p>

          <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span>Request Type</span>
              <select name="serviceType" value={formValues.serviceType} onChange={handleChange}>
                {BOOKING_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small className={styles.helper}>
                {BOOKING_TYPE_OPTIONS.find((option) => option.value === formValues.serviceType)?.description}
              </small>
              {errors.serviceType ? <span className={styles.error}>{errors.serviceType}</span> : null}
            </label>

            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Name</span>
                <input name="name" value={formValues.name} onChange={handleChange} autoComplete="name" />
                {errors.name ? <span className={styles.error}>{errors.name}</span> : null}
              </label>

              <label className={styles.field}>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email ? <span className={styles.error}>{errors.email}</span> : null}
              </label>

              <label className={styles.field}>
                <span>Phone</span>
                <input name="phone" value={formValues.phone} onChange={handleChange} autoComplete="tel" />
                {errors.phone ? <span className={styles.error}>{errors.phone}</span> : null}
              </label>

              <label className={styles.field}>
                <span>Organization</span>
                <input
                  name="organization"
                  value={formValues.organization}
                  onChange={handleChange}
                  autoComplete="organization"
                />
                {errors.organization ? <span className={styles.error}>{errors.organization}</span> : null}
              </label>

              <label className={styles.field}>
                <span>Event Date</span>
                <input
                  name="eventDate"
                  type="date"
                  value={formValues.eventDate}
                  onChange={handleChange}
                />
                <small className={styles.helper}>Calendar format. Submitted as YYYY-MM-DD.</small>
                {errors.eventDate ? <span className={styles.error}>{errors.eventDate}</span> : null}
              </label>

              <label className={styles.field}>
                <span>Timeframe</span>
                <input
                  name="timeframe"
                  value={formValues.timeframe}
                  onChange={handleChange}
                  placeholder="Example: Q3 2026, next 60 days, late spring"
                />
                <small className={styles.helper}>Use this if you do not have an exact date yet.</small>
                {errors.timeframe ? <span className={styles.error}>{errors.timeframe}</span> : null}
              </label>
            </div>

            <label className={styles.field}>
              <span>Message and Goals</span>
              <textarea name="message" rows="5" value={formValues.message} onChange={handleChange} />
              {errors.message ? <span className={styles.error}>{errors.message}</span> : null}
            </label>

            <label className={styles.honeypot} aria-hidden="true">
              <span>Website</span>
              <input
                tabIndex="-1"
                autoComplete="off"
                name="website"
                value={formValues.website}
                onChange={handleChange}
              />
            </label>

            {submitState.message ? (
              <div
                className={`${styles.notice} ${
                  submitState.status === 'success' ? styles.noticeSuccess : styles.noticeError
                }`}
              >
                {submitState.message}
              </div>
            ) : null}

            <div className={styles.actions}>
              <button type="submit" disabled={submitState.status === 'submitting'}>
                {submitState.status === 'submitting' ? 'Submitting...' : 'Submit Booking Request'}
              </button>
              <button type="button" className={styles.ghost} onClick={handleBooking}>
                Jump to Form
              </button>
              <Link to="/">Back to Home</Link>
            </div>
          </form>

          <div className={styles.meta}>
            <span>Prefer direct email? support@sickfitofficial.com</span>
            <span>Typical response time: 5-7 business days.</span>
          </div>
        </section>
      </main>

      <Footer
        columns={footerColumns}
        tagline="People who were not supposed to win. Exactly how they did it."
      />
    </div>
  );
}