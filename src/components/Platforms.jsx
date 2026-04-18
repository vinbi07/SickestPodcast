import { YoutubeIcon } from './icons/SocialIcons';
import spotifyIcon from '../assets/icons/spotify-icon.svg';
import appleMusicIcon from '../assets/icons/Apple_Music_icon.svg';
import feedIcon from '../assets/icons/Generic_Feed-icon.svg';
import amazonMusicIcon from '../assets/icons/Amazon_Music_logo.svg';
import styles from './Platforms.module.css';

const platformMap = {
  Spotify: { icon: spotifyIcon, type: 'img' },
  'Apple Podcasts': { icon: appleMusicIcon, type: 'img' },
  YouTube: { icon: YoutubeIcon, type: 'component', color: '#ff0000' },
  'Amazon Music': { icon: amazonMusicIcon, type: 'img' },
  RSS: { icon: feedIcon, type: 'img' }
};

export default function Platforms({ items }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.row}`}>
        <h2>Listen everywhere (Coming Soon)</h2>
        <div>
          {items.map((item) => (
            <button key={item} className={styles.item} type="button" aria-label={item}>
              {platformMap[item]?.type === 'component' ? (
                (() => {
                  const Icon = platformMap[item].icon;
                  return <Icon size={18} color={platformMap[item].color} />;
                })()
              ) : (
                <img src={platformMap[item]?.icon} alt="" aria-hidden="true" />
              )}
              <span>{item}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}