'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './Footer.module.css';
import {
  InstagramIcon,
  TikTokIcon,
  LinkedInIcon,
  YoutubeIcon,
  TwitterIcon,
  FacebookIcon,
} from './icons/SocialIcons';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, hoverRotateVariants, TIMING } from '../motion/presets';
import type { FooterColumn } from '../content/footer';
import { BUZZSPROUT_SHARE_URL } from '../content/links';

interface FooterLinkDef {
  href: string;
  external?: boolean;
}

const footerLinks: Record<string, FooterLinkDef> = {
  Episodes: { href: '/episodes' },
  'Season 1 Guests': { href: '/#guests' },
  'About the Show': { href: '/#about' },
  'Watch on YouTube': { href: 'https://www.youtube.com/@TheSickestPodcast', external: true },
  'Listen on Buzzsprout': { href: BUZZSPROUT_SHARE_URL, external: true },
  'About Paden': { href: '/#about' },
  'Book a Keynote': { href: '/booking/keynote' },
  'VIP Advisory': { href: '/booking/advisory' },
  'Speaking Inquiries': { href: '/booking/speaking' },
  'Shop SickFit': { href: 'https://sickfitofficial.com/collections/all', external: true },
  'Brand Partners': { href: 'https://sickfitofficial.com', external: true },
  'Retail Inquiries': { href: 'https://sickfitofficial.com/pages/wholesale', external: true },
  'sickfitofficial.com': { href: 'https://sickfitofficial.com', external: true },
  Instagram: { href: 'https://www.instagram.com/thesickestpod?utm_source=qr', external: true },
  TikTok: { href: 'https://www.tiktok.com/@sickfitofficial', external: true },
  LinkedIn: { href: 'https://www.linkedin.com/in/paden-sickles/', external: true },
  YouTube: { href: 'https://www.youtube.com/@TheSickestPodcast', external: true },
  Twitter: { href: 'https://twitter.com', external: true },
  Facebook: { href: 'https://facebook.com', external: true },
};

const socialIconMap: Record<string, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  LinkedIn: LinkedInIcon,
  YouTube: YoutubeIcon,
  Twitter: TwitterIcon,
  Facebook: FacebookIcon,
};

interface FooterProps {
  columns: FooterColumn[];
  tagline: string;
}

export default function Footer({ columns, tagline }: FooterProps) {
  const renderItem = (item: string) => {
    const IconComponent = socialIconMap[item];
    const link = footerLinks[item];
    const isHashLink = Boolean(link?.href?.includes('#'));

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

    if (link?.external || isHashLink) {
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

    if (link) {
      return (
        <motion.span whileHover={{ x: 4, color: '#ffffff' }} whileTap={{ scale: 0.98 }} transition={{ duration: TIMING.FAST }}>
          <Link className={styles.itemLink} href={link.href}>
            {content}
          </Link>
        </motion.span>
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
