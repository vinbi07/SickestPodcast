import { motion } from 'framer-motion';
import styles from './HostSection.module.css';
import { staggerContainerVariants, staggerItemVariants, scrollTriggerConfig, hoverScaleVariants, TIMING } from '../motion/presets';

export default function HostSection({ host, onBook }) {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.08)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            Your Host
          </motion.div>
          <motion.h2 variants={staggerItemVariants}>
            {host.firstName}
            <span>{host.lastName}</span>
          </motion.h2>
          <motion.p variants={staggerItemVariants}>{host.bio}</motion.p>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.08, TIMING.STANDARD * 1.2)}
          >
            {host.credentials.map((credential) => (
              <motion.li key={credential} variants={staggerItemVariants}>
                {credential}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className={styles.actions}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.1, TIMING.STANDARD * 1.8)}
          >
            <motion.button
              onClick={onBook}
              variants={staggerItemVariants}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              initial="rest"
            >
              Book a Keynote
            </motion.button>
            <motion.button
              onClick={onBook}
              variants={staggerItemVariants}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              initial="rest"
            >
              Advisory Program
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.12)}
        >
          <motion.blockquote variants={staggerItemVariants}>
            <span>"{host.quote}"</span>
            <footer>{host.firstName} {host.lastName} · Founder, SickFit</footer>
          </motion.blockquote>

          <motion.div
            className={styles.advisory}
            variants={staggerItemVariants}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={scrollTriggerConfig.viewport}
            transition={{ duration: TIMING.STANDARD, delay: TIMING.STANDARD * 0.5 }}
          >
            <div>VIP Advisory</div>
            <h3>12 Calls. 12 Months. $12,000.</h3>
            <p>
              Monthly one-on-one strategy access with direct operator support, practical frameworks,
              and accountability.
            </p>
            <motion.button
              onClick={onBook}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              initial="rest"
            >
              Apply Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}