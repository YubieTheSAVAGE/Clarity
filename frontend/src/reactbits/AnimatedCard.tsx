/**
 * React Bits-inspired animated card entrance
 * Uses motion for fade-in-up with stagger (no GSAP)
 */
import { motion } from "motion/react";

type AnimatedCardProps = {
  children: React.ReactNode;
  index?: number;
  className?: string;
};

export function AnimatedCard({ children, index = 0, className = "" }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -2 }}
      className={className}
      style={{ transition: "box-shadow 0.18s ease" }}
    >
      {children}
    </motion.div>
  );
}
