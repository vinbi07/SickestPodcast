import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './FeaturedEpisode.module.css';
import {
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  bounceInVariants,
  scrollTriggerConfig,
  hoverScaleVariants,
  TIMING,
} from '../motion/presets';

const MotionLink = motion(Link);

export default function FeaturedEpisode({ episode, onPlay }) {
  return (
    <motion.section
      className={styles.featured}
      id="episodes"
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerConfig.viewport}
      variants={staggerContainerVariants(0.15, 0)}
    >
      <motion.div className={styles.visualWrap} variants={staggerItemVariants}>
        <motion.div
          className={styles.visualBg}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.3, scale: 1 }}
          viewport={scrollTriggerConfig.viewport}
          transition={{ duration: TIMING.STANDARD }}
        >
          EP {String(episode.id).padStart(2, '0')}
        </motion.div>
        <motion.div className={styles.badge} variants={bounceInVariants}>
          Featured
        </motion.div>
        <motion.button
          className={styles.play}
          onClick={() => onPlay(episode)}
          aria-label="Play featured episode"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: TIMING.FAST }}
        >
          <motion.svg
            viewBox="0 0 24 24"
            whileHover={{ rotate: 5 }}
            transition={{ duration: TIMING.FAST }}
          >
            <path d="M8 5v14l11-7z" />
          </motion.svg>
        </motion.button>
      </motion.div>

      <motion.div
        className={styles.body}
        initial="hidden"
        whileInView="visible"
        viewport={scrollTriggerConfig.viewport}
        variants={staggerContainerVariants(0.08, TIMING.STANDARD * 0.5)}
      >
        <motion.div className={styles.overline} variants={staggerItemVariants}>
          First Episode (Coming Soon)
        </motion.div>
        <motion.div className={styles.ep} variants={staggerItemVariants}>
          Episode {String(episode.id).padStart(2, '0')}
        </motion.div>
        <motion.h2 className={styles.title} variants={staggerItemVariants}>
          {episode.title}
        </motion.h2>
        <motion.div className={styles.role} variants={staggerItemVariants}>
          {episode.role}
        </motion.div>
        <motion.p className={styles.desc} variants={staggerItemVariants}>
          {episode.description}
        </motion.p>
        <motion.div
          className={styles.row}
          variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.8)}
        >
          <motion.button
            className={styles.listen}
            onClick={() => onPlay(episode)}
            variants={staggerItemVariants}
            whileHover="hover"
            initial="rest"
          >
            Play Episode
          </motion.button>
          <MotionLink
            className={styles.link}
            to={`/episodes/${episode.id}`}
            whileHover={{ x: 4 }}
            transition={{ duration: TIMING.FAST }}
          >
            View Details
          </MotionLink>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}