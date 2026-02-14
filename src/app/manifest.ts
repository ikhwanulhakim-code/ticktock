import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TickTock — Countdown Manager",
    short_name: "TickTock",
    description:
      "Create and share beautiful countdown timers instantly — no sign-up needed.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/app_icon.webp",
        sizes: "512x512",
        type: "image/webp",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
