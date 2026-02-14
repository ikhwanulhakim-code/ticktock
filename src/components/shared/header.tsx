"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAddClick: () => void;
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/app_icon.webp"
              alt="TickTock logo"
              width={28}
              height={28}
              className="rounded"
            />
            <h1 className="text-2xl font-bold tracking-tight">
              Tick<span className="text-primary/60">Tock</span>
            </h1>
          </div>

          {/* Desktop only — hidden on mobile/tablet */}
          <Button
            size="icon"
            className="hidden h-10 w-10 rounded-full shadow-md md:flex"
            onClick={onAddClick}
            aria-label="Add new event"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile/Tablet FAB — fixed bottom-right, hidden on desktop */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-40 md:hidden"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={onAddClick}
          aria-label="Add new event"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
    </>
  );
}
