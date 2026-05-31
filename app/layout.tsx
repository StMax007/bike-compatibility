import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language";
import { ThemeProvider } from "@/context/theme";
import { Navbar } from "@/components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BikeCompat – Road Bike Compatibility Checker",
  description:
    "Instantly check compatibility between Shimano, SRAM, and Campagnolo road bike components. Find compatible upgrades and estimate costs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <div className="pt-14">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
