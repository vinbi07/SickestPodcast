'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './HostSection.module.css';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, TIMING } from '../motion/presets';
import type { Host } from '../content/host';

interface HostSectionProps {
  host: Host;
  keynoteHref: string;
  advisoryHref: string;
}

export default function HostSection({ host, keynoteHref, advisoryHref }: HostSectionProps) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.08)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            Your Host
          </motion.div>
          <motion.h2 variants={staggerItemVariants}>
            {host.firstName}
            <span>{host.lastName}</span>
          </motion.h2>
          <motion.p variants={staggerItemVariants}>{host.bio}</motion.p>
          <motion.a className={styles.bioLink} href="https://padensickles.com" variants={staggerItemVariants}>
            Learn more about paden
          </motion.a>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.08, TIMING.STANDARD * 1.2)}
          >
            {host.credentials.map((credential) => (
              <motion.li key={credential} variants={staggerItemVariants}>
                {credential}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className={styles.actions}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.8)}
          >
            <motion.div variants={staggerItemVariants} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} initial="rest">
              <Link href={keynoteHref}>Book a Keynote</Link>
            </motion.div>
            <motion.div variants={staggerItemVariants} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} initial="rest">
              <Link href={advisoryHref}>Advisory Program</Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.12)}
        >
          <motion.blockquote variants={staggerItemVariants}>
            <span>&quot;{host.quote}&quot;</span>
            <footer>
              {host.firstName} {host.lastName} · Founder, SickFit
            </footer>
          </motion.blockquote>

          <motion.div
            className={styles.advisory}
            variants={staggerItemVariants}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, delay: TIMING.STANDARD * 0.5 }}
          >
            <div>VIP Advisory</div>
            <h3>12 Calls. 12 Months.</h3>
            <p>
              Monthly one-on-one strategy access with direct operator support, practical frameworks, and
              accountability.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} initial="rest">
              <Link href={advisoryHref}>Apply Now</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
