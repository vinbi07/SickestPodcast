'use client';

import styles from './NowPlayingCard.module.css';
import type { Episode } from '../content/types';
import { ctaLabel, isPlayable, statusLabel } from '../lib/episode-status';

interface NowPlayingCardProps {
  episode: Episode;
  onPlay: (episode: Episode) => void;
}

export default function NowPlayingCard({ episode, onPlay }: NowPlayingCardProps) {
  const playable = isPlayable(episode);

  return (
    <article className={styles.card}>
      <div className={styles.glow} />
      <div className={styles.top}>
        <div className={styles.label}>{statusLabel(episode)}</div>
        <div className={styles.visual}>
          <div className={styles.visualBg}>EP {String(episode.id).padStart(2, '0')}</div>
          <button
            className={styles.play}
            onClick={() => playable && onPlay(episode)}
            aria-label={playable ? 'Play episode' : ctaLabel(episode)}
            aria-disabled={!playable}
          >
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        <div className={styles.row}>
          <div>
            <div className={styles.epNum}>Episode {String(episode.id).padStart(2, '0')}</div>
          </div>
          <div className={styles.duration}>{episode.duration ?? 'TBD'}</div>
        </div>
      </div>
    </article>
  );
}
