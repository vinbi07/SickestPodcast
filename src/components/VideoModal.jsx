import { motion } from 'framer-motion';
import VideoPlayer from './VideoPlayer';
import styles from './VideoModal.module.css';
import { modalBackdropVariants, modalContentVariants, hoverRotateVariants, TIMING } from '../motion/presets';

export default function VideoModal({ episode, onClose }) {
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
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: TIMING.STANDARD, delay: 0.1 }}
        >
          {episode.title}
        </motion.h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: TIMING.STANDARD, delay: 0.15 }}
        >
          <VideoPlayer videoUrl={episode.videoUrl} title={episode.title} embedded />
        </motion.div>
      </motion.div>
    </>
  );
}