import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  Rocket,
  ShieldCheck,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Globe,
  ArrowRight,
} from "lucide-react";
import { HeroAnimation } from "@/components/features/hero-animation";
import { PageHeader } from "@/components/shared/page-header";
import { PageFooter } from "@/components/shared/page-footer";
import { EmailLink } from "@/components/features/email-link";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind TickTock — a free countdown timer I built during a casual Discord 'seminar' with friends, showing off how to build real websites with AI as your coding buddy. Meet the maker!",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "article",
    title: "About TickTock",
    description:
      "The story behind TickTock — a free countdown timer I built during a casual Discord 'seminar' with friends, showing off how to build real websites with AI.",
    url: "https://tryticktock.vercel.app/about",
  },
  twitter: {
    title: "About TickTock",
    description:
      "Built live on Discord as a 'seminar' for friends — showing how I use AI as my coding buddy to build real apps.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About TickTock",
  url: "https://tryticktock.vercel.app/about",
  description:
    "The story behind TickTock — a free countdown timer I built during a casual Discord 'seminar' with friends, showing off how to build real websites with AI as your coding buddy.",
  mainEntity: {
    "@type": "WebApplication",
    name: "TickTock",
    url: "https://tryticktock.vercel.app",
  },
};

const FUN_FACTS = [
  {
    icon: Sparkles,
    title: "AI = My Coding Buddy",
    description:
      "Every feature built with AI as my pair programmer. It's like having a really smart rubber duck that actually codes.",
  },
  {
    icon: MessageSquare,
    title: "Born on Discord",
    description:
      "Started as an impromptu 'seminar' for friends. No slides, no prep — just vibes and live coding.",
  },
  {
    icon: Rocket,
    title: "Zero to Production",
    description:
      "Took it from 'hm what should we build?' to a fully deployed app — database, UI polish, SEO, the works — all in one stream.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First (Because Simple)",
    description:
      "No login, no analytics, no cookies asking for consent. Just a URL and you're in. Privacy through laziness, basically.",
  },
];

const SOCIAL_LINKS = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/ikhwanulhakim-code",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "https://www.instagram.com/ikhwanulhakim.me/",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ikhwanulhakimm",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:ikhwanulhakim.work@gmail.com",
  },
  {
    icon: Globe,
    label: "Website",
    href: "https://ikhwanulhakim.site",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <PageHeader />

        <main className="flex-1 px-4 py-16">
          <HeroAnimation className="max-w-3xl w-full mx-auto text-left space-y-0">
            <div className="space-y-16">
              {/* Hero */}
              <section className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  About TickTock
                </h1>
                <p className="text-muted-foreground text-lg">
                  A free countdown timer with an origin story that involves Discord, AI, and zero planning.
                </p>
              </section>

              {/* Origin story */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  How It All Started
                </h2>
                <div className="space-y-3 text-muted-foreground leading-relaxed">
                  <p>
                    TickTock wasn&apos;t born in a startup incubator or a
                    hackathon — I built it live during what I&apos;d generously call
                    a &quot;seminar&quot; on Discord (read: me screen-sharing to friends
                    at 10 PM). A friend asked me to do a sharing session about
                    how I build websites with AI, so I figured: why not just
                    build something live and show the whole process?
                  </p>
                  <p>
                    So we went from zero to deployment — brainstorming what to
                    build, sketching out the architecture, shipping the first
                    prototype, wiring up a real database, making it look good,
                    and even throwing in some SEO sauce. Every line of code was
                    written with AI as my pair programmer. I&apos;d explain the
                    prompt, AI would suggest code, I&apos;d tweak it, merge it, ship
                    it. Rinse, repeat.
                  </p>
                  <p>
                    What started as a casual sharing session turned
                    into an actual production app that people can actually use.
                    No sign-up forms, no premium tiers, no &quot;please allow
                    cookies&quot; popups — just paste a link and watch time tick.
                  </p>
                </div>
              </section>

              {/* Fun facts */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Fun Facts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FUN_FACTS.map((fact) => (
                    <div
                      key={fact.title}
                      className="flex flex-col gap-2 rounded-lg border p-4"
                    >
                      <fact.icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-medium">{fact.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {fact.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Meet the maker */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  Meet the Maker
                </h2>
                <div className="rounded-lg border p-6 space-y-4">
                  <div>
                    <h3 className="text-base font-medium">Ikhwanul Hakim</h3>
                    <p className="text-sm text-muted-foreground">
                      Developer who built TickTock. Professionally: I ship code. Casually: I treat AI like a very patient senior dev who never gets tired of my questions.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {SOCIAL_LINKS.map((link) =>
                      link.href.startsWith("mailto:") ? (
                        <EmailLink
                          key={link.label}
                          email={link.href.replace("mailto:", "")}
                        />
                      ) : (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener me"
                          className="flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                        >
                          <link.icon className="h-3.5 w-3.5" aria-hidden="true" />
                          {link.label}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </section>

              {/* CTAs */}
              <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  See How It Works
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Start a Timer
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>
            </div>
          </HeroAnimation>
        </main>

        <PageFooter />
      </div>
    </>
  );
}
