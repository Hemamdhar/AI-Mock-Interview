"use client";

import React, { useState } from "react";
import {
  Database,
  Laptop,
  Server,
  Cpu,
  Layers,
  ShieldCheck,
  ArrowRight,
  ArrowLeftRight,
  Play,
  RotateCcw,
  Check,
  Copy,
  Terminal,
  ChevronRight,
  Info,
  Sliders,
  Eye,
  Activity,
  HardDrive,
  Network,
  Radio,
  FileCode,
  Sparkles,
  Lock,
  Unlock,
  AlertCircle,
  Clock,
  Zap,
  HelpCircle,
  Lightbulb,
} from "lucide-react";
import { TopicItem } from "@/components/dashboard/CoreCSView";

// =========================================================================
// CUSTOM VECTOR GRAPHICS (Matching the user's uploaded illustration exactly)
// =========================================================================

/**
 * 3-Tier Database Cylinder Graphic matching the user's green cylinder illustration
 */
function DatabaseServerGraphic({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Database Server Illustration"
    >
      {/* Tier 1 (Bottom Cylinder) */}
      <path
        d="M20 62 C20 72, 80 72, 80 62 V74 C80 84, 20 84, 20 74 Z"
        fill="#15803d"
      />
      <ellipse cx="50" cy="62" rx="30" ry="9" fill="#16a34a" />
      {/* White indicator dot */}
      <circle cx="32" cy="71" r="2.5" fill="#ffffff" />

      {/* Tier 2 (Middle Cylinder) */}
      <path
        d="M20 42 C20 52, 80 52, 80 42 V54 C80 64, 20 64, 20 54 Z"
        fill="#15803d"
      />
      <ellipse cx="50" cy="42" rx="30" ry="9" fill="#16a34a" />
      {/* White indicator dot */}
      <circle cx="32" cy="51" r="2.5" fill="#ffffff" />

      {/* Tier 3 (Top Cylinder) */}
      <path
        d="M20 22 C20 32, 80 32, 80 22 V34 C80 44, 20 44, 20 34 Z"
        fill="#15803d"
      />
      <ellipse cx="50" cy="22" rx="30" ry="9" fill="#22c55e" />
      {/* White indicator dot */}
      <circle cx="32" cy="31" r="2.5" fill="#ffffff" />
    </svg>
  );
}

/**
 * Open Green Laptop Graphic matching the user's laptop illustration
 */
function UserLaptopGraphic({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="User Laptop Illustration"
    >
      {/* Laptop Screen Outer Bezel */}
      <rect x="22" y="16" width="56" height="42" rx="4" fill="#15803d" />
      {/* Laptop Screen Display Area */}
      <rect x="26" y="20" width="48" height="34" rx="2" fill="#0f5127" />
      {/* Code / Window lines inside screen */}
      <line x1="30" y1="26" x2="48" y2="26" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="32" x2="62" y2="32" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="38" x2="54" y2="38" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="44" x2="42" y2="44" stroke="#86efac" strokeWidth="1.5" strokeLinecap="round" />

      {/* Laptop Hinge */}
      <rect x="20" y="58" width="60" height="3" rx="1" fill="#166534" />

      {/* Laptop Keyboard Base (Trapezoid) */}
      <polygon points="12,74 88,74 80,59 20,59" fill="#15803d" />
      {/* Trackpad */}
      <rect x="42" y="65" width="16" height="6" rx="1" fill="#0f5127" />
    </svg>
  );
}

/**
 * Application Server Rack Unit Graphic (for 3-Tier)
 */
