'use client';

import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import styles from './VideoModal.module.css';
import { modalBackdropVariants, modalContentVariants, TIMING } from '../motion/presets';
import type { Episode } from '../content/types';

interface VideoModalProps {
  episode: Episode | null;
  onClose: () => void;
}

export default function VideoModal({ episode, onClose }: VideoModalProps) {
  if (!episode) return null;

  return (
    <>
      <motion.div
        className={styles.overlay}
        onClick={onClose}
        variants={modalBackdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      <motion.div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        variants={modalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
      >
        <motion.button
          className={styles.close}
          onClick={onClose}
          aria-label="Close video modal"
          whileHover={{ scale: 1.2, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: TIMING.FAST }}
        >
          ×
        </motion.button>
        <motion.h3
          id="video-modal-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: TIMING.STANDARD, delay: 0.1 }}
        >
          {episode.title}
        </motion.h3>
        <motion.div
          className={styles.playerWrap}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: TIMING.STANDARD, delay: 0.15 }}
        >
          <VideoPlayer episode={episode} embedded />
        </motion.div>
      </motion.div>
    </>
  );
}
