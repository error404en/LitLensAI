import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { SideNavBar } from "@/components/layout/SideNavBar";
import { TopNavBar } from "@/components/layout/TopNavBar";

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
  title: "LitLens AI - Dashboard",
  description: "Precision Literature Survey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
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
        className={`${inter.variable} ${geist.variable} bg-background text-on-surface font-body-md text-body-md antialiased overflow-hidden flex h-screen`}
      >
        <SideNavBar />
        <TopNavBar />
        
        {/* Main Content Canvas */}
        <main className="flex-1 ml-0 md:ml-64 mt-[60px] h-[calc(100vh-60px)] overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </body>
    </html>
  );
}
