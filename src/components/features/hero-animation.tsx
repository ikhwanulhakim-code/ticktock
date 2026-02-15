"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroAnimationProps {
  children: ReactNode;
  className?: string;
}

export function HeroAnimation({ children, className }: HeroAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("text-center max-w-lg space-y-6", className)}
    >
      {children}
    </motion.div>
  );
}
