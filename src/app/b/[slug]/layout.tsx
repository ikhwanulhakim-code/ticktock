import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
  description:
    "View and manage your countdown timers. Track deadlines, events, and milestones in real-time.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function BoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
