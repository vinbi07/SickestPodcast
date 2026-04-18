import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import {
  scrollTriggerConfig,
  staggerContainerVariants,
  staggerItemVariants,
  TIMING
} from '../motion/presets';
import styles from './RacetrackWallOfFame.module.css';

const fallbackCars = ['Dodge Viper GTS', 'Ferrari F40', 'Porsche 911 Turbo', 'Shelby GT500'];
const fallbackColors = ['#e63946', '#f4d03f', '#2196f3', '#ff6b35', '#6c3483'];

const mappedGuests = {
  'Crystal Hayslett-1': { car: "'67 Ford Mustang Coupe", color: '#e63946' },
  'Nicole Lynn-2': { car: 'Corvette C7 Z06', color: '#f4d03f' },
  'Arike Ogunbowale-3': { car: "'82 Nissan Skyline R30", color: '#2196f3' },
  'Donovan Reta-4': { car: 'Dodge Viper GTS', color: '#ff6b35' },
  'Rob Matwick-5': { car: 'Ferrari F40', color: '#6c3483' },
  'Dother Sykes-6': { car: 'Porsche 911 Turbo', color: '#ef476f' },
  'Sydney Colson-7': { car: 'Lamborghini Huracan', color: '#1b998b' },
  'Khalia Collier-8': { car: 'Chevrolet Camaro ZL1', color: '#2a9d8f' },
  'Jim Jeffcoat-9': { car: 'Ford GT', color: '#264653' },
  'Jason Mitchell-10': { car: 'McLaren 720S', color: '#8ecae6' },
  'Danielle Price-11': { car: 'Audi R8 V10', color: '#fb8500' },
  'Jalen Foster-12': { car: 'Tesla Roadster', color: '#457b9d' },
  'Maya Carter-13': { car: 'Toyota Supra Mk4', color: '#a8dadc' },
  'Trevor Mills-14': { car: 'Nissan GT-R R35', color: '#bc4749' },
  'Mark Rockefeller-15': { car: 'Plymouth Barracuda', color: '#7f5539' }
};

function normalizeGuests(guests) {
  return guests.map((guest, index) => {
    const key = `${guest.name}-${guest.episode}`;
    const matched = mappedGuests[key];

    return {
      ...guest,
      car: guest.car || matched?.car || fallbackCars[index % fallbackCars.length],
      color: guest.color || matched?.color || fallbackColors[index % fallbackColors.length]
    };
  });
}

