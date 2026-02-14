"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function HeroAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-lg space-y-6"
    >
      {children}
    </motion.div>
  );
}
