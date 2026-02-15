import Image from "next/image";
import { Link2, Smartphone, Monitor, Plus } from "lucide-react";
import { HeroAnimation } from "@/components/features/hero-animation";
import { CreateBoardButton } from "@/components/features/create-board-button";
import { RecentBoards } from "@/components/features/recent-boards";
import { PageHeader } from "@/components/shared/page-header";
import { PageFooter } from "@/components/shared/page-footer";

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
  author: {
    "@type": "Person",
    name: "Ikhwanul Hakim",
    url: "https://ikhwanulhakim.site",
  },
  datePublished: "2025-02-13",
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <PageHeader />

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
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Share via magic link
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                <div className="flex gap-1" aria-hidden="true">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center font-medium">
                  Cross-device access
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
                <Plus className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm text-muted-foreground text-center font-medium">
                  No sign-up required
                </p>
              </div>
            </section>

            {/* CTA */}
            <CreateBoardButton />
          </HeroAnimation>

          {/* Recent boards — client component, reads localStorage */}
          <RecentBoards />
        </main>

        <PageFooter />
      </div>
    </>
  );
}
