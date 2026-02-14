import Image from "next/image";
import { Link2, Smartphone, Monitor, Plus, Github } from "lucide-react";
import { HeroAnimation } from "@/components/features/hero-animation";
import { CreateBoardButton } from "@/components/features/create-board-button";
import { RecentBoards } from "@/components/features/recent-boards";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "TickTock",
  url: "https://tryticktock.vercel.app",
  description:
    "Create and share beautiful countdown timers instantly — no sign-up needed. Track deadlines, events, and milestones with shareable magic links.",
  applicationCategory: "UtilityApplication",
  operatingSystem: "All",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Shareable countdown timers via magic link",
    "Cross-device access",
    "No sign-up required",
    "Real-time countdown",
    "Focus mode",
    "Drag-and-drop reordering",
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
          <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Image
                src="/app_icon.webp"
                alt="TickTock logo"
                width={28}
                height={28}
                className="rounded"
                priority
              />
              <span className="text-2xl font-bold tracking-tight" aria-hidden="true">
                Tick<span className="text-primary/60">Tock</span>
              </span>
            </div>
            <nav aria-label="Main navigation">
              <a
                href="https://github.com/ikhwanulhakim-code/ticktock"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Peek the code</span>
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
          <HeroAnimation>
            <Image
              src="/app_icon.webp"
              alt="TickTock — countdown timer application icon"
              width={80}
              height={80}
              className="mx-auto rounded-2xl shadow-lg"
              priority
            />

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Free Online Countdown Timer
              </h1>
              <p className="text-muted-foreground text-lg">
                Create beautiful countdown timers for deadlines, events, and
                milestones. Share them with a magic link — no account needed.
              </p>
            </div>

            {/* Features */}
            <section
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
              aria-label="Key features"
            >
              <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-sm text-muted-foreground text-center font-medium">
                  Share via magic link
                </h2>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                <div className="flex gap-1" aria-hidden="true">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-sm text-muted-foreground text-center font-medium">
                  Cross-device access
                </h2>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="text-sm text-muted-foreground text-center font-medium">
                  No sign-up required
                </h2>
              </div>
            </section>

            {/* CTA */}
            <CreateBoardButton />
          </HeroAnimation>

          {/* Recent boards — client component, reads localStorage */}
          <RecentBoards />
        </main>

        {/* Footer */}
        <footer className="border-t py-6">
          <div className="mx-auto max-w-3xl px-4 flex items-center justify-center text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} TickTock. Free countdown timer for everyone.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
