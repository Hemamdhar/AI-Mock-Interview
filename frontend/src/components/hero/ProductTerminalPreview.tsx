"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Architecture3DView } from "@/components/systemdesign/Architecture3DView";
import { Card3DTilt } from "@/components/ui/Card3DTilt";
import {
  Terminal,
  Code2,
  CheckCircle2,
  Volume2,
  Play,
  HelpCircle,
  Cpu,
  ArrowRight,
  Eye,
  EyeOff,
  Workflow,
} from "lucide-react";

const PREVIEW_NODES = [
  { id: "p-client", type: "client" as const, label: "Client Apps", techName: "Web & Mobile", x: 80, y: 160 },
  { id: "p-cdn", type: "cdn" as const, label: "Edge CDN", techName: "Cloudflare Anycast", x: 230, y: 160 },
  { id: "p-lb", type: "loadbalancer" as const, label: "Layer 7 LB", techName: "AWS ALB", x: 380, y: 160 },
  { id: "p-svc", type: "service" as const, label: "Routing Service", techName: "Go Cluster", x: 530, y: 120 },
  { id: "p-cache", type: "cache" as const, label: "Hot Cache", techName: "Redis Cluster", x: 690, y: 100 },
  { id: "p-db", type: "sqldb" as const, label: "Primary Database", techName: "PostgreSQL Master", x: 690, y: 220 },
];

const PREVIEW_EDGES = [
  { id: "pe-1", from: "p-client", to: "p-cdn", protocol: "HTTP/REST" as const },
  { id: "pe-2", from: "p-cdn", to: "p-lb", protocol: "HTTP/REST" as const },
  { id: "pe-3", from: "p-lb", to: "p-svc", protocol: "gRPC" as const },
  { id: "pe-4", from: "p-svc", to: "p-cache", protocol: "TCP/SQL" as const },
  { id: "pe-5", from: "p-svc", to: "p-db", protocol: "TCP/SQL" as const },
];

