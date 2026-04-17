import styles from './Footer.module.css';
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon
} from './icons/SocialIcons';

const socialIconMap = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YoutubeIcon,
  Twitter: TwitterIcon,
  Facebook: FacebookIcon
};

export default function Footer({ columns, tagline }) {
  const renderItem = (item) => {
    const IconComponent = socialIconMap[item];

    if (IconComponent) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <IconComponent size={16} color="rgba(255, 255, 255, 0.7)" />
          {item}
        </span>
      );
    }

    return item;
  };
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.brand}>THE <span>SICK</span>EST PODCAST</div>
        <p className={styles.tagline}>{tagline}</p>

        <div className={styles.cols}>
          {columns.map((column) => (
            <div key={column.title}>
              <div className={styles.heading}>{column.title}</div>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{renderItem(item)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>© 2026 The Sickest Podcast · Paden Sickles · SickFit</span>
          <span>Supposed to be here.</span>
        </div>
      </div>
    </footer>
  );
}