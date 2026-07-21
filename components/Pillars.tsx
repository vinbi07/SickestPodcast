'use client';

import { motion } from 'framer-motion';
import styles from './Pillars.module.css';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, bounceInVariants } from '../motion/presets';

export interface Pillar {
  id: number;
  title: string;
  description: string;
}

export default function Pillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <motion.div
      className={styles.list}
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerConfig.viewport}
      variants={staggerContainerVariants(0.12)}
    >
      {pillars.map((pillar) => (
        <motion.article key={pillar.id} className={styles.item} variants={staggerItemVariants}>
          <motion.div className={styles.badge} variants={bounceInVariants}>
            {String(pillar.id).padStart(2, '0')}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </motion.div>
        </motion.article>
      ))}
    </motion.div>
  );
}
