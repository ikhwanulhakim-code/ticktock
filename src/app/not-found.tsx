"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4 text-center bg-background">
      <div className="rounded-full bg-muted p-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Page Not Found</h1>
        <p className="text-muted-foreground max-w-125">
          The page you are looking for does not exist. You can create a new
          board to start tracking your events.
        </p>
      </div>
      <Button size="lg" onClick={() => router.push("/")}>
        Return to Home
      </Button>
    </div>
  );
}
