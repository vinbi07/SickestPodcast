'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { PARTY, PARTY_ADDRESS_LINES } from '../../content/party';
import { buildGoogleCalendarUrl, buildPartyIcs } from '../../lib/party-rsvp/calendar';
import type { RsvpStatus } from '../../lib/party-rsvp/validation';
import styles from './Rsvp.module.css';

interface RsvpConfirmationProps {
  status: RsvpStatus;
}

function downloadIcs() {
  const blob = new Blob([buildPartyIcs()], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'sickest-podcast-end-of-season-party.ics';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function RsvpConfirmation({ status }: RsvpConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (status === 'declined') {
    return (
      <div className={styles.confirmation}>
        <div className={styles.overline}>RSVP Received</div>
        <h3 ref={headingRef} tabIndex={-1} className={styles.confirmTitle}>
          Thanks for letting us know.
        </h3>
        <p className={styles.confirmCopy}>We appreciate you being part of The Sickest Podcast community.</p>
        <div className={styles.confirmActions}>
          <Link href="/episodes" className={styles.secondaryBtn}>
            Catch Up on Season One
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.confirmation}>
      <div className={styles.overline}>RSVP Confirmed</div>
      <h3 ref={headingRef} tabIndex={-1} className={styles.confirmTitle}>
        You&apos;re on the list.
      </h3>
      <p className={styles.confirmCopy}>We&apos;ll see you at The Sickest Podcast End of Season Party.</p>

      <dl className={styles.confirmDetails}>
        <div>
          <dt>When</dt>
          <dd>
            {PARTY.dateLabel}
            <br />
            {PARTY.timeLabel}
          </dd>
        </div>
        <div>
          <dt>Where</dt>
          <dd>
            <address>
              {PARTY_ADDRESS_LINES.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
          </dd>
        </div>
      </dl>

      <div className={styles.confirmActions}>
        <button type="button" className={styles.primaryBtn} onClick={downloadIcs}>
          Add to Calendar
        </button>
        <a href={buildGoogleCalendarUrl()} className={styles.secondaryBtn} target="_blank" rel="noreferrer">
          Google Calendar<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a href={PARTY.mapsUrl} className={styles.textLink} target="_blank" rel="noreferrer">
          Get Directions<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
