import { Link } from 'react-router-dom';
import HeroStats from './HeroStats';
import NowPlayingCard from './NowPlayingCard';
import { InstagramIcon, LinkedInIcon, TikTokIcon, YoutubeIcon } from './icons/SocialIcons';
import spotifyIcon from '../assets/icons/spotify-icon.svg';
import appleMusicIcon from '../assets/icons/Apple_Music_icon.svg';
import feedIcon from '../assets/icons/Generic_Feed-icon.svg';
import amazonMusicIcon from '../assets/icons/Amazon_Music_logo.svg';
import styles from './Hero.module.css';
import heroVideo from '../assets/HeroVideoBg.mp4';

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://tiktok.com', Icon: TikTokIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YoutubeIcon }
];

const rightPlatforms = [
  { label: 'Spotify', type: 'img', icon: spotifyIcon },
  { label: 'Apple Podcasts', type: 'img', icon: appleMusicIcon },
  { label: 'YouTube', type: 'component', icon: YoutubeIcon, color: '#ff0000' },
  { label: 'Amazon Music', type: 'img', icon: amazonMusicIcon },
  { label: 'RSS', type: 'img', icon: feedIcon }
];

export default function Hero({ titleLines, subtitle, currentEpisode, stats, onPlay }) {
  return (
    <section className={styles.hero}>
      <div className={styles.videoBg} aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>
      <div className={styles.overlay} aria-hidden="true" />

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

          <div className={styles.socialRow}>
            <span className={styles.socialLabel}>Follow Us</span>
            <div className={styles.socialLinks}>
              {socialLinks.map(({ label, href, Icon }) => (
                <a key={label} className={styles.socialLink} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon size={18} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.desktopStats}>
            <HeroStats stats={stats} desktop />
          </div>
        </div>
      </div>

      <div className={styles.right}>
          <div className={styles.rightPlatforms}>
            <div className={styles.platformsLabel}>Listen On</div>
            <div className={styles.platformsColumn}>
              {rightPlatforms.map((platform) => {
                const IconComponent = platform.icon;

                return (
                  <div key={platform.label} className={styles.platformBox}>
                    {platform.type === 'component' ? (
                      <IconComponent size={16} color={platform.color} />
                    ) : (
                      <img src={platform.icon} alt="" aria-hidden="true" />
                    )}
                    <span>{platform.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

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