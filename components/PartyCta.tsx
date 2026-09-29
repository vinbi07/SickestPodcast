'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PARTY, PARTY_ADDRESS_LINES } from '../content/party';
import { scrollTriggerConfig, staggerContainerVariants, staggerItemVariants } from '../motion/presets';
import styles from './PartyCta.module.css';

export default function PartyCta() {
  return (
    <section className={styles.section} id="party" aria-labelledby="party-cta-title">
      <div className="container">
        <motion.div
          className={styles.card}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.08)}
        >
          <div className={styles.copy}>
            <motion.div className={styles.tag} variants={staggerItemVariants}>
              <span /> Season One Finale · You&apos;re Invited
            </motion.div>
            <motion.h2 id="party-cta-title" className={styles.title} variants={staggerItemVariants}>
              End of Season <em>Party</em>
            </motion.h2>
            <motion.p className={styles.subtitle} variants={staggerItemVariants}>
              Season one deserves a proper sendoff.
            </motion.p>
          </div>

          <motion.dl className={styles.details} variants={staggerItemVariants}>
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
                {PARTY_ADDRESS_LINES[0]}
                <br />
                {PARTY_ADDRESS_LINES[1]}, {PARTY_ADDRESS_LINES[2]}
              </dd>
            </div>
          </motion.dl>

          <motion.div className={styles.actions} variants={staggerItemVariants}>
            <Link href={`${PARTY.path}#rsvp`} className={styles.cta}>
              RSVP Now
            </Link>
            <Link href={PARTY.path} className={styles.link}>
              Event Details
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
