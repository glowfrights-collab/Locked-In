import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unlock — Free Wallpapers & AI Prompts",
  description:
    "Unlock premium wallpapers, AI prompts and themed art collections for free — watch an ad, complete a survey, or refer a friend.",
  other: {
    monetag: "d71bb5f67ea780045bed28870e3ae576",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-surface font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
