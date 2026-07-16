import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia",
  description: "Aplikasi Al-Qur'an digital Indonesia dengan fitur lengkap: baca Quran, doa harian, jadwal sholat, kuis, tahlil, hadits, dan dzikir. Gratis dan mudah digunakan.",
  keywords: [
    "Al-Qur'an digital",
    "aplikasi Al-Qur'an",
    "Qur'an online",
    "baca Quran",
    "pembelajaran Al-Qur'an",
    "doa harian",
    "jadwal sholat",
    "kuis Qur'an",
    "hadits Islam",
    "tahlil",
    "dzikir pagi",
    "kiblat finder"
  ],
  metadataBase: new URL("https://quran.ammaricano.my.id"),
  alternates: {
    canonical: "https://quran.ammaricano.my.id"
  },
  openGraph: {
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap",
    description: "Aplikasi Al-Qur'an digital Indonesia dengan fitur lengkap: baca Quran, doa harian, jadwal sholat, kuis, tahlil, hadits, dan dzikir.",
    type: 'website',
    locale: 'id_ID',
    siteName: "Al-Qur'an Ku",
    url: "https://quran.ammaricano.my.id"
  },
  twitter: {
    card: 'summary_large_image',
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap",
    description: "Aplikasi Al-Qur'an digital Indonesia dengan fitur lengkap: baca Quran, doa harian, jadwal sholat, kuis, tahlil, hadits, dan dzikir.",
    creator: "@ammaricano"
  },
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  category: "Religion"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/ic_kaligrafi.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Al-Qur'an Ku" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Al-Qur'an Ku" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Al-Qur'an Ku",
              "description": "Aplikasi Al-Qur'an digital Indonesia dengan fitur lengkap: baca Quran, doa harian, jadwal sholat, kuis, tahlil, hadits, dan dzikir.",
              "url": "https://quran.ammaricano.my.id",
              "applicationCategory": "ReligiousApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "IDR"
              }
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
