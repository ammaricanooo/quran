import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Al-Qur'an Ku",
  description: "Aplikasi Al-Qur'an digital dengan fitur lengkap untuk memudahkan pembelajaran dan pemahaman Al-Qur'an.",
  keywords: [
    "Al-Qur'an digital",
    "aplikasi Al-Qur'an",
    "pembelajaran Al-Qur'an",
    "pemahaman Al-Qur'an",
    "surah Al-Qur'an",
    "doa harian",
    "kiblat",
    "jadwal sholat"
  ],
  openGraph: {
    title: "Al-Qur'an Ku",
    description: "Aplikasi Al-Qur'an digital dengan fitur lengkap untuk memudahkan pembelajaran dan pemahaman Al-Qur'an.",
    type: 'website',
    locale: 'id_ID',
    siteName: "Al-Qur'an Ku"
  },
  twitter: {
    card: 'summary_large_image',
    title: "Al-Qur'an Ku",
    description: "Aplikasi Al-Qur'an digital dengan fitur lengkap untuk memudahkan pembelajaran dan pemahaman Al-Qur'an."
  }
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
        {children}
      </body>
    </html>
  );
}
