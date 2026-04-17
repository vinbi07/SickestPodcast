import { useEffect, useMemo, useState } from 'react';
import EpisodeCard from './EpisodeCard';
import styles from './Episodes.module.css';

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
          <div className={styles.filters}>
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? styles.active : ''}
                onClick={() => {
                  setActiveCategory(category);
                  setVisibleCount(6);
                  setShowAllMobile(false);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {shown.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} onPlay={onPlay} />
          ))}
        </div>

        {canLoadMore ? (
          <div className={styles.loadWrap}>
            <button
              className={styles.load}
              onClick={() => {
                if (isMobile) {
                  setShowAllMobile((value) => !value);
                  return;
                }

                setVisibleCount((count) => count + 3);
              }}
            >
              {isMobile ? (showAllMobile ? 'Show Less Episodes' : 'Show More Episodes') : 'Load More Episodes'}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}