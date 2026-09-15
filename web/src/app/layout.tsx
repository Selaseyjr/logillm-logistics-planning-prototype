import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LogiLLM Control Tower",
  description:
    "Modern logistics decision-support interface — a frontend UX experiment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>
      </body>
    </html>
  );
}
