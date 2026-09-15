"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Container, Menu, X, Clock, CheckCircle2 } from "lucide-react";
import { NavLinks } from "./NavLinks";
import { cn } from "@/lib/utils";
import { lastUpdated, systemStatus } from "@/lib/data";

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 pb-6 pt-6">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-pop">
        <Container className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-[15px] font-semibold tracking-tight text-white">LogiLLM</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
          Control Tower
        </p>
      </div>
    </div>
  );
}

function SidebarPanel({ pathname }: { pathname: string }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <Brand />
      <div className="mb-4 px-5">
        <div className="h-px bg-white/10" />
      </div>
      <NavLinks pathname={pathname} />
      <div className="mt-auto px-5 pb-6">
        <div className="h-px bg-white/10" />
        <div className="mt-5 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] font-medium text-emerald-300/90">{systemStatus}</span>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const current = pathname === "/" ? "Overview" : pathname === "/planning" ? "Shipment Planning" : pathname === "/risk" ? "Risk & Exceptions" : pathname === "/sustainability" ? "Sustainability" : "AI Decision Support";

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <SidebarPanel pathname={pathname} />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <SidebarPanel pathname={pathname} />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation"
                className="absolute right-3 top-4 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute inset-y-0 left-full w-px bg-white/10" />
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
                className="rounded-md p-1.5 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="flex items-center gap-2 lg:hidden">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
                  <Container className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-slate-900">LogiLLM</span>
              </Link>
              <span className="hidden text-sm font-medium text-slate-500 lg:block">{current}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-xs text-slate-500 sm:flex">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Updated {lastUpdated}
              </span>
              <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200 sm:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {systemStatus}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-[11px] font-semibold text-white ring-2 ring-white shadow-sm">
                JD
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <footer className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
          <p className="border-t border-slate-200/70 pt-4 text-center text-[11px] text-slate-400">
            LogiLLM Control Tower · Logistics decision-support prototype — illustrative analytics for demonstration purposes.
          </p>
        </footer>
      </div>
    </div>
  );
}
