import { motion } from 'framer-motion';
import styles from './Footer.module.css';
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon
} from './icons/SocialIcons';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, hoverRotateVariants, TIMING } from '../motion/presets';

const footerLinks = {
  Episodes: { href: '#episodes' },
  'Season 1 Guests': { href: '#guests' },
  'About the Show': { href: '#about' },
  'Watch on YouTube': { href: 'https://youtube.com', external: true },
  'About Paden': { href: '#about' },
  'Book a Keynote': { href: '/booking?type=keynote' },
  'VIP Advisory': { href: '/booking?type=advisory' },
  'Speaking Inquiries': { href: '/booking?type=speaking' },
  'Shop SickFit': { href: 'https://sickfitofficial.com/collections/all', external: true },
  'Brand Partners': { href: 'https://sickfitofficial.com', external: true },
  'Retail Inquiries': { href: 'https://sickfitofficial.com/pages/wholesale', external: true },
  'sickfitofficial.com': { href: 'https://sickfitofficial.com', external: true },
  Instagram: { href: 'https://instagram.com', external: true },
  TikTok: { href: 'https://tiktok.com', external: true },
  LinkedIn: { href: 'https://linkedin.com', external: true },
  YouTube: { href: 'https://youtube.com', external: true },
  Twitter: { href: 'https://twitter.com', external: true },
  Facebook: { href: 'https://facebook.com', external: true },
};

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
    const link = footerLinks[item];

    const content = (
      <>
        {IconComponent ? (
          <motion.div className={styles.itemIcon} variants={hoverRotateVariants}>
            <IconComponent size={16} color="rgba(255, 255, 255, 0.7)" />
          </motion.div>
        ) : null}
        {item}
      </>
    );

    if (link) {
      return (
        <motion.a
          className={styles.itemLink}
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          whileHover={{ x: 4, color: '#ffffff' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: TIMING.FAST }}
        >
          {content}
        </motion.a>
      );
    }

    return content;
  };

  return (
    <footer className={styles.footer}>
      <div className="container">
        <motion.div
          className={styles.brand}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={scrollTriggerConfig.viewport}
          transition={{ duration: TIMING.STANDARD }}
        >
          THE <span>SICK</span>EST PODCAST
        </motion.div>
        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={scrollTriggerConfig.viewport}
          transition={{ duration: TIMING.STANDARD, delay: 0.1 }}
        >
          {tagline}
        </motion.p>

        <motion.div
          className={styles.cols}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.12, TIMING.STANDARD * 0.5)}
        >
          {columns.map((column) => (
            <motion.div key={column.title} variants={staggerItemVariants}>
              <div className={styles.heading}>{column.title}</div>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={scrollTriggerConfig.viewport}
                variants={staggerContainerVariants(0.06, 0)}
              >
                {column.items.map((item) => (
                  <motion.li key={item} variants={staggerItemVariants}>
                    {renderItem(item)}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.bottom}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={scrollTriggerConfig.viewport}
          transition={{ duration: TIMING.STANDARD, delay: TIMING.STANDARD * 1.2 }}
        >
          <span>© 2026 The Sickest Podcast · Paden Sickles · SickFit®</span>
          <span>Supposed to be here.</span>
        </motion.div>
      </div>
    </footer>
  );
}