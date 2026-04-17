import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import EpisodeCard from './EpisodeCard';
import styles from './Episodes.module.css';
import { staggerContainerVariants, hoverScaleVariants, TIMING } from '../motion/presets';

export default function Episodes({ episodes, onPlay }) {
  const categories = useMemo(() => ['All', ...new Set(episodes.map((ep) => ep.category))], [episodes]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);

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

  const shown = isMobile
    ? showAllMobile
      ? filtered
      : filtered.slice(0, 3)
    : filtered.slice(0, visibleCount);

  const canLoadMore = isMobile ? filtered.length > 3 : visibleCount < filtered.length;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <h2>Recent Episodes</h2>
          <motion.div
            className={styles.filters}
            initial="hidden"
            animate="visible"
            variants={staggerContainerVariants(0.05)}
          >
            {categories.map((category) => (
              <motion.button
                key={category}
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

        {canLoadMore ? (
          <motion.div
            className={styles.loadWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={styles.load}
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