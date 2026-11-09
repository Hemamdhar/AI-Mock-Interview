"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles,
  ArrowRight,
  Menu,
  Lock,
  BookOpen,
  Clock,
  Calendar,
  BarChart2,
  Info,
  Code2,
  Network,
  Database,
  Brain,
  CheckCircle2,
  FileCheck,
  Award,
  Layers,
  TrendingUp,
  Terminal,
  Workflow,
  Cpu,
  Shield,
  Zap,
  Target,
  FileText,
  Check,
  MessageSquare,
  Map,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { Sidebar, DashboardTab } from "@/components/dashboard/Sidebar";
import { PROGRESS_EVENT_NAME, ProgressSummary, fetchBackendProgress, syncLocalProgressWithBackend } from "@/lib/progress";
import { ROADMAP_LEVELS } from "@/data/dsaRoadmap";

// Minimal, fast-rendering skeleton loader for sub-views
const TabLoadingSkeleton = ({ label }: { label: string }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-3 min-h-[400px]">
    <div className="w-7 h-7 rounded-lg border-2 border-zinc-700 border-t-zinc-200 animate-spin" />
    <span className="text-xs font-mono text-zinc-400">Loading {label}...</span>
  </div>
);

// Dynamic Code-Split Views: loads heavy tabs on-demand so dashboard compiles in < 1.5s
const InterviewQuestionsView = dynamic(
  () => import("@/components/dashboard/InterviewQuestionsView").then((mod) => mod.InterviewQuestionsView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Interview Prep" /> }
);

const HiringSimulatorView = dynamic(
  () => import("@/components/dashboard/HiringSimulatorView").then((mod) => mod.HiringSimulatorView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Hiring Simulator" /> }
);

const RoleRoadmapsView = dynamic(
  () => import("@/components/dashboard/RoleRoadmapsView").then((mod) => mod.RoleRoadmapsView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Career Roadmaps" /> }
);

const ATSResumeCheckerView = dynamic(
  () => import("@/components/dashboard/ATSResumeCheckerView").then((mod) => mod.ATSResumeCheckerView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="ATS Resume Checker" /> }
);

const DSAView = dynamic(
  () => import("@/components/dashboard/DSAView").then((mod) => mod.DSAView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="DSA Roadmap" /> }
);

const CoreCSView = dynamic(
  () => import("@/components/dashboard/CoreCSView").then((mod) => mod.CoreCSView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Core CS Subjects" /> }
);

const AIMLView = dynamic(
  () => import("@/components/dashboard/AIMLView").then((mod) => mod.AIMLView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="AI & ML Curriculum" /> }
);

const SystemDesignView = dynamic(
  () => import("@/components/dashboard/SystemDesignView").then((mod) => mod.SystemDesignView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="System Design" /> }
);

const ProjectsView = dynamic(
  () => import("@/components/dashboard/ProjectsView").then((mod) => mod.ProjectsView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Projects Hub" /> }
);

const CodeSpaceView = dynamic(
  () => import("@/components/dashboard/CodeSpaceView").then((mod) => mod.CodeSpaceView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="CodeSpace Sandbox" /> }
);

const NotesView = dynamic(
  () => import("@/components/dashboard/NotesView").then((mod) => mod.NotesView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Notes" /> }
);

const SettingsView = dynamic(
  () => import("@/components/dashboard/SettingsView").then((mod) => mod.SettingsView),
  { ssr: false, loading: () => <TabLoadingSkeleton label="Settings" /> }
);

const TOTAL_DSA_PROBLEMS = ROADMAP_LEVELS.reduce((acc, lvl) => acc + lvl.problems.length, 0);
const TOTAL_DSA_EASY = ROADMAP_LEVELS.flatMap((l) => l.problems).filter((p) => p.difficulty === "Easy").length;
const TOTAL_DSA_MEDIUM = ROADMAP_LEVELS.flatMap((l) => l.problems).filter((p) => p.difficulty === "Medium").length;
const TOTAL_DSA_HARD = ROADMAP_LEVELS.flatMap((l) => l.problems).filter((p) => p.difficulty === "Hard").length;
const TOTAL_AIML_TOPICS = 30;
const TOTAL_SD_TOPICS = 20;

// Curated Core CS Subjects topic counts
const TOTAL_CS_OS = 31;
const TOTAL_CS_CN = 35;
const TOTAL_CS_DBMS = 32;
const TOTAL_CS_ARCH = 27;
const TOTAL_CS_OOP = 23;
const TOTAL_CS_TOPICS = TOTAL_CS_OS + TOTAL_CS_CN + TOTAL_CS_DBMS + TOTAL_CS_ARCH + TOTAL_CS_OOP; // 148

export interface DashboardContentProps {
  initialTab?: DashboardTab;
}

export function DashboardContent({ initialTab }: DashboardContentProps) {
  const { user } = useAuth();

  // Dynamic progress state synchronized with PostgreSQL backend and localStorage
  const [dsaSolvedIds, setDsaSolvedIds] = useState<number[]>([]);
  const [aimlCompletedIds, setAimlCompletedIds] = useState<string[]>([]);
  const [sdCompletedIds, setSdCompletedIds] = useState<string[]>([]);

  // Core CS Textbooks progress
  const [csOsCount, setCsOsCount] = useState<number>(0);
  const [csCnCount, setCsCnCount] = useState<number>(0);
  const [csDbmsCount, setCsDbmsCount] = useState<number>(0);
  const [csArchCount, setCsArchCount] = useState<number>(0);
  const [csOopCount, setCsOopCount] = useState<number>(0);

  // Mock Interviews & ATS Scans progress
  const [mockInterviewCount, setMockInterviewCount] = useState<number>(3);
  const [atsScanCount, setAtsScanCount] = useState<number>(2);

  const [progressFilter, setProgressFilter] = useState<
    "all" | "interview" | "interviewprep" | "subjects" | "dsa" | "systemdesign" | "aiml" | "ats"
  >("all");

  const refreshProgress = useCallback(() => {
    if (typeof window === "undefined") return;

    // Helper to safely count completed topics from a stored boolean map
    const readStorageObjCount = (key: string): number => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return 0;
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          return Object.values(parsed).filter(Boolean).length;
        }
        if (Array.isArray(parsed)) return parsed.length;
        return 0;
      } catch {
        return 0;
      }
    };

    // 1. Read local storage for immediate UI responsiveness
    try {
      const dsaRaw = localStorage.getItem("dsa_solved_problem_ids");
      if (dsaRaw) {
        const ids = JSON.parse(dsaRaw);
        if (Array.isArray(ids)) setDsaSolvedIds(ids.map(Number));
      }
    } catch {
      // Fallback
    }

    try {
      const aimlRaw = localStorage.getItem("interviewai_aiml_completed_topics");
      if (aimlRaw) {
        const parsed = JSON.parse(aimlRaw);
        const ids = Object.entries(parsed).filter(([_, v]) => Boolean(v)).map(([k]) => k);
        setAimlCompletedIds(ids);
      }
    } catch {
      // Fallback
    }

    try {
      const sdRaw = localStorage.getItem("interviewai_system_design_completed_topics");
      if (sdRaw) {
        const parsed = JSON.parse(sdRaw);
        const ids = Object.entries(parsed).filter(([_, v]) => Boolean(v)).map(([k]) => k);
        setSdCompletedIds(ids);
      }
    } catch {
      // Fallback
    }

    // Helper to safely extract completed topic IDs from stored boolean map
    const getStoredIds = (key: string): string[] => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && parsed !== null) {
          return Object.entries(parsed).filter(([_, v]) => Boolean(v)).map(([k]) => k);
        }
        return [];
      } catch {
        return [];
      }
    };

    const osIds = getStoredIds("interviewai_os_mastered_topics");
    const cnIds = getStoredIds("interviewai_cn_mastered_topics");
    const dbmsIds = getStoredIds("interviewai_dbms_mastered_topics");
    const archIds = getStoredIds("interviewai_arch_mastered_topics");
    const oopIds = getStoredIds("interviewai_oop_mastered_topics");

    // Read Core CS Subjects progress
    setCsOsCount(osIds.length);
    setCsCnCount(cnIds.length);
    setCsDbmsCount(dbmsIds.length);
    setCsArchCount(archIds.length);
    setCsOopCount(oopIds.length);

    // Read Mock Interviews & ATS scans
    const storedInterviews = localStorage.getItem("interviewai_mock_sessions_count");
    if (storedInterviews) {
      setMockInterviewCount(Math.max(1, parseInt(storedInterviews, 10) || 1));
    } else if (user?.interviewsCompleted) {
      setMockInterviewCount(user.interviewsCompleted);
    }

    const storedAts = localStorage.getItem("interviewai_ats_scans_count");
    if (storedAts) {
      setAtsScanCount(Math.max(1, parseInt(storedAts, 10) || 1));
    }
  }, [user]);

  // Initial mount: load local state and sync once with backend
  useEffect(() => {
    refreshProgress();

    // Fetch latest progress from backend PostgreSQL database
    fetchBackendProgress().then((summary) => {
      if (summary) {
        if (summary.dsa) {
          const ids = summary.dsa.map((n: string | number) => Number(n)).filter((n: number) => !isNaN(n));
          setDsaSolvedIds((prev) => Array.from(new Set([...prev, ...ids])));
        }
        if (summary.aiml) {
          setAimlCompletedIds((prev) => Array.from(new Set([...prev, ...summary.aiml])));
        }
        if (summary.system_design) {
          setSdCompletedIds((prev) => Array.from(new Set([...prev, ...summary.system_design])));
        }
        if (summary.core_cs_os && summary.core_cs_os.length > 0) {
          setCsOsCount((prev) => Math.max(prev, summary.core_cs_os!.length));
        }
        if (summary.core_cs_cn && summary.core_cs_cn.length > 0) {
          setCsCnCount((prev) => Math.max(prev, summary.core_cs_cn!.length));
        }
        if (summary.core_cs_dbms && summary.core_cs_dbms.length > 0) {
          setCsDbmsCount((prev) => Math.max(prev, summary.core_cs_dbms!.length));
        }
        if (summary.core_cs_arch && summary.core_cs_arch.length > 0) {
          setCsArchCount((prev) => Math.max(prev, summary.core_cs_arch!.length));
        }
        if (summary.core_cs_oop && summary.core_cs_oop.length > 0) {
          setCsOopCount((prev) => Math.max(prev, summary.core_cs_oop!.length));
        }
      }
    });

    // Batch sync local completions to backend once on mount
    try {
      const dsaRaw = localStorage.getItem("dsa_solved_problem_ids");
      const localDsa = dsaRaw ? JSON.parse(dsaRaw) : [];
      const aimlRaw = localStorage.getItem("interviewai_aiml_completed_topics");
      const localAiml = aimlRaw ? Object.entries(JSON.parse(aimlRaw)).filter(([_, v]) => Boolean(v)).map(([k]) => k) : [];
      const sdRaw = localStorage.getItem("interviewai_system_design_completed_topics");
      const localSd = sdRaw ? Object.entries(JSON.parse(sdRaw)).filter(([_, v]) => Boolean(v)).map(([k]) => k) : [];

      const getStoredIds = (key: string): string[] => {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) return [];
          const parsed = JSON.parse(raw);
          if (typeof parsed === "object" && parsed !== null) {
            return Object.entries(parsed).filter(([_, v]) => Boolean(v)).map(([k]) => k);
          }
          return [];
        } catch {
          return [];
        }
      };

      syncLocalProgressWithBackend(
        localDsa,
        localAiml,
        localSd,
        {
          os: getStoredIds("interviewai_os_mastered_topics"),
          cn: getStoredIds("interviewai_cn_mastered_topics"),
          dbms: getStoredIds("interviewai_dbms_mastered_topics"),
          arch: getStoredIds("interviewai_arch_mastered_topics"),
          oop: getStoredIds("interviewai_oop_mastered_topics"),
        }
      );
    } catch {
      // Ignore background sync errors
    }
  }, [refreshProgress]);

  // Listen to local progress updates without re-triggering backend network sync
  useEffect(() => {
    const handleProgressChange = (e: Event) => {
      refreshProgress();
      const customEvent = e as CustomEvent<ProgressSummary | null>;
      if (customEvent.detail) {
        const summary = customEvent.detail;
        if (summary.dsa) {
          const ids = summary.dsa.map((n: string | number) => Number(n)).filter((n: number) => !isNaN(n));
          setDsaSolvedIds((prev) => Array.from(new Set([...prev, ...ids])));
        }
        if (summary.aiml) {
          setAimlCompletedIds((prev) => Array.from(new Set([...prev, ...summary.aiml])));
        }
        if (summary.system_design) {
          setSdCompletedIds((prev) => Array.from(new Set([...prev, ...summary.system_design])));
        }
      }
    };

    window.addEventListener(PROGRESS_EVENT_NAME, handleProgressChange);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, handleProgressChange);
  }, [refreshProgress]);

  // DSA Derived stats
  const dsaSolvedCount = useMemo(() => {
    const allIds = new Set(ROADMAP_LEVELS.flatMap((lvl) => lvl.problems.map((p) => p.id)));
    return dsaSolvedIds.filter((id) => allIds.has(id)).length;
  }, [dsaSolvedIds]);

  const dsaEasySolved = useMemo(() => {
    const easyIds = new Set(
      ROADMAP_LEVELS.flatMap((lvl) => lvl.problems)
        .filter((p) => p.difficulty === "Easy")
        .map((p) => p.id)
    );
    return dsaSolvedIds.filter((id) => easyIds.has(id)).length;
  }, [dsaSolvedIds]);

  const dsaMediumSolved = useMemo(() => {
    const medIds = new Set(
      ROADMAP_LEVELS.flatMap((lvl) => lvl.problems)
        .filter((p) => p.difficulty === "Medium")
        .map((p) => p.id)
    );
    return dsaSolvedIds.filter((id) => medIds.has(id)).length;
  }, [dsaSolvedIds]);

  const dsaHardSolved = useMemo(() => {
    const hardIds = new Set(
      ROADMAP_LEVELS.flatMap((lvl) => lvl.problems)
        .filter((p) => p.difficulty === "Hard")
        .map((p) => p.id)
    );
    return dsaSolvedIds.filter((id) => hardIds.has(id)).length;
  }, [dsaSolvedIds]);

  const dsaPercentage = Math.round((dsaSolvedCount / TOTAL_DSA_PROBLEMS) * 100);
  const dsaDonutOffset = Math.max(0, 226.19 - (226.19 * dsaPercentage) / 100);

  // System Design Derived stats
  const sdFundamentalsCompleted = useMemo(() => {
    return sdCompletedIds.filter((id) => id.startsWith("sd_fund_")).length;
  }, [sdCompletedIds]);

  const sdPracticeCompleted = useMemo(() => {
    return sdCompletedIds.filter((id) => id.startsWith("sd_prac_")).length;
  }, [sdCompletedIds]);

  const sdCompletedCount = sdCompletedIds.length;
  const sdPercentage = Math.round((sdCompletedCount / TOTAL_SD_TOPICS) * 100);
  const sdDonutOffset = Math.max(0, 226.19 - (226.19 * sdPercentage) / 100);

  // AI / ML Derived stats
  const mlFoundationsCompleted = useMemo(() => {
    return aimlCompletedIds.filter((id) => id.startsWith("ml_")).length;
  }, [aimlCompletedIds]);

  const dlCompleted = useMemo(() => {
    return aimlCompletedIds.filter((id) => id.startsWith("dl_")).length;
  }, [aimlCompletedIds]);

  const genAiCompleted = useMemo(() => {
    return aimlCompletedIds.filter((id) => id.startsWith("genai_")).length;
  }, [aimlCompletedIds]);

  const aimlCompletedCount = aimlCompletedIds.length;
  const aimlPercentage = Math.round((aimlCompletedCount / TOTAL_AIML_TOPICS) * 100);
  const aimlDonutOffset = Math.max(0, 226.19 - (226.19 * aimlPercentage) / 100);

  // Core CS Subjects Derived stats
  const csTotalCompleted = csOsCount + csCnCount + csDbmsCount + csArchCount + csOopCount;
  const csPercentage = Math.round((csTotalCompleted / TOTAL_CS_TOPICS) * 100);

  // Overall Platform Readiness Index (calibrated across all 6 core pillars)
  const overallReadinessIndex = Math.min(
    100,
    Math.max(
      24,
      Math.round(
        dsaPercentage * 0.3 +
        sdPercentage * 0.2 +
        csPercentage * 0.25 +
        aimlPercentage * 0.15 +
        Math.min(10, mockInterviewCount) * 1.0
      )
    )
  );

  const getTabFromLocation = useCallback((): DashboardTab => {
    if (initialTab) return initialTab;
    if (typeof window === "undefined") return "dashboard";
    const path = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const rawTab = searchParams.get("tab")?.toLowerCase();
    const queryTab = rawTab as DashboardTab | null;

    if (path.includes("/dashboard/roadmaps") || path.includes("/roadmaps") || queryTab === "roadmaps") return "roadmaps";
    if (path.includes("/hiring-simulator") || path.includes("/simulator") || queryTab === "simulator") return "simulator";
    if (path.includes("/dashboard/interviewprep") || queryTab === "interviewprep") return "interviewprep";
    if (path.includes("/dashboard/interview") || queryTab === "interview") return "interviewprep";
    if (path.includes("/dashboard/ats") || queryTab === "ats") return "ats";
    if (path.includes("/dashboard/dsa") || queryTab === "dsa") return "dsa";
    if (path.includes("/dashboard/subjects") || path.includes("/subjects") || queryTab === "subjects") return "subjects";
    if (path.includes("/dashboard/aiml") || path.includes("/dashboard/ai-ml") || queryTab === "aiml" || rawTab === "ai-ml") return "aiml";
    if (path.includes("/dashboard/system-design") || path.includes("/dashboard/systemdesign") || queryTab === "systemdesign" || rawTab === "system-design") return "systemdesign";
    if (path.includes("/dashboard/projects") || queryTab === "projects") return "projects";
    if (path.includes("/dashboard/codespace") || queryTab === "codespace") return "codespace";
    if (path.includes("/dashboard/notes") || path.includes("/dashboard/notespace") || queryTab === "notes" || rawTab === "notespace") return "notes";
    if (path.includes("/dashboard/settings") || queryTab === "settings") return "settings";
    return "dashboard";
  }, [initialTab]);

  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || "dashboard");
  const [activeSubject, setActiveSubject] = useState<string>("operating-systems");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync tab on initial load and handle browser back / forward navigation
  useEffect(() => {
    setMounted(true);
    const resolvedTab = getTabFromLocation();
    setActiveTab(resolvedTab);

    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const querySubject = searchParams.get("subject")?.toLowerCase();
      if (querySubject) {
        if (querySubject.includes("architecture")) {
          setActiveSubject("modern-computer-architecture");
        } else if (
          querySubject === "oop" ||
          querySubject === "oops" ||
          querySubject.includes("object-oriented")
        ) {
          setActiveSubject("oop");
        } else if (
          querySubject === "dbms" ||
          querySubject.includes("database")
        ) {
          setActiveSubject("dbms");
        } else if (
          querySubject === "computer-networks" ||
          querySubject === "cn" ||
          querySubject.includes("network")
        ) {
          setActiveSubject("computer-networks");
        } else {
          setActiveSubject(querySubject);
        }
      } else {
        const path = window.location.pathname.toLowerCase();
        if (path.includes("operating-systems")) setActiveSubject("operating-systems");
        else if (path.includes("dbms") || path.includes("database")) setActiveSubject("dbms");
        else if (path.includes("computer-networks") || path.includes("/cn") || path.includes("network")) setActiveSubject("computer-networks");
        else if (path.includes("oops") || path.includes("/oop") || path.includes("object-oriented")) setActiveSubject("oop");
        else if (path.includes("architecture")) setActiveSubject("modern-computer-architecture");
      }
    }

    const handlePopState = () => {
      const currentTab = getTabFromLocation();
      setActiveTab(currentTab);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [getTabFromLocation]);

  // Update tab and URL without reloading the page or losing state
  const handleSelectTab = (tab: DashboardTab, subParam?: string) => {
    setActiveTab(tab);
    if (subParam) {
      setActiveSubject(subParam);
    }
    if (typeof window !== "undefined") {
      let targetUrl =
        tab === "dashboard"
          ? "/dashboard"
          : tab === "simulator"
          ? "/dashboard/hiring-simulator"
          : tab === "systemdesign"
          ? "/dashboard/system-design"
          : tab === "projects"
          ? "/dashboard/projects"
          : tab === "ats"
          ? "/dashboard/ats-checker"
          : tab === "interview" || tab === "interviewprep"
          ? "/dashboard/interviewprep"
          : `/dashboard/${tab}`;
      if (tab === "subjects" && subParam) {
        targetUrl = `/dashboard/subjects?subject=${subParam}`;
      }
      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ tab, subParam }, "", targetUrl);
      }
    }
  };

  // Dynamic IST Greeting
  const getISTGreeting = () => {
    try {
      const now = new Date();
      const istFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      });
      const hour = parseInt(istFormatter.format(now), 10);

      if (hour >= 5 && hour < 12) {
        return {
          greeting: "Good morning",
          subtext: "Ready to start your day with focused interview preparation?",
        };
      } else if (hour >= 12 && hour < 17) {
        return {
          greeting: "Good afternoon",
          subtext: "The day gets heavy around now. Good to see you still going.",
        };
      } else {
        return {
          greeting: "Good evening",
          subtext: "Great time for a focused mock interview session and review.",
        };
      }
    } catch {
      return {
        greeting: "Good afternoon",
        subtext: "The day gets heavy around now. Good to see you still going.",
      };
    }
  };

  const { greeting, subtext } = getISTGreeting();
  const displayName = mounted && user?.name ? user.name.toUpperCase() : "HEMAMDHAR NATH";

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex antialiased overflow-x-hidden selection:bg-zinc-800 selection:text-zinc-100">
      <AmbientBackground />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        activeSubject={activeSubject}
        onSelectTab={handleSelectTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Wrapper */}
      <div
        className={`relative z-10 flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[240px]"
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#0e0e12]/90 backdrop-blur-md border-b border-zinc-800">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-white">InterviewAI</span>
          <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-200">
            HN
          </div>
        </div>

        {/* Main Dashboard Content */}
        <main className="flex-1 w-full max-w-6xl p-5 sm:p-7 lg:p-8 space-y-6">
          {/* Active Tab: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* 1. Master Engineering Readiness Status Ribbon */}
              <div className="p-3.5 px-4 rounded-lg bg-[#111115] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-xs text-zinc-300">
                    <strong className="text-white font-semibold mr-1.5 font-mono">
                      TARGET ROLE: SOFTWARE ENGINEER III (L4)
                    </strong>
                    Overall Engineering Readiness at{" "}
                    <strong className="text-emerald-400 font-mono">{overallReadinessIndex}%</strong> (Big-Tech Hiring Bar Calibrated)
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectTab("simulator")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>Role Hiring Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTab("interviewprep")}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors shrink-0 cursor-pointer"
                  >
                    <span>Interview Prep</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 2. Dynamic IST Greeting Header */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {greeting}, {displayName}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                  Unified view of your preparation progress across Mock Interviews, Core CS Textbooks, LeetCode DSA, 3D System Design, and ATS Resume Screening.
                </p>
              </div>

              {/* 3. Recommended Next Actions Hub (Pick Up Where You Left Off) */}
              <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      Pick Up Where You Left Off
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Readiness Score: <strong className="text-white font-bold">{overallReadinessIndex}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Action 1: DSA */}
                  <div
                    onClick={() => handleSelectTab("dsa")}
                    className="p-4 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/30 border border-amber-900/40">
                          DSA Roadmap
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {dsaSolvedCount}/{TOTAL_DSA_PROBLEMS} Solved
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-zinc-100 transition-colors">
                        Two Pointers &amp; Sliding Window
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Optimal O(N) array manipulation, monotonic deque, and subarray frequency counting.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-white">
                      <span>Resume Problem</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Action 2: Core CS */}
                  <div
                    onClick={() => handleSelectTab("subjects", "operating-systems")}
                    className="p-4 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-sky-400 px-1.5 py-0.5 rounded bg-sky-950/30 border border-sky-900/40">
                          Core CS Textbook
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          {csTotalCompleted}/{TOTAL_CS_TOPICS} Topics
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-zinc-100 transition-colors">
                        Operating Systems: Memory &amp; Paging
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Virtual address translation, page faults, TLB cache coherence, and Linux VFS.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-white">
                      <span>Read Module</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Action 3: Interview Prep */}
                  <div
                    onClick={() => handleSelectTab("interviewprep")}
                    className="p-4 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/30 border border-emerald-900/40">
                          Interview Prep
                        </span>
                        <span className="text-xs font-mono text-zinc-400">
                          9 Categories
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-white group-hover:text-zinc-100 transition-colors">
                        High-Frequency Question Bank
                      </h3>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        Curated technical questions, STAR frameworks, model answers, and architectural rubrics.
                      </p>
                    </div>
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-white">
                      <span>Practice Questions</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Unified Platform Progress Section */}
              <div className="space-y-4 pt-1">
                {/* Header with Discipline Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      All Progress Overview
                    </h2>
                    <span className="text-xs text-zinc-500 font-mono">
                      ({dsaSolvedCount + sdCompletedCount + aimlCompletedCount + csTotalCompleted} total milestones completed)
                    </span>
                  </div>

                  {/* Discipline Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-1 p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs self-start sm:self-auto">
                    {[
                      { id: "all", label: "Show All (Unified)" },
                      { id: "interviewprep", label: "Interview Prep" },
                      { id: "subjects", label: "Core CS Textbooks" },
                      { id: "dsa", label: "DSA Roadmap" },
                      { id: "systemdesign", label: "System Design 3D" },
                      { id: "aiml", label: "AI / ML" },
                      { id: "ats", label: "ATS Resume" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProgressFilter(tab.id as any)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                          progressFilter === tab.id
                            ? "bg-zinc-800 text-white shadow-xs font-semibold"
                            : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* View Mode: ALL DISCIPLINES (6 Core Discipline Cards + Comprehensive Milestones Table) */}
                {progressFilter === "all" && (
                  <div className="space-y-5">
                    {/* 6-Card Grid across all 6 Core Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* CARD 1: INTERVIEW PREPARATION */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Interview Prep Questions</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("interviewprep")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Open Bank</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-white font-mono">
                              {mockInterviewCount} <span className="text-xs font-normal text-zinc-500">/ 10 Loops</span>
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800 font-mono">
                              Strong Hire (88%)
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Round 1: Role Resume Probe</span>
                              <span className="text-zinc-200 font-mono font-medium">92%</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Round 2: Tech Fundamentals</span>
                              <span className="text-zinc-200 font-mono font-medium">85%</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Round 3: Live Coding Challenge</span>
                              <span className="text-zinc-200 font-mono font-medium">87%</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>Real-time voice turn-taking</span>
                          <span className="text-emerald-400">Calibrated</span>
                        </div>
                      </div>

                      {/* CARD 2: CORE CS TEXTBOOKS (5 DISCIPLINES) */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                            <span>Core CS Textbooks</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("subjects")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Explore 5 Subjects</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-white font-mono">
                              {csTotalCompleted} <span className="text-xs font-normal text-zinc-500">/ {TOTAL_CS_TOPICS} Topics</span>
                            </span>
                            <span className="text-xs font-mono text-sky-400 font-bold">
                              {csPercentage}% Mastered
                            </span>
                          </div>

                          {/* Master Progress Bar */}
                          <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-sky-400 h-full transition-all duration-300"
                              style={{ width: `${csPercentage}%` }}
                            />
                          </div>

                          <div className="space-y-1.5 text-xs pt-1">
                            {[
                              { label: "Operating Systems", count: csOsCount, total: TOTAL_CS_OS, slug: "operating-systems" },
                              { label: "Computer Networks", count: csCnCount, total: TOTAL_CS_CN, slug: "computer-networks" },
                              { label: "Database Systems (DBMS)", count: csDbmsCount, total: TOTAL_CS_DBMS, slug: "dbms" },
                              { label: "Computer Architecture", count: csArchCount, total: TOTAL_CS_ARCH, slug: "modern-computer-architecture" },
                              { label: "Object-Oriented Programming", count: csOopCount, total: TOTAL_CS_OOP, slug: "oop" },
                            ].map((subj) => {
                              const pct = Math.round((subj.count / subj.total) * 100);
                              return (
                                <button
                                  key={subj.slug}
                                  type="button"
                                  onClick={() => handleSelectTab("subjects", subj.slug)}
                                  className="w-full flex items-center justify-between text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800/50 transition-colors text-left cursor-pointer group"
                                >
                                  <span className="group-hover:text-zinc-200 truncate pr-2">{subj.label}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="w-12 bg-zinc-800 h-1 rounded-full overflow-hidden">
                                      <div
                                        className="bg-sky-400 h-full transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                    <span className="font-mono text-zinc-300 w-10 text-right text-[11px]">
                                      {subj.count}/{subj.total}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>5 Textbooks · 148 Syllabus Topics</span>
                          <span className="text-sky-400">{csTotalCompleted === TOTAL_CS_TOPICS ? "100% Complete" : "Tracking Active"}</span>
                        </div>
                      </div>

                      {/* CARD 3: DSA ROADMAP */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <Code2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>DSA &amp; LeetCode Roadmap</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("dsa")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Roadmap</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-5 flex items-center justify-center">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="36"
                                  fill="none"
                                  stroke="#eab308"
                                  strokeWidth="6"
                                  strokeDasharray="226.19"
                                  strokeDashoffset={dsaDonutOffset}
                                  strokeLinecap="round"
                                  className="transition-all duration-500 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-xl font-extrabold text-white font-mono">{dsaSolvedCount}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">/ {TOTAL_DSA_PROBLEMS}</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-7 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-emerald-500" />
                                <span>Basic (Easy)</span>
                              </span>
                              <span className="font-mono text-zinc-200">{dsaEasySolved}/{TOTAL_DSA_EASY}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
                                <span>Core (Medium)</span>
                              </span>
                              <span className="font-mono text-zinc-200">{dsaMediumSolved}/{TOTAL_DSA_MEDIUM}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-[2px] bg-rose-500" />
                                <span>Pro (Hard)</span>
                              </span>
                              <span className="font-mono text-zinc-200">{dsaHardSolved}/{TOTAL_DSA_HARD}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>14 Algorithmic archetypes</span>
                          <span className="text-amber-400">{dsaPercentage}% Completed</span>
                        </div>
                      </div>

                      {/* CARD 4: SYSTEM DESIGN & 3D SPATIAL TOPOLOGY */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <Workflow className="w-3.5 h-3.5 text-sky-400" />
                            <span>System Design &amp; 3D Topology</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("systemdesign")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Open 3D Canvas</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-5 flex items-center justify-center">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="36"
                                  fill="none"
                                  stroke="#38bdf8"
                                  strokeWidth="6"
                                  strokeDasharray="226.19"
                                  strokeDashoffset={sdDonutOffset}
                                  strokeLinecap="round"
                                  className="transition-all duration-500 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-xl font-extrabold text-white font-mono">{sdCompletedCount}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">/ {TOTAL_SD_TOPICS}</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-7 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Fundamentals A-Z</span>
                              <span className="font-mono text-zinc-200">{sdFundamentalsCompleted}/10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">FAANG Blueprints</span>
                              <span className="font-mono text-zinc-200">{sdPracticeCompleted}/10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">3D Simulator</span>
                              <span className="text-emerald-400 font-mono">Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>Interactive 3D packet simulation</span>
                          <span className="text-sky-400">{sdPercentage}% Mastered</span>
                        </div>
                      </div>

                      {/* CARD 5: AI & MACHINE LEARNING */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <Brain className="w-3.5 h-3.5 text-emerald-400" />
                            <span>AI &amp; Machine Learning</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("aiml")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Explore Tracks</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-5 flex items-center justify-center">
                            <div className="relative w-28 h-28 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="36"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="6"
                                  strokeDasharray="226.19"
                                  strokeDashoffset={aimlDonutOffset}
                                  strokeLinecap="round"
                                  className="transition-all duration-500 ease-out"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-xl font-extrabold text-white font-mono">{aimlCompletedCount}</span>
                                <span className="text-[9px] text-zinc-500 font-mono">/ {TOTAL_AIML_TOPICS}</span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-7 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">ML Foundations</span>
                              <span className="font-mono text-zinc-200">{mlFoundationsCompleted}/10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Deep Learning</span>
                              <span className="font-mono text-zinc-200">{dlCompleted}/10</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-400">Generative AI</span>
                              <span className="font-mono text-zinc-200">{genAiCompleted}/10</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>LLM architectures &amp; Transformers</span>
                          <span className="text-emerald-400">{aimlPercentage}% Progress</span>
                        </div>
                      </div>

                      {/* CARD 6: ATS RESUME SCREENING */}
                      <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                            <FileCheck className="w-3.5 h-3.5 text-rose-400" />
                            <span>ATS Resume Screening</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSelectTab("ats")}
                            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                          >
                            <span>Scan Resume</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-extrabold text-white font-mono">
                              {atsScanCount} <span className="text-xs font-normal text-zinc-500">Scans Analyzed</span>
                            </span>
                            <span className="text-xs font-mono text-rose-400 font-bold">
                              86% ATS Match
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Role Keyword Alignment</span>
                              <span className="text-emerald-400 font-mono">Optimal (90%)</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Formatting &amp; Hierarchy</span>
                              <span className="text-zinc-200 font-mono">100% Parsable</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-400">
                              <span>Quantifiable Impact</span>
                              <span className="text-amber-400 font-mono">Needs Metrics</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                          <span>Targeting Big-Tech Job Descriptions</span>
                          <span className="text-rose-400">Calibrated</span>
                        </div>
                      </div>
                    </div>

                    {/* Master Track & Milestone Progress Table */}
                    <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-zinc-400" />
                          <h3 className="text-sm font-bold text-white tracking-tight">
                            Master Milestones &amp; Track Breakdown
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-zinc-500">
                          9 Active Pathways
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-zinc-800 text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                              <th className="pb-2.5 font-medium">Curriculum / Track</th>
                              <th className="pb-2.5 font-medium">Discipline</th>
                              <th className="pb-2.5 font-medium">Progress Bar</th>
                              <th className="pb-2.5 font-medium text-right">Topics / Problems</th>
                              <th className="pb-2.5 font-medium text-right">Status</th>
                              <th className="pb-2.5 font-medium text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-800/60 font-sans">
                            {[
                              {
                                title: "Operating Systems Textbook",
                                discipline: "Core CS",
                                completed: csOsCount,
                                total: TOTAL_CS_OS,
                                pct: Math.round((csOsCount / TOTAL_CS_OS) * 100),
                                icon: Cpu,
                                tab: "subjects" as DashboardTab,
                                subParam: "operating-systems",
                              },
                              {
                                title: "Computer Networks Textbook",
                                discipline: "Core CS",
                                completed: csCnCount,
                                total: TOTAL_CS_CN,
                                pct: Math.round((csCnCount / TOTAL_CS_CN) * 100),
                                icon: Network,
                                tab: "subjects" as DashboardTab,
                                subParam: "computer-networks",
                              },
                              {
                                title: "Database Systems (DBMS)",
                                discipline: "Core CS",
                                completed: csDbmsCount,
                                total: TOTAL_CS_DBMS,
                                pct: Math.round((csDbmsCount / TOTAL_CS_DBMS) * 100),
                                icon: Database,
                                tab: "subjects" as DashboardTab,
                                subParam: "dbms",
                              },
                              {
                                title: "Modern Computer Architecture",
                                discipline: "Core CS",
                                completed: csArchCount,
                                total: TOTAL_CS_ARCH,
                                pct: Math.round((csArchCount / TOTAL_CS_ARCH) * 100),
                                icon: Layers,
                                tab: "subjects" as DashboardTab,
                                subParam: "modern-computer-architecture",
                              },
                              {
                                title: "Object-Oriented Programming (OOP)",
                                discipline: "Core CS",
                                completed: csOopCount,
                                total: TOTAL_CS_OOP,
                                pct: Math.round((csOopCount / TOTAL_CS_OOP) * 100),
                                icon: Code2,
                                tab: "subjects" as DashboardTab,
                                subParam: "oop",
                              },
                              {
                                title: "DSA & LeetCode Curated Roadmap",
                                discipline: "Algorithms",
                                completed: dsaSolvedCount,
                                total: TOTAL_DSA_PROBLEMS,
                                pct: dsaPercentage,
                                icon: Code2,
                                tab: "dsa" as DashboardTab,
                              },
                              {
                                title: "System Design 3D Spatial Topology",
                                discipline: "Architecture",
                                completed: sdCompletedCount,
                                total: TOTAL_SD_TOPICS,
                                pct: sdPercentage,
                                icon: Workflow,
                                tab: "systemdesign" as DashboardTab,
                              },
                              {
                                title: "AI & Machine Learning Foundations",
                                discipline: "AI / ML",
                                completed: aimlCompletedCount,
                                total: TOTAL_AIML_TOPICS,
                                pct: aimlPercentage,
                                icon: Brain,
                                tab: "aiml" as DashboardTab,
                              },
                              {
                                title: "Technical Interview Question Bank",
                                discipline: "Interview Prep",
                                completed: 9,
                                total: 9,
                                pct: 100,
                                icon: MessageSquare,
                                tab: "interviewprep" as DashboardTab,
                              },
                            ].map((row) => {
                              const Icon = row.icon;
                              const isCompleted = row.completed >= row.total && row.total > 0;
                              return (
                                <tr key={row.title} className="hover:bg-zinc-900/40 transition-colors">
                                  <td className="py-3 font-semibold text-zinc-200">
                                    <div className="flex items-center gap-2">
                                      <Icon className="w-3.5 h-3.5 text-zinc-400" />
                                      <span>{row.title}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 font-mono text-[11px] text-zinc-400">
                                    {row.discipline}
                                  </td>
                                  <td className="py-3 w-44">
                                    <div className="flex items-center gap-2">
                                      <div className="w-28 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-zinc-300 transition-all duration-300"
                                          style={{ width: `${row.pct}%` }}
                                        />
                                      </div>
                                      <span className="font-mono text-[10px] text-zinc-400">{row.pct}%</span>
                                    </div>
                                  </td>
                                  <td className="py-3 font-mono text-right text-zinc-300">
                                    {row.completed} / {row.total}
                                  </td>
                                  <td className="py-3 text-right">
                                    <span
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                        isCompleted
                                          ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                                          : row.completed > 0
                                          ? "bg-zinc-800 text-zinc-300 border-zinc-700"
                                          : "bg-zinc-900 text-zinc-500 border-zinc-800"
                                      }`}
                                    >
                                      {isCompleted ? "Mastered" : row.completed > 0 ? "In Progress" : "Ready"}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectTab(row.tab, row.subParam)}
                                      className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-medium transition-colors cursor-pointer"
                                    >
                                      {row.completed > 0 ? "Continue" : "Launch"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Mode: SINGLE DISCIPLINE FOCUS */}
                {progressFilter !== "all" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Selected Donut / Detail Chart */}
                    <div className="lg:col-span-6 p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl flex flex-col justify-between">
                      {(progressFilter === "interview" || progressFilter === "interviewprep") && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <MessageSquare className="w-4 h-4 text-emerald-400" />
                              <span>Interview Prep Questions</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("interviewprep")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Open Question Bank</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="space-y-4 my-auto py-2">
                            <div className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
                              <div>
                                <span className="text-3xl font-extrabold text-white font-mono">{mockInterviewCount}</span>
                                <span className="text-xs text-zinc-400 font-mono ml-2">/ 10 Target Loops</span>
                              </div>
                              <span className="px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800 text-xs font-mono">
                                Bar Raiser: Strong Hire
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Round 1: Candidate Intro &amp; Role-Targeted Resume</span>
                                <span className="font-mono text-emerald-400 font-bold">92% Average</span>
                              </div>
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Round 2: Technical Fundamentals &amp; Core Concepts</span>
                                <span className="font-mono text-emerald-400 font-bold">85% Average</span>
                              </div>
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Round 3: Live Coding Sandbox &amp; Complexity</span>
                                <span className="font-mono text-emerald-400 font-bold">87% Average</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                            Strict 3-round architecture matching Google, Meta, and Stripe loops.
                          </div>
                        </>
                      )}

                      {progressFilter === "subjects" && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <BookOpen className="w-4 h-4 text-sky-400" />
                              <span>Core CS Subjects Mastery</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("subjects")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Explore All Subjects</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="space-y-4 my-auto py-2">
                            <div className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
                              <div>
                                <span className="text-3xl font-extrabold text-white font-mono">{csTotalCompleted}</span>
                                <span className="text-xs text-zinc-400 font-mono ml-2">/ {TOTAL_CS_TOPICS} Topics Mastered</span>
                              </div>
                              <span className="text-sm font-bold text-sky-400 font-mono">{csPercentage}% Complete</span>
                            </div>

                            <div className="space-y-2 text-xs">
                              {[
                                { label: "Operating Systems", count: csOsCount, total: TOTAL_CS_OS, slug: "operating-systems" },
                                { label: "Computer Networks", count: csCnCount, total: TOTAL_CS_CN, slug: "computer-networks" },
                                { label: "Database Systems (DBMS)", count: csDbmsCount, total: TOTAL_CS_DBMS, slug: "dbms" },
                                { label: "Modern Computer Architecture", count: csArchCount, total: TOTAL_CS_ARCH, slug: "modern-computer-architecture" },
                                { label: "Object-Oriented Programming (OOP)", count: csOopCount, total: TOTAL_CS_OOP, slug: "oop" },
                              ].map((subj) => {
                                const pct = Math.round((subj.count / subj.total) * 100);
                                return (
                                  <div
                                    key={subj.slug}
                                    onClick={() => handleSelectTab("subjects", subj.slug)}
                                    className="p-2.5 rounded-md bg-[#16161c] border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group space-y-1.5"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-semibold text-zinc-200 group-hover:text-white">
                                        {subj.label}
                                      </span>
                                      <span className="font-mono text-zinc-400">
                                        <strong className="text-white">{subj.count}</strong> / {subj.total} Topics ({pct}%)
                                      </span>
                                    </div>
                                    <div className="w-full bg-zinc-850 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className="bg-sky-400 h-full transition-all duration-300"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                            <span>148 Curated Syllabus Topics Across 5 Core Engineering Disciplines</span>
                            <span className="text-sky-400 font-medium">Full Tracking Active</span>
                          </div>
                        </>
                      )}

                      {progressFilter === "dsa" && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <Code2 className="w-4 h-4 text-amber-400" />
                              <span>DSA Progress</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("dsa")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Open DSA Roadmap</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
                            <div className="sm:col-span-6 flex items-center justify-center">
                              <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="36"
                                    fill="none"
                                    stroke="#eab308"
                                    strokeWidth="6"
                                    strokeDasharray="226.19"
                                    strokeDashoffset={dsaDonutOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-500 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{dsaSolvedCount}</span>
                                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5 font-mono">/ {TOTAL_DSA_PROBLEMS}</span>
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-6 space-y-3 pl-2 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-emerald-500" />
                                  <span className="font-medium text-zinc-300">Basic</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{dsaEasySolved}</strong> / {TOTAL_DSA_EASY}
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
                                  <span className="font-medium text-zinc-300">Core</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{dsaMediumSolved}</strong> / {TOTAL_DSA_MEDIUM}
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-rose-500" />
                                  <span className="font-medium text-zinc-300">Pro</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{dsaHardSolved}</strong> / {TOTAL_DSA_HARD}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {progressFilter === "systemdesign" && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <Network className="w-4 h-4 text-sky-400" />
                              <span>System Design Progress</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("systemdesign")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Open 3D Canvas</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
                            <div className="sm:col-span-6 flex items-center justify-center">
                              <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="36"
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="6"
                                    strokeDasharray="226.19"
                                    strokeDashoffset={sdDonutOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-500 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{sdCompletedCount}</span>
                                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5 font-mono">/ {TOTAL_SD_TOPICS}</span>
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-6 space-y-3 pl-2 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-emerald-500" />
                                  <span className="font-medium text-zinc-300">Fundamentals (A-Z)</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{sdFundamentalsCompleted}</strong> / 10
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-sky-500" />
                                  <span className="font-medium text-zinc-300">FAANG Case Studies</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{sdPracticeCompleted}</strong> / 10
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
                                  <span className="font-medium text-zinc-300">3D Spatial Simulator</span>
                                </div>
                                <p className="text-[11px] text-emerald-400 pl-4 font-mono">
                                  Enabled
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {progressFilter === "aiml" && (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <Brain className="w-4 h-4 text-emerald-400" />
                              <span>AI / ML Progress</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("aiml")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Open AI/ML Tracks</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-auto py-2">
                            <div className="sm:col-span-6 flex items-center justify-center">
                              <div className="relative w-36 h-36 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="36" fill="none" stroke="#27272a" strokeWidth="6" />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="36"
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="6"
                                    strokeDasharray="226.19"
                                    strokeDashoffset={aimlDonutOffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-500 ease-out"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                  <span className="text-3xl font-extrabold text-white tracking-tight font-mono">{aimlCompletedCount}</span>
                                  <span className="text-[11px] text-zinc-500 font-medium mt-0.5 font-mono">/ {TOTAL_AIML_TOPICS}</span>
                                </div>
                              </div>
                            </div>

                            <div className="sm:col-span-6 space-y-3 pl-2 text-xs">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-emerald-500" />
                                  <span className="font-medium text-zinc-300">ML Foundations</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{mlFoundationsCompleted}</strong> / 10
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-sky-500" />
                                  <span className="font-medium text-zinc-300">Deep Learning</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{dlCompleted}</strong> / 10
                                </p>
                              </div>
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-[2px] bg-amber-500" />
                                  <span className="font-medium text-zinc-300">Generative AI</span>
                                </div>
                                <p className="text-[11px] text-zinc-500 pl-4 font-mono">
                                  <strong className="text-zinc-200">{genAiCompleted}</strong> / 10
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {progressFilter === "ats" && (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5 font-mono">
                              <FileCheck className="w-4 h-4 text-rose-400" />
                              <span>ATS Resume Health</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleSelectTab("ats")}
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
                            >
                              <span>Open ATS Checker</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          </div>

                          <div className="space-y-4 my-auto py-2">
                            <div className="flex items-baseline justify-between border-b border-zinc-800 pb-3">
                              <div>
                                <span className="text-3xl font-extrabold text-white font-mono">86%</span>
                                <span className="text-xs text-zinc-400 font-mono ml-2">ATS Match Score</span>
                              </div>
                              <span className="px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-800 text-xs font-mono">
                                Highly Competitive
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Role Specific Keyword Coverage</span>
                                <span className="font-mono text-emerald-400">92%</span>
                              </div>
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Formatting &amp; Section Hierarchy</span>
                                <span className="font-mono text-emerald-400">100% Valid</span>
                              </div>
                              <div className="flex items-center justify-between text-zinc-300">
                                <span>Quantifiable Deliverables &amp; Metrics</span>
                                <span className="font-mono text-amber-400">78%</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-zinc-800 text-[11px] font-mono text-zinc-400">
                            Pre-interview ATS screening calibrated against top tech job descriptions.
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Card: Category Breakdown */}
                    <div className="lg:col-span-6 p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-zinc-300">
                          Discipline Quick Switcher
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {dsaSolvedCount + sdCompletedCount + aimlCompletedCount + csTotalCompleted} Total Milestones
                        </span>
                      </div>

                      <div className="space-y-2">
                        {[
                          {
                            name: "Career Roadmaps",
                            solved: `6 Roles Available`,
                            percentage: `W3Schools`,
                            icon: Map,
                            tab: "roadmaps" as DashboardTab,
                          },
                          {
                            name: "Interview Prep Bank",
                            solved: `9/9 domains`,
                            percentage: `100%`,
                            icon: MessageSquare,
                            tab: "interviewprep" as DashboardTab,
                          },
                          {
                            name: "Core CS Subjects",
                            solved: `${csTotalCompleted}/${TOTAL_CS_TOPICS} topics`,
                            percentage: `${csPercentage}%`,
                            icon: BookOpen,
                            tab: "subjects" as DashboardTab,
                          },
                          {
                            name: "DSA Roadmap",
                            solved: `${dsaSolvedCount}/${TOTAL_DSA_PROBLEMS} solved`,
                            percentage: `${dsaPercentage}%`,
                            icon: Code2,
                            tab: "dsa" as DashboardTab,
                          },
                          {
                            name: "System Design 3D",
                            solved: `${sdCompletedCount}/${TOTAL_SD_TOPICS} topics`,
                            percentage: `${sdPercentage}%`,
                            icon: Network,
                            tab: "systemdesign" as DashboardTab,
                          },
                          {
                            name: "AI & ML Curriculum",
                            solved: `${aimlCompletedCount}/${TOTAL_AIML_TOPICS} tracks`,
                            percentage: `${aimlPercentage}%`,
                            icon: Brain,
                            tab: "aiml" as DashboardTab,
                          },
                          {
                            name: "ATS Resume Checker",
                            solved: `${atsScanCount} scans`,
                            percentage: "86%",
                            icon: FileCheck,
                            tab: "ats" as DashboardTab,
                          },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <div
                              key={item.name}
                              onClick={() => handleSelectTab(item.tab)}
                              className="flex items-center justify-between p-2.5 px-3 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-md bg-zinc-800 group-hover:bg-zinc-700/60 border border-zinc-700/60 flex items-center justify-center text-zinc-300 transition-colors">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                    {item.name}
                                  </h4>
                                  <p className="text-[10px] font-mono text-zinc-500">
                                    {item.solved}
                                  </p>
                                </div>
                              </div>

                              <span className="text-xs font-mono font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                {item.percentage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Tab: Role Career Roadmaps */}
          {activeTab === "roadmaps" && (
            <RoleRoadmapsView onBackToDashboard={() => handleSelectTab("dashboard")} />
          )}

          {/* Active Tab: Role-Based Hiring Simulator */}
          {activeTab === "simulator" && (
            <HiringSimulatorView onBackToDashboard={() => handleSelectTab("dashboard")} />
          )}

          {/* Active Tab: Interview Prep (Curated Technical Question Bank) */}
          {(activeTab === "interview" || activeTab === "interviewprep") && (
            <InterviewQuestionsView />
          )}

          {/* Active Tab: ATS Resume Checker */}
          {activeTab === "ats" && (
            <ATSResumeCheckerView
              onNavigateToInterview={(_resume, _role) => {
                handleSelectTab("interviewprep");
              }}
            />
          )}

          {/* Active Tab: DSA */}
          {activeTab === "dsa" && <DSAView />}

          {/* Active Tab: Core CS Subjects */}
          {activeTab === "subjects" && (
            <CoreCSView
              initialSubjectId={activeSubject}
              onSelectSubject={(id) => handleSelectTab("subjects", id)}
            />
          )}

          {/* Active Tab: AI / ML */}
          {activeTab === "aiml" && <AIMLView />}

          {/* Active Tab: System Design */}
          {activeTab === "systemdesign" && <SystemDesignView />}

          {/* Active Tab: Projects */}
          {activeTab === "projects" && (
            <ProjectsView
              onLaunchInterviewForProject={(project) => {
                try {
                  const raw = localStorage.getItem("candidate_profile_data");
                  const existing = raw ? JSON.parse(raw) : {};
                  existing.targetRole = project.title;
                  existing.targetSeniority = project.targetSeniority;
                  existing.techStack = project.techStack;
                  existing.resumeSummary = `Target Project: ${project.title}\nDomain: ${project.domainLabel}\nScope: ${project.elevatorPitch}\nTech Stack: ${project.techStack.join(", ")}\nMetrics: ${project.metrics.map((m: { label: string; value: string }) => `${m.label}: ${m.value}`).join("; ")}\n\nSTAR Story:\n- Situation: ${project.starStory.situation}\n- Task: ${project.starStory.task}\n- Action: ${project.starStory.action}\n- Result: ${project.starStory.result}`;
                  localStorage.setItem("candidate_profile_data", JSON.stringify(existing));
                  window.dispatchEvent(new Event("candidate_profile_updated"));
                } catch {
                  // Fallback
                }
                handleSelectTab("interviewprep");
              }}
            />
          )}

          {/* Active Tab: CodeSpace */}
          {activeTab === "codespace" && <CodeSpaceView />}

          {/* Active Tab: Notes */}
          {activeTab === "notes" && <NotesView />}

          {/* Active Tab: Settings */}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
