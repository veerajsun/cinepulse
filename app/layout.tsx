import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CinePulse — Premium Entertainment News Portal",
  description: "Prestige digital publication delivering real-time dispatches, box office analytics, film reviews, anime seasonal slates, and K-drama updates.",
  keywords: ["Entertainment News", "Movies", "Box Office", "Anime", "K-Drama", "Web Series", "CinePulse"],
  openGraph: {
    title: "CinePulse — Premium Entertainment News Portal",
    description: "Prestige entertainment journalism bridging legacy Hollywood trades with global pop culture fandoms.",
    url: "https://cinepulse.news",
    siteName: "CinePulse",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-on-surface antialiased font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow w-full pt-20 bg-background">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
