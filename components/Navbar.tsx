'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './Navbar.module.css';
import { staggerContainerVariants, staggerItemVariants, TIMING } from '../motion/presets';

interface NavLinkItem {
  label: string;
  href: string;
}

interface Brand {
  prefix: string;
  highlight: string;
  suffix: string;
}

interface NavbarProps {
  brand: Brand;
  links: NavLinkItem[];
  bookHref: string;
  listenHref: string;
}

export default function Navbar({ brand, links, bookHref, listenHref }: NavbarProps) {
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
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: TIMING.FAST }}>
          <Link href="/" className={styles.logo}>
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
              <motion.a href={link.href} whileHover={{ y: -2 }} transition={{ duration: TIMING.FAST }}>
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
          <motion.div variants={staggerItemVariants} whileHover="hover" whileTap={{ scale: 0.95 }} initial="rest">
            <Link className={`${styles.btn} ${styles.btnOutline}`} href={bookHref}>
              Book Paden
            </Link>
          </motion.div>
          <motion.div variants={staggerItemVariants} whileHover="hover" whileTap={{ scale: 0.95 }} initial="rest">
            <Link className={`${styles.btn} ${styles.btnFill}`} href={listenHref}>
              Listen Now
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
