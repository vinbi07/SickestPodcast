'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EpisodeCard from './EpisodeCard';
import styles from './Episodes.module.css';
import { staggerContainerVariants, hoverScaleVariants, TIMING } from '../motion/presets';
import type { Episode } from '../content/types';

interface EpisodesProps {
  episodes: Episode[];
  onPlay: (episode: Episode) => void;
}

export default function Episodes({ episodes, onPlay }: EpisodesProps) {
  const categories = useMemo(() => ['All', ...new Set(episodes.map((ep) => ep.category))], [episodes]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return activeCategory === 'All' ? episodes : episodes.filter((ep) => ep.category === activeCategory);
  }, [episodes, activeCategory]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');

    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => {
      mediaQuery.removeEventListener('change', updateIsMobile);
    };
  }, []);

  useEffect(() => {
    if (!isCategoryMenuOpen) {
      return undefined;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCategoryMenuOpen]);

  const shown = isMobile
    ? showAllMobile
      ? filtered
      : filtered.slice(0, 3)
    : filtered.slice(0, visibleCount);

  const canLoadMore = isMobile ? filtered.length > 3 : visibleCount < filtered.length;

  return (
    <section className={styles.section} id="episodes">
      <div className="container">
        <div className={styles.head}>
          <h2>Future Episodes</h2>
          <div className={styles.mobileFilter} ref={categoryMenuRef}>
            <motion.button
              className={styles.mobileTrigger}
              onClick={() => setIsCategoryMenuOpen((open) => !open)}
              aria-haspopup="listbox"
              aria-expanded={isCategoryMenuOpen}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.01 }}
            >
              <span>{activeCategory}</span>
              <motion.span
                className={styles.caret}
                animate={{ rotate: isCategoryMenuOpen ? 180 : 0 }}
                transition={{ duration: TIMING.FAST }}
              >
                v
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {isCategoryMenuOpen ? (
                <motion.ul
                  className={styles.mobileMenu}
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: TIMING.STANDARD }}
                  role="listbox"
                  aria-label="Episode categories"
                >
                  {categories.map((category, index) => (
                    <motion.li
                      key={category}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03, duration: TIMING.FAST }}
                    >
                      <button
                        type="button"
                        className={
                          activeCategory === category
                            ? `${styles.mobileOption} ${styles.mobileOptionActive}`
                            : styles.mobileOption
                        }
                        onClick={() => {
                          setActiveCategory(category);
                          setVisibleCount(6);
                          setShowAllMobile(false);
                          setIsCategoryMenuOpen(false);
                        }}
                        role="option"
                        aria-selected={activeCategory === category}
                      >
                        {category}
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </div>

          <motion.div
            className={styles.filters}
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants(0.05)}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                type="button"
                className={activeCategory === category ? styles.active : ''}
                onClick={() => {
                  setActiveCategory(category);
                  setVisibleCount(6);
                  setShowAllMobile(false);
                }}
                whileHover="hover"
                whileTap={{ scale: 0.98 }}
                initial="rest"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0, transition: { duration: TIMING.STANDARD } },
                  rest: { scale: 1 },
                  hover: {
                    scale: 1.05,
                    transition: { duration: TIMING.FAST },
                  },
                }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.08)}
          key={`grid-${activeCategory}`}
        >
          {shown.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} onPlay={onPlay} />
          ))}
        </motion.div>

        {shown.length === 0 ? (
          <p className={styles.empty}>No episodes match this category yet.</p>
        ) : null}

        {canLoadMore ? (
          <motion.div
            className={styles.loadWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={styles.load}
              type="button"
              onClick={() => {
                if (isMobile) {
                  setShowAllMobile((value) => !value);
                  return;
                }

                setVisibleCount((count) => count + 3);
              }}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              initial="rest"
              variants={hoverScaleVariants}
            >
              {isMobile ? (showAllMobile ? 'Show Less Episodes' : 'Show More Episodes') : 'Load More Episodes'}
            </motion.button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
