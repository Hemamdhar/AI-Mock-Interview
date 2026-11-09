"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Menu, X, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: "Core Subjects", href: "/subjects" },
  { name: "Question Bank", href: "/#questions" },
  { name: "Mock Engine", href: "/#mock-engine" },
  { name: "System Design", href: "/#capabilities" },
  { name: "DSA", href: "/dashboard/dsa" },
];

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 sm:px-6 py-3 transition-all duration-200">
      <nav
        aria-label="Main Navigation"
        className={`w-full max-w-6xl flex items-center justify-between px-4 sm:px-5 py-2.5 rounded-lg border transition-all duration-200 ${
          isScrolled
            ? "bg-[#09090b]/90 backdrop-blur-md border-zinc-800 shadow-sm"
            : "bg-[#09090b]/60 backdrop-blur-sm border-zinc-800/60"
        }`}
      >
        {/* Brand / Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-md"
          aria-label="InterviewAI Home"
        >
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100 text-zinc-950 font-bold transition-transform group-hover:scale-105">
            <Terminal className="w-4 h-4 text-zinc-950" />
          </div>

          <span className="font-semibold text-sm sm:text-base tracking-tight text-zinc-100">
            Interview<span className="text-zinc-400">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 rounded-md transition-colors duration-150"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />
          {mounted && isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 py-1 px-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors group"
                title="Go to Dashboard"
              >
                <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-200 border border-zinc-700">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-zinc-200">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
              </Link>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-zinc-400 hover:text-rose-400 transition-colors rounded-md hover:bg-rose-950/20"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white rounded-md hover:bg-zinc-800/50 transition-colors"
              >
                Log In
              </Link>

              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 transition-colors shadow-xs"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[62px] left-4 right-4 p-4 rounded-lg bg-[#09090b] border border-zinc-800 shadow-xl pointer-events-auto">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-md hover:bg-zinc-800/50 transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <div className="h-px bg-zinc-800 my-2" />

            <div className="flex flex-col gap-2 pt-1">
              <ThemeToggle showLabel className="w-full justify-center" />
              {mounted && isAuthenticated && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-md bg-zinc-900 border border-zinc-800"
                  >
                    <div className="w-7 h-7 rounded bg-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{user.name}</p>
                      <p className="text-[11px] text-zinc-400">{user.email}</p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2 text-xs font-medium text-rose-400 rounded-md bg-rose-950/20 hover:bg-rose-950/40 transition-colors border border-rose-900/30 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-medium text-zinc-300 hover:text-white rounded-md bg-zinc-900 border border-zinc-800"
                  >
                    Log In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-xs font-medium bg-zinc-100 text-zinc-950 rounded-md flex items-center justify-center gap-1.5 hover:bg-white"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
