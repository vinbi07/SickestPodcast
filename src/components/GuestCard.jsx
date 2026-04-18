import { motion } from 'framer-motion';
import styles from './GuestCard.module.css';
import { staggerItemVariants, TIMING } from '../motion/presets';

export default function GuestCard({ guest, onOpenEpisode }) {
  return (
    <motion.article
      className={styles.card}
      onClick={() => onOpenEpisode(guest.episode)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onOpenEpisode(guest.episode);
        }
      }}
      role="button"
      tabIndex={0}
      variants={staggerItemVariants}
      whileHover="hover"
      initial="rest"
    >
      <motion.div className={styles.info}>
        <motion.div className={styles.episode}>Ep {String(guest.episode).padStart(2, '0')}</motion.div>
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

      <motion.img
        className={styles.avatar}
        src={guest.photo}
        alt={guest.name}
        loading="lazy"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: TIMING.STANDARD }}
        whileHover={{ scale: 1.08 }}
      />

      <div className={styles.mobileMeta}>
        <span className={styles.mobileCategory}>{guest.category}</span>
        <span className={styles.mobileArrow} aria-hidden="true">
          {'>'}
        </span>
      </div>
    </motion.article>
  );
}