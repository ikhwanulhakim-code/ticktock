"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

interface EmailLinkProps {
  email: string;
}

export function EmailLink({ email }: EmailLinkProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: open mailto
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted cursor-pointer"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
      ) : (
        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? "Copied!" : "Email"}
    </button>
  );
}
