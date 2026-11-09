import React from "react";
import Link from "next/link";
import { AmbientBackground } from "@/components/background/AmbientBackground";
import { Navbar } from "@/components/navbar/Navbar";
import { HeroSection } from "@/components/hero/HeroSection";
import { Footer } from "@/components/footer/Footer";
import { Card3DTilt } from "@/components/ui/Card3DTilt";
import {
  Code,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Network,
  Database,
  Braces,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileText,
  User,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between overflow-x-hidden selection:bg-zinc-800 selection:text-zinc-100">
      <AmbientBackground />
      <Navbar />

      <main className="relative z-10 flex-1 flex flex-col">
        {/* Main Hero Section with Multi-View Terminal Preview */}
        <HeroSection />

        {/* SECTION 1: CORE CS SUBJECTS CURRICULUM */}
        <section
          id="subjects"
          className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>ACADEMIC FOUNDATIONS &bull; 5 CORE CURRICULA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Core Computer Science Textbooks
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Module-based syllabi with architecture diagrams, memory layouts, Linux kernel tracing, and interview drill-downs for every foundational discipline.
              </p>
            </div>

            <Link
              href="/subjects"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors shrink-0 self-start md:self-auto cursor-pointer"
            >
              <span>View All 5 Subjects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Subject 1: Operating Systems */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/subjects/operating-systems"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-3 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">6 Modules &bull; 38 Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Operating Systems
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Processes and threads, CPU scheduling algorithms, virtual memory paging, synchronization primitives, and Linux VFS file systems.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors" style={{ transform: "translateZ(15px)" }}>
                  <span>Explore syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Card3DTilt>

            {/* Subject 2: Modern Computer Architecture */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/subjects/modern-computer-architecture"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-3 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Layers className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">5 Modules &bull; 27 Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Modern Computer Architecture
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Instruction pipelines, multi-level cache hierarchies (L1/L2/L3), branch prediction, out-of-order execution, and MESI cache coherency.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors" style={{ transform: "translateZ(15px)" }}>
                  <span>Explore syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Card3DTilt>

            {/* Subject 3: OOP */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/subjects/oop"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-3 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Braces className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">5 Modules &bull; 28 Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Object-Oriented Programming
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    SOLID design principles, design patterns (Creational, Structural, Behavioral), vtable dispatch, and memory management models.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors" style={{ transform: "translateZ(15px)" }}>
                  <span>Explore syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Card3DTilt>

            {/* Subject 4: DBMS */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/subjects/dbms"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-3 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">6 Modules &bull; 32 Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Database Management Systems
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Relational algebra, B+ Trees, ACID transactions, WAL recovery, concurrency control (2PL, MVCC), and distributed partitioning.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors" style={{ transform: "translateZ(15px)" }}>
                  <span>Explore syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Card3DTilt>

            {/* Subject 5: Computer Networks */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/subjects/computer-networks"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-3 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                    <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                      <Network className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">6 Modules &bull; 34 Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Computer Networks
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    TCP/IP protocol internals, TCP flow control, HTTP/2 vs HTTP/3 QUIC, TLS 1.3 cryptographic handshakes, and DNS routing.
                  </p>
                </div>
                <div className="pt-3 border-t border-zinc-850 flex items-center justify-between text-xs font-medium text-zinc-400 group-hover:text-white transition-colors" style={{ transform: "translateZ(15px)" }}>
                  <span>Explore syllabus</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </Card3DTilt>

            {/* Subject Overview Card */}
            <Card3DTilt maxTilt={6} scale={1.015} className="h-full rounded-lg">
              <div className="p-5 rounded-lg border border-zinc-800/80 bg-zinc-900/30 flex flex-col justify-between space-y-4 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400" style={{ transform: "translateZ(20px)" }}>
                    Comprehensive Learning
                  </span>
                  <h3 className="text-base font-bold text-white" style={{ transform: "translateZ(25px)" }}>
                    Built for Engineering Depth
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Every topic contains key architectural diagrams, real-world industry case studies, and exact questions asked in senior technical screens.
                  </p>
                </div>
                <Link
                  href="/subjects"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-md bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-semibold transition-colors shadow-xs"
                  style={{ transform: "translateZ(20px)" }}
                >
                  <span>Browse Full Curriculum</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card3DTilt>
          </div>
        </section>

        {/* SECTION 2: 440+ QUESTION BANK */}
        <section
          id="questions"
          className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>INTERVIEW PRACTICE &bull; 9 DOMAINS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                440+ Curated Interview Questions
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Practice high-frequency questions with structured model answers, candidate STAR frameworks, interviewer evaluation signals, and dual study modes.
              </p>
            </div>

            <Link
              href="/dashboard/interviewprep"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-200 transition-colors shrink-0 self-start md:self-auto cursor-pointer"
            >
              <span>Open Question Bank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 9 Category Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <User className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">36 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Behavioral
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Ownership, teamwork, leadership, setbacks, and answers grounded in real experience.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-850" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Cpu className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">60 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Operating Systems
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Processes, scheduling, synchronization, memory, file systems, and practical scenarios.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Network className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">60 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    Computer Networks
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Web protocols, TCP/IP, routing, addressing, security, and troubleshooting.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Layers className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">60 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    OOP
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Objects, inheritance, polymorphism, SOLID principles, and practical design decisions.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Database className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">60 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    DBMS
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    SQL, normalization, transactions, indexing, concurrency, and database decisions.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Code className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">39 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    HTML
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Document structure, semantics, forms, accessibility, and browser behavior.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Sparkles className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">31 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    CSS
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Layout, responsive design, selectors, the cascade, and rendering engine pipelines.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Braces className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">41 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    JavaScript
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Language fundamentals, the runtime, event loop, asynchronous code, and the DOM.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>

            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <Link
                href="/dashboard/interviewprep"
                className="group p-5 rounded-lg border border-zinc-800 bg-[#111115] hover:border-zinc-700 hover:bg-[#141419] transition-all space-y-2.5 flex flex-col justify-between h-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2" style={{ transform: "translateZ(25px)" }}>
                    <Code className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                    <span className="text-xs font-mono text-zinc-500">56 questions</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-zinc-100 transition-colors" style={{ transform: "translateZ(20px)" }}>
                    React
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                    Components, hooks, state, reconciliation, server components, and architecture.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 group-hover:text-white transition-colors pt-2 border-t border-zinc-855" style={{ transform: "translateZ(15px)" }}>
                  <span>Start practicing</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </Card3DTilt>
          </div>

          {/* Study Modes Callout */}
          <div className="mt-8 p-6 rounded-lg border border-zinc-800 bg-[#111115] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Dual Interactive Modes
              </span>
              <h4 className="text-sm font-bold text-white">
                Learn Mode for Rapid Study &bull; Practice Mode for Blind Recall
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In Learn Mode, expand all model answers and interviewer evaluation signals at once. In Practice Mode, answers remain concealed until you formulate your response and click Reveal Answer.
              </p>
            </div>
            <Link
              href="/dashboard/interviewprep"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition-colors shrink-0"
            >
              <span>Explore Practice Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* SECTION 3: CALIBRATED 3-PHASE MOCK ENGINE */}
        <section
          id="mock-engine"
          className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full"
        >
          <div className="space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SIMULATION ENGINE &bull; 3-PHASE INTERVIEW LOOP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Calibrated 3-Phase Mock Interview Sessions
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Simulate full company hiring loops with personalized resume deep-dives, architectural system trade-offs, and live browser coding sandboxes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Phase 1 */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-6 rounded-lg border border-zinc-800 bg-[#111115] space-y-4 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                  <span className="text-xs font-mono text-zinc-400">PHASE 01</span>
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ transform: "translateZ(20px)" }}>
                  Resume &amp; Experience Deep-Dive
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  The AI interlocutor analyzes your resume or target JD, grilling you on past architecture decisions, production rollbacks, and quantifiable technical impact.
                </p>
                <div className="pt-3 border-t border-zinc-850 text-[11px] font-mono text-zinc-500" style={{ transform: "translateZ(15px)" }}>
                  STAR framework verification &bull; Probing questions
                </div>
              </div>
            </Card3DTilt>

            {/* Phase 2 */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-6 rounded-lg border border-zinc-800 bg-[#111115] space-y-4 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                  <span className="text-xs font-mono text-zinc-400">PHASE 02</span>
                  <Cpu className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ transform: "translateZ(20px)" }}>
                  System Architecture &amp; Scale
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Defend architectural trade-offs: distributed cache invalidation, write-ahead logging, message queue backpressure, and shard rebalancing under load.
                </p>
                <div className="pt-3 border-t border-zinc-850 text-[11px] font-mono text-zinc-500" style={{ transform: "translateZ(15px)" }}>
                  CAP theorem &bull; Bottlenecks &bull; Blast radiuses
                </div>
              </div>
            </Card3DTilt>

            {/* Phase 3 */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-6 rounded-lg border border-zinc-800 bg-[#111115] space-y-4 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="flex items-center justify-between" style={{ transform: "translateZ(25px)" }}>
                  <span className="text-xs font-mono text-zinc-400">PHASE 03</span>
                  <Terminal className="w-4 h-4 text-zinc-400" />
                </div>
                <h3 className="text-base font-bold text-white" style={{ transform: "translateZ(20px)" }}>
                  Live Coding Sandbox
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Write clean code in an isolated browser sandbox. Run test suites, catch boundary edge cases, and justify time/space complexities under interactive voice dialogue.
                </p>
                <div className="pt-3 border-t border-zinc-850 text-[11px] font-mono text-zinc-500" style={{ transform: "translateZ(15px)" }}>
                  Multi-language runtime &bull; Automated test cases
                </div>
              </div>
            </Card3DTilt>
          </div>
        </section>

        {/* SECTION 4: FULL PREPARATION SUITE (DSA, SYSTEM DESIGN, AI/ML, PROJECTS) */}
        <section
          id="capabilities"
          className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full"
        >
          <div className="space-y-3 mb-12">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Complete Preparation Suite
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Engineered for High-Scale Roles
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Beyond question banks and mock sessions: access specialized modules for algorithmic mastery, system architecture, and AI engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Capability 1: DSA & LeetCode Sync */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-5 rounded-lg border border-zinc-800 bg-[#111115] space-y-3 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300" style={{ transform: "translateZ(25px)" }}>
                  <Code className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white" style={{ transform: "translateZ(20px)" }}>
                  DSA &amp; LeetCode Sync
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Connect your LeetCode handle via GraphQL. Track solved distributions across 14 algorithmic archetypes and practice in-browser.
                </p>
              </div>
            </Card3DTilt>

            {/* Capability 2: System Design Blueprints */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-5 rounded-lg border border-zinc-800 bg-[#111115] space-y-3 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300" style={{ transform: "translateZ(25px)" }}>
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white" style={{ transform: "translateZ(20px)" }}>
                  System Design Blueprints
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Interactive architecture guides, latency numbers every engineer should know, caching strategies, and distributed database sharding.
                </p>
              </div>
            </Card3DTilt>

            {/* Capability 3: AI / ML Track */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-5 rounded-lg border border-zinc-800 bg-[#111115] space-y-3 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300" style={{ transform: "translateZ(25px)" }}>
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white" style={{ transform: "translateZ(20px)" }}>
                  AI &amp; ML Engineering
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Transformer attention math, fine-tuning methodologies, vector database indexing, and LLM evaluation benchmarks.
                </p>
              </div>
            </Card3DTilt>

            {/* Capability 4: Production Projects Hub */}
            <Card3DTilt maxTilt={8} scale={1.02} className="h-full rounded-lg">
              <div className="p-5 rounded-lg border border-zinc-800 bg-[#111115] space-y-3 h-full" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-300" style={{ transform: "translateZ(25px)" }}>
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-semibold text-white" style={{ transform: "translateZ(20px)" }}>
                  Production Projects Hub
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed" style={{ transform: "translateZ(10px)" }}>
                  Full-stack and distributed backend architectures with STAR talking points, quantified metrics, and instant mock interview launches.
                </p>
              </div>
            </Card3DTilt>
          </div>
        </section>

        {/* SECTION 5: SECURITY & CANDIDATE PRIVACY */}
        <section
          id="security"
          className="py-16 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full"
        >
          <div className="p-6 sm:p-8 rounded-lg border border-zinc-800 bg-[#111115] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>PRIVATE BY DESIGN &bull; AES-256 ENCRYPTED</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                Your Code, Audio, and Transcripts Stay Yours
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All interview sessions, voice recordings, and code solutions are encrypted. We never train public AI models on your private interview data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/privacy"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors cursor-pointer"
              >
                <span>Read Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors cursor-pointer"
              >
                <span>Read Terms</span>
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: FINAL CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-zinc-800/80 max-w-6xl mx-auto w-full text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready for Calibrated Interview Preparation?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Start with foundational computer science curricula, drill 440+ curated questions, or launch a realistic 3-phase technical mock interview.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
              >
                <span>Start Practice Session</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/subjects"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-sm font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>Explore Core Subjects</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
