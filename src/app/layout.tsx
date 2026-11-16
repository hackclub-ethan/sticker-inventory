import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { ThemeProvider } from "next-themes";

import { Geist, Geist_Mono } from "next/font/google";

import { Link, Toast } from "@heroui/react";

import { auth } from "../utils/auth";
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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({headers: await headers()});

  let isAdmin: boolean = false;

  if (session) {
      isAdmin= session["user"]["role"] === "admin" ? true : false;
  };
  
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="light">
          <div className="grid">
            <div className="row1">
              {children}
            </div>

            <footer className="row2">
              <Link href="/">Home</Link> | <Link href="/dashboard">Dashboard</Link> | <Link href="/wishlist">Wishlist</Link> | <Link href="/account">Account</Link> | {isAdmin ? <Link href="/admin">Admin</Link> : ""} | <ThemeSwitch />
            </footer>
          </div>

          <Toast.Provider />
        </ThemeProvider>
      </body>
    </html>
  );
};