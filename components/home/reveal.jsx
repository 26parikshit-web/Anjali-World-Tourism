"use client";

import { motion } from "motion/react";

const directions = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { x: 28, y: 0 },
  right: { x: -28, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Lightweight scroll-reveal wrapper. Animates transform + opacity only
 * (compositor-friendly) and runs once when the element enters the viewport.
 */
export function Reveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  amount = 0.3,
  ...rest
}) {
  const MotionTag = motion[as] ?? motion.div;
  const offset = directions[direction] ?? directions.up;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
