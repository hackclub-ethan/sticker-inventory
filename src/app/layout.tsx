import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "next-themes";

import { Geist, Geist_Mono } from "next/font/google";

import { Link, Toast } from "@heroui/react";

import { ThemeSwitch } from "./components/themeSwitcher";

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
  title: "Stickers! but inventory",
  description: "Sticker Inventory website",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="light">
          {children}

          <footer>
            <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> | <Link href="/wishlist">Wishlist</Link> | <Link href="account">Account</Link> | <ThemeSwitch />
          </footer>

          <Toast.Provider />
        </ThemeProvider>
      </body>
    </html>
  );
};