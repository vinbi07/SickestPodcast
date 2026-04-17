import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './EpisodeCard.module.css';
import { staggerItemVariants, hoverCardScaleVariants, TIMING } from '../motion/presets';

const MotionLink = motion(Link);

export default function EpisodeCard({ episode, onPlay }) {
  return (
    <motion.article
      className={styles.card}
      variants={staggerItemVariants}
      whileHover="hover"
      initial="rest"
    >
      <motion.div
        className={styles.meta}
        initial="rest"
        whileHover="hover"
        variants={hoverCardScaleVariants}
      >
        Episode {String(episode.id).padStart(2, '0')} · {episode.duration}
      </motion.div>
      <h3 className={styles.title}>{episode.title}</h3>
      <div className={styles.guest}>{episode.role}</div>
      <p className={styles.desc}>{episode.description}</p>
      <motion.div
        className={styles.actions}
        initial="hidden"
        whileHover="visible"
        variants={{
          hidden: { opacity: 0.9 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        <motion.button
          className={styles.play}
          onClick={() => onPlay(episode)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: TIMING.FAST }}
        >
          Play
        </motion.button>
        <MotionLink
          className={styles.details}
          to={`/episodes/${episode.id}`}
          whileHover={{ x: 4 }}
          transition={{ duration: TIMING.FAST }}
        >
          Details
        </MotionLink>
      </motion.div>
    </motion.article>
  );
}