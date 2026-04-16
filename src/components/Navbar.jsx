import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ brand, links, onBook }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo}>
          {brand.prefix} <span>{brand.highlight}</span> {brand.suffix}
        </Link>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.btnOutline}`} onClick={onBook}>
            Book Paden
          </button>
          <NavLink className={`${styles.btn} ${styles.btnFill}`} to="/episodes/1">
            Listen Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
}