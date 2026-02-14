import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://tryticktock.vercel.app";
const SITE_TITLE = "TickTock — Free Online Countdown Timer & Deadline Tracker";
const SITE_DESCRIPTION =
  "Create and share beautiful countdown timers instantly — no sign-up needed. Track deadlines, events, and milestones with shareable magic links. Free, cross-device, real-time.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | TickTock",
  },
  description: SITE_DESCRIPTION,
  applicationName: "TickTock",
  authors: [{ name: "Ikhwanul Hakim", url: "https://github.com/ikhwanulhakim-code" }],
  creator: "Ikhwanul Hakim",
  keywords: [
    "countdown timer",
    "countdown manager",
    "online countdown",
    "event countdown",
    "deadline tracker",
    "shareable timer",
    "free countdown timer",
    "countdown clock",
    "timer online",
    "ticktock",
  ],
  icons: [
    { rel: "icon", url: "/favicon.ico", sizes: "any" },
    { rel: "icon", url: "/icon.webp", type: "image/webp" },
    { rel: "apple-touch-icon", url: "/app_icon.webp" },
  ],
  openGraph: {
    type: "website",
    siteName: "TickTock",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
