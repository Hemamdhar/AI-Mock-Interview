"use client";

import React, { useMemo } from "react";
import {
  ArrowLeft,
  Check,
  Box,
  MapPin,
  ExternalLink,
  Code2,
  Sparkles,
} from "lucide-react";
import { LevelData } from "@/data/dsaRoadmap";
import { SubMethodData } from "@/data/dsaSubMethods";
import { useTheme } from "@/context/ThemeContext";

interface SubMethodRoadmapCanvasProps {
  parentLevel: LevelData;
  subMethods: SubMethodData[];
  solvedProblemIds: number[];
  onSelectSubMethod: (subMethod: SubMethodData) => void;
  onBackToOverview: () => void;
  onViewLevelOverview?: () => void;
}

export const SubMethodRoadmapCanvas: React.FC<SubMethodRoadmapCanvasProps> = ({
  parentLevel,
  subMethods,
  solvedProblemIds,
  onSelectSubMethod,
  onBackToOverview,
  onViewLevelOverview,
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Calculate coordinates for the sub-methods in a smooth S-curve snake track
  // Alternate horizontally: 50% -> 78% -> 50% -> 22% -> 50% -> 78% ...
  const nodesWithCoordinates = useMemo(() => {
    const xPattern = [50, 78, 50, 22];
    const verticalGap = 160;
    const startY = 80;

    return subMethods.map((sub, idx) => {
      const x = xPattern[idx % xPattern.length];
      const y = startY + idx * verticalGap;
      return {
        ...sub,
        x,
        y,
      };
    });
  }, [subMethods]);

  // Total canvas height based on number of sub-methods
  const canvasHeight = useMemo(() => {
    return Math.max(500, nodesWithCoordinates.length * 165 + 100);
  }, [nodesWithCoordinates]);

  // Construct SVG Bezier snake path
  const svgTrackPath = useMemo(() => {
    if (nodesWithCoordinates.length < 2) return "";

    const points = nodesWithCoordinates.map((node) => ({
      x: (node.x / 100) * 800,
      y: node.y,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [nodesWithCoordinates]);

  // Calculate overall level sub-method solved stats
  const totalSubProblems = useMemo(() => {
    return subMethods.reduce((acc, sm) => acc + sm.problems.length, 0);
  }, [subMethods]);

  const totalSubSolved = useMemo(() => {
    const allIds = new Set(subMethods.flatMap((sm) => sm.problems.map((p) => p.id)));
    return solvedProblemIds.filter((id) => allIds.has(id)).length;
  }, [subMethods, solvedProblemIds]);

  return (
    <div className="space-y-4">
      {/* 1. Sub-Roadmap Header & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToOverview}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to 18 Levels</span>
            </button>

            {onViewLevelOverview && (
              <button
                type="button"
                onClick={onViewLevelOverview}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
              >
                <span>Level Overview</span>
              </button>
            )}

            <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-300">
              LEVEL {parentLevel.levelNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                parentLevel.tag === "CORE"
                  ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                  : parentLevel.tag === "HARD"
                  ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                  : parentLevel.tag === "MEDIUM"
                  ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                  : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
              }`}
            >
              {parentLevel.tag}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>{parentLevel.title}</span>
            <span className="text-sm font-normal text-zinc-500 font-mono">
              ({subMethods.length} Sub-Methods)
            </span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl">
            {parentLevel.description} Click any sub-method below to open its dedicated 3D Interactive Lab, Video Tutorial, and LeetCode problems.
          </p>
        </div>

        {/* Solved Counter & 3D badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-right">
            <span className="text-[10px] text-zinc-500 font-mono block">Sub-Problems Solved</span>
            <span className="text-xs font-mono font-bold text-white">
              {totalSubSolved} / {totalSubProblems}
            </span>
          </div>

          <div className="px-3 py-2 rounded-md bg-blue-950/30 border border-blue-900/40 flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase block">
                2D Interactive Labs
              </span>
              <span className="text-[10px] text-zinc-400">All Sub-Methods</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub-Method Snake Canvas */}
      <div className="relative rounded-lg bg-[#09090b] border border-zinc-800/90 shadow-2xl p-4 sm:p-8 overflow-hidden select-none">
        {/* Matrix Grid Pattern Background */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: isLight
              ? "linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)"
              : "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Canvas Wrapper */}
        <div
          className="relative w-full max-w-[800px] mx-auto"
          style={{ minHeight: `${canvasHeight}px` }}
        >
          {/* SVG Snake Track */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox={`0 0 800 ${canvasHeight}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Track Rail */}
            <path
              d={svgTrackPath}
              stroke={isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner Dotted Track Rail */}
            <path
              d={svgTrackPath}
              stroke={isLight ? "#475569" : "rgba(255, 255, 255, 0.35)"}
              strokeWidth="4"
              strokeDasharray="6 8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Render Sub-Method Circular Nodes */}
          {nodesWithCoordinates.map((sub) => {
            const total = sub.problems.length;
            const solved = sub.problems.filter((p) => solvedProblemIds.includes(p.id)).length;
            const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
            const isCompleted = total > 0 && percentage === 100;

            return (
              <button
                key={sub.id}
                type="button"
                aria-label={`${sub.title}`}
                style={{
                  left: `${sub.x}%`,
                  top: `${sub.y}px`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 focus:outline-none"
                onClick={() => onSelectSubMethod(sub)}
              >
                {/* 2D Lab Ready Mini Pill Badge */}
                <div className="absolute -top-7 flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-950/80 border border-blue-800/80 text-[8px] font-mono font-bold text-cyan-300 uppercase shadow-xs group-hover:scale-105 transition-transform">
                  <Box className="w-2.5 h-2.5 text-cyan-400" />
                  <span>2D LAB</span>
                </div>

                {/* Circular Node with Radial Progress Arc */}
                <div className="relative w-15 h-15 sm:w-16 sm:h-16 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                    {/* Background track circle */}
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      stroke={isLight ? "#e2e8f0" : "#1f1f23"}
                      strokeWidth="5"
                      fill={isLight ? "#ffffff" : "#121216"}
                    />
                    {/* Partial progress arc */}
                    {percentage > 0 && (
                      <circle
                        cx="36"
                        cy="36"
                        r="30"
                        stroke={isCompleted ? "#10b981" : "#eab308"}
                        strokeWidth="5"
                        strokeDasharray={188.5}
                        strokeDashoffset={188.5 - (188.5 * percentage) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    )}
                  </svg>

                  {/* Node Interior */}
                  <div className="absolute inset-2 rounded-full flex flex-col items-center justify-center bg-[#141418] border border-zinc-700/60 shadow-inner group-hover:border-zinc-500 transition-colors">
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                    ) : (
                      <span className="font-mono font-black text-xs sm:text-sm text-white">
                        {parentLevel.levelNumber}.{sub.subNumber}
                      </span>
                    )}
                  </div>
                </div>

                {/* Concept Label & Tag */}
                <div className="mt-2 flex flex-col items-center max-w-[170px] text-center">
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                    {sub.shortTitle}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span
                      className={`px-1.5 py-0.2 rounded-sm text-[8px] font-bold font-mono tracking-wider uppercase ${
                        sub.tag === "CORE"
                          ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                          : sub.tag === "HARD"
                          ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                          : sub.tag === "MEDIUM"
                          ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                          : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                      }`}
                    >
                      {sub.tag}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      {sub.timeComplexity.average}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
