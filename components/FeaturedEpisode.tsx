'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './FeaturedEpisode.module.css';
import {
  staggerContainerVariants,
  staggerItemVariants,
  bounceInVariants,
  scrollTriggerConfig,
  TIMING,
} from '../motion/presets';
import type { Episode } from '../content/types';
import { ctaLabel, episodeNumberLabel, isPlayable, primaryEpisodeHref, statusLabel } from '../lib/episode-status';

interface FeaturedEpisodeProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
}

export default function FeaturedEpisode({ episode, onPlay }: FeaturedEpisodeProps) {
  const playable = isPlayable(episode);

  return (
    <motion.section
      className={styles.featured}
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerConfig.viewport}
      variants={staggerContainerVariants(0.15, 0)}
    >
      <motion.div className={styles.visualWrap} variants={staggerItemVariants}>
        {episode.thumbnailImage ? (
          <Image
            src={episode.thumbnailImage}
            alt={episode.guest}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className={styles.visualImg}
          />
        ) : (
          <motion.div
            className={styles.visualBg}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.3, scale: 1 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD }}
          >
            EP {episodeNumberLabel(episode)}
          </motion.div>
        )}
        <motion.div className={styles.badge} variants={bounceInVariants}>
          Featured
        </motion.div>
        {playable ? (
          <motion.button
            className={styles.play}
            onClick={() => onPlay(episode)}
            aria-label="Play featured episode"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: TIMING.FAST }}
          >
            <motion.svg viewBox="0 0 24 24" whileHover={{ rotate: 5 }} transition={{ duration: TIMING.FAST }}>
              <path d="M8 5v14l11-7z" />
            </motion.svg>
          </motion.button>
        ) : null}
      </motion.div>

      <motion.div
        className={styles.body}
        initial="hidden"
        whileInView="visible"
        viewport={scrollTriggerConfig.viewport}
        variants={staggerContainerVariants(0.08, TIMING.STANDARD * 0.5)}
      >
        <motion.div className={styles.overline} variants={staggerItemVariants}>
          {statusLabel(episode)}
        </motion.div>
        <motion.div className={styles.ep} variants={staggerItemVariants}>
          Episode {episodeNumberLabel(episode)}
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
        <motion.div className={styles.row} variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.8)}>
          {playable ? (
            <motion.button
              className={styles.listen}
              onClick={() => onPlay(episode)}
              variants={staggerItemVariants}
              whileHover="hover"
              initial="rest"
            >
              Play Episode
            </motion.button>
          ) : (
            <motion.span className={styles.listen} variants={staggerItemVariants} aria-disabled="true">
              {ctaLabel(episode)}
            </motion.span>
          )}
          <motion.div variants={staggerItemVariants} whileHover={{ x: 4 }} transition={{ duration: TIMING.FAST }}>
            <Link className={styles.link} href={primaryEpisodeHref(episode)}>
              View Details<span className="sr-only"> — {episode.guest}&apos;s episode</span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
