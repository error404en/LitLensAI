import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from '@clerk/nextjs';
import { QueryProvider } from '@/providers/query-provider';
import { GlobalRealtime } from '@/components/providers/global-realtime';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LitLens AI - Research Assistant",
  description: "Enterprise-grade AI research assistant for navigating, understanding, and synthesizing academic literature via RAG.",
  openGraph: {
    title: "LitLens AI - Research Assistant",
    description: "Enterprise-grade AI research assistant for navigating, understanding, and synthesizing academic literature via RAG.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LitLens AI - Research Assistant",
    description: "Enterprise-grade AI research assistant for navigating, understanding, and synthesizing academic literature via RAG.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en" className="dark scroll-smooth">
        <head>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
            rel="stylesheet" 
          />
          <style>{`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
          `}</style>
        </head>
        <body
          className={`${inter.variable} ${geist.variable} bg-background text-on-surface font-body-md text-body-md antialiased overflow-x-hidden min-h-screen`}
        >
          <GlobalRealtime />
          {children}
        </body>
      </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
