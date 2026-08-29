import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia | Ammar Abdul Malik",
  description: "Aplikasi Al-Qur'an digital Indonesia terbaik & terlengkap karya Ammar Abdul Malik: baca 114 Surah 30 Juz, doa harian, jadwal sholat, hadits 9 imam, asmaul husna, dzikir, tahlil, maulid, dan kuis Quran. Gratis tanpa iklan yang mengganggu.",
  keywords: [
    "Ammar Abdul Malik",
    "Ammar Abdul Malik Quran",
    "Ammaricano",
    "Ammar Abdul Malik Developer",
    "Al-Qur'an Ku",
    "Al-Qur'an digital",
    "aplikasi Al-Qur'an",
    "Qur'an online Indonesia",
    "baca Quran online",
    "Al Quran 30 Juz",
    "Al Quran 114 Surah",
    "terjemahan Quran Indonesia",
    "tafsir Quran digital",
    "murottal Quran online",
    "doa harian Islam",
    "jadwal sholat akurat",
    "hadits shahih",
    "asmaul husna",
    "dzikir pagi petang",
    "bacaan tahlil",
    "maulid nabi",
    "kuis quran interaktif",
    "kiblat finder"
  ],
  authors: [
    {
      name: "Ammar Abdul Malik",
      url: "https://linkedin.com/in/ammaricano"
    }
  ],
  creator: "Ammar Abdul Malik",
  publisher: "Ammar Abdul Malik",
  generator: "Next.js",
  applicationName: "Al-Qur'an Ku",
  metadataBase: new URL("https://quran.ammaricano.my.id"),
  alternates: {
    canonical: "https://quran.ammaricano.my.id"
  },
  openGraph: {
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia",
    description: "Aplikasi Al-Qur'an digital Indonesia karya Ammar Abdul Malik dengan fitur 114 Surah, 30 Juz, doa harian, jadwal sholat, hadits, asmaul husna, dzikir, dan kuis.",
    type: "website",
    locale: "id_ID",
    siteName: "Al-Qur'an Ku",
    url: "https://quran.ammaricano.my.id",
    images: [
      {
        url: "https://quran.ammaricano.my.id/ic_kaligrafi.svg",
        width: 512,
        height: 512,
        alt: "Logo Al-Qur'an Ku oleh Ammar Abdul Malik"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Al-Qur'an Ku - Aplikasi Qur'an Digital Terlengkap Indonesia",
    description: "Aplikasi Al-Qur'an digital karya Ammar Abdul Malik dengan fitur 114 Surah, doa harian, jadwal sholat, hadits, dan dzikir.",
    creator: "@ammaricano",
    site: "@ammaricano",
    images: ["https://quran.ammaricano.my.id/ic_kaligrafi.svg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  category: "Religion & Spirituality",
  other: {
    "geo.region": "ID",
    "geo.placename": "Indonesia",
    "author": "Ammar Abdul Malik"
  }
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://quran.ammaricano.my.id/#author",
      "name": "Ammar Abdul Malik",
      "alternateName": ["Ammaricano", "Ammar", "Ammar Abdul Malik Developer"],
      "jobTitle": "Full Stack Developer & Creator of Al-Qur'an Ku",
      "url": "https://quran.ammaricano.my.id/tentang",
      "image": "https://quran.ammaricano.my.id/ic_kaligrafi.svg",
      "sameAs": [
        "https://linkedin.com/in/ammaricano",
        "https://github.com/ammaricanooo",
        "https://instagram.com/ammaricano",
        "https://threads.com/@ammaricano"
      ],
      "knowsAbout": [
        "Web Development",
        "Next.js",
        "React",
        "Al-Qur'an Digital",
        "Islamic Software",
        "Software Engineering"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://quran.ammaricano.my.id/#website",
      "url": "https://quran.ammaricano.my.id",
      "name": "Al-Qur'an Ku",
      "alternateName": "Al-Qur'an Ku by Ammar Abdul Malik",
      "description": "Aplikasi Al-Qur'an digital Indonesia lengkap: 114 Surah, 30 Juz, doa harian, jadwal sholat, hadits, asmaul husna, dan dzikir.",
      "publisher": {
        "@id": "https://quran.ammaricano.my.id/#author"
      },
      "inLanguage": "id-ID",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://quran.ammaricano.my.id/surah?q={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      "@id": "https://quran.ammaricano.my.id/#app",
      "name": "Al-Qur'an Ku",
      "url": "https://quran.ammaricano.my.id",
      "applicationCategory": "ReligiousApplication",
      "operatingSystem": "All",
      "author": {
        "@id": "https://quran.ammaricano.my.id/#author"
      },
      "creator": {
        "@id": "https://quran.ammaricano.my.id/#author"
      },
      "description": "Aplikasi Al-Qur'an digital Indonesia terlengkap dengan fitur baca Quran 114 surah, doa harian, jadwal sholat, hadits, tahlil, dzikir, dan kuis.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://quran.ammaricano.my.id/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Siapa pembuat atau pengembang aplikasi Al-Qur'an Ku?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Aplikasi Al-Qur'an Ku dibuat dan dikembangkan oleh Ammar Abdul Malik (Ammaricano), seorang Full Stack Developer Indonesia."
          }
        },
        {
          "@type": "Question",
          "name": "Apa saja fitur utama di Al-Qur'an Ku?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Al-Qur'an Ku memiliki fitur baca Al-Qur'an 114 surah dan 30 juz, audio murottal, terjemahan Indonesia & tafsir, doa harian, jadwal sholat akurat berbasis GPS, kumpulan hadits shahih, Asmaul Husna, dzikir pagi petang, tahlil, maulid nabi, dan kuis cerdas cermat Qur'an."
          }
        },
        {
          "@type": "Question",
          "name": "Apakah aplikasi Al-Qur'an Ku gratis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ya, Al-Qur'an Ku dapat diakses 100% gratis secara online tanpa biaya berlangganan."
          }
        }
      ]
    }
  ]
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
        <meta name="author" content="Ammar Abdul Malik" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdData)
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
