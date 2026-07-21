'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EpisodeCard from './EpisodeCard';
import VideoModal from './VideoModal';
import styles from './EpisodeArchiveView.module.css';
import type { Episode } from '../content/types';

interface EpisodeArchiveViewProps {
  episodes: Episode[];
}

export default function EpisodeArchiveView({ episodes }: EpisodeArchiveViewProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);

  const categories = useMemo(() => ['All', ...new Set(episodes.map((episode) => episode.category))], [episodes]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return episodes.filter((episode) => {
      const matchesCategory = activeCategory === 'All' || episode.category === activeCategory;
      const matchesQuery =
        !q || episode.title.toLowerCase().includes(q) || episode.guest.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [episodes, query, activeCategory]);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.intro}>
          <h1>All Episodes</h1>
          <p>
            Every conversation from The Sickest Podcast in one place — search by guest or episode title,
            or browse by topic below.
          </p>
        </div>

        <div className={styles.controls}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by guest or episode title"
            aria-label="Search episodes by guest or title"
          />
          <div className={styles.filters} role="group" aria-label="Filter episodes by topic">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? styles.active : ''}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} onPlay={setActiveEpisode} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No episodes match {query ? `"${query}"` : 'this topic'} yet. Try a different search or topic.
          </p>
        )}
      </div>

      <AnimatePresence>
        {activeEpisode && <VideoModal episode={activeEpisode} onClose={() => setActiveEpisode(null)} />}
      </AnimatePresence>
    </section>
  );
}
