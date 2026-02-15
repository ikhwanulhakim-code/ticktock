"use client";

import { useState, useCallback } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
}

export function ShareButton({
  url,
  title = "TickTock — Countdown Timer",
  text = "Check out my countdown timers on TickTock!",
  variant = "ghost",
  size = "icon",
  className,
  label,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareUrl = url ?? window.location.href;

    // Try native Web Share API first (mobile & supported browsers)
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch (err) {
        // User cancelled or share failed — fall through to clipboard
        if ((err as DOMException)?.name === "AbortError") return;
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [url, title, text]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      className={cn(className)}
      aria-label="Share link"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {label && <span className="ml-1.5">{label}</span>}
    </Button>
  );
}