function speedMultiplier(index) {
  const multipliers = [0.9, 0.95, 1, 1.05, 1.1, 0.92, 1.08, 0.97, 1.03, 0.99];
  return multipliers[index % multipliers.length];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getNeutralPan(sceneWidth) {
  if (!sceneWidth) {
    return -96;
  }

  return -Math.max(72, sceneWidth * 0.1);
}

function seededUnit(index, salt = 0) {
  const raw = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return raw - Math.floor(raw);
}

function buildTrafficEntries(guests) {
  return guests.map((guest, index) => {
    const lane = index % 3;
    const laneRanges = [
      [46, 55],
      [40, 50],
      [35, 45]
    ];
    const [minDuration, maxDuration] = laneRanges[lane];
    const durationSec = minDuration + seededUnit(index, 1) * (maxDuration - minDuration);
    const phaseSec = seededUnit(index, 2) * durationSec;
    const variant = lane === 0 ? 'sedan' : lane === 1 ? 'coupe' : 'sport';

    return {
      ...guest,
      lane,
      variant,
      durationSec,
      phaseSec,
      duration: `${durationSec.toFixed(2)}s`,
      delay: `-${phaseSec.toFixed(2)}s`
    };
  });
}

function TinyCar({ color, variant }) {
  const bodyByVariant = {
    sedan: 'M7 27l7-10c2-3 5-5 9-6l28-4c5-1 10 1 14 4l8 7h18c4 0 7 3 7 7v3h8v5H96c-2 4-6 6-10 6s-8-2-10-6H42c-2 4-6 6-10 6s-8-2-10-6H7v-6z',
    coupe: 'M8 28l10-11c3-3 6-4 10-5l28-4c6-1 11 1 15 5l8 7h18c4 0 7 3 7 7v3h8v5h-10c-2 4-6 6-10 6s-8-2-10-6H44c-2 4-6 6-10 6s-8-2-10-6H8v-7z',
    sport: 'M9 30l12-10c3-3 7-5 11-5l32-3c4 0 8 1 11 4l8 6h15c3 0 6 3 6 7v2h8v4h-10c-2 4-6 6-10 6s-8-2-10-6H46c-2 4-6 6-10 6s-8-2-10-6H9v-5z'
  };

  const windshieldByVariant = {
    sedan: 'M40 15h16l8 7H33z',
    coupe: 'M42 14h16l8 8H34z',
    sport: 'M45 14h14l8 7H37z'
  };

  return (
    <svg className={styles.tinyCar} viewBox="0 0 120 44" aria-hidden="true" focusable="false">
      <path fill={color} d={bodyByVariant[variant]} />
      <path className={styles.windshield} d={windshieldByVariant[variant]} />
      <circle cx="34" cy="34" r="5" fill="#16120f" />
      <circle cx="84" cy="34" r="5" fill="#16120f" />
    </svg>
  );
}

export default function RacetrackWallOfFame({ guests = [] }) {
  const [selectedGuestKey, setSelectedGuestKey] = useState(null);
  const [worldMetrics, setWorldMetrics] = useState({ sceneWidth: 0, worldWidth: 0 });

  const sceneRef = useRef(null);
  const worldRef = useRef(null);
  const carMoverRefs = useRef(new Map());
  const currentTrackedKeyRef = useRef(null);
  const phaseOverridesRef = useRef(new Map());
  const elapsedSecRef = useRef(0);
  const cameraXRef = useRef(0);
  const worldX = useMotionValue(0);

  const displayGuests = normalizeGuests(guests);
  const trafficGuests = useMemo(() => buildTrafficEntries(displayGuests), [displayGuests]);
  const trafficByKey = useMemo(
    () =>
      Object.fromEntries(trafficGuests.map((guest) => [`${guest.name}-${guest.episode}`, guest])),
    [trafficGuests]
  );

  useEffect(() => {
    const measure = () => {
      const sceneNode = sceneRef.current;
      const worldNode = worldRef.current;

      if (!sceneNode || !worldNode) {
        return;
      }

      setWorldMetrics({
        sceneWidth: sceneNode.clientWidth,
        worldWidth: worldNode.scrollWidth
      });
    };

    measure();
    window.addEventListener('resize', measure);

    return () => {
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (selectedGuestKey || !worldMetrics.sceneWidth) {
      return;
    }

    const neutralPan = getNeutralPan(worldMetrics.sceneWidth);
    cameraXRef.current = neutralPan;
    worldX.set(neutralPan);
  }, [worldMetrics.sceneWidth, selectedGuestKey, worldX]);

  const loopDistance = worldMetrics.worldWidth > 0 ? worldMetrics.worldWidth + 260 : 2000;

  const getNaturalX = (guest, elapsedSec) => {
    const phaseSec = phaseOverridesRef.current.get(`${guest.name}-${guest.episode}`) ?? guest.phaseSec;
    const progress = ((elapsedSec + phaseSec) / guest.durationSec) % 1;
    const normalizedProgress = progress < 0 ? progress + 1 : progress;
    return normalizedProgress * loopDistance;
  };

  const clearTrackedMover = () => {
    const previousKey = currentTrackedKeyRef.current;
    if (!previousKey) {
      return;
    }

    const mover = carMoverRefs.current.get(previousKey);
    if (mover) {
      mover.style.transform = '';
    }
  };

  const ensureSelectedStartsVisible = (guestKey) => {
    const guest = trafficByKey[guestKey];
    if (!guest || worldMetrics.sceneWidth <= 0) {
      return;
    }

    const naturalX = getNaturalX(guest, elapsedSecRef.current);
    const carWidth = guest.lane === 2 ? 76 : 88;
    const currentLeftInScene = worldX.get() - 130 + naturalX;
    const currentRightInScene = currentLeftInScene + carWidth;
    const isVisible = currentRightInScene > 0 && currentLeftInScene < worldMetrics.sceneWidth;

    if (isVisible) {
      return;
    }

    const desiredLeft = Math.max(44, worldMetrics.sceneWidth * 0.18);
    const desiredX = desiredLeft + 130 - worldX.get();
    const desiredProgress = clamp(desiredX / loopDistance, 0, 0.9999);
    const naturalProgress = naturalX / loopDistance;
    const phaseAdjustment = (desiredProgress - naturalProgress) * guest.durationSec;
    phaseOverridesRef.current.set(guestKey, guest.phaseSec + phaseAdjustment);
  };

  useAnimationFrame((time) => {
    elapsedSecRef.current = time / 1000;

    const sceneWidth = worldMetrics.sceneWidth;
    const worldWidth = worldMetrics.worldWidth;
    const selectedKey = selectedGuestKey;

    const neutralPan = getNeutralPan(sceneWidth);

    let targetPan = neutralPan;

    if (selectedKey && trafficByKey[selectedKey] && sceneWidth > 0 && worldWidth > 0) {
      const selectedGuest = trafficByKey[selectedKey];
      const selectedX = getNaturalX(selectedGuest, elapsedSecRef.current);
      const mover = carMoverRefs.current.get(selectedKey);

      if (mover) {
        mover.style.transform = `translateX(${selectedX}px)`;
      }

      const carWidth = selectedGuest.lane === 2 ? 76 : 88;
      const carCenterInWorld = -130 + selectedX + carWidth / 2;
      targetPan = sceneWidth / 2 - carCenterInWorld;

      const minPan = sceneWidth - worldWidth;
      targetPan = clamp(targetPan, minPan, neutralPan);
    }

    cameraXRef.current += (targetPan - cameraXRef.current) * 0.08;
    worldX.set(cameraXRef.current);
  });

  useEffect(() => {
    if (!selectedGuestKey) {
      clearTrackedMover();
      currentTrackedKeyRef.current = null;
      return;
    }

    clearTrackedMover();
    ensureSelectedStartsVisible(selectedGuestKey);
    currentTrackedKeyRef.current = selectedGuestKey;
  }, [selectedGuestKey]);

  useEffect(() => {
    if (selectedGuestKey) {
      ensureSelectedStartsVisible(selectedGuestKey);
    }
  }, [worldMetrics.sceneWidth, worldMetrics.worldWidth, selectedGuestKey]);

  useEffect(
    () => () => {
      clearTrackedMover();
    },
    []
  );

  const handleSelectGuest = (guestKey) => {
    if (selectedGuestKey === guestKey) {
      setSelectedGuestKey(null);
      return;
    }

    setSelectedGuestKey(guestKey);
  };

  const handleRosterToggle = (guestKey) => {
    handleSelectGuest(guestKey);
  };

  const dismissSelection = () => {
    setSelectedGuestKey(null);
  };

  return (
    <section
      className={styles.section}
      id="garage"
      onClick={(event) => {
        if (!event.target.closest('[data-interactive="true"]')) {
          dismissSelection();
        }
      }}
    >
      <div className={`container ${styles.layout}`}>
        <motion.div
          className={styles.head}
          initial="hidden"
          whileInView="visible"
          viewport={scrollTriggerConfig.viewport}
          variants={staggerContainerVariants(0.1)}
        >
          <motion.div className={styles.overline} variants={staggerItemVariants}>
            Every Guest, Every Car
          </motion.div>
          <motion.h2 className={styles.title} variants={staggerItemVariants}>
            The Garage
          </motion.h2>
          <motion.p className={styles.body} variants={staggerItemVariants}>
            Every guest leaves with a car chosen before the conversation starts. This racetrack keeps all
            of them in motion - the full wall of fame, one lap at a time.
          </motion.p>
        </motion.div>

        <div className={styles.grid}>
          <motion.div
            className={styles.sceneFrame}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerItemVariants}
            ref={sceneRef}
          >
            <motion.div
              className={styles.roadWorld}
              ref={worldRef}
              style={{ x: worldX }}
            >
              <div className={`${styles.lane} ${styles.laneNear}`} aria-hidden="true" />
              <div className={`${styles.lane} ${styles.laneMid}`} aria-hidden="true" />
              <div className={`${styles.lane} ${styles.laneFar}`} aria-hidden="true" />

              <div className={styles.carsLayer} aria-label="Guest cars driving across the highway">
                {trafficGuests.map((guest, index) => {
                  const guestKey = `${guest.name}-${guest.episode}`;
                  const isSelected = selectedGuestKey === guestKey;
                  const laneClass =
                    guest.lane === 0
                      ? styles.carNear
                      : guest.lane === 1
                        ? styles.carMid
                        : styles.carFar;

                  return (
                    <div
                      key={guestKey}
                      className={`${styles.carCard} ${laneClass} ${isSelected ? styles.isSelected : ''} ${
                        isSelected ? styles.isTracked : ''
                      }`}
                      style={{
                        '--car-color': guest.color,
                        '--drive-duration': guest.duration,
                        '--drive-delay': guest.delay,
                        '--loop-distance': `${loopDistance}px`
                      }}
                    >
                      <div
                        className={styles.carMover}
                        ref={(node) => {
                          if (node) {
                            carMoverRefs.current.set(guestKey, node);
                          } else {
                            carMoverRefs.current.delete(guestKey);
                          }
                        }}
                      >
                        <div className={styles.carBob}>
                          <button
                            type="button"
                            className={styles.carButton}
                            onClick={() => handleSelectGuest(guestKey)}
                            data-interactive="true"
                            aria-label={`${guest.name} episode ${guest.episode}`}
                          >
                            <span className={styles.carShadow} aria-hidden="true" />
                            <TinyCar color={guest.color} variant={guest.variant} />
                          </button>
                          {isSelected && (
                            <div className={styles.carLabel}>
                              <span>{guest.name}</span>
                              <small>Ep {String(guest.episode).padStart(2, '0')}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            className={styles.roster}
            initial="hidden"
            whileInView="visible"
            viewport={scrollTriggerConfig.viewport}
            variants={staggerContainerVariants(0.06)}
          >
            <h3>Guest Roster</h3>
            <ul>
              {displayGuests.map((guest) => (
                <motion.li key={`${guest.name}-${guest.episode}`} variants={staggerItemVariants}>
                  <button
                    type="button"
                    className={`${styles.rosterItemBtn} ${
                      selectedGuestKey === `${guest.name}-${guest.episode}` ? styles.rosterItemActive : ''
                    }`}
                    onClick={() => handleRosterToggle(`${guest.name}-${guest.episode}`)}
                    data-interactive="true"
                  >
                    <span>Ep {String(guest.episode).padStart(2, '0')}</span>
                    <strong>{guest.name}</strong>
                    <small>{guest.car}</small>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
