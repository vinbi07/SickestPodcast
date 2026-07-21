'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Pillars, { type Pillar } from './Pillars';
import styles from './About.module.css';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, TIMING } from '../motion/presets';

interface AboutStat {
  value: number;
  label: string;
}

interface AboutProps {
  quote: string;
  body: string;
  stats: AboutStat[];
  pillars: Pillar[];
  bookHref: string;
}

export default function About({ quote, body, stats, pillars, bookHref }: AboutProps) {
  return (
    <section className={styles.section} id="about">
      <div className={`container ${styles.layout}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.1)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            The Show
          </motion.div>
          <motion.h2 className={styles.quote} variants={staggerItemVariants}>
            {quote}
          </motion.h2>
          <motion.p className={styles.body} variants={staggerItemVariants}>
            {body}
          </motion.p>

          <motion.div
            className={styles.stats}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.5)}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className={styles.stat} variants={staggerItemVariants}>
                <div>{stat.value}</div>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, delay: TIMING.STANDARD * 1.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link className={styles.bookBtn} href={bookHref}>
              About Paden
            </Link>
          </motion.div>
        </motion.div>

        <Pillars pillars={pillars} />
      </div>
    </section>
  );
}
