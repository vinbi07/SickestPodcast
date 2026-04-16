import { useMemo, useState } from 'react';
import GuestCard from './GuestCard';
import styles from './Guests.module.css';

export default function Guests({ guests, onOpenEpisode }) {
  const [query, setQuery] = useState('');

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
          />
        </div>

        <div className={styles.grid}>
          {filtered.map((guest) => (
            <GuestCard key={guest.id} guest={guest} onOpenEpisode={onOpenEpisode} />
          ))}
        </div>
      </div>
    </section>
  );
}