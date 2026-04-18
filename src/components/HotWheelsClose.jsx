import { motion } from 'framer-motion';
import {
  fadeInUpVariants,
  hoverCardScaleVariants,
  scrollTriggerConfig,
  staggerContainerVariants,
  staggerItemVariants,
  TIMING
} from '../motion/presets';
import styles from './HotWheelsClose.module.css';

const featuredCars = [
  {
    name: "'67 Ford Mustang Coupe",
    why: 'For the guest who rebuilt everything from nothing - American muscle, born again.',
    accent: 'Legacy Build'
  },
  {
    name: 'Corvette C7 Z06 Convertible',
    why: 'For the guest whose confidence came with receipts - precision, speed, and no apologies.',
    accent: 'No Coasting'
  },
  {
    name: "'82 Nissan Skyline R30",
    why: 'For the guest who stayed patient through the long curve - classic lines, relentless engine.',
    accent: 'Quiet Torque'
  }
];

function CarSilhouette({ className }) {
  return (
    <svg className={className} viewBox="0 0 240 80" aria-hidden="true" focusable="false">
      <path d="M24 54l13-20c3-5 8-8 14-9l71-9c9-1 18 2 25 8l17 14h27c8 0 14 6 14 14v3h10v8h-14c-2 8-9 13-18 13s-16-5-18-13h-58c-2 8-9 13-18 13s-16-5-18-13H20v-9h4z" />
      <circle cx="72" cy="63" r="10" />
      <circle cx="164" cy="63" r="10" />
    </svg>
  );
}

export default function HotWheelsClose() {
  return (
    <section className={styles.section} id="ritual">
      <div className={`container ${styles.layout}`}>
        <motion.div
          className={styles.head}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.1)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            The Close
          </motion.div>
          <motion.h2 className={styles.title} variants={staggerItemVariants}>
            The Ritual
          </motion.h2>
          <motion.p className={styles.description} variants={staggerItemVariants}>
            Every episode ends with the same move: a Hot Wheels car already picked for that guest before
            we ever sit down. It is not a gift bag moment or a prop for the camera. It is the signal that
            we paid attention to how they built their story.
          </motion.p>
        </motion.div>

        <motion.blockquote
          className={styles.quote}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={fadeInUpVariants}
          custom={0.05}
        >
          Every guest leaves with one thing - a car that was chosen for them before we ever hit record.
          That&apos;s when they know we actually listened.
        </motion.blockquote>

        <motion.div
          className={styles.grid}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(TIMING.STAGGER_SLOW)}
        >
          {featuredCars.map((car) => (
            <motion.article
              key={car.name}
              className={styles.card}
              variants={staggerItemVariants}
              initial="rest"
              whileHover="hover"
              whileFocus="hover"
              tabIndex={0}
            >
              <motion.div className={styles.cardInner} variants={hoverCardScaleVariants}>
                <span className={styles.packStripe} aria-hidden="true" />
                <span className={styles.packBurst} aria-hidden="true">
                  {car.accent}
                </span>
                <CarSilhouette className={styles.carGraphic} />
                <h3>{car.name}</h3>
                <p>{car.why}</p>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
