import { Link } from 'react-router-dom';
import styles from './FeaturedEpisode.module.css';

export default function FeaturedEpisode({ episode, onPlay }) {
  return (
    <section className={styles.featured} id="episodes">
      <div className={styles.visualWrap}>
        <div className={styles.visualBg}>EP {String(episode.id).padStart(2, '0')}</div>
        <div className={styles.badge}>Featured</div>
        <button className={styles.play} onClick={() => onPlay(episode)} aria-label="Play featured episode">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      <div className={styles.body}>
        <div className={styles.overline}>Featured Episode</div>
        <div className={styles.ep}>Episode {String(episode.id).padStart(2, '0')}</div>
        <h2 className={styles.title}>{episode.title}</h2>
        <div className={styles.role}>{episode.role}</div>
        <p className={styles.desc}>{episode.description}</p>
        <div className={styles.row}>
          <button className={styles.listen} onClick={() => onPlay(episode)}>
            Play Episode
          </button>
          <Link className={styles.link} to={`/episodes/${episode.id}`}>
            View Details
          </Link>
        </div>
      </div>
    </section>
  );
}