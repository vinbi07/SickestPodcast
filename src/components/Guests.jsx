import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import GuestCard from './GuestCard';
import styles from './Guests.module.css';
import { staggerContainerVariants, hoverScaleVariants, TIMING } from '../motion/presets';

export default function Guests({ guests, onOpenEpisode }) {
  const [query, setQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return guests;
    return guests.filter((guest) => {
      return (
        guest.name.toLowerCase().includes(q) ||
        guest.role.toLowerCase().includes(q) ||
        guest.category.toLowerCase().includes(q)
      );
    });
  }, [guests, query]);

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
    setShowAllMobile(false);
  }, [query]);

  const visibleGuests = isMobile && !showAllMobile ? filtered.slice(0, 3) : filtered;
  const canToggleMobile = isMobile && filtered.length > 3;

  return (
    <section className={styles.section} id="guests">
      <div className="container">
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: TIMING.STANDARD }}
        >
          <h2>Season 1 Guests</h2>
          <motion.input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guests"
            aria-label="Search guests"
            style={{ fontFamily: 'Poppins' }}
            whileFocus={{
              boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
              scale: 1.02,
            }}
            transition={{ duration: TIMING.FAST }}
          />
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.08)}
          key={`guest-grid-${query}`}
        >
          {visibleGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} onOpenEpisode={onOpenEpisode} />
          ))}
        </motion.div>

        {canToggleMobile ? (
          <motion.div
            className={styles.loadWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={styles.loadMore}
              onClick={() => setShowAllMobile((value) => !value)}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              initial="rest"
              variants={hoverScaleVariants}
            >
              {showAllMobile ? 'Show Less Guests' : 'Show More Guests'}
            </motion.button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}