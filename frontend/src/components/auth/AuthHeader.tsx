"use client";

import React from "react";
import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  badgeText = "Mock Session Calibration",
}) => {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      {/* Top row */}
      <div className="w-full flex items-center justify-between mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors py-1 px-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Home</span>
        </Link>

        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{badgeText}</span>
        </div>
      </div>

      {/* Brand Icon */}
      <Link href="/" className="mb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-zinc-100 text-zinc-950 font-bold transition-transform hover:scale-105">
          <Terminal className="w-5 h-5 text-zinc-950" />
        </div>
      </Link>

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
        {title}
      </h1>

      {/* Subtitle */}
      <p className="text-xs text-zinc-400 max-w-sm">
        {subtitle}
      </p>
    </div>
  );
};
