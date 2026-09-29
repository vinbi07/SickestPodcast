'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PARTY, PARTY_ADDRESS_LINES } from '../../content/party';
import {
  fadeInScaleVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  textLineVariants,
  TIMING,
  useMotionPreference,
} from '../../motion/presets';
import { RSVP_SECTION_ID, RSVP_HEADING_ID } from './RsvpSection';
import styles from './PartyHero.module.css';

export default function PartyHero() {
  const prefersReducedMotion = useMotionPreference();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) videoRef.current?.pause();
  }, [prefersReducedMotion]);

  const handleRegister = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(RSVP_SECTION_ID);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    // Focus the heading (not an input) so mobile keyboards don't pop open mid-scroll.
    document.getElementById(RSVP_HEADING_ID)?.focus({ preventScroll: true });
  };

  return (
    <section className={styles.hero} aria-labelledby="party-title">
      <div className={styles.videoBg} aria-hidden="true">
        <video ref={videoRef} autoPlay muted loop playsInline preload="metadata">
          <source src="/HeroVideoBg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={`container ${styles.inner}`}>
        <motion.div className={styles.tag} initial="hidden" animate="visible" variants={fadeInScaleVariants} custom={0}>
          <span /> Season One Finale · You&apos;re Invited
        </motion.div>

        <motion.h1
          id="party-title"
          className={styles.title}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(TIMING.STAGGER_STANDARD, TIMING.FAST)}
        >
          <motion.span className={styles.kicker} variants={textLineVariants} custom={0}>
            The Sickest Podcast
          </motion.span>{' '}
          <motion.span className={styles.headline} variants={textLineVariants} custom={0.12}>
            End of Season <em>Party</em>
          </motion.span>
        </motion.h1>

        <motion.p
          className={styles.subtitle}
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          custom={TIMING.STANDARD * 2}
        >
          Season one deserves a proper sendoff.
        </motion.p>

        <motion.dl
          className={styles.ticket}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.08, TIMING.STANDARD * 2.4)}
        >
          <motion.div className={styles.stub} variants={staggerItemVariants}>
            <dt>Date</dt>
            <dd>{PARTY.dateLabel}</dd>
          </motion.div>
          <motion.div className={styles.stub} variants={staggerItemVariants}>
            <dt>Time</dt>
            <dd>{PARTY.timeLabel}</dd>
          </motion.div>
          <motion.div className={`${styles.stub} ${styles.stubWide}`} variants={staggerItemVariants}>
            <dt>Location</dt>
            <dd>
              <address>
                {PARTY_ADDRESS_LINES.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </dd>
          </motion.div>
        </motion.dl>

        <motion.div
          className={styles.actions}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.1, TIMING.STANDARD * 3)}
        >
          <motion.a
            href={`#${RSVP_SECTION_ID}`}
            className={styles.cta}
            onClick={handleRegister}
            variants={staggerItemVariants}
            whileTap={{ scale: 0.98 }}
          >
            Register Now
          </motion.a>
          <motion.a
            href={PARTY.mapsUrl}
            className={styles.link}
            target="_blank"
            rel="noreferrer"
            variants={staggerItemVariants}
          >
            Get Directions<span className="sr-only"> (opens in a new tab)</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