function AppServerGraphic({ className = "w-28 h-28" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Application Server Illustration"
    >
      {/* Rack Chassis */}
      <rect x="18" y="18" width="64" height="64" rx="5" fill="#15803d" />
      {/* Blade 1 */}
      <rect x="23" y="24" width="54" height="15" rx="2.5" fill="#0f5127" />
      <circle cx="30" cy="31.5" r="2" fill="#4ade80" />
      <circle cx="36" cy="31.5" r="2" fill="#ffffff" />
      <line x1="45" y1="31.5" x2="70" y2="31.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />

      {/* Blade 2 */}
      <rect x="23" y="43" width="54" height="15" rx="2.5" fill="#0f5127" />
      <circle cx="30" cy="50.5" r="2" fill="#4ade80" />
      <circle cx="36" cy="50.5" r="2" fill="#ffffff" />
      <line x1="45" y1="50.5" x2="70" y2="50.5" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />

      {/* Blade 3 */}
      <rect x="23" y="62" width="54" height="14" rx="2.5" fill="#0f5127" />
      <circle cx="30" cy="69" r="2" fill="#4ade80" />
      <circle cx="36" cy="69" r="2" fill="#ffffff" />
      <line x1="45" y1="69" x2="70" y2="69" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================

interface CoreCSVisualizerProps {
  topic: TopicItem;
  subjectSlug: string;
}

export function CoreCSVisualizer({ topic, subjectSlug }: CoreCSVisualizerProps) {
  // Tabs: Visual Diagram vs ASCII Spec
  const [viewTab, setViewTab] = useState<"visualizer" | "ascii">("visualizer");
  const [copiedAscii, setCopiedAscii] = useState(false);

  // Difficulty / Audience Mode: "beginner" (simple analogies) vs "pro" (technical deep dive)
  const [learningMode, setLearningMode] = useState<"beginner" | "pro">("beginner");

  // Tiered architecture switcher (Single-Tier matching uploaded photo, 2-Tier, 3-Tier)
  const [architectureTier, setArchitectureTier] = useState<"1-tier" | "2-tier" | "3-tier">("1-tier");

  // Query simulation animation state
  const [simQueryState, setSimQueryState] = useState<"idle" | "user-to-db" | "db-processing" | "db-to-user" | "completed">("idle");
  const [simQueryType, setSimQueryType] = useState<string>("profile");

  // ANSI/SPARC 3-Schema state
  const [schemaIndependenceDemo, setSchemaIndependenceDemo] = useState<"none" | "logical" | "physical">("none");

  // B+ Tree Search state
  const [bTreeSearchKey, setBTreeSearchKey] = useState<number>(35);
  const [bTreeActivePath, setBTreeActivePath] = useState<string[]>([]);
  const [bTreeSearchResult, setBTreeSearchResult] = useState<string | null>(null);

  // OS 5-State Process state
  const [processState, setProcessState] = useState<"NEW" | "READY" | "RUNNING" | "WAITING" | "TERMINATED">("READY");
  const [processHistory, setProcessHistory] = useState<string[]>([
    "Process created (PID 1042)",
    "Admitted to READY queue",
  ]);

  // OS Virtual Memory Paging state
  const [selectedVpn, setSelectedVpn] = useState<number>(3);

  // TCP 3-Way Handshake state
  const [tcpStep, setTcpStep] = useState<number>(0);

  const handleCopyAscii = () => {
    if (topic.diagram) {
      navigator.clipboard.writeText(topic.diagram);
      setCopiedAscii(true);
      setTimeout(() => setCopiedAscii(false), 2000);
    }
  };

  const topicId = topic.id.toLowerCase();
  const titleLower = topic.title.toLowerCase();

  const isDbmsArchitecture =
    topicId === "dbms-1-1" ||
    topicId === "dbms-1-2" ||
    titleLower.includes("architecture") ||
    titleLower.includes("tier");

  const isThreeSchema =
    topicId === "dbms-1-4" ||
    titleLower.includes("three-schema") ||
    titleLower.includes("data independence");

  const isBTree =
    topicId.includes("b-tree") ||
    topicId.includes("index") ||
    titleLower.includes("b+ tree") ||
    titleLower.includes("indexing");

  const isOsProcess =
    topicId === "os-processes" ||
    topicId === "os-intro" ||
    topicId === "os-sched-fundamentals" ||
    titleLower.includes("process lifecycle") ||
    titleLower.includes("process state");

  const isOsPaging =
    topicId === "os-mem-paging" ||
    topicId === "os-mem-page-tables" ||
    topicId === "os-mem-virtual" ||
    topicId === "os-mem-tlb" ||
    titleLower.includes("paging") ||
    titleLower.includes("virtual memory");

  const isTcpHandshake =
    topicId.includes("tcp") ||
    titleLower.includes("tcp") ||
    titleLower.includes("handshake");

  // Interactive Query Animation Runner
  const runQuerySimulation = (type: string = simQueryType) => {
    setSimQueryType(type);
    setSimQueryState("user-to-db");

    setTimeout(() => {
      setSimQueryState("db-processing");
      setTimeout(() => {
        setSimQueryState("db-to-user");
        setTimeout(() => {
          setSimQueryState("completed");
        }, 700);
      }, 700);
    }, 700);
  };

  const resetQuerySimulation = () => {
    setSimQueryState("idle");
  };

  // Handler for B+ Tree Search
  const runBTreeSearch = (key: number) => {
    setBTreeSearchKey(key);
    const path: string[] = ["root"];

    if (key < 25) {
      path.push("internal-left");
      if (key <= 10) path.push("leaf-1");
      else path.push("leaf-2");
    } else if (key <= 60) {
      path.push("internal-mid");
      if (key <= 40) path.push("leaf-3");
      else path.push("leaf-4");
    } else {
      path.push("internal-right");
      if (key <= 80) path.push("leaf-5");
      else path.push("leaf-6");
    }

    setBTreeActivePath(path);
    setBTreeSearchResult(
      `Found key ${key} in ${path[path.length - 1].toUpperCase()}. Took only 3 steps instead of checking all 100 items!`
    );
  };

  const transitionProcess = (
    next: "NEW" | "READY" | "RUNNING" | "WAITING" | "TERMINATED",
    eventDesc: string
  ) => {
    setProcessState(next);
    setProcessHistory((prev) => [eventDesc, ...prev.slice(0, 3)]);
  };

  return (
    <section className="space-y-3 pt-2">
      {/* Top Bar with Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono bg-[#111115] px-3.5 py-2.5 rounded-t-md border border-b-0 border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700/60" />
          </div>
          <span className="font-semibold text-zinc-200">
            Interactive Architecture & Visualizer
          </span>
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/70 text-emerald-400 border border-emerald-800/40">
            Beginner Friendly
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Beginner vs Deep-Dive Toggle */}
          <div className="flex items-center bg-[#09090b] rounded-md p-0.5 border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setLearningMode("beginner")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                learningMode === "beginner"
                  ? "bg-emerald-950 text-emerald-300 font-medium border border-emerald-800/60"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Lightbulb className="w-3 h-3 text-emerald-400" />
              <span>Beginner Friendly</span>
            </button>
            <button
              type="button"
              onClick={() => setLearningMode("pro")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                learningMode === "pro"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Deep Dive</span>
            </button>
          </div>

          {/* Visual vs ASCII Toggle */}
          <div className="flex items-center bg-[#09090b] rounded-md p-0.5 border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setViewTab("visualizer")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewTab === "visualizer"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>Visual</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("ascii")}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewTab === "ascii"
                  ? "bg-zinc-800 text-white font-medium"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>ASCII</span>
            </button>
          </div>

          {topic.diagram && (
            <button
              type="button"
              onClick={handleCopyAscii}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer px-2 py-1 rounded hover:bg-zinc-800"
              title="Copy Diagram Text"
            >
              {copiedAscii ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-sans">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="font-sans">Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 rounded-b-md bg-[#0a0a0d] border border-zinc-800 text-xs">
        {viewTab === "ascii" ? (
          <pre className="p-4 rounded-md bg-[#070709] border border-zinc-800 font-mono text-zinc-300 overflow-x-auto leading-relaxed">
            {topic.diagram || "No ASCII schematic available for this module."}
          </pre>
        ) : (
          <div className="space-y-6">
            {/* ------------------------------------------------------------- */}
            {/* 1. TIERED DBMS ARCHITECTURE (Matches User's Uploaded Photo!)    */}
            {/* ------------------------------------------------------------- */}
            {isDbmsArchitecture && (
              <div className="space-y-6">
                {/* Architecture Tier Selector Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800/80">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                      <span>Database System Architecture</span>
                      <span className="text-[11px] font-normal text-emerald-400 font-mono">
                        [{architectureTier.toUpperCase()}]
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {learningMode === "beginner"
                        ? "See how your laptop communicates with the database in 1-tier, 2-tier, and 3-tier setups."
                        : "Analyze network topology, protocol overhead, and security isolation across client-server tiers."}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-[#111115] p-1 rounded-md border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => {
                        setArchitectureTier("1-tier");
                        resetQuerySimulation();
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                        architectureTier === "1-tier"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/70 shadow-xs"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Single-Tier
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setArchitectureTier("2-tier");
                        resetQuerySimulation();
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                        architectureTier === "2-tier"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/70 shadow-xs"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      2-Tier (Client-Server)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setArchitectureTier("3-tier");
                        resetQuerySimulation();
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all ${
                        architectureTier === "3-tier"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/70 shadow-xs"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      3-Tier (Enterprise Web)
                    </button>
                  </div>
                </div>

                {/* THE ILLUSTRATED ARCHITECTURAL SCHEMATIC (Direct Match to User Image!) */}
                <div className="py-8 px-4 sm:px-10 bg-[#0d1410] rounded-xl border border-emerald-900/40 relative overflow-hidden">
                  {/* Subtle clean grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                  {/* Main Title Matching Uploaded Diagram */}
                  <div className="text-center mb-8 relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-100 font-sans tracking-wide">
                      {architectureTier === "1-tier" && "Single-Tier Architecture"}
                      {architectureTier === "2-tier" && "Two-Tier Architecture"}
                      {architectureTier === "3-tier" && "Three-Tier Architecture"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
                      {architectureTier === "1-tier" &&
                        "The Database Server and User Client live on the exact same computer. No internet or network needed!"}
                      {architectureTier === "2-tier" &&
                        "The User Client sends requests directly over the network to a central Database Server."}
                      {architectureTier === "3-tier" &&
                        "A middle Application Server protects the Database and handles business rules, just like modern websites."}
                    </p>
                  </div>

                  {/* Component Boxes & Connecting Arrows */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 relative z-10">
                    {/* LEFT BOX: DATABASE SERVER (Dashed Green Card matching user image) */}
                    <div className="w-56 sm:w-64 border-2 border-dashed border-emerald-500/70 bg-[#0c1f15] rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all hover:border-emerald-400">
                      {/* 3-Tier Cylinder Illustration */}
                      <div className="relative mb-2">
                        <DatabaseServerGraphic className="w-24 h-24 sm:w-28 sm:h-28" />
                        {simQueryState === "db-processing" && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500 text-black font-bold animate-bounce shadow">
                            QUERYING...
                          </span>
                        )}
                      </div>

                      <span className="text-base font-bold text-zinc-100 font-sans tracking-tight">
                        Database Server
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono mt-1">
                        {architectureTier === "1-tier" ? "Embedded SQLite / MS Access" : "PostgreSQL / MySQL Server"}
                      </span>
                      <div className="mt-3 text-[10px] text-zinc-400 border-t border-emerald-900/60 pt-2 w-full space-y-0.5">
                        <div>Storage: Hard Drive / SSD</div>
                        <div>Role: Stores & organizes data</div>
                      </div>
                    </div>

                    {/* CONNECTOR 1: BI-DIRECTIONAL ARROW */}
                    <div className="flex flex-col items-center justify-center py-2 px-1 relative">
                      {/* Animated Query Packet */}
                      {simQueryState === "user-to-db" && (
                        <div className="mb-2 px-2 py-1 rounded bg-amber-500 text-black font-mono text-[10px] font-bold shadow animate-pulse">
                          Query: Get Profile →
                        </div>
                      )}
                      {simQueryState === "db-to-user" && (
                        <div className="mb-2 px-2 py-1 rounded bg-emerald-400 text-black font-mono text-[10px] font-bold shadow animate-pulse">
                          ← Response: [Alice, 98%]
                        </div>
                      )}

                      {/* Crisp Bi-directional Arrow Line */}
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 sm:w-36 h-1 bg-zinc-600 rounded-full relative overflow-hidden">
                          {(simQueryState === "user-to-db" || simQueryState === "db-to-user") && (
                            <div className="absolute inset-0 bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        {/* Left and Right arrow heads */}
                        <div className="absolute -left-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-6 border-r-zinc-600" />
                        <div className="absolute -right-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-zinc-600" />
                      </div>

                      <span className="text-[10px] font-mono text-zinc-300 mt-2 px-2.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-800">
                        {architectureTier === "1-tier" && "Direct Memory Call (0 ms)"}
                        {architectureTier === "2-tier" && "Network Cable / Wi-Fi"}
                        {architectureTier === "3-tier" && "Secure Internal SQL Link"}
                      </span>
                    </div>

                    {/* MIDDLE BOX: APPLICATION SERVER (Only in 3-Tier) */}
                    {architectureTier === "3-tier" && (
                      <>
                        <div className="w-56 sm:w-64 border-2 border-dashed border-emerald-500/70 bg-[#0c1f15] rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all hover:border-emerald-400">
                          <AppServerGraphic className="w-24 h-24 sm:w-28 sm:h-28 mb-2" />
                          <span className="text-base font-bold text-zinc-100 font-sans tracking-tight">
                            Application Server
                          </span>
                          <span className="text-[11px] text-emerald-400 font-mono mt-1">
                            Node.js / Django / Spring Boot
                          </span>
                          <div className="mt-3 text-[10px] text-zinc-400 border-t border-emerald-900/60 pt-2 w-full space-y-0.5">
                            <div>Role: The &quot;Waiter&quot; (Business Rules)</div>
                            <div>Protects database passwords</div>
                          </div>
                        </div>

                        {/* CONNECTOR 2 (App Server to User) */}
                        <div className="flex flex-col items-center justify-center py-2 px-1 relative">
                          <div className="relative flex items-center justify-center">
                            <div className="w-24 sm:w-36 h-1 bg-zinc-600 rounded-full" />
                            <div className="absolute -left-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-r-6 border-r-zinc-600" />
                            <div className="absolute -right-1 w-0 h-0 border-t-4 border-t-transparent border-b-4 border-b-transparent border-l-6 border-l-zinc-600" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-300 mt-2 px-2.5 py-0.5 rounded bg-zinc-900/90 border border-zinc-800">
                            HTTPS / Internet
                          </span>
                        </div>
                      </>
                    )}

                    {/* RIGHT BOX: USER (Dashed Green Card matching user image) */}
                    <div className="w-56 sm:w-64 border-2 border-dashed border-emerald-500/70 bg-[#0c1f15] rounded-xl p-6 flex flex-col items-center text-center shadow-lg transition-all hover:border-emerald-400">
                      {/* Laptop Graphic */}
                      <UserLaptopGraphic className="w-24 h-24 sm:w-28 sm:h-28 mb-2" />

                      <span className="text-base font-bold text-zinc-100 font-sans tracking-tight">
                        User
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono mt-1">
                        {architectureTier === "1-tier"
                          ? "Standalone Desktop App"
                          : architectureTier === "2-tier"
                          ? "Office Software / Client"
                          : "Web Browser / Mobile Phone"}
                      </span>
                      <div className="mt-3 text-[10px] text-zinc-400 border-t border-emerald-900/60 pt-2 w-full space-y-0.5">
                        <div>Role: Interacts with screen & mouse</div>
                        <div>Input: Clicks, form inputs</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BEGINNER-FRIENDLY INTERACTIVE LAB & SIMULATOR */}
                <div className="p-4 sm:p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-zinc-200">
                        Interactive Action: Send Data from User to Database
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => runQuerySimulation("profile")}
                        className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Send Test Query</span>
                      </button>
                      {simQueryState !== "idle" && (
                        <button
                          type="button"
                          onClick={resetQuerySimulation}
                          className="px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time simulation feedback card */}
                  <div className="p-3.5 rounded-md bg-[#070709] border border-zinc-800 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                      <span>SIMULATION STATUS:</span>
                      <span className="text-emerald-400 font-bold uppercase">
                        {simQueryState === "idle" && "Ready to Send"}
                        {simQueryState === "user-to-db" && "Transmitting over Arrow →"}
                        {simQueryState === "db-processing" && "Database Looking Up Row..."}
                        {simQueryState === "db-to-user" && "Sending Results Back ←"}
                        {simQueryState === "completed" && "Success! Result Displayed"}
                      </span>
                    </div>

                    {simQueryState === "completed" ? (
                      <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 space-y-1">
                        <div className="font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Database Returned Record Successfully:</span>
                        </div>
                        <div className="text-[11px] text-zinc-300">
                          {`{ id: 101, username: "alice_engineer", role: "admin", status: "active" }`}
                        </div>
                      </div>
                    ) : (
                      <div className="text-zinc-400 text-[11px] font-sans">
                        Click &quot;Send Test Query&quot; above to watch an animated data packet travel between the User and the Database Server!
                      </div>
                    )}
                  </div>

                  {/* Everyday Relatable Real-World Analogy */}
                  <div className="p-4 rounded-md bg-[#0c1318] border border-blue-900/40 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-blue-400 font-semibold font-sans">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      <span>Everyday Real-World Analogy: How to remember this</span>
                    </div>

                    {architectureTier === "1-tier" && (
                      <p className="text-zinc-300 leading-relaxed font-sans">
                        <strong className="text-white">Like a Personal Diary in your desk:</strong> You are the user, and the diary is the database. Everything is right in front of you. You don&apos;t need to phone anyone, and nobody else can read or write in it at the same time. Examples: SQLite in mobile games, Microsoft Word documents, Notes app.
                      </p>
                    )}

                    {architectureTier === "2-tier" && (
                      <p className="text-zinc-300 leading-relaxed font-sans">
                        <strong className="text-white">Like Bank Tellers sharing a Vault:</strong> Every teller has a computer screen at their desk, and all screens connect directly to the central bank vault database in the back office. Fast for the bank staff, but you wouldn&apos;t let random customers on the internet connect directly into the vault! Examples: Hospital record computers, University lab booking software.
                      </p>
                    )}

                    {architectureTier === "3-tier" && (
                      <p className="text-zinc-300 leading-relaxed font-sans">
                        <strong className="text-white">Like Ordering Food at a Restaurant:</strong> You (Tier 1: Customer) do NOT walk into the kitchen. You talk to the Waiter (Tier 2: Application Server). The waiter verifies your order, takes it to the Chef (Tier 3: Database), and brings your prepared meal back. If a customer is rude, the waiter stops them before they ever reach the kitchen. Examples: Amazon, Instagram, Netflix, Uber.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 2. THREE-SCHEMA ARCHITECTURE (ANSI/SPARC)                    */}
            {/* ------------------------------------------------------------- */}
            {isThreeSchema && (
              <div className="space-y-5">
                <div className="pb-3 border-b border-zinc-800/80">
                  <h4 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                    <span>ANSI/SPARC Three-Schema Architecture</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {learningMode === "beginner"
                      ? "Why databases separate user views, table designs, and physical hard drives so changes don't break your apps."
                      : "Separation of concerns enabling Logical and Physical Data Independence."}
                  </p>
                </div>

                {/* 3 Dashed Boxes Stack */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* External Level */}
                  <div className="p-5 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">1. EXTERNAL LEVEL</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">User Views</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      What individual people see. Payroll sees salaries, HR sees employee names.
                    </p>
                    <div className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-emerald-400">
                      View 1: HR View
                      <br />
                      View 2: Payroll View
                    </div>
                  </div>

                  {/* Conceptual Level */}
                  <div className="p-5 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">2. CONCEPTUAL LEVEL</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">Full Schema</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      The whole blueprint: Tables, Columns, Relationships, and Primary Keys.
                    </p>
                    <div className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-0.5">
                      <div>Table: Employees</div>
                      <div>- id, name, salary</div>
                      {schemaIndependenceDemo === "logical" && (
                        <div className="text-emerald-400 font-bold animate-pulse">+ bonus_score [ADDED]</div>
                      )}
                    </div>
                  </div>

                  {/* Internal Level */}
                  <div className="p-5 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">3. INTERNAL LEVEL</span>
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">Physical Disk</span>
                    </div>
                    <p className="text-[11px] text-zinc-300">
                      How bytes are actually saved on the physical SSD or Hard Drive.
                    </p>
                    <div className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                      Media: {schemaIndependenceDemo === "physical" ? "NVMe SSD (Upgraded!)" : "Standard Disk"}
                      <br />
                      Format: 8 KB Pages
                    </div>
                  </div>
                </div>

                {/* Interactive Demonstrations */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSchemaIndependenceDemo(schemaIndependenceDemo === "logical" ? "none" : "logical")
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                      schemaIndependenceDemo === "logical"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Test Logical Data Independence (Add New Column)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSchemaIndependenceDemo(schemaIndependenceDemo === "physical" ? "none" : "physical")
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                      schemaIndependenceDemo === "physical"
                        ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                        : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:text-white"
                    }`}
                  >
                    Test Physical Data Independence (Upgrade to SSD)
                  </button>
                </div>

                {schemaIndependenceDemo !== "none" && (
                  <div className="p-3.5 rounded bg-[#0c1f15] border border-emerald-800/80 text-xs text-zinc-200">
                    <span className="font-bold text-emerald-400">Result: </span>
                    {schemaIndependenceDemo === "logical" &&
                      "We added a new column (bonus_score) to the database. Because of Logical Data Independence, existing user views and queries keep working with zero changes!"}
                    {schemaIndependenceDemo === "physical" &&
                      "We migrated the disk from an old hard drive to a high-speed SSD. Because of Physical Data Independence, the database queries and code remain 100% identical!"}
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 3. B+ TREE INDEX TRAVERSAL (Visual Index Search)              */}
            {/* ------------------------------------------------------------- */}
            {isBTree && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      B+ Tree Index Search: Like a Book Index
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Instead of checking 1,000,000 rows one-by-one, jump directly to the answer in 3 fast hops!
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[10, 28, 35, 55, 75, 90].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => runBTreeSearch(k)}
                        className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                          bTreeSearchKey === k
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        }`}
                      >
                        Find {k}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tree Visual Hierarchy */}
                <div className="p-6 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 flex flex-col items-center gap-5">
                  {/* ROOT */}
                  <div
                    className={`px-5 py-2.5 rounded-lg border-2 font-mono text-xs flex items-center gap-3 transition-all ${
                      bTreeActivePath.includes("root")
                        ? "border-emerald-400 bg-emerald-950 text-emerald-200 shadow-md font-bold"
                        : "border-zinc-700 bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500 font-sans">ROOT:</span>
                    <span>[ 25 | 60 ]</span>
                  </div>

                  <div className="w-32 h-0.5 bg-zinc-600" />

                  {/* INTERNAL NODES */}
                  <div className="flex items-center gap-4 sm:gap-8 font-mono text-xs">
                    <div
                      className={`px-3.5 py-2 rounded-md border-2 transition-all ${
                        bTreeActivePath.includes("internal-left")
                          ? "border-emerald-400 bg-emerald-950 text-emerald-200 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      [ 10 | 20 ]
                    </div>
                    <div
                      className={`px-3.5 py-2 rounded-md border-2 transition-all ${
                        bTreeActivePath.includes("internal-mid")
                          ? "border-emerald-400 bg-emerald-950 text-emerald-200 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      [ 35 | 50 ]
                    </div>
                    <div
                      className={`px-3.5 py-2 rounded-md border-2 transition-all ${
                        bTreeActivePath.includes("internal-right")
                          ? "border-emerald-400 bg-emerald-950 text-emerald-200 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      [ 75 | 85 ]
                    </div>
                  </div>

                  <div className="w-full max-w-md h-0.5 bg-zinc-700" />

                  {/* LEAF NODES */}
                  <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
                    {[
                      { id: "leaf-1", label: "[5, 10]" },
                      { id: "leaf-2", label: "[15, 20, 24]" },
                      { id: "leaf-3", label: "[28, 35]" },
                      { id: "leaf-4", label: "[42, 55]" },
                      { id: "leaf-5", label: "[68, 75]" },
                      { id: "leaf-6", label: "[85, 90]" },
                    ].map((leaf) => (
                      <div
                        key={leaf.id}
                        className={`px-3 py-1.5 rounded border transition-all ${
                          bTreeActivePath.includes(leaf.id)
                            ? "border-emerald-400 bg-emerald-950 text-emerald-200 font-bold shadow"
                            : "border-zinc-800 bg-zinc-900 text-zinc-400"
                        }`}
                      >
                        {leaf.label}
                      </div>
                    ))}
                  </div>
                </div>

                {bTreeSearchResult && (
                  <div className="p-3.5 rounded bg-[#0c1f15] border border-emerald-800 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{bTreeSearchResult}</span>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 4. OS 5-STATE PROCESS LIFECYCLE                               */}
            {/* ------------------------------------------------------------- */}
            {isOsProcess && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-100">
                    How the Operating System Runs Programs (Process Lifecycle)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Every app you launch (like Chrome or Spotify) transitions through these 5 states.
                  </p>
                </div>

                {/* State Machine Graphic in Green Dashed Style */}
                <div className="p-6 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 flex flex-wrap items-center justify-center gap-4">
                  {(["NEW", "READY", "RUNNING", "WAITING", "TERMINATED"] as const).map((st) => (
                    <div
                      key={st}
                      className={`w-32 py-3 px-2 rounded-lg border-2 text-center font-mono text-xs transition-all ${
                        processState === st
                          ? "border-emerald-400 bg-emerald-950 text-emerald-200 shadow-md font-bold scale-105"
                          : "border-zinc-800 bg-zinc-900/90 text-zinc-400"
                      }`}
                    >
                      {st}
                      {processState === st && (
                        <span className="block text-[9px] text-emerald-400 font-sans mt-0.5">
                          CURRENT
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Controls */}
                <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                  <span className="text-zinc-200 font-semibold block text-xs">
                    Simulate What Happens to the Program:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => transitionProcess("READY", "OS loaded app from SSD into RAM (NEW → READY)")}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                    >
                      1. Open App (Ready)
                    </button>
                    <button
                      type="button"
                      onClick={() => transitionProcess("RUNNING", "CPU is now executing app code (READY → RUNNING)")}
                      className="p-2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 cursor-pointer font-medium"
                    >
                      2. Give CPU Time (Running)
                    </button>
                    <button
                      type="button"
                      onClick={() => transitionProcess("WAITING", "App paused to wait for disk or internet (RUNNING → WAITING)")}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                    >
                      3. Wait for File (Waiting)
                    </button>
                    <button
                      type="button"
                      onClick={() => transitionProcess("READY", "File finished loading, ready to continue (WAITING → READY)")}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                    >
                      4. File Ready (Ready)
                    </button>
                    <button
                      type="button"
                      onClick={() => transitionProcess("READY", "Timer expired; CPU paused app to let another app run")}
                      className="p-2 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                    >
                      5. Time Share (Interrupt)
                    </button>
                    <button
                      type="button"
                      onClick={() => transitionProcess("TERMINATED", "User clicked Close (RUNNING → TERMINATED)")}
                      className="p-2 rounded bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 cursor-pointer"
                    >
                      6. Close App (Exit)
                    </button>
                  </div>

                  <div className="p-3 rounded bg-[#070709] border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-1">
                    <div className="text-zinc-500">// What Just Happened:</div>
                    {processHistory.map((item, i) => (
                      <div key={i} className="text-emerald-400">
                        › {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 5. VIRTUAL MEMORY PAGING                                      */}
            {/* ------------------------------------------------------------- */}
            {isOsPaging && (
              <div className="space-y-4">
                <div className="pb-2 border-b border-zinc-800">
                  <h4 className="text-sm font-semibold text-zinc-100">
                    Virtual Memory Paging: Giving Each App its Own Sandbox
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Apps think they have all memory to themselves. The OS Page Table secretly maps it to real physical RAM slots.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="p-4 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block font-sans">
                      1. App Virtual Page
                    </span>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelectedVpn(v)}
                          className={`flex-1 py-1.5 rounded text-xs font-mono cursor-pointer ${
                            selectedVpn === v ? "bg-emerald-600 text-white font-bold" : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          Page {v}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-zinc-300 mt-2">
                      App asks for: <strong className="text-white">Page #{selectedVpn}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-2 font-mono text-xs">
                    <span className="text-xs font-bold text-emerald-400 block font-sans">
                      2. OS Page Table (The Map)
                    </span>
                    <div className="text-[11px] text-zinc-300 space-y-1">
                      <div>Page 0 → RAM Frame #5</div>
                      <div>Page 1 → RAM Frame #12</div>
                      <div className={selectedVpn === 2 ? "text-amber-400 font-bold" : ""}>
                        Page 2 → Swapped on Disk (Page Fault!)
                      </div>
                      <div>Page 3 → RAM Frame #8</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 space-y-2 font-mono text-xs">
                    <span className="text-xs font-bold text-emerald-400 block font-sans">
                      3. Physical RAM Memory
                    </span>
                    {selectedVpn === 2 ? (
                      <div className="text-rose-400">
                        ⚠ PAGE FAULT! Not in RAM. OS is reading it from disk now.
                      </div>
                    ) : (
                      <div className="text-emerald-300">
                        ✓ Found in Physical RAM Frame #{selectedVpn === 0 ? 5 : selectedVpn === 1 ? 12 : 8}!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 6. TCP 3-WAY HANDSHAKE (Computer Networks)                    */}
            {/* ------------------------------------------------------------- */}
            {isTcpHandshake && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-100">
                      TCP 3-Way Handshake: How Two Computers Introduce Themselves
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Like saying: &quot;Can you hear me?&quot; → &quot;Yes, can you hear me?&quot; → &quot;Yes, let&apos;s talk!&quot;
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTcpStep((prev) => (prev < 3 ? prev + 1 : 0))}
                    className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{tcpStep === 3 ? "Restart Handshake" : `Step ${tcpStep + 1} of 3`}</span>
                  </button>
                </div>

                <div className="p-6 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 grid grid-cols-2 gap-8 font-mono text-xs">
                  {/* Client */}
                  <div className="flex flex-col items-center text-center">
                    <UserLaptopGraphic className="w-20 h-20 mb-2" />
                    <span className="font-bold text-zinc-100">Your Laptop (Client)</span>
                    <span className="text-[11px] text-emerald-400 mt-1">
                      Status: {tcpStep === 0 ? "Ready" : tcpStep === 1 ? "Sent SYN" : "Connected (Established)"}
                    </span>
                  </div>

                  {/* Server */}
                  <div className="flex flex-col items-center text-center">
                    <DatabaseServerGraphic className="w-20 h-20 mb-2" />
                    <span className="font-bold text-zinc-100">Web Server</span>
                    <span className="text-[11px] text-emerald-400 mt-1">
                      Status: {tcpStep < 2 ? "Listening" : "Connected (Established)"}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#111115] border border-zinc-800 text-xs text-zinc-300">
                  <span className="font-bold text-emerald-400">What is happening: </span>
                  {tcpStep === 0 && "Both computers are waiting. Click 'Step 1 of 3' to start handshake."}
                  {tcpStep === 1 && "Step 1 (SYN): Laptop says: 'Hello Server, I want to connect (Sequence #1000).'"}
                  {tcpStep === 2 && "Step 2 (SYN-ACK): Server replies: 'I hear you! I acknowledge 1000, and my sequence is 5000.'"}
                  {tcpStep === 3 && "Step 3 (ACK): Laptop replies: 'Got your message! We are now securely connected!'"}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* 7. FALLBACK / GENERAL SCHEMATIC (For any other topic)         */}
            {/* ------------------------------------------------------------- */}
            {!isDbmsArchitecture &&
              !isThreeSchema &&
              !isBTree &&
              !isOsProcess &&
              !isOsPaging &&
              !isTcpHandshake && (
                <div className="space-y-4">
                  <div className="pb-2 border-b border-zinc-800">
                    <h4 className="text-sm font-semibold text-zinc-100">
                      System Architectural Schematic
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Illustrated component interactions for {topic.title}.
                    </p>
                  </div>

                  <div className="p-8 rounded-xl bg-[#0c1f15] border-2 border-dashed border-emerald-500/70 flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="w-56 border-2 border-dashed border-emerald-500/70 bg-[#0e1713] rounded-xl p-5 flex flex-col items-center text-center shadow-lg">
                      <Cpu className="w-16 h-16 text-emerald-400 mb-2" />
                      <span className="font-bold text-zinc-100 text-sm">Execution Engine</span>
                      <span className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        Core Processor / Logic
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="relative flex items-center justify-center">
                        <div className="w-24 sm:w-32 h-1 bg-zinc-600 rounded-full" />
                        <ArrowLeftRight className="w-5 h-5 text-zinc-400 absolute" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-300 mt-2 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                        Bi-directional Bus
                      </span>
                    </div>

                    <div className="w-56 border-2 border-dashed border-emerald-500/70 bg-[#0e1713] rounded-xl p-5 flex flex-col items-center text-center shadow-lg">
                      <DatabaseServerGraphic className="w-16 h-16 mb-2" />
                      <span className="font-bold text-zinc-100 text-sm">Storage Subsystem</span>
                      <span className="text-[11px] font-mono text-emerald-400 mt-0.5">
                        Persistent Data
                      </span>
                    </div>
                  </div>

                  {topic.diagram && (
                    <div className="pt-2">
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1.5">
                        Detailed Text Specification:
                      </span>
                      <pre className="p-3.5 rounded bg-[#070709] border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                        {topic.diagram}
                      </pre>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  );
}
