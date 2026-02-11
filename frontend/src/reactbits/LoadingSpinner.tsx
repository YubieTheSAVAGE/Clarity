/**
 * React Bits-inspired animated loading spinner
 * Uses motion for smooth rotation
 */
import { motion } from "motion/react";

export function LoadingSpinner() {
  return (
    <motion.div
      className="rb-loading-spinner"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}
