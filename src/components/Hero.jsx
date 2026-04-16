import { Link } from 'react-router-dom';
import HeroStats from './HeroStats';
import NowPlayingCard from './NowPlayingCard';
import styles from './Hero.module.css';

export default function Hero({ titleLines, subtitle, currentEpisode, stats, onPlay }) {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <div className="container">
          <div className={styles.tag}><span /> New Episodes Weekly</div>
          <h1 className={styles.title}>
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.actions}>
            <button className={styles.play} onClick={() => onPlay(currentEpisode)}>
              <span>▶</span> Play Latest
            </button>
            <a href="#guests" className={styles.link}>
              Meet the Guests
            </a>
          </div>

          <div className={styles.desktopStats}>
            <HeroStats stats={stats} desktop />
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <NowPlayingCard episode={currentEpisode} onPlay={onPlay} />
        <div className={styles.rightInfo}>
          <div className={styles.rightEp}>Episode {String(currentEpisode.id).padStart(2, '0')}</div>
          <div className={styles.rightTitle}>{currentEpisode.guest}</div>
          <div className={styles.rightRole}>{currentEpisode.role}</div>
          <Link to={`/episodes/${currentEpisode.id}`} className={styles.details}>
            Episode Details
          </Link>
        </div>
      </div>

      <div className={styles.mobileCard}>
        <div className="container">
          <NowPlayingCard episode={currentEpisode} onPlay={onPlay} />
        </div>
      </div>

      <div className={styles.mobileStats}>
        <div className="container">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}