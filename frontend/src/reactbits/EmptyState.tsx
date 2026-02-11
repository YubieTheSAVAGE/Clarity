/**
 * React Bits-inspired animated empty state
 * Uses motion for subtle entrance animation
 */
import { motion } from "motion/react";

type EmptyStateProps = {
  message: string;
  icon?: React.ReactNode;
};

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rb-empty-state"
    >
      {icon && <div className="rb-empty-state-icon">{icon}</div>}
      <p>{message}</p>
    </motion.div>
  );
}
