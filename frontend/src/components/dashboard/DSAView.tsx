"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Code2,
  CheckCircle2,
  Circle,
  Search,
  ArrowUpRight,
  Play,
  BookOpen,
  RefreshCw,
  ExternalLink,
  Check,
  X,
  MapPin,
  ListFilter,
  Globe,
  Activity,
} from "lucide-react";
import {
  recordProgressToggle,
  fetchBackendProgress,
  syncLocalProgressWithBackend,
} from "@/lib/progress";
import { useTheme } from "@/context/ThemeContext";

import {
  SupportedLanguage,
  LeetCodeProblem,
  LevelData,
  ROADMAP_LEVELS,
} from "@/data/dsaRoadmap";
import { LEVEL_SUB_METHODS, SubMethodData } from "@/data/dsaSubMethods";
import { SubMethodRoadmapCanvas } from "@/components/dsa/SubMethodRoadmapCanvas";
import { SubMethodModal } from "@/components/dsa/SubMethodModal";
import { DSA2DLab } from "@/components/dsa/DSA2DLab";

export type { SupportedLanguage, LeetCodeProblem, LevelData };
export { ROADMAP_LEVELS };
export const DSAView: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Navigation / View state
  const [viewMode, setViewMode] = useState<"roadmap" | "list">("roadmap");
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [selectedParentLevel, setSelectedParentLevel] = useState<LevelData | null>(null);
  const [selectedSubMethod, setSelectedSubMethod] = useState<SubMethodData | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"video" | "resources" | "problems" | "lab">("video");
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>("python");
  const [searchTerm, setSearchTerm] = useState("");

  // Solved state management
  const [solvedProblemIds, setSolvedProblemIds] = useState<number[]>([1, 217, 1929]);
  const [leetcodeUsername, setLeetcodeUsername] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<{
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number | null;
    syncedAt?: string;
  } | null>(null);

  // Load saved local stats on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dsa_solved_problem_ids");
      if (saved) setSolvedProblemIds(JSON.parse(saved));
      const savedUsername = localStorage.getItem("leetcode_username");
      if (savedUsername) setLeetcodeUsername(savedUsername);
      const savedStats = localStorage.getItem("leetcode_stats");
      if (savedStats) setLeetcodeStats(JSON.parse(savedStats));
    } catch {
      // ignore
    }
  }, []);

  // Initial fetch & sync with backend progress
  useEffect(() => {
    fetchBackendProgress().then((summary) => {
      if (summary && summary.dsa) {
        setSolvedProblemIds((prev) => {
          const backendIds = summary.dsa.map(Number).filter((n) => !isNaN(n));
          const merged = Array.from(new Set([...prev, ...backendIds]));
          if (typeof window !== "undefined") {
            localStorage.setItem("dsa_solved_problem_ids", JSON.stringify(merged));
          }
          return merged;
        });
      }
    });
  }, []);

  // Persist solved problems
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dsa_solved_problem_ids", JSON.stringify(solvedProblemIds));
    }
  }, [solvedProblemIds]);

  // Persist username & stats
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (leetcodeUsername) localStorage.setItem("leetcode_username", leetcodeUsername);
      if (leetcodeStats) localStorage.setItem("leetcode_stats", JSON.stringify(leetcodeStats));
    }
  }, [leetcodeUsername, leetcodeStats]);

  // Toggle problem solved & sync immediately to backend
  const toggleProblemSolved = (problemId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlySolved = solvedProblemIds.includes(problemId);
    const nextSolvedState = !isCurrentlySolved;

    setSolvedProblemIds((prev) =>
      isCurrentlySolved ? prev.filter((id) => id !== problemId) : [...prev, problemId]
    );

    // Find problem metadata for backend persistence
    const prob = ROADMAP_LEVELS.flatMap((l) => l.problems).find((p) => p.id === problemId);
    recordProgressToggle(
      "dsa",
      problemId,
      nextSolvedState,
      prob?.title || `Problem ${problemId}`,
      prob?.difficulty || "Medium"
    );
  };

  // Sync with LeetCode API
  const handleSyncLeetCode = async () => {
    if (!leetcodeUsername.trim()) {
      setSyncStatusMessage("Please enter your LeetCode username first.");
      return;
    }

    setIsSyncing(true);
    setSyncStatusMessage(null);

    try {
      const res = await fetch("/api/leetcode/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeUsername.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSyncStatusMessage(data.error || "Failed to sync LeetCode profile.");
        setIsSyncing(false);
        return;
      }

      setLeetcodeStats({
        totalSolved: data.totalSolved,
        easySolved: data.easySolved,
        mediumSolved: data.mediumSolved,
        hardSolved: data.hardSolved,
        ranking: data.ranking,
        syncedAt: data.syncedAt,
      });

      // Match any recent submissions to our problems list
      const matchedSlugs = (data.recentSubmissions || []).map(
        (s: { titleSlug: string }) => s.titleSlug.toLowerCase()
      );

      const newSolvedIds = new Set(solvedProblemIds);
      ROADMAP_LEVELS.forEach((lvl) => {
        lvl.problems.forEach((prob) => {
          if (matchedSlugs.includes(prob.slug.toLowerCase())) {
            newSolvedIds.add(prob.id);
          }
        });
      });

      const solvedArray = Array.from(newSolvedIds);
      setSolvedProblemIds(solvedArray);
      // Synchronize in batch with backend database
      syncLocalProgressWithBackend(solvedArray, [], []);

      setSyncStatusMessage(
        `Successfully synced ${data.totalSolved} solved problems from LeetCode (${data.username}).`
      );
    } catch {
      setSyncStatusMessage("Network error connecting to LeetCode API.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate Level completion stats
  const levelStats = useMemo(() => {
    return ROADMAP_LEVELS.map((level) => {
      const total = level.problems.length;
      const solved = level.problems.filter((p) => solvedProblemIds.includes(p.id)).length;
      const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;
      const isCompleted = percentage === 100;
      return {
        levelId: level.id,
        total,
        solved,
        percentage,
        isCompleted,
      };
    });
  }, [solvedProblemIds]);

  // Overall metrics
  const totalRoadmapProblems = useMemo(() => {
    return ROADMAP_LEVELS.reduce((acc, lvl) => acc + lvl.problems.length, 0);
  }, []);

  const totalRoadmapSolved = useMemo(() => {
    const allIds = new Set(ROADMAP_LEVELS.flatMap((lvl) => lvl.problems.map((p) => p.id)));
    return solvedProblemIds.filter((id) => allIds.has(id)).length;
  }, [solvedProblemIds]);

  // Determine current active level ("YOU'RE HERE")
  const currentActiveLevelId = useMemo(() => {
    const incompleteLevel = levelStats.find((s) => !s.isCompleted);
    return incompleteLevel ? incompleteLevel.levelId : 1;
  }, [levelStats]);

  // Filter problems for list view
  const allProblemsFlat = useMemo(() => {
    return ROADMAP_LEVELS.flatMap((lvl) =>
      lvl.problems.map((p) => ({
        ...p,
        levelNumber: lvl.levelNumber,
        levelTitle: lvl.title,
      }))
    );
  }, []);

  const filteredFlatProblems = useMemo(() => {
    if (!searchTerm.trim()) return allProblemsFlat;
    const q = searchTerm.toLowerCase();
    return allProblemsFlat.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.levelTitle.toLowerCase().includes(q)
    );
  }, [allProblemsFlat, searchTerm]);

  // Build SVG cubic bezier path string for the 18-level winding road
  const svgRoadPath = useMemo(() => {
    const points = ROADMAP_LEVELS.map((lvl) => ({
      x: (lvl.x / 100) * 800,
      y: lvl.y,
    }));

    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. Header & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              18 Concept Levels
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              {totalRoadmapSolved}/{totalRoadmapProblems} Solved ({Math.round((totalRoadmapSolved / totalRoadmapProblems) * 100)}%)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-zinc-300" />
            <span>DSA Roadmap & Concept Progression</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            18 concept-driven milestones: from Language Foundations and Complexity Analysis to Dynamic Programming.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("roadmap")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "roadmap"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow-xs"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Roadmap Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "list"
                ? "bg-zinc-100 text-zinc-950 font-semibold shadow-xs"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Problem Index ({totalRoadmapProblems})</span>
          </button>
        </div>
      </div>

      {/* 2. LeetCode Live Sync Bar */}
      <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-zinc-300" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>LeetCode Synchronization</span>
                {leetcodeStats && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-950/40 border border-emerald-900/50 text-[10px] font-medium text-emerald-400">
                    <Check className="w-2.5 h-2.5" />
                    <span>Connected</span>
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Sync your public LeetCode handle to track real-time solved problems and auto-unlock roadmap milestones.
              </p>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="LeetCode username (e.g. tourist)"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                className="w-full sm:w-56 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={handleSyncLeetCode}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-zinc-300" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync LeetCode"}</span>
            </button>
          </div>
        </div>

        {/* Live Sync Stats Row */}
        {leetcodeStats && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="text-zinc-500 text-[11px]">Total Solved:</span>
              <span className="font-mono font-bold text-white">{leetcodeStats.totalSolved}</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-emerald-400 text-[11px] font-mono">
              <span className="text-zinc-500">Easy:</span>
              <span className="font-bold">{leetcodeStats.easySolved}</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-mono">
              <span className="text-zinc-500">Medium:</span>
              <span className="font-bold">{leetcodeStats.mediumSolved}</span>
            </div>
            <span className="text-zinc-700">•</span>
            <div className="flex items-center gap-1 text-rose-400 text-[11px] font-mono">
              <span className="text-zinc-500">Hard:</span>
              <span className="font-bold">{leetcodeStats.hardSolved}</span>
            </div>
            {leetcodeStats.ranking && (
              <>
                <span className="text-zinc-700">•</span>
                <div className="flex items-center gap-1 text-zinc-400 text-[11px] font-mono">
                  <span className="text-zinc-500">Rank:</span>
                  <span>#{leetcodeStats.ranking.toLocaleString()}</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* Status Message */}
        {syncStatusMessage && (
          <p className="mt-2 text-[11px] text-zinc-400 font-mono">{syncStatusMessage}</p>
        )}
      </div>

      {/* 3. SUB-METHOD SNAKE ROADMAP VIEW */}
      {viewMode === "roadmap" && selectedParentLevel && (
        <SubMethodRoadmapCanvas
          parentLevel={selectedParentLevel}
          subMethods={LEVEL_SUB_METHODS[selectedParentLevel.id] || []}
          solvedProblemIds={solvedProblemIds}
          onSelectSubMethod={(sm) => setSelectedSubMethod(sm)}
          onBackToOverview={() => setSelectedParentLevel(null)}
          onViewLevelOverview={() => {
            setSelectedLevel(selectedParentLevel);
            setActiveModalTab("video");
          }}
        />
      )}

      {/* 4. MAIN ROADMAP VIEW CANVAS (All 18 Levels with S-curved winding track) */}
      {viewMode === "roadmap" && !selectedParentLevel && (
        <div className="relative rounded-lg bg-[#09090b] border border-zinc-800/90 shadow-2xl p-4 sm:p-8 overflow-hidden select-none">
          {/* Subtle Grid Matrix Background */}
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
          <div className="relative w-full max-w-[800px] mx-auto min-h-[3150px]">
            {/* SVG S-Curve Path connecting all 18 milestones */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 800 3150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Track Rail */}
              <path
                d={svgRoadPath}
                className="roadmap-track-rail"
                stroke={isLight ? "#e2e8f0" : "rgba(255, 255, 255, 0.08)"}
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Inner Dotted Railway Path */}
              <path
                d={svgRoadPath}
                className="roadmap-track-dots"
                stroke={isLight ? "#475569" : "rgba(255, 255, 255, 0.35)"}
                strokeWidth="4"
                strokeDasharray="6 8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Render 18 Level Nodes */}
            {ROADMAP_LEVELS.map((level) => {
              const stats = levelStats.find((s) => s.levelId === level.id);
              const isCurrent = currentActiveLevelId === level.id;
              const isCompleted = stats?.isCompleted || false;
              const percentage = stats?.percentage || 0;

              return (
                <button
                  key={level.id}
                  id={`roadmap-node-level-${level.levelNumber}`}
                  type="button"
                  aria-label={`Level ${level.levelNumber}: ${level.title}`}
                  style={{
                    left: `${level.x}%`,
                    top: `${level.y}px`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 focus:outline-none"
                  onClick={() => {
                    const subs = LEVEL_SUB_METHODS[level.id];
                    if (subs && subs.length > 0) {
                      setSelectedParentLevel(level);
                    } else {
                      setSelectedLevel(level);
                      setActiveModalTab("video");
                    }
                  }}
                >
                  {/* "YOU'RE HERE" Badge above current node */}
                  {isCurrent && (
                    <div className="absolute -top-10 flex flex-col items-center animate-bounce pointer-events-none">
                      <div className="px-2.5 py-0.5 rounded-md bg-cyan-400 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-zinc-950" />
                        <span>YOU&apos;RE HERE</span>
                      </div>
                      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-cyan-400 -mt-0.5" />
                    </div>
                  )}

                  {/* Circular Node with Radial Progress Arc */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    {/* SVG Radial Arc Ring */}
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
                      {/* Partial progress arc (yellow/green) */}
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
                    <div className="absolute inset-2 rounded-full flex flex-col items-center justify-center bg-[#141418] border border-zinc-700/60 shadow-inner">
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                      ) : (
                        <span
                          className={`font-mono font-black text-sm sm:text-base ${
                            isCurrent ? "text-cyan-400" : "text-white"
                          }`}
                        >
                          {level.levelNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Concept Label & Tag below Node */}
                  <div className="mt-2 flex flex-col items-center max-w-[170px] text-center">
                    <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                      {level.shortTitle}
                    </span>
                    <span
                      className={`mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono tracking-wider uppercase ${
                        level.tag === "CORE"
                          ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                          : level.tag === "HARD"
                          ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                          : level.tag === "MEDIUM"
                          ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                          : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                      }`}
                    >
                      {level.tag}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. LIST / TABLE VIEW (Search & Filter all 18 levels) */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search concepts (e.g. Arrays, Trees, Dynamic Programming)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          <div className="p-4 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl overflow-hidden">
            <div className="space-y-2">
              {filteredFlatProblems.map((prob) => {
                const isSolved = solvedProblemIds.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    className="flex items-center justify-between p-3.5 rounded-md bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => toggleProblemSolved(prob.id, e)}
                        className="text-zinc-500 hover:text-white transition-colors"
                        title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                      >
                        {isSolved ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-md bg-zinc-800 text-zinc-400">
                            L{prob.levelNumber} • {prob.levelTitle}
                          </span>
                          <h4
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isSolved ? "text-zinc-400 line-through" : "text-zinc-200 group-hover:text-white"
                            }`}
                          >
                            {prob.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {prob.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] font-mono text-zinc-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          prob.difficulty === "Hard"
                            ? "bg-rose-950/25 text-rose-300 border border-rose-900/40"
                            : prob.difficulty === "Medium"
                            ? "bg-amber-950/25 text-amber-300 border border-amber-900/40"
                            : "bg-emerald-950/25 text-emerald-300 border border-emerald-900/40"
                        }`}
                      >
                        {prob.difficulty}
                      </span>

                      <a
                        href={prob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE LEVEL STUDY & PRACTICE MODAL */}
      {selectedLevel && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-300">
                    LEVEL {selectedLevel.levelNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      selectedLevel.tag === "CORE"
                        ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                        : selectedLevel.tag === "HARD"
                        ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                        : selectedLevel.tag === "MEDIUM"
                        ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                        : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                    }`}
                  >
                    {selectedLevel.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  {selectedLevel.title}
                </h3>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  {selectedLevel.description}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedLevel(null)}
                className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="Close level drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex items-center gap-1 px-4 sm:px-5 pt-3 border-b border-zinc-800 bg-[#0e0e12]">
              <button
                type="button"
                onClick={() => setActiveModalTab("video")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                  activeModalTab === "video"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Concept Video</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("resources")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                  activeModalTab === "resources"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study Resources</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("problems")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                  activeModalTab === "problems"
                    ? "border-white text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>
                  Practice Problems ({selectedLevel.problems.filter((p) => solvedProblemIds.includes(p.id)).length}/
                  {selectedLevel.problems.length})
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab("lab")}
                className={`inline-flex items-center gap-1.5 px-3 py-2 border-b-2 text-xs font-semibold transition-colors ${
                  activeModalTab === "lab"
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Lab (2D)</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
              {/* TAB 1: CONCEPT VIDEO */}
              {activeModalTab === "video" && (
                <div className="space-y-4">
                  {/* YouTube Embed Player */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-zinc-800 shadow-xl">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${selectedLevel.youtubeVideoId}?rel=0&modestbranding=1`}
                      title={selectedLevel.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  {/* Video Meta Info */}
                  <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <h4 className="font-bold text-white text-sm">{selectedLevel.videoTitle}</h4>
                      <p className="text-zinc-400 text-[11px]">
                        Instructor: {selectedLevel.videoChannel} • Duration: {selectedLevel.videoDuration}
                      </p>
                    </div>

                    <a
                      href={`https://www.youtube.com/watch?v=${selectedLevel.youtubeVideoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white underline shrink-0 font-medium"
                    >
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Key Video Takeaways */}
                  <div className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800 space-y-2">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Key Concept Takeaways
                    </h5>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedLevel.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: STUDY RESOURCES & MULTI-LANGUAGE TOOLS */}
              {activeModalTab === "resources" && (
                <div className="space-y-5">
                  {/* If Level 1: Language Selector (Python, C++, C, Java) */}
                  {selectedLevel.supportedLanguages && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                          Choose Programming Language
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Interview standard implementations
                        </span>
                      </div>

                      {/* Language Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(["python", "cpp", "c", "java"] as SupportedLanguage[]).map((langKey) => (
                          <button
                            key={langKey}
                            type="button"
                            onClick={() => setSelectedLang(langKey)}
                            className={`px-3 py-2 rounded-md text-xs font-semibold transition-all border ${
                              selectedLang === langKey
                                ? "bg-zinc-100 text-zinc-950 border-zinc-100 shadow-xs"
                                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                            }`}
                          >
                            {selectedLevel.supportedLanguages![langKey].name}
                          </button>
                        ))}
                      </div>

                      {/* Selected Language Details */}
                      {selectedLevel.supportedLanguages[selectedLang] && (
                        <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
                          {/* Code Preview */}
                          <div>
                            <span className="text-[11px] font-mono text-zinc-400 block mb-1">
                              Standard Template & Data Structures ({selectedLevel.supportedLanguages[selectedLang].name})
                            </span>
                            <pre className="p-3.5 rounded-md bg-[#09090b] border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                              <code>{selectedLevel.supportedLanguages[selectedLang].codeSnippet}</code>
                            </pre>
                          </div>

                          {/* Memory Model Explanation */}
                          <div className="text-xs space-y-1">
                            <span className="font-bold text-white font-mono text-[11px] uppercase">
                              Memory Model & Garbage Collection:
                            </span>
                            <p className="text-zinc-300 leading-relaxed">
                              {selectedLevel.supportedLanguages[selectedLang].memoryModel}
                            </p>
                          </div>

                          {/* Cheat Sheet Bullet Points */}
                          <div className="text-xs space-y-1">
                            <span className="font-bold text-white font-mono text-[11px] uppercase">
                              STL / Standard Library Complexity Cheat Sheet:
                            </span>
                            <ul className="space-y-1 mt-1 text-zinc-400 font-mono text-[11px]">
                              {selectedLevel.supportedLanguages[selectedLang].cheatSheet.map((item, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="text-zinc-600">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Level Study Resource Card */}
                  <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono text-zinc-300">
                          {selectedLevel.studyResources.type}
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          {selectedLevel.studyResources.title}
                        </h4>
                      </div>

                      {selectedLevel.studyResources.linkUrl && (
                        <a
                          href={selectedLevel.studyResources.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white underline font-medium"
                        >
                          <span>Open Visualizer</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-zinc-400">
                      {selectedLevel.studyResources.description}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-800 text-xs">
                      {selectedLevel.studyResources.notes.map((note, i) => (
                        <div key={i} className="flex items-start gap-2 text-zinc-300">
                          <Check className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                          <span>{note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRACTICE PROBLEMS (LeetCode redirect + solved sync) */}
              {activeModalTab === "problems" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400 pb-1">
                    <span>Click the checkmark to mark as solved, or click &quot;View Problem&quot; to redirect to LeetCode.</span>
                  </div>

                  <div className="space-y-2">
                    {selectedLevel.problems.map((prob) => {
                      const isSolved = solvedProblemIds.includes(prob.id);
                      return (
                        <div
                          key={prob.id}
                          className="flex items-center justify-between p-3.5 rounded-md bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-all"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Solved Checkbox */}
                            <button
                              type="button"
                              onClick={(e) => toggleProblemSolved(prob.id, e)}
                              className="text-zinc-500 hover:text-white transition-colors"
                              title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                            >
                              {isSolved ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <h4
                                className={`text-xs sm:text-sm font-semibold truncate ${
                                  isSolved ? "text-zinc-400 line-through" : "text-zinc-200"
                                }`}
                              >
                                {prob.id}. {prob.title}
                              </h4>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {prob.tags.map((tag) => (
                                  <span key={tag} className="text-[10px] font-mono text-zinc-500">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                prob.difficulty === "Hard"
                                  ? "bg-rose-950/30 text-rose-300 border border-rose-900/40"
                                  : prob.difficulty === "Medium"
                                  ? "bg-amber-950/30 text-amber-300 border border-amber-900/40"
                                  : "bg-emerald-950/30 text-emerald-300 border border-emerald-900/40"
                              }`}
                            >
                              {prob.difficulty}
                            </span>

                            {/* View / Redirect Button */}
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors shadow-xs"
                            >
                              <span>View Problem</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* TAB 4: 2D INTERACTIVE LAB */}
              {activeModalTab === "lab" && (
                <DSA2DLab level={selectedLevel} />
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-zinc-800 bg-[#0e0e12] flex items-center justify-between text-xs text-zinc-400">
              <span className="font-mono">
                Level Progress: {selectedLevel.problems.filter((p) => solvedProblemIds.includes(p.id)).length}/
                {selectedLevel.problems.length} Solved
              </span>
              <button
                type="button"
                onClick={() => setSelectedLevel(null)}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUB-METHOD DETAIL & 2D INTERACTIVE LAB MODAL */}
      {selectedSubMethod && (
        <SubMethodModal
          subMethod={selectedSubMethod}
          onClose={() => setSelectedSubMethod(null)}
          solvedProblemIds={solvedProblemIds}
          onToggleProblemSolved={toggleProblemSolved}
        />
      )}
    </div>
  );
};
