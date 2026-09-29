'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PARTY, PARTY_ADDRESS_LINES } from '../../content/party';
import { EASING, TIMING, useMotionPreference } from '../../motion/presets';
import type { RsvpData, RsvpStatus } from '../../lib/party-rsvp/validation';
import GuestList, { type SelfGuest } from './GuestList';
import RsvpForm from './RsvpForm';
import RsvpConfirmation from './RsvpConfirmation';
import styles from './Rsvp.module.css';

export const RSVP_SECTION_ID = 'rsvp';
export const RSVP_HEADING_ID = 'rsvp-heading';

export default function RsvpSection() {
  const [completed, setCompleted] = useState<RsvpStatus | null>(null);
  const [self, setSelf] = useState<SelfGuest | null>(null);

  const handleComplete = (status: RsvpStatus, data: RsvpData) => {
    setCompleted(status);
    if (status === 'attending') {
      setSelf({ firstName: data.firstName, plus: data.guestCount - 1, shown: data.showOnGuestList });
    }
  };
  const prefersReducedMotion = useMotionPreference();

  const panelMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
      };

  return (
    <section id={RSVP_SECTION_ID} className={styles.section} aria-labelledby={RSVP_HEADING_ID}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.intro}>
          <div className={styles.overline}>RSVP</div>
          <h2 id={RSVP_HEADING_ID} className={styles.heading} tabIndex={-1}>
            Save your spot.
          </h2>
          <p className={styles.lede}>
            Registration is required for entry. Tell us you&apos;re coming, or let us know if you can&apos;t make it.
          </p>

          <GuestList self={self} />

          <div className={styles.pass} aria-hidden="true">
            <div className={styles.passHead}>
              <span>Admit</span>
              <strong>Season One Finale</strong>
            </div>
            <div className={styles.passRow}>
              <span>{PARTY.dateLabel}</span>
              <span>{PARTY.timeLabel}</span>
            </div>
            <div className={styles.passAddress}>
              {PARTY_ADDRESS_LINES.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <AnimatePresence mode="wait" initial={false}>
            {completed ? (
              <motion.div
                key="confirmation"
                {...panelMotion}
                transition={{ duration: TIMING.SLOW, ease: EASING.OUT }}
              >
                <RsvpConfirmation status={completed} />
              </motion.div>
            ) : (
              <motion.div key="form" {...panelMotion} transition={{ duration: TIMING.STANDARD, ease: EASING.OUT }}>
                <RsvpForm onComplete={handleComplete} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
