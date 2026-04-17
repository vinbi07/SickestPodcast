import { useEffect, useMemo, useState } from 'react';
import GuestCard from './GuestCard';
import styles from './Guests.module.css';

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
        <div className={styles.head}>
          <h2>Season 1 Guests</h2>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search guests"
            aria-label="Search guests"
            style={{ fontFamily: 'Poppins' }}
          />
        </div>

        <div className={styles.grid}>
          {visibleGuests.map((guest) => (
            <GuestCard key={guest.id} guest={guest} onOpenEpisode={onOpenEpisode} />
          ))}
        </div>

        {canToggleMobile ? (
          <div className={styles.loadWrap}>
            <button className={styles.loadMore} onClick={() => setShowAllMobile((value) => !value)}>
              {showAllMobile ? 'Show Less Guests' : 'Show More Guests'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}