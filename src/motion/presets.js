import { useReducedMotion } from "framer-motion";

/**
 * Animation Timing Constants
 */
export const TIMING = {
  FAST: 0.2,
  STANDARD: 0.3,
  SLOW: 0.4,
  STAGGER_FAST: 0.05,
  STAGGER_STANDARD: 0.1,
  STAGGER_SLOW: 0.15,
};

/**
 * Easing curves for consistent animation feel
 */
export const EASING = {
  OUT: [0.25, 0.46, 0.45, 0.94], // easeOut
  IN_OUT: [0.43, 0.13, 0.15, 0.96], // easeInOut
  SMOOTH: [0.6, 0.05, -0.01, 0.9], // smooth cubic
};

/**
 * Hook to detect prefers-reduced-motion preference
 * Returns true if user has enabled reduce motion
 */
export const useMotionPreference = () => {
  return useReducedMotion();
};

/**
 * Base variants - used for entrance/exit animations
 */
export const baseVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Fade + slight translate entrance (common for elements)
 */
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
      delay,
    },
  }),
  exit: {
    opacity: 0,
    y: 20,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Fade + scale entrance (for cards, modals)
 */
export const fadeInScaleVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
      delay,
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Staggered container for lists/grids
 */
export const staggerContainerVariants = (
  staggerDelay = TIMING.STAGGER_STANDARD,
  delayChildren = 0,
) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

/**
 * Staggered item (child of staggered container)
 */
export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
    },
  },
};

/**
 * Hover scale animation for interactive elements
 */
export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Subtle hover scale for cards
 */
export const hoverCardScaleVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Icon hover rotation
 */
export const hoverRotateVariants = {
  rest: { rotate: 0 },
  hover: {
    rotate: 5,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Modal/backdrop entrance and exit
 */
export const modalBackdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

export const modalContentVariants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
      delay: TIMING.FAST,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Page transition variants
 */
export const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: TIMING.FAST,
      ease: EASING.OUT,
    },
  },
};

/**
 * Bounce entrance (for badges, highlights)
 */
export const bounceInVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 12,
      duration: TIMING.STANDARD,
    },
  },
};

/**
 * Helper: Apply reduced motion to a variant object
 * Returns empty variant if motion is reduced, otherwise returns original
 */
export const withReducedMotion = (variant, prefersReduced) => {
  if (prefersReduced) {
    return { opacity: variant.visible?.opacity ?? 1 };
  }
  return variant;
};

/**
 * Scroll trigger configuration for whileInView
 */
export const scrollTriggerConfig = {
  whileInView: { opacity: 1, y: 0 },
  viewport: {
    once: true,
    margin: "0px 0px -100px 0px", // Trigger slightly before element reaches bottom of screen
    amount: "some",
  },
  transition: {
    duration: TIMING.STANDARD,
    ease: EASING.OUT,
  },
};

/**
 * Counter animation configuration
 * Used for animated number displays (stats, etc.)
 */
export const counterConfig = {
  duration: 0.6,
  ease: EASING.OUT,
};

/**
 * Line-by-line text entrance (for hero titles)
 */
export const textLineVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: TIMING.STANDARD,
      ease: EASING.OUT,
      delay,
    },
  }),
};

/**
 * Stagger configuration for line-by-line text
 */
export const textLineStaggerConfig = (delayStart = 0) => ({
  staggerChildren: TIMING.STANDARD + TIMING.STAGGER_STANDARD,
  delayChildren: delayStart,
});
