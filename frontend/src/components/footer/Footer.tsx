"use client";

import React from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-[#09090b] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Brand column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-zinc-100 text-zinc-950 font-bold">
              <Terminal className="w-3.5 h-3.5 text-zinc-950" />
            </div>
            <span className="font-semibold text-sm text-zinc-200">InterviewAI</span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            Technical and behavioral interview practice environment with real-time
            code execution and structured hiring rubric evaluations.
          </p>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap gap-8 text-xs font-medium">
          <div className="space-y-2">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px] block">
              Platform
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/subjects" className="hover:text-white transition-colors">
                  Core CS Subjects
                </Link>
              </li>
              <li>
                <Link href="/dashboard/interview" className="hover:text-white transition-colors">
                  Question Bank
                </Link>
              </li>
              <li>
                <Link href="/#mock-engine" className="hover:text-white transition-colors">
                  3-Phase Mock Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/system-design" className="hover:text-white transition-colors">
                  System Design
                </Link>
              </li>
              <li>
                <Link href="/dashboard/dsa" className="hover:text-white transition-colors">
                  DSA &amp; LeetCode
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Candidate Workspace
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px] block">
              Legal & Compliance
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#security" className="hover:text-white transition-colors">
                  Data Security
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-300 font-semibold uppercase tracking-wider text-[10px] block">
              System
            </span>
            <ul className="space-y-1.5">
              <li className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>All Systems Operational</span>
              </li>
              <li className="text-[11px] font-mono text-zinc-400">v1.0.0 Stable</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 gap-4">
        <p>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
