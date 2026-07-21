'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './EpisodeCard.module.css';
import { staggerItemVariants, hoverCardScaleVariants, TIMING } from '../motion/presets';
import type { Episode } from '../content/types';
import { ctaLabel, isPlayable, primaryEpisodeHref } from '../lib/episode-status';

interface EpisodeCardProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
}

export default function EpisodeCard({ episode, onPlay }: EpisodeCardProps) {
  const playable = isPlayable(episode);

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
        Episode {String(episode.id).padStart(2, '0')} · {episode.duration ?? 'Duration TBD'}
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
        {playable ? (
          <motion.button
            className={styles.play}
            onClick={() => onPlay(episode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: TIMING.FAST }}
          >
            {ctaLabel(episode)}
          </motion.button>
        ) : (
          <span className={styles.play} aria-disabled="true">
            {ctaLabel(episode)}
          </span>
        )}
        <motion.div whileHover={{ x: 4 }} transition={{ duration: TIMING.FAST }}>
          <Link className={styles.details} href={primaryEpisodeHref(episode)}>
            Details
          </Link>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
