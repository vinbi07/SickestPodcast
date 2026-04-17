import styles from './NowPlayingCard.module.css';

export default function NowPlayingCard({ episode, onPlay }) {
  return (
    <article className={styles.card}>
      <div className={styles.glow} />
      <div className={styles.top}>
        <div className={styles.label}>Now Playing</div>
        <div className={styles.visual}>
          <div className={styles.visualBg}>EP {String(episode.id).padStart(2, '0')}</div>
          <button className={styles.play} onClick={() => onPlay(episode)} aria-label="Play episode">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
        <div className={styles.row}>
          <div>
            <div className={styles.epNum}>Episode {String(episode.id).padStart(2, '0')}</div>
          </div>
          <div className={styles.duration}>{episode.duration}</div>
        </div>
      </div>
    </article>
  );
}