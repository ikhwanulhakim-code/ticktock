import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Local Board",
  description:
    "Manage your countdown timers locally. Share when ready to make them accessible from anywhere.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function LocalBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
