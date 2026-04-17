import { motion } from 'framer-motion';
import Pillars from './Pillars';
import styles from './About.module.css';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, hoverScaleVariants, TIMING } from '../motion/presets';

export default function About({ quote, body, stats, pillars, onBook }) {
  return (
    <section className={styles.section} id="about">
      <div className={`container ${styles.layout}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.1)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            The Show
          </motion.div>
          <motion.h2 className={styles.quote} variants={staggerItemVariants}>
            {quote}
          </motion.h2>
          <motion.p className={styles.body} variants={staggerItemVariants}>
            {body}
          </motion.p>

          <motion.div
            className={styles.stats}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.5)}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className={styles.stat} variants={staggerItemVariants}>
                <div>{stat.value}</div>
                <span>{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            className={styles.bookBtn}
            onClick={onBook}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, delay: TIMING.STANDARD * 1.8 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            About Paden
          </motion.button>
        </motion.div>

        <Pillars pillars={pillars} />
      </div>
    </section>
  );
}