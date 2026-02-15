import type { Metadata } from "next";
import Link from "next/link";
import {
  Plus,
  Timer,
  Link2,
  Focus,
  GripVertical,
  Palette,
  Smartphone,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { HeroAnimation } from "@/components/features/hero-animation";
import { PageHeader } from "@/components/shared/page-header";
import { PageFooter } from "@/components/shared/page-footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn how to create, share, and manage countdown timers with TickTock in 3 simple steps — no account required. Free, real-time, and cross-device.",
  alternates: {
    canonical: "/how-it-works",
  },
  openGraph: {
    type: "article",
    title: "How It Works — TickTock",
    description:
      "Create, share, and manage countdown timers in 3 simple steps. No sign-up required.",
    url: "https://tryticktock.vercel.app/how-it-works",
  },
  twitter: {
    title: "How It Works — TickTock",
    description:
      "Create, share, and manage countdown timers in 3 simple steps. No sign-up required.",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is TickTock really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely free — no hidden costs, no premium tier, no ads. TickTock is an open-source project built for everyone.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nope. Just visit the site, create a board, and start adding countdowns. Your board is accessible via its unique link — no sign-up required.",
      },
    },
    {
      "@type": "Question",
      name: "Can others edit my board?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Anyone with the link can view and manage the timers on your board. Think of it as a shared workspace — great for teams, classrooms, or event planning.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work on mobile?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. TickTock is fully responsive and works on all devices. You can even install it as a PWA for a native app-like experience.",
      },
    },
    {
      "@type": "Question",
      name: "What happens when a countdown reaches zero?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The timer shows a completion status with a checkmark. You can keep it for reference or delete it — it's up to you.",
      },
    },
  ],
};

const STEPS = [
  {
    icon: Plus,
    title: "Create a Board",
    description:
      "Click the button, get a unique board instantly. No sign-up, no forms — just start.",
  },
  {
    icon: Timer,
    title: "Add Countdowns",
    description:
      "Set a title, pick a date, choose a color. Your countdown starts ticking immediately.",
  },
  {
    icon: Link2,
    title: "Share the Link",
    description:
      "Copy your board's magic link and share it. Anyone with the link can view your timers across any device.",
  },
];

const FEATURES = [
  {
    icon: Focus,
    title: "Focus Mode",
    description: "Fullscreen view for a single countdown — perfect for presentations or deep work.",
  },
  {
    icon: GripVertical,
    title: "Drag & Drop",
    description: "Reorder your countdowns by dragging them into the order that works for you.",
  },
  {
    icon: Palette,
    title: "Color-coded",
    description: "Assign colors to your timers so you can tell them apart at a glance.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive. Works beautifully on phones, tablets, and desktops.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Visual progress bars show how much time has elapsed and how much remains.",
  },
  {
    icon: Link2,
    title: "Shareable Links",
    description: "Every board has a unique URL. Share it and collaborate in real-time.",
  },
];

const FAQS = [
  {
    question: "Is TickTock really free?",
    answer:
      "Yes, completely free — no hidden costs, no premium tier, no ads. TickTock is an open-source project built for everyone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "Nope. Just visit the site, create a board, and start adding countdowns. Your board is accessible via its unique link — no sign-up required.",
  },
  {
    question: "Can others edit my board?",
    answer:
      "Anyone with the link can view and manage the timers on your board. Think of it as a shared workspace — great for teams, classrooms, or event planning.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Absolutely. TickTock is fully responsive and works on all devices. You can even install it as a PWA for a native app-like experience.",
  },
  {
    question: "What happens when a countdown reaches zero?",
    answer:
      "The timer shows a completion status with a checkmark. You can keep it for reference or delete it — it's up to you.",
  },
];

export default function HowItWorksPage() {
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
                  How It Works
                </h1>
                <p className="text-muted-foreground text-lg">
                  Get started in seconds. No sign-up required.
                </p>
              </section>

              {/* Steps */}
              <section className="space-y-6" aria-label="Steps to get started">
                {STEPS.map((step, index) => (
                  <div
                    key={step.title}
                    className="flex gap-4 rounded-lg border p-5"
                  >
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <Badge
                        variant="secondary"
                        className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-sm font-semibold"
                      >
                        {index + 1}
                      </Badge>
                      <step.icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="space-y-1 pt-1">
                      <h2 className="text-base font-medium">{step.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </section>

              {/* Features */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-center">
                  Everything You Need
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FEATURES.map((feature) => (
                    <div
                      key={feature.title}
                      className="flex flex-col gap-2 rounded-lg border p-4"
                    >
                      <feature.icon
                        className="h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      <h3 className="text-sm font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {FAQS.map((faq) => (
                    <details
                      key={faq.question}
                      className="group rounded-lg border"
                    >
                      <summary className="flex cursor-pointer items-center justify-between p-4 text-sm font-medium transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span
                          className="ml-2 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* CTAs */}
              <section className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Create Your First Timer
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Learn More About Us
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
