'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './AnnouncementBanner.module.css';
import { TIMING, useMotionPreference } from '../motion/presets';

// TODO(copy): replace with final announcement copy.
const BANNER_MESSAGE = 'Episode 1 Drops In —';

// No timezone suffix: parsed as local browser time, per spec.
const COUNTDOWN_TARGET_ISO = '2026-09-08T00:00:00';
const DISMISS_KEY = 'sp_announcement_dismissed_v1';
const TICK_MS = 1000;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function getTimeLeft(): TimeLeft {
  const diff = new Date(COUNTDOWN_TARGET_ISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isExpired: false,
  };
}

export default function AnnouncementBanner() {
  // null = "not yet decided" (server render + first client paint); real value set post-mount.
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const prefersReducedMotion = useMotionPreference();

  useEffect(() => {
    setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');
    setTimeLeft(getTimeLeft());

    const id = window.setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, []);

  const handleDismiss = () => {
    window.localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  const visible = dismissed === false && timeLeft !== null && !timeLeft.isExpired;

  return (
    <AnimatePresence>
      {visible && timeLeft && (
        <motion.div
          key="announcement-banner"
          className={styles.banner}
          role="region"
          aria-label="Site announcement"
          initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: TIMING.STANDARD }}
        >
          <div className={`container ${styles.inner}`}>
            <p className={styles.message}>
              {BANNER_MESSAGE}{' '}
              <span className={styles.countdown}>
                <span className={styles.unit}>
                  <strong>{timeLeft.days}</strong>d
                </span>
                <span className={styles.unit}>
                  <strong>{String(timeLeft.hours).padStart(2, '0')}</strong>h
                </span>
                <span className={styles.unit}>
                  <strong>{String(timeLeft.minutes).padStart(2, '0')}</strong>m
                </span>
                <span className={styles.unit}>
                  <strong>{String(timeLeft.seconds).padStart(2, '0')}</strong>s
                </span>
              </span>
            </p>
            <motion.button
              type="button"
              className={styles.close}
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: TIMING.FAST }}
            >
              ×
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
