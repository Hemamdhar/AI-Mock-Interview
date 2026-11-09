"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Bot,
  FileCheck,
  Code2,
  FileText,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronUp,
  FolderCode,
  BookOpen,
  Wrench,
  Sparkles,
  Megaphone,
  Terminal,
  Brain,
  Network,
  FolderGit2,
  Compass,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { PROGRESS_EVENT_NAME } from "@/lib/progress";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export type DashboardTab =
  | "dashboard"
  | "simulator"
  | "interview"
  | "interviewprep"
  | "ats"
  | "dsa"
  | "subjects"
  | "aiml"
  | "systemdesign"
  | "projects"
  | "codespace"
  | "notes"
  | "settings";

interface SidebarProps {
  activeTab: DashboardTab;
  activeSubject?: string;
  onSelectTab: (tab: DashboardTab, subParam?: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  activeSubject,
  onSelectTab,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const [prepExpanded, setPrepExpanded] = useState(true);
  const [exploreExpanded, setExploreExpanded] = useState(true);
  const [mySpacesExpanded, setMySpacesExpanded] = useState(true);
  const [coreCSExpanded, setCoreCSExpanded] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("interviewai_core_cs_expanded");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true;
  });

  const toggleCoreCS = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCoreCSExpanded((prev) => {
      const nextVal = !prev;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("interviewai_core_cs_expanded", String(nextVal));
        } catch {
          // ignore localStorage errors
        }
      }
      return nextVal;
    });
  };

  // Live Core CS Subjects progress tracking
  const [csCounts, setCsCounts] = useState({
    os: 0,
    dbms: 0,
    cn: 0,
    oop: 0,
    arch: 0,
  });

  useEffect(() => {
    const updateCounts = () => {
      try {
        const getCount = (k: string) => {
          const raw = localStorage.getItem(k);
          if (!raw) return 0;
          return Object.values(JSON.parse(raw)).filter(Boolean).length;
        };
        setCsCounts({
          os: getCount("interviewai_os_mastered_topics"),
          dbms: getCount("interviewai_dbms_mastered_topics"),
          cn: getCount("interviewai_cn_mastered_topics"),
          oop: getCount("interviewai_oop_mastered_topics"),
          arch: getCount("interviewai_arch_mastered_topics"),
        });
      } catch {
        // Ignore
      }
    };
    updateCounts();
    window.addEventListener(PROGRESS_EVENT_NAME, updateCounts);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, updateCounts);
  }, []);

  const totalCsCompleted = csCounts.os + csCounts.dbms + csCounts.cn + csCounts.oop + csCounts.arch;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userName = mounted && user?.name ? user.name.toUpperCase() : "HEMAMDHAR NATH";
  const userInitials = mounted && user?.name ? user.name.substring(0, 2).toUpperCase() : "HN";

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-[#0e0e12]/95 backdrop-blur-md border-r border-zinc-800 transition-all duration-300 ease-in-out ${
          collapsed ? "w-[72px]" : "w-[240px]"
        } ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Header / Brand Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-2.5 overflow-hidden group"
          >
            {/* Custom Logo Icon */}
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100 text-zinc-950 font-extrabold text-sm shrink-0">
              <Terminal className="w-4 h-4 text-zinc-950" />
            </div>

            {!collapsed && (
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                Interview<span className="text-zinc-400">AI</span>
              </span>
            )}
          </Link>

          {/* Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 py-3 px-2.5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {/* Section 1: Prep */}
          <div className="space-y-1">
            {!collapsed && (
              <button
                type="button"
                onClick={() => setPrepExpanded(!prepExpanded)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200"
              >
                <span>Prep</span>
                {prepExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
            )}

            {(prepExpanded || collapsed) && (
              <div className="space-y-0.5">
                {/* Dashboard (Active) */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("dashboard");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "Dashboard" : undefined}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0 text-zinc-300" />
                  {!collapsed && <span>Dashboard</span>}
                </button>

                {/* Role-Based Hiring Simulator */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("simulator");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                    activeTab === "simulator"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "Hiring Simulator" : undefined}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Compass className="w-4 h-4 shrink-0 text-emerald-400" />
                    {!collapsed && <span className="truncate">Hiring Simulator</span>}
                  </div>
                  {!collapsed && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
                      Simulator
                    </span>
                  )}
                </button>

                {/* Interview Prep */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("interviewprep");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                    activeTab === "interviewprep" || activeTab === "interview"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "Interview Prep" : undefined}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>Interview Prep</span>}
                </button>

                {/* ATS Resume Checker */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("ats");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer ${
                    activeTab === "ats"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "ATS Resume Checker" : undefined}
                >
                  <FileCheck className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>ATS Resume</span>}
                </button>

                {/* DSA */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("dsa");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "dsa"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "DSA" : undefined}
                >
                  <Code2 className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>DSA</span>}
                </button>

                {/* Core CS Subjects Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={collapsed ? () => { onSelectTab("subjects"); onCloseMobile(); } : toggleCoreCS}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer select-none ${
                      activeTab === "subjects"
                        ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                    }`}
                    title={collapsed ? "Core CS Subjects" : undefined}
                    aria-expanded={coreCSExpanded}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookOpen className="w-4 h-4 shrink-0 text-zinc-400" />
                      {!collapsed && <span className="truncate">Core CS Subjects</span>}
                    </div>
                    {!collapsed && (
                      <div className="flex items-center gap-1.5">
                        {totalCsCompleted > 0 && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/40">
                            {totalCsCompleted}/148
                          </span>
                        )}
                        <span className="text-zinc-400 hover:text-zinc-100 p-0.5 rounded hover:bg-zinc-700/60 transition-colors">
                          {coreCSExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Sub-Items: Hidden when collapsed, revealed when expanded */}
                  {!collapsed && coreCSExpanded && (
                    <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-zinc-800 ml-4 my-1">
                      {[
                        { id: "operating-systems", label: "Operating Systems", count: csCounts.os, total: 31 },
                        { id: "dbms", label: "DBMS", count: csCounts.dbms, total: 32 },
                        { id: "computer-networks", label: "Computer Networks", count: csCounts.cn, total: 35 },
                        { id: "oop", label: "OOP", count: csCounts.oop, total: 23 },
                        { id: "modern-computer-architecture", label: "Computer Architecture", count: csCounts.arch, total: 27 },
                      ].map((sub) => {
                        const isSubActive =
                          activeTab === "subjects" &&
                          (activeSubject === sub.id ||
                            (sub.id === "modern-computer-architecture" &&
                              (activeSubject === "modern-computer-architecture" ||
                                activeSubject === "computer-architecture")) ||
                            (sub.id === "oop" &&
                              (activeSubject === "oop" ||
                                activeSubject === "oops" ||
                                activeSubject === "object-oriented-programming")) ||
                            (sub.id === "dbms" &&
                              (activeSubject === "dbms" ||
                                activeSubject === "database" ||
                                activeSubject === "database-management-systems")) ||
                            (sub.id === "computer-networks" &&
                              (activeSubject === "computer-networks" ||
                                activeSubject === "cn" ||
                                activeSubject === "networks")) ||
                            (!activeSubject && sub.id === "operating-systems"));

                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTab("subjects", sub.id);
                              onCloseMobile();
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                              isSubActive
                                ? "bg-zinc-800/90 text-white border border-zinc-750 font-semibold"
                                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60"
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0 pl-1">
                              <span
                                className={`text-[10px] font-mono ${
                                  sub.count > 0 ? "text-emerald-400 font-medium" : "text-zinc-500"
                                }`}
                              >
                                {sub.count}/{sub.total}
                              </span>
                              {isSubActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* AI / ML */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("aiml");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "aiml"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "AI / ML" : undefined}
                >
                  <Brain className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>AI / ML</span>}
                </button>

                {/* System Design */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("systemdesign");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "systemdesign"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "System Design" : undefined}
                >
                  <Network className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>System Design</span>}
                </button>

                {/* Projects */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("projects");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "projects"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "Projects" : undefined}
                >
                  <FolderGit2 className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>Projects</span>}
                </button>

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("settings");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-medium text-xs transition-colors ${
                    activeTab === "settings"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "Settings" : undefined}
                >
                  <Settings className="w-4 h-4 shrink-0 text-zinc-400" />
                  {!collapsed && <span>Settings</span>}
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Explore */}
          {!collapsed && (
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => setExploreExpanded(!exploreExpanded)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200"
              >
                <span>Explore</span>
                {exploreExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>

              {exploreExpanded && (
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => onSelectTab("notes")}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors"
                  >
                    <BookOpen className="w-4 h-4 text-zinc-500" />
                    <span>Blogs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Unlock all advanced FAANG mock interview sets.")}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-zinc-400" />
                      <span>Unlock Plus</span>
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => alert("Developer tools & code sandbox")}
                    className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 transition-colors"
                  >
                    <span className="flex items-center gap-2.5">
                      <Wrench className="w-4 h-4 text-zinc-500" />
                      <span>Dev Tools</span>
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-500" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section 3: My Spaces */}
          <div className="space-y-1 pt-1">
            {!collapsed && (
              <button
                type="button"
                onClick={() => setMySpacesExpanded(!mySpacesExpanded)}
                className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider hover:text-zinc-200"
              >
                <span>My Spaces</span>
                {mySpacesExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                )}
              </button>
            )}

            {(mySpacesExpanded || collapsed) && (
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("notes");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                    activeTab === "notes"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "NoteSpace" : undefined}
                >
                  <FileText className={`w-4 h-4 shrink-0 ${activeTab === "notes" ? "text-white" : "text-zinc-500"}`} />
                  {!collapsed && <span>NoteSpace</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTab("codespace");
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs transition-colors ${
                    activeTab === "codespace"
                      ? "bg-zinc-800 text-white border border-zinc-700/60 shadow-xs font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850"
                  }`}
                  title={collapsed ? "CodeSpace" : undefined}
                >
                  <FolderCode className={`w-4 h-4 shrink-0 ${activeTab === "codespace" ? "text-white" : "text-zinc-500"}`} />
                  {!collapsed && <span>CodeSpace</span>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Notification card + Theme Toggle + User Profile */}
        <div className="p-2.5 border-t border-zinc-800 space-y-2">
          {/* Global Theme Toggle */}
          <ThemeToggle showLabel={!collapsed} className="w-full justify-center" />

          {/* Notification Card */}
          {!collapsed && (
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
                <Megaphone className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold text-zinc-200 text-[10px]">2 unread</span>
              </div>
              <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">
                A2Z Sheet problem count and external links issues have... • 4d
              </p>
              <div className="mt-1.5 text-right">
                <span className="text-[10px] text-zinc-500 hover:text-zinc-300 cursor-pointer">
                  Notifications
                </span>
              </div>
            </div>
          )}

          {/* User Profile Bar */}
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } p-1.5 rounded-lg bg-zinc-900 border border-zinc-800`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {/* Initials Square */}
              <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-[11px] text-zinc-200 shrink-0">
                {userInitials}
              </div>

              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-white truncate">
                    {userName}
                  </span>
                  <span className="text-[9px] text-zinc-500">Free Tier</span>
                </div>
              )}
            </div>

            {!collapsed && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => alert("Upgrade to Plus modal")}
                  className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-medium text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  + Upgrade
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
