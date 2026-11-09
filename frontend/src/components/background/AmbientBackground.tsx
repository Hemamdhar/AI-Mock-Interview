"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function AmbientBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLight = mounted && theme === "light";
  const gridColor = isLight ? "rgba(0, 0, 0, 0.07)" : "rgba(255, 255, 255, 0.08)";

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-300"
      aria-hidden="true"
    >
      {/* Base Surface */}
      <div className={`absolute inset-0 transition-colors duration-300 ${isLight ? "bg-[#f8fafc]" : "bg-[#09090b]"}`} />

      {/* 3D Perspective Horizon Grid Plane (Receding Floor) */}
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[160vw] max-w-[2000px] h-[550px] opacity-[0.8] origin-top"
        style={{
          transform: "perspective(500px) rotateX(62deg)",
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 95%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 95%)",
        }}
      />

      {/* Flat Subtle Micro-Grid on Main Body */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle Top Center Lighting Bevel */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[380px] blur-[120px] rounded-full pointer-events-none transition-colors duration-300 ${
          isLight ? "bg-black/[0.02]" : "bg-white/[0.03]"
        }`}
      />

      {/* Subtle Depth Vignette */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          background: isLight
            ? "radial-gradient(ellipse at center, transparent 30%, rgba(248, 250, 252, 0.8) 100%)"
            : "radial-gradient(ellipse at center, transparent 30%, rgba(9, 9, 11, 0.75) 100%)",
        }}
      />
    </div>
  );
}
