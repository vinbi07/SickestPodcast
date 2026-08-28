'use client';

import Link from 'next/link';
import type { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import HeroStats from './HeroStats';
import NowPlayingCard from './NowPlayingCard';
import { InstagramIcon, LinkedInIcon, TikTokIcon, YoutubeIcon } from './icons/SocialIcons';
import spotifyIcon from '../assets/icons/spotify-icon.svg';
import appleMusicIcon from '../assets/icons/Apple_Music_icon.svg';
import feedIcon from '../assets/icons/Generic_Feed-icon.svg';
import amazonMusicIcon from '../assets/icons/Amazon_Music_logo.svg';
import styles from './Hero.module.css';
import {
  fadeInScaleVariants,
  textLineVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  hoverRotateVariants,
  TIMING,
} from '../motion/presets';
import type { Episode, PlatformLinks } from '../content/types';
import { ctaLabel, episodeNumberLabel, isPlayable, primaryEpisodeHref } from '../lib/episode-status';

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/thesickestpod?utm_source=qr', Icon: InstagramIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/@sickfitofficial', Icon: TikTokIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/paden-sickles/', Icon: LinkedInIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/@TheSickestPodcast', Icon: YoutubeIcon },
];

interface RightPlatform {
  label: string;
  key: keyof PlatformLinks;
  type: 'img' | 'component';
  icon: StaticImageData | typeof YoutubeIcon;
  color?: string;
}

const rightPlatforms: RightPlatform[] = [
  { label: 'Spotify', key: 'spotify', type: 'img', icon: spotifyIcon },
  { label: 'Apple Podcasts', key: 'applePodcasts', type: 'img', icon: appleMusicIcon },
  { label: 'YouTube', key: 'youtube', type: 'component', icon: YoutubeIcon, color: '#ff0000' },
  { label: 'Amazon Music', key: 'amazonMusic', type: 'img', icon: amazonMusicIcon },
  { label: 'RSS', key: 'rss', type: 'img', icon: feedIcon },
];

interface HeroStat {
  value: number;
  label: string;
}

interface HeroProps {
  titleLines: string[];
  subtitle: string;
  currentEpisode: Episode;
  stats: HeroStat[];
  onPlay: (episode: Episode) => void;
}

