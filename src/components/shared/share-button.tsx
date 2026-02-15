"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Share2, Check, Copy, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { shareLocalBoard } from "@/services/share-service";
import { getLocalEvents } from "@/services/local-storage-service";
import { useSortPreference } from "@/hooks/use-sort-preference";
import { getCustomColors } from "@/services/storage";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  label?: string;
  boardId?: string;
  isLocal?: boolean;
}

export function ShareButton({
  url,
  title = "TickTock — Countdown Timer",
  text = "Check out my countdown timers on TickTock!",
  variant = "ghost",
  size = "icon",
  className,
  label,
  boardId,
  isLocal = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  
  // Get sort preference if board ID is provided
  const sortPreferenceHook = boardId ? useSortPreference(boardId) : null;

  const handleShare = useCallback(async () => {
    // If it's a local board, publish it first
    if (isLocal && boardId) {
      setIsPublishing(true);
      try {
        // Check if board has events
        const events = getLocalEvents(boardId);
        if (events.length === 0) {
          toast.error("Add at least one event before sharing");
          setIsPublishing(false);
          return;
        }

        // Get preferences
        const sortPreference = sortPreferenceHook?.sortMode;
        const customColors = getCustomColors();

        // Share the board
        const { boardId: sharedBoardId, url: sharedUrl } = await shareLocalBoard(
          boardId,
          {
            sortPreference,
            customColors,
          }
        );

        // Show success message
        toast.success("Board published!");

        // Now share the URL BEFORE redirect (to preserve button context)
        let shareCompleted = false;
        if (navigator.share) {
          try {
            await navigator.share({ title, text, url: sharedUrl });
            shareCompleted = true;
          } catch (err) {
            // User cancelled or share failed
            if ((err as DOMException)?.name === "AbortError") {
              // User cancelled, still redirect
              shareCompleted = true;
            } else {
              // Share failed, try clipboard fallback
              try {
                await navigator.clipboard.writeText(sharedUrl);
                toast.success("Link copied to clipboard!");
              } catch {
                // Ignore clipboard errors
              }
            }
          }
        } else {
          // No Web Share API, use clipboard
          try {
            await navigator.clipboard.writeText(sharedUrl);
            toast.success("Link copied to clipboard!");
          } catch {
            toast.error("Failed to copy link");
          }
        }

        setIsPublishing(false);

        // Redirect to shared board AFTER share dialog closes
        router.replace(`/b/${sharedBoardId}`);
        
        return;
      } catch (error) {
        console.error("Failed to publish board:", error);
        const message =
          error instanceof Error ? error.message : "Failed to publish board";
        toast.error(message);
        setIsPublishing(false);
        return;
      }
    }

    // Normal share flow for already-shared boards
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
  }, [url, title, text, isLocal, boardId, sortPreferenceHook, router]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        handleShare();
      }}
      className={cn(className)}
      aria-label={isLocal ? "Publish and share" : "Share link"}
      disabled={isPublishing}
    >
      {isPublishing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : isLocal ? (
        <Upload className="h-4 w-4" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {label && <span className="ml-1.5">{isLocal && !isPublishing ? "Publish & Share" : label}</span>}
    </Button>
  );
}
