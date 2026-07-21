'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './GuestCard.module.css';
import { staggerItemVariants, TIMING } from '../motion/presets';
import type { Guest } from '../content/types';

const MotionLink = motion(Link);

interface GuestCardProps {
  guest: Guest;
}

export default function GuestCard({ guest }: GuestCardProps) {
  return (
    <MotionLink
      href={`/episodes/${guest.episodeSlug}`}
      className={styles.card}
      variants={staggerItemVariants}
      whileHover="hover"
      initial="rest"
    >
      <motion.div className={styles.info}>
        <motion.div className={styles.episode}>Ep {String(guest.episodeNumber).padStart(2, '0')}</motion.div>
        <h3 className={styles.name}>{guest.name}</h3>
        <p className={styles.role}>{guest.role}</p>
        <motion.span
          className={styles.tag}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: TIMING.STANDARD, delay: 0.1 }}
        >
          {guest.category}
        </motion.span>
      </motion.div>

      <Image
        className={styles.avatar}
        src={guest.photo}
        alt={guest.name}
        loading="lazy"
      />

      <div className={styles.mobileMeta}>
        <span className={styles.mobileCategory}>{guest.category}</span>
        <span className={styles.mobileArrow} aria-hidden="true">
          {'>'}
        </span>
      </div>
    </MotionLink>
  );
}