export default function Hero({ titleLines, subtitle, currentEpisode, stats, onPlay }: HeroProps) {
  const playable = isPlayable(currentEpisode);

  return (
    <section className={styles.hero}>
      <div className={styles.videoBg} aria-hidden="true">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src="/HeroVideoBg.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.left}>
        <div className="container">
          <motion.div
            className={styles.tag}
            initial="hidden"
            animate="visible"
            variants={fadeInScaleVariants}
            custom={0}
          >
            <span /> New Episodes Weekly
          </motion.div>

          <motion.h1
            className={styles.title}
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants(TIMING.STAGGER_STANDARD, TIMING.STANDARD)}
          >
            {titleLines.map((line, index) => (
              <motion.span key={line} custom={index * 0.12} variants={textLineVariants}>
                {line}
                {index < titleLines.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            custom={TIMING.STANDARD * 2.5}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className={styles.actions}
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants(0.1, TIMING.STANDARD * 2.8)}
          >
            {playable ? (
              <motion.button
                className={styles.play}
                onClick={() => onPlay(currentEpisode)}
                variants={staggerItemVariants}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                initial="rest"
                animate="visible"
                custom={0}
              >
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: TIMING.FAST }}
                >
                  ▶
                </motion.span>{' '}
                Play Latest
              </motion.button>
            ) : (
              <motion.div variants={staggerItemVariants} initial="rest" animate="visible" custom={0}>
                <Link href={primaryEpisodeHref(currentEpisode)} className={styles.play}>
                  {ctaLabel(currentEpisode)}
                </Link>
              </motion.div>
            )}
            <motion.a
              href="#guests"
              className={styles.link}
              variants={staggerItemVariants}
              whileHover={{ x: 8 }}
              transition={{ duration: TIMING.FAST }}
              initial="rest"
              animate="visible"
              custom={0}
            >
              Meet the Guests
            </motion.a>
          </motion.div>

          <motion.div
            className={styles.socialRow}
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants(0.08, TIMING.STANDARD * 3.2)}
          >
            <span className={styles.socialLabel}>Follow Us</span>
            <motion.div className={styles.socialLinks}>
              {socialLinks.map(({ label, href, Icon }, idx) => (
                <motion.a
                  key={label}
                  className={styles.socialLink}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  variants={staggerItemVariants}
                  whileHover="hover"
                  initial="rest"
                  custom={idx * 0.05}
                >
                  <motion.div initial="rest" whileHover="hover" variants={hoverRotateVariants}>
                    <Icon size={18} />
                  </motion.div>
                  <span>{label}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <div className={styles.desktopStats}>
            <HeroStats stats={stats} desktop />
          </div>
        </div>
      </div>

      <motion.div
        className={styles.right}
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: TIMING.STANDARD, ease: 'easeOut', delay: TIMING.STANDARD * 3.5 }}
      >
        <motion.div
          className={styles.rightPlatforms}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.08, TIMING.STANDARD * 1.5)}
        >
          <div className={styles.platformsLabel}>Listen On</div>
          <motion.div className={styles.platformsColumn}>
            {rightPlatforms.map((platform, idx) => {
              const link = currentEpisode.platformLinks[platform.key];
              const IconComponent = platform.type === 'component' ? (platform.icon as typeof YoutubeIcon) : null;

              const iconEl = IconComponent ? (
                <IconComponent size={22} color={platform.color} />
              ) : (
                <img src={(platform.icon as StaticImageData).src} alt="" aria-hidden="true" />
              );

              if (link) {
                return (
                  <motion.a
                    key={platform.label}
                    className={styles.platformBox}
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    variants={staggerItemVariants}
                    whileHover="hover"
                    initial="rest"
                    custom={idx * 0.05}
                  >
                    <motion.div className={styles.platformIcon} initial="rest" whileHover="hover" variants={hoverRotateVariants}>
                      {iconEl}
                    </motion.div>
                    <span className={styles.platformText}>{platform.label}</span>
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={platform.label}
                  className={`${styles.platformBox} ${styles.platformBoxDisabled ?? ''}`}
                  variants={staggerItemVariants}
                  initial="rest"
                  custom={idx * 0.05}
                  aria-disabled="true"
                >
                  <div className={styles.platformIcon}>{iconEl}</div>
                  <span className={styles.platformText}>
                    {platform.label} · {currentEpisode.date ?? 'Coming soon'}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInScaleVariants} custom={TIMING.STANDARD * 2}>
          <NowPlayingCard episode={currentEpisode} onPlay={onPlay} />
        </motion.div>

        <motion.div
          className={styles.rightInfo}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.1, TIMING.STANDARD * 2.5)}
        >
          <motion.div className={styles.rightEp} variants={staggerItemVariants}>
            Episode {episodeNumberLabel(currentEpisode)}
          </motion.div>
          <motion.div className={styles.rightTitle} variants={staggerItemVariants}>
            {currentEpisode.guest}
          </motion.div>
          <motion.div className={styles.rightRole} variants={staggerItemVariants}>
            {currentEpisode.role}
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <Link href={primaryEpisodeHref(currentEpisode)} className={styles.details}>
              Episode Details
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.mobileCard}
        initial="hidden"
        animate="visible"
        variants={fadeInScaleVariants}
        custom={TIMING.STANDARD * 2}
      >
        <div className="container">
          <NowPlayingCard episode={currentEpisode} onPlay={onPlay} />
        </div>
      </motion.div>

      <div className={styles.mobileStats}>
        <div className="container">
          <HeroStats stats={stats} />
        </div>
      </div>
    </section>
  );
}
