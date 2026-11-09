"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-8 h-8 rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center opacity-50 ${className}`}
        aria-hidden="true"
      >
        <span className="w-3.5 h-3.5" />
      </div>
    );
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors border cursor-pointer theme-toggle-btn ${
        isLight
          ? "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
          : "bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
      } ${className}`}
      title={isLight ? "Switch to Dark Craft Mode" : "Switch to Light Mode"}
      aria-label={isLight ? "Switch to Dark Craft Mode" : "Switch to Light Mode"}
    >
      {isLight ? (
        <Moon className="w-3.5 h-3.5 text-zinc-700" />
      ) : (
        <Sun className="w-3.5 h-3.5 text-amber-300" />
      )}
      {showLabel && (
        <span className="text-[11px] font-mono">
          {isLight ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
}

