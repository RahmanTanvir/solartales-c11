import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Solar Tales - Space Weather Stories",
  description: "Experience space weather through immersive storytelling. Learn about solar flares, auroras, and cosmic events through interactive narratives.",
  keywords: "space weather, solar flares, aurora, NASA, education, storytelling",
  authors: [{ name: "Solar Tales Team" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" }
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Solar Tales" />
      </head>
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white font-inter antialiased">
        <div id="space-background" className="fixed inset-0 z-0"></div>
        <main className="relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
