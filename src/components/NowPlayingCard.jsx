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
            <div className={styles.name}>{episode.guest}</div>
          </div>
          <div className={styles.duration}>{episode.duration}</div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.track}>
          <span className={styles.progress} />
        </div>
        <div className={styles.times}>
          <span>18:42</span>
          <span>{episode.duration}</span>
        </div>
      </div>
    </article>
  );
}