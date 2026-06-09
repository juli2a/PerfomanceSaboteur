import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import WebVitalsReporter from "@/components/simulator/WebVitalsReporter";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PerfSaboteur",
  description: "B2B Merchant Analytics — frontend anti-pattern simulator",
};

// Root layout: dark theme, fonts, web-vitals reporter
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="h-full bg-zinc-950 text-zinc-100 antialiased">
        <WebVitalsReporter />
        {children}
      </body>
    </html>
  );
}
