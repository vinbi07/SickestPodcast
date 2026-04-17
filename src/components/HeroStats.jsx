import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './HeroStats.module.css';
import {
  counterConfig,
  staggerContainerVariants,
  staggerItemVariants,
  scrollTriggerConfig,
  TIMING,
  useMotionPreference,
} from '../motion/presets';

function AnimatedCounter({ value }) {
  const prefersReducedMotion = useMotionPreference();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return undefined;
    }

    let animationFrame = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (counterConfig.duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    setDisplayValue(0);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [value, prefersReducedMotion]);

  return <motion.span>{displayValue}</motion.span>;
}

export default function HeroStats({ stats, desktop = false }) {
  return (
    <motion.div
      className={`${styles.stats} ${desktop ? styles.desktop : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={scrollTriggerConfig.viewport}
      variants={staggerContainerVariants(TIMING.STAGGER_STANDARD + 0.05)}
    >
      {stats.map((item) => (
        <motion.div
          key={item.label}
          className={styles.item}
          variants={staggerItemVariants}
        >
          <motion.div
            className={styles.number}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, ease: 'easeOut' }}
          >
            <AnimatedCounter value={item.value} />
          </motion.div>
          <motion.div
            className={styles.label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, delay: counterConfig.duration }}
          >
            {item.label}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}