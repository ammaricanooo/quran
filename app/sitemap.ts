import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://quran.ammaricano.my.id";
  const now = new Date();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 1.0
    },
    {
      url: `${baseUrl}/surah`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/juz`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/doa`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/jadwal`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/game`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/tahlil`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/hadits`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/dzikir`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/maulid`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3
    }
  ];

  // Generate surah pages (1-114)
  const surahPages = Array.from({ length: 114 }, (_, i) => ({
    url: `${baseUrl}/surah/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  // Generate juz pages (1-30)
  const juzPages = Array.from({ length: 30 }, (_, i) => ({
    url: `${baseUrl}/juz/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8
  }));

  // Generate game pages
  const gamePages = [
    {
      url: `${baseUrl}/game/tebak-surah`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/game/tebak-ayat`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/game/sambung-ayat`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6
    },
    {
      url: `${baseUrl}/game/multiplayer`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6
    }
  ];

  return [...staticPages, ...surahPages, ...juzPages, ...gamePages];
}