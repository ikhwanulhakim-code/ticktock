import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Board",
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