export function ProductTerminalPreview() {
  const [activeMode, setActiveMode] = useState<"mock" | "subjects" | "questions" | "dsa" | "topology">("mock");
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [revealedQuestion, setRevealedQuestion] = useState(false);
  const [isTrafficSimulating, setIsTrafficSimulating] = useState(true);
  const [selected3dNode, setSelected3dNode] = useState<string | null>(null);

  const handleRunTests = () => {
    setIsRunning(true);
    setTestOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setTestOutput(
        "[PASS] Test 1: Token replenishment under burst traffic (1.2ms)\n[PASS] Test 2: Concurrent Redis Lua atomicity verification (2.4ms)\nResult: 2/2 Test Cases Passed (Optimal O(1) Memory, O(1) Time)"
      );
    }, 650);
  };

  return (
    <Card3DTilt
      maxTilt={5}
      perspective={1200}
      scale={1.012}
      className="w-full max-w-4xl mx-auto rounded-lg shadow-2xl"
    >
      <div className="w-full rounded-lg border border-zinc-800 bg-[#0e0e12] shadow-2xl overflow-hidden text-left" style={{ transformStyle: "preserve-3d" }}>
      {/* Top Application Bar & Feature Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-2.5 border-b border-zinc-800 bg-[#121216] select-none gap-2">
        <div className="flex items-center gap-2">
          {/* Window control dots */}
          <div className="flex items-center gap-1.5 mr-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60 text-[11px] font-mono text-zinc-300">
            <Terminal className="w-3 h-3 text-zinc-400" />
            <span>interviewai-runtime</span>
          </div>
        </div>

        {/* Feature Preview Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveMode("mock")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeMode === "mock"
                ? "bg-zinc-800 text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            3-Phase Mock
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("subjects")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeMode === "subjects"
                ? "bg-zinc-800 text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Core CS Subjects
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("questions")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeMode === "questions"
                ? "bg-zinc-800 text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            440+ Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("dsa")}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeMode === "dsa"
                ? "bg-zinc-800 text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            DSA & LeetCode
          </button>
          <button
            type="button"
            onClick={() => setActiveMode("topology")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeMode === "topology"
                ? "bg-zinc-800 text-white shadow-xs font-semibold"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Cpu className="w-3 h-3 text-emerald-400" />
            <span>3D Architecture</span>
          </button>
        </div>
      </div>

      {/* TAB 1: 3-PHASE MOCK ENGINE PREVIEW */}
      {activeMode === "mock" && (
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
          {/* Left Column: Interviewer Prompt & Voice Transcript */}
          <div className="md:col-span-5 p-4 flex flex-col justify-between bg-[#0e0e12] space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/40">
                  System Architecture & Coding
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Voice Active
                </span>
              </div>

              <h3 className="text-xs font-semibold text-zinc-200">
                Distributed Token Bucket Rate Limiter
              </h3>

              {/* Dialogue Box */}
              <div className="p-3 rounded-md bg-zinc-900/90 border border-zinc-800 text-[12px] leading-relaxed text-zinc-300 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase">
                  <Volume2 className="w-3 h-3 text-zinc-400" />
                  <span>Interviewer Voice Probe</span>
                </div>
                <p>
                  &ldquo;How do you ensure atomic counter updates when two distributed worker nodes receive bursts within the same millisecond?&rdquo;
                </p>
              </div>

              {/* Live Rubric Checklist */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  Evaluation Rubric
                </span>
                <div className="space-y-1 text-[11px] text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Redis Lua Script Atomicity</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Sliding Window Asymptotics</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-600 inline-block shrink-0" />
                    <span className="text-zinc-400">Degraded Fallback on Cache Failure</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Target Level: L5 Senior</span>
              <span className="text-zinc-300">Track: Distributed Systems</span>
            </div>
          </div>

          {/* Right Column: Code Editor & Runner */}
          <div className="md:col-span-7 flex flex-col justify-between bg-[#0a0a0d]">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/80 bg-[#0f0f13]">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-300">
                <Code2 className="w-3 h-3 text-zinc-400" />
                <span>rate_limiter.py</span>
              </div>

              <button
                type="button"
                onClick={handleRunTests}
                disabled={isRunning}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 text-zinc-950 hover:bg-white text-[11px] font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{isRunning ? "Running..." : "Run Tests"}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-3.5 font-mono text-[11px] leading-5 text-zinc-300 overflow-x-auto select-text">
              <div>
                <span className="text-zinc-400">import</span> redis
                <br />
                <span className="text-zinc-400">import</span> time
                <br />
                <br />
                <span className="text-blue-400">class</span>{" "}
                <span className="text-amber-200">TokenBucketLimiter</span>:
                <br />
                &nbsp;&nbsp;<span className="text-blue-400">def</span>{" "}
                <span className="text-emerald-400">__init__</span>(self, capacity:{" "}
                <span className="text-zinc-400">int</span>, refill_rate:{" "}
                <span className="text-zinc-400">float</span>):
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;self.capacity = capacity
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;self.refill_rate = refill_rate
                <br />
                <br />
                &nbsp;&nbsp;<span className="text-blue-400">def</span>{" "}
                <span className="text-emerald-400">allow_request</span>(self, client_id:{" "}
                <span className="text-zinc-400">str</span>) -&gt;{" "}
                <span className="text-zinc-400">bool</span>:
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-zinc-500"># Execute atomic Lua script in Redis</span>
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-400">return</span>{" "}
                self.eval_lua(client_id, self.capacity)
              </div>
            </div>

            {/* Test Runner Output Drawer */}
            <div className="p-3 border-t border-zinc-800 bg-[#0c0c10] text-[11px] font-mono">
              {testOutput ? (
                <pre className="whitespace-pre-wrap font-mono leading-relaxed text-[10px] text-emerald-400">
                  {testOutput}
                </pre>
              ) : (
                <div className="flex items-center justify-between text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Isolated Sandbox Ready (Python 3.12, Node 22, Go 1.22)</span>
                  </div>
                  <span className="text-zinc-400">0.0ms</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CORE CS SUBJECTS PREVIEW */}
      {activeMode === "subjects" && (
        <div className="p-5 bg-[#0e0e12] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                <Cpu className="w-3.5 h-3.5 text-zinc-300" />
                <span>Textbook Module Syllabus</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Operating Systems: Virtual Memory & Paging Internals
              </h3>
            </div>
            <Link
              href="/subjects/operating-systems"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors self-start sm:self-auto"
            >
              <span>Read Full Syllabus</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500">MODULE 01</span>
              <h4 className="text-xs font-semibold text-zinc-200">Processes & Threads</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                PCB structures, context switching overhead, kernel vs user space, preemptive scheduling algorithms.
              </p>
            </div>
            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-400">ACTIVE: MODULE 03</span>
              <h4 className="text-xs font-semibold text-white">Virtual Memory & Paging</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Multi-level page tables, TLB hits/misses, inverted page tables, page fault handling, working set models.
              </p>
            </div>
            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[10px] font-mono text-zinc-500">MODULE 05</span>
              <h4 className="text-xs font-semibold text-zinc-200">Storage & File Systems</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Inodes, extent trees, journal logging (WAL), directory indexing, and VFS abstraction layers.
              </p>
            </div>
          </div>

          {/* Architectural Diagram Box */}
          <div className="p-3.5 rounded-md bg-[#0a0a0d] border border-zinc-800 font-mono text-[11px] text-zinc-300 space-y-2">
            <div className="flex items-center justify-between text-zinc-400 text-[10px]">
              <span>HARDWARE TRANSLATION PIPELINE</span>
              <span>TLB Hit Rate: ~99%</span>
            </div>
            <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-850 flex items-center justify-between gap-2 overflow-x-auto text-[10px]">
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 shrink-0">Virtual Address (VPN + Offset)</span>
              <span className="text-zinc-600 shrink-0">&rarr;</span>
              <span className="px-2 py-1 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 shrink-0">TLB Lookup (L1 Cache)</span>
              <span className="text-zinc-600 shrink-0">&rarr;</span>
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 shrink-0">Multi-Level Page Walk</span>
              <span className="text-zinc-600 shrink-0">&rarr;</span>
              <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 shrink-0">Physical RAM Frame</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURATED QUESTION BANK PREVIEW */}
      {activeMode === "questions" && (
        <div className="p-5 bg-[#0e0e12] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                <HelpCircle className="w-3.5 h-3.5 text-zinc-300" />
                <span>Question Bank (440+ Curated Problems)</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Behavioral: &ldquo;Tell me about yourself.&rdquo;
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRevealedQuestion(!revealedQuestion)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors cursor-pointer"
              >
                {revealedQuestion ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{revealedQuestion ? "Hide Model Answer" : "Reveal Model Answer"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-md bg-zinc-900/80 border border-zinc-800 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-zinc-300">
                Track: Introduction and Motivation
              </span>
              <span>ID: BEH-01</span>
            </div>

            <p className="text-sm font-semibold text-white">
              Tell me about yourself and your background in software engineering.
            </p>

            {revealedQuestion ? (
              <div className="pt-2 border-t border-zinc-800 space-y-2 text-zinc-300 animate-fadeIn">
                <div className="text-[11px] font-mono text-emerald-400">STRUCTURED STAR RESPONSE:</div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  &ldquo;I am a full-stack engineer with hands-on experience designing distributed backend systems and responsive web interfaces. At my last role, I led the migration of a legacy billing monolith to event-driven microservices, improving throughput by 42%. Outside work, I contribute to open-source database connectors and study kernel systems.&rdquo;
                </p>
                <div className="p-2.5 rounded bg-[#0a0a0d] border border-zinc-850 text-[11px] text-zinc-400 space-y-1">
                  <div className="text-zinc-300 font-semibold text-[10px] uppercase font-mono">
                    Interviewer Signals Evaluated:
                  </div>
                  <div>• Concise chronological progression (Present &rarr; Past &rarr; Future)</div>
                  <div>• Concrete quantified impact without buzzword stuffing</div>
                  <div>• Explicit connection to the team&apos;s architectural challenges</div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-zinc-500 font-mono">
                Click &ldquo;Reveal Model Answer&rdquo; to review the calibrated STAR answer rubric and interviewer evaluation signals.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DSA & LEETCODE SYNC PREVIEW */}
      {activeMode === "dsa" && (
        <div className="p-5 bg-[#0e0e12] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                <Code2 className="w-3.5 h-3.5 text-zinc-300" />
                <span>LeetCode Sync & Pattern Engine</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Real-Time Problem Tracker & Sandbox
              </h3>
            </div>
            <Link
              href="/dashboard/dsa"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors self-start sm:self-auto"
            >
              <span>Open DSA Engine</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">GraphQL Synced</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">248 Problems</div>
              <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-2">
                <span className="text-emerald-400">82 Easy</span> •{" "}
                <span className="text-amber-400">134 Medium</span> •{" "}
                <span className="text-rose-400">32 Hard</span>
              </div>
            </div>

            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Core Patterns</span>
              <div className="text-lg font-bold text-white font-mono mt-0.5">14 Archetypes</div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Monotonic Stack, Sliding Window, DP, Graphs
              </div>
            </div>

            <div className="p-3 rounded-md bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Sandbox Runner</span>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">Multi-Language</div>
              <div className="text-[10px] text-zinc-400 mt-1">
                Python, TypeScript, C++, Java, Go
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: 3D SPATIAL ARCHITECTURE PREVIEW */}
      {activeMode === "topology" && (
        <div className="p-4 bg-[#0e0e12] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                <Workflow className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-Time 3D WebGL Infrastructure Engine</span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Spatial Distributed System Topology
              </h3>
            </div>
            <Link
              href="/dashboard/system-design"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-medium transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>Launch Full 3D Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-[460px] rounded-lg overflow-hidden border border-zinc-800">
            <Architecture3DView
              nodes={PREVIEW_NODES}
              edges={PREVIEW_EDGES}
              selectedNodeId={selected3dNode}
              onSelectNode={setSelected3dNode}
              isSimulatingTraffic={isTrafficSimulating}
              onToggleTraffic={() => setIsTrafficSimulating(!isTrafficSimulating)}
            />
          </div>
        </div>
      )}
      </div>
    </Card3DTilt>
  );
}
