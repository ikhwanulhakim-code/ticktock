import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://tryticktock.vercel.app",
      lastModified: new Date("2025-02-13"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://tryticktock.vercel.app/about",
      lastModified: new Date("2025-02-13"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://tryticktock.vercel.app/how-it-works",
      lastModified: new Date("2025-02-13"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
