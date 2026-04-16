import { Link } from 'react-router-dom';
import styles from './EpisodeCard.module.css';

export default function EpisodeCard({ episode, onPlay }) {
  return (
    <article className={styles.card}>
      <div className={styles.meta}>Episode {String(episode.id).padStart(2, '0')} · {episode.duration}</div>
      <h3 className={styles.title}>{episode.title}</h3>
      <div className={styles.guest}>{episode.role}</div>
      <p className={styles.desc}>{episode.description}</p>
      <div className={styles.actions}>
        <button className={styles.play} onClick={() => onPlay(episode)}>
          Play
        </button>
        <Link className={styles.details} to={`/episodes/${episode.id}`}>
          Details
        </Link>
      </div>
    </article>
  );
}