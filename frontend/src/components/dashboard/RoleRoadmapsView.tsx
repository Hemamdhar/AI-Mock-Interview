"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Search,
  ExternalLink,
  CheckCircle2,
  Circle,
  MapPin,
  Check,
  X,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import { ROLE_ROADMAPS, RoleRoadmap, RoadmapMilestone } from "@/data/roleRoadmapsData";

interface RoleRoadmapsViewProps {
  initialRoleId?: string;
  onBackToDashboard?: () => void;
}

export const RoleRoadmapsView: React.FC<RoleRoadmapsViewProps> = ({
  initialRoleId,
  onBackToDashboard,
}) => {
  // Navigation State
  const [selectedRole, setSelectedRole] = useState<RoleRoadmap | null>(() => {
    if (initialRoleId) {
      const match = ROLE_ROADMAPS.find((r) => r.id === initialRoleId);
      if (match) return match;
    }
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("role");
      if (param) {
        const match = ROLE_ROADMAPS.find((r) => r.id === param);
        if (match) return match;
      }
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Roles");
  const [activeMilestoneModal, setActiveMilestoneModal] = useState<RoadmapMilestone | null>(null);

  // Progress tracking in localStorage: { [milestoneId: string]: boolean }
  const [completedMilestoneIds, setCompletedMilestoneIds] = useState<string[]>([]);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("role_roadmap_completed_ids");
      if (saved) {
        setCompletedMilestoneIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save progress
  const toggleMilestoneCompleted = (id: string) => {
    setCompletedMilestoneIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((mId) => mId !== id) : [...prev, id];
      try {
        localStorage.setItem("role_roadmap_completed_ids", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Filtered roles for catalog view
  const filteredRoles = useMemo(() => {
    return ROLE_ROADMAPS.filter((role) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Roles" ||
        role.domainBadge.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        role.domain.toLowerCase().includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Cubic Bezier SVG path generator for the selected role's milestones
  const svgRoadPath = useMemo(() => {
    if (!selectedRole || selectedRole.milestones.length < 2) return "";
    const points = selectedRole.milestones.map((m) => ({
      x: (m.x / 100) * 800,
      y: m.y,
    }));

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const midY = (p1.y + p2.y) / 2;
      d += ` C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [selectedRole]);

  // Current milestone where candidate is currently standing
  const currentActiveMilestone = useMemo(() => {
    if (!selectedRole) return null;
    const firstIncomplete = selectedRole.milestones.find(
      (m) => !completedMilestoneIds.includes(m.id)
    );
    return firstIncomplete || selectedRole.milestones[0];
  }, [selectedRole, completedMilestoneIds]);

  // Overall completion for selected role
  const roleCompletedCount = useMemo(() => {
    if (!selectedRole) return 0;
    return selectedRole.milestones.filter((m) => completedMilestoneIds.includes(m.id)).length;
  }, [selectedRole, completedMilestoneIds]);

  const roleProgressPercent = useMemo(() => {
    if (!selectedRole || selectedRole.milestones.length === 0) return 0;
    return Math.round((roleCompletedCount / selectedRole.milestones.length) * 100);
  }, [selectedRole, roleCompletedCount]);

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          PHASE 1: ROLE CATALOG SELECTION (When no role is selected)
      ────────────────────────────────────────────────────────────── */}
      {!selectedRole && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700/60 text-[11px] font-mono text-zinc-300">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>ENGINEERING CAREER ROADMAPS</span>
              </div>
              {onBackToDashboard && (
                <button
                  type="button"
                  onClick={onBackToDashboard}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Role-Based Career Roadmaps
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl">
                Master production software engineering roles milestone-by-milestone. Follow the interactive winding path and launch direct W3Schools learning tutorials for every core technology.
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search by role title, skill, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                {filteredRoles.length} Roles Available
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                <option value="All Roles">Category: All Roles</option>
                <option value="WEB ARCHITECTURE">Web Architecture</option>
                <option value="SYSTEMS & BACKEND">Systems &amp; Backend</option>
                <option value="FULL STACK">Full Stack</option>
                <option value="ARTIFICIAL INTELLIGENCE">Artificial Intelligence</option>
                <option value="CLOUD & DEVOPS">Cloud &amp; DevOps</option>
                <option value="MOBILE ENGINEERING">Mobile Engineering</option>
              </select>
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRoles.map((role) => {
              const completedInRole = role.milestones.filter((m) =>
                completedMilestoneIds.includes(m.id)
              ).length;
              const pct = Math.round((completedInRole / role.milestones.length) * 100);

              return (
                <div
                  key={role.id}
                  className="p-5 rounded-lg bg-[#111115] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group shadow-xl"
                >
                  <div className="space-y-3">
                    {/* Badge & Milestone Count */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-zinc-400">
                        {role.domainBadge}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 border border-zinc-700/60 text-[10px] text-zinc-300">
                        {role.totalMilestones} Milestones
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Calibrated Against */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                        CALIBRATED AGAINST:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {role.calibratedAgainst.map((comp) => (
                          <span
                            key={comp}
                            className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Tech Badges & Action */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      {role.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800/60 shrink-0"
                        >
                          {tech}
                        </span>
                      ))}
                      {role.techStack.length > 3 && (
                        <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                          +{role.techStack.length - 3}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Explore Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PHASE 2: WINDING PATH ROADMAP (When a role is selected)
      ────────────────────────────────────────────────────────────── */}
      {selectedRole && (
        <div className="space-y-6">
          {/* Top Bar with Back Button & Role Summary */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Roles</span>
              </button>

              {/* Role Switcher Pill Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 hidden sm:inline">Role:</span>
                <select
                  value={selectedRole.id}
                  onChange={(e) => {
                    const match = ROLE_ROADMAPS.find((r) => r.id === e.target.value);
                    if (match) setSelectedRole(match);
                  }}
                  className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-medium text-white focus:outline-none focus:border-zinc-700 cursor-pointer"
                >
                  {ROLE_ROADMAPS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role Header Info */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 font-semibold uppercase">
                    {selectedRole.domainBadge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    {selectedRole.totalMilestones} Milestones
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {selectedRole.title} Roadmap
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl">
                  {selectedRole.description}
                </p>
              </div>

              {/* Progress Box */}
              <div className="p-3.5 rounded-md bg-zinc-900/80 border border-zinc-800 space-y-2 min-w-[240px]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Roadmap Progress</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {roleCompletedCount} / {selectedRole.milestones.length} ({roleProgressPercent}%)
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-300"
                    style={{ width: `${roleProgressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-zinc-500">
                  Click any node to study via official W3Schools guides.
                </p>
              </div>
            </div>
          </div>

          {/* Winding Road Interactive Canvas */}
          <div className="p-6 sm:p-10 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl overflow-hidden relative">
            {/* Ambient Background Grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Canvas Wrapper */}
            <div
              className="relative w-full max-w-[800px] mx-auto"
              style={{ minHeight: `${selectedRole.milestones.length * 160 + 120}px` }}
            >
              {/* SVG S-Curve Track connecting all nodes */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 800 ${selectedRole.milestones.length * 160 + 120}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer Track Rail */}
                <path
                  d={svgRoadPath}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Inner Dotted Railway Path */}
                <path
                  d={svgRoadPath}
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="4"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Render Milestone Nodes */}
              {selectedRole.milestones.map((milestone) => {
                const isCompleted = completedMilestoneIds.includes(milestone.id);
                const isCurrent = currentActiveMilestone?.id === milestone.id;

                return (
                  <button
                    key={milestone.id}
                    type="button"
                    onClick={() => setActiveMilestoneModal(milestone)}
                    style={{
                      left: `${milestone.x}%`,
                      top: `${milestone.y}px`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer z-10 focus:outline-none"
                  >
                    {/* "YOU'RE HERE" Bouncing Badge above active node */}
                    {isCurrent && (
                      <div className="absolute -top-10 flex flex-col items-center animate-bounce pointer-events-none">
                        <div className="px-2.5 py-0.5 rounded-md bg-cyan-400 text-zinc-950 text-[10px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-zinc-950" />
                          <span>YOU&apos;RE HERE</span>
                        </div>
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-cyan-400 -mt-0.5" />
                      </div>
                    )}

                    {/* Circular Node with Radial Border Ring */}
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                      {/* SVG Radial Arc Ring */}
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
                        {/* Background track circle */}
                        <circle
                          cx="36"
                          cy="36"
                          r="30"
                          stroke="#1f1f23"
                          strokeWidth="5"
                          fill="#121216"
                        />
                        {/* Completed Arc Ring */}
                        {isCompleted && (
                          <circle
                            cx="36"
                            cy="36"
                            r="30"
                            stroke="#10b981"
                            strokeWidth="5"
                            strokeDasharray={188.5}
                            strokeDashoffset={0}
                            strokeLinecap="round"
                            fill="transparent"
                          />
                        )}
                        {/* Active (In-Progress) Arc Ring */}
                        {!isCompleted && isCurrent && (
                          <circle
                            cx="36"
                            cy="36"
                            r="30"
                            stroke="#eab308"
                            strokeWidth="5"
                            strokeDasharray={188.5}
                            strokeDashoffset={94}
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
                            {milestone.stepNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Milestone Label & Tag below Node */}
                    <div className="mt-2 flex flex-col items-center max-w-[170px] text-center">
                      <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                        {milestone.shortTitle}
                      </span>
                      <span
                        className={`mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-bold font-mono tracking-wider uppercase ${
                          milestone.tag === "CORE"
                            ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                            : milestone.tag === "FRAMEWORK"
                            ? "bg-purple-950/40 text-purple-300 border border-purple-900/40"
                            : milestone.tag === "DATABASE"
                            ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                            : milestone.tag === "SECURITY"
                            ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                            : milestone.tag === "DEVOPS"
                            ? "bg-cyan-950/40 text-cyan-300 border border-cyan-900/40"
                            : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                        }`}
                      >
                        {milestone.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          PHASE 3: INTERACTIVE MILESTONE STUDY & W3SCHOOLS MODAL
      ────────────────────────────────────────────────────────────── */}
      {activeMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden my-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-300">
                    Step {activeMilestoneModal.stepNumber} of {selectedRole?.totalMilestones}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-900/40 text-emerald-400 text-[10px] font-mono font-semibold uppercase">
                    {activeMilestoneModal.tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {activeMilestoneModal.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveMilestoneModal(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                  OVERVIEW &amp; SCOPE
                </span>
                <p className="text-zinc-300 mt-1 leading-relaxed text-xs sm:text-sm">
                  {activeMilestoneModal.description}
                </p>
              </div>

              {/* Key Topics List */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                  KEY SYLLABUS TOPICS
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {activeMilestoneModal.keyTopics.map((topic, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 rounded-md bg-zinc-900/60 border border-zinc-800/80 text-zinc-300"
                    >
                      <span className="text-emerald-400 font-mono font-bold">0{idx + 1}.</span>
                      <span className="text-zinc-200">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive W3Schools Callout Card */}
              <div className="p-4 rounded-md bg-zinc-900 border border-zinc-800 space-y-2 mt-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-zinc-200">
                    Official W3Schools Learning Resource
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  Dive into hands-on code examples, interactive online editors, and syntax references directly on W3Schools.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-5 border-t border-zinc-800 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleMilestoneCompleted(activeMilestoneModal.id)}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  completedMilestoneIds.includes(activeMilestoneModal.id)
                    ? "bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-950/60"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {completedMilestoneIds.includes(activeMilestoneModal.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-zinc-400" />
                    <span>Mark as Completed</span>
                  </>
                )}
              </button>

              <a
                href={activeMilestoneModal.w3Url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <span>Open {activeMilestoneModal.shortTitle} on W3Schools</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
