import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroStats from './HeroStats';
import NowPlayingCard from './NowPlayingCard';
import { InstagramIcon, LinkedInIcon, TikTokIcon, YoutubeIcon } from './icons/SocialIcons';
import spotifyIcon from '../assets/icons/spotify-icon.svg';
import appleMusicIcon from '../assets/icons/Apple_Music_icon.svg';
import feedIcon from '../assets/icons/Generic_Feed-icon.svg';
import amazonMusicIcon from '../assets/icons/Amazon_Music_logo.svg';
import styles from './Hero.module.css';
import heroVideo from '../assets/HeroVideoBg.mp4';
import {
  fadeInScaleVariants,
  textLineVariants,
  fadeInUpVariants,
  staggerContainerVariants,
  staggerItemVariants,
  hoverScaleVariants,
  hoverRotateVariants,
  TIMING,
} from '../motion/presets';

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
              <motion.span
                key={line}
                custom={index * 0.12}
                variants={textLineVariants}
              >
                {line}
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
                  <motion.div
                    initial="rest"
                    whileHover="hover"
                    variants={hoverRotateVariants}
                  >
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
                const IconComponent = platform.icon;

                return (
                  <motion.div
                    key={platform.label}
                    className={styles.platformBox}
                    variants={staggerItemVariants}
                    whileHover="hover"
                    initial="rest"
                    custom={idx * 0.05}
                  >
                    <motion.div
                      className={styles.platformIcon}
                      initial="rest"
                      whileHover="hover"
                      variants={hoverRotateVariants}
                    >
                      {platform.type === 'component' ? (
                        <IconComponent size={22} color={platform.color} />
                      ) : (
                        <img src={platform.icon} alt="" aria-hidden="true" />
                      )}
                    </motion.div>
                    <span className={styles.platformText}>{platform.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInScaleVariants}
          custom={TIMING.STANDARD * 2}
        >
          <NowPlayingCard episode={currentEpisode} onPlay={onPlay} />
        </motion.div>

        <motion.div
          className={styles.rightInfo}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.1, TIMING.STANDARD * 2.5)}
        >
          <motion.div className={styles.rightEp} variants={staggerItemVariants}>
            Episode {String(currentEpisode.id).padStart(2, '0')}
          </motion.div>
          <motion.div className={styles.rightTitle} variants={staggerItemVariants}>
            {currentEpisode.guest}
          </motion.div>
          <motion.div className={styles.rightRole} variants={staggerItemVariants}>
            {currentEpisode.role}
          </motion.div>
          <motion.div variants={staggerItemVariants}>
            <Link
              to={`/episodes/${currentEpisode.id}`}
              className={styles.details}
            >
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