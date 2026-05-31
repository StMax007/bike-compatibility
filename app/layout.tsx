import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/language";
import { ThemeProvider } from "@/context/theme";
import { Navbar } from "@/components/Navbar";

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
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="antialiased bg-[#0a0a0a] dark:bg-[#0a0a0a] text-white dark:text-white min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <Navbar />
            <div className="pt-14">{children}</div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
