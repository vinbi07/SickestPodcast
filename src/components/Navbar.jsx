import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import { staggerContainerVariants, staggerItemVariants, hoverScaleVariants, TIMING } from '../motion/presets';

export default function Navbar({ brand, links, onBook }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: TIMING.STANDARD }}
    >
      <div className={`container ${styles.inner}`}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: TIMING.FAST }}
        >
          <Link to="/" className={styles.logo}>
            {brand.prefix} <span>{brand.highlight}</span> {brand.suffix}
          </Link>
        </motion.div>

        <motion.ul
          className={styles.links}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.06)}
        >
          {links.map((link) => (
            <motion.li key={link.label} variants={staggerItemVariants}>
              <motion.a
                href={link.href}
                whileHover={{ y: -2 }}
                transition={{ duration: TIMING.FAST }}
              >
                {link.label}
              </motion.a>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className={styles.actions}
          initial="hidden"
          animate="visible"
          variants={staggerContainerVariants(0.08, TIMING.STANDARD * 0.5)}
        >
          <motion.button
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={onBook}
            variants={staggerItemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            initial="rest"
          >
            Book Paden
          </motion.button>
          <motion.div variants={staggerItemVariants} whileHover="hover" whileTap={{ scale: 0.95 }} initial="rest">
            <NavLink className={`${styles.btn} ${styles.btnFill}`} to="/episodes/1">
              Listen Now
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}