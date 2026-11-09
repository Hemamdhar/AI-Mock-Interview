"use client";

import React, { useState } from "react";
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  UploadCloud,
  Terminal,
  Bot,
  Search,
  Sparkles,
  TrendingUp,
  RotateCcw,
  BookOpen,
} from "lucide-react";

interface AtsEvaluationResult {
  atsScore: number;
  verdict: string;
  scoreBreakdown: {
    keywordMatch: {
      score: number;
      max: number;
      matched: string[];
      missing: string[];
    };
    formatting: {
      score: number;
      max: number;
      strengths: string[];
      issues: string[];
    };
    experienceImpact: {
      score: number;
      max: number;
      metricsFound: number;
      actionVerbsCount?: number;
      feedback: string;
    };
    sectionCompleteness: {
      score: number;
      max: number;
      sections: { name: string; found: boolean }[];
    };
    relevance: {
      score: number;
      max: number;
      summary: string;
    };
  };
  strengths: string[];
  criticalGaps: string[];
  optimizedBullets: Array<{
    original: string;
    optimized: string;
    rationale: string;
  }>;
  roleFitSummary: string;
}

const SAMPLE_RESUMES = [
  {
    role: "Full-Stack & Cloud Intern",
    targetRole: "Full Stack Developer",
    text: `Alex Rivera | alex.rivera@example.com | github.com/alexrivera | linkedin.com/in/alexrivera
Full-Stack Software Engineer & CS Senior

EXPERIENCE:
• Backend Engineering Intern @ CloudScale Tech (May - Aug): Built low-latency microservices with Node.js and Redis, reducing p99 API response times by 32%. Implemented automated database migration scripts for PostgreSQL.
• Open-Source Fellow @ DevGuild: Contributed 15+ merged PRs to React dev-tools and documentation.

PROJECTS:
1. Distributed Cache & Rate Limiter: Built a high-throughput sliding window rate limiter in Go with Redis and gRPC handling 50k RPS.
2. Real-Time Collaborative Canvas: Created a WebSocket-based interactive canvas with operational transformation and CRDTs in TypeScript/React.
3. AI Mock Interview Evaluator: Fine-tuned LLM scoring models with vector embeddings and rubric generation.

TECHNICAL SKILLS: TypeScript, JavaScript, Python, Go, React, Next.js, Node.js, PostgreSQL, Redis, Docker, AWS, Git.
EDUCATION: B.S. in Computer Science, 3.8 GPA.`,
  },
  {
    role: "Backend & Systems Specialist",
    targetRole: "Backend Engineer",
    text: `Jordan Chen | jordan.chen@example.com | github.com/jordanchen | linkedin.com/in/jordanchen
Systems & Distributed Backend Engineer

EXPERIENCE:
• Software Engineering Intern @ DataStream Inc: Developed Kafka event streaming pipelines processing 10M daily events with zero data loss. Implemented distributed dead-letter retry queues.
• Research Assistant @ University Systems Lab: Researched lock-free concurrent data structures in C++ and Rust.

PROJECTS:
1. Raft Consensus KV-Store: Implemented Raft consensus protocol in C++ with leader election, log replication, and snapshotting.
2. High-QPS URL Shortener: Distributed URL service using Bloom filters, Base62 encoding, and Redis Cluster.
3. Async Task Queue Engine: Priority job queue in Python/FastAPI with worker heartbeat recovery.

TECHNICAL SKILLS: C++, Rust, Python, Go, Kafka, PostgreSQL, Redis, Kubernetes, Linux, gRPC, Docker, Git.
EDUCATION: B.Tech in Computer Engineering, Graduating 2025.`,
  },
  {
    role: "Frontend & UI Architect",
    targetRole: "Frontend Engineer",
    text: `Maya Patel | maya.patel@example.com | github.com/mayapatel | linkedin.com/in/mayapatel
Frontend & Product Engineer

EXPERIENCE:
• Frontend Engineering Intern @ Fintech Flow: Refactored core payment checkout wizard in React 19 and Next.js, boosting conversion rate by 18% and achieving 98+ Lighthouse Web Vitals.
• UI/UX Developer @ Campus Portal: Led the redesign of mobile-first student portal serving 25k daily active users.

PROJECTS:
1. Virtualized Grid Component: High-performance React windowing grid rendering 100k+ rows with smooth 60fps scrolling.
2. Design System & Component Library: Accessible Tailwind/Radix UI system with automated Jest/Playwright visual regression tests.
3. Live Crypto Dashboard: Real-time price tracking dashboard with WebSockets and Chart.js animations.

TECHNICAL SKILLS: React, TypeScript, Next.js, Tailwind CSS, GraphQL, Web Vitals, Jest, HTML5, CSS3, Vite, Git.
EDUCATION: B.S. in Software Engineering.`,
  },
];

const PRESET_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Developer",
  "Software Development Engineer (SDE-1)",
  "DevOps / Cloud Engineer",
  "AI / ML Engineer",
];

interface ATSResumeCheckerViewProps {
  onNavigateToInterview?: (resumeText: string, targetRole: string) => void;
}

export const ATSResumeCheckerView: React.FC<ATSResumeCheckerViewProps> = ({
  onNavigateToInterview,
}) => {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUMES[0].text);
  const [targetRole, setTargetRole] = useState(PRESET_ROLES[2]);
  const [jobDescription, setJobDescription] = useState("");
  const [showJdInput, setShowJdInput] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [result, setResult] = useState<AtsEvaluationResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "bullets" | "formatting">("overview");

  // Run ATS Audit
  const handleRunAudit = async () => {
    if (!resumeText.trim()) return;
    setIsScanning(true);
    try {
      const res = await fetch("/api/ats/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          targetRole,
          jobDescription,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error("ATS audit failed:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Enhanced File Upload Handler (PDF, TXT, MD, DOCX)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadedFileName(file.name);
    setIsParsingFile(true);

    try {
      if (file.name.toLowerCase().endsWith(".txt") || file.name.toLowerCase().endsWith(".md")) {
        const text = await file.text();
        setResumeText(text);
        setResult(null);
      } else {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/ats/parse-resume", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.text) {
            setResumeText(data.text);
            setResult(null);
          } else {
            setUploadError("Could not extract readable text from document.");
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          setUploadError(errData.error || "Failed to extract text from PDF.");
        }
      }
    } catch (err: any) {
      setUploadError(err?.message || "File upload failed.");
    } finally {
      setIsParsingFile(false);
      // reset file input
      e.target.value = "";
    }
  };

  // Copy Bullet Helper
  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    if (score >= 65) return "text-amber-400 border-amber-500/30 bg-amber-950/20";
    return "text-rose-400 border-rose-500/30 bg-rose-950/20";
  };

  const getScoreStroke = (score: number) => {
    if (score >= 80) return "#34d399";
    if (score >= 65) return "#fbbf24";
    return "#f87171";
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 animate-fadeIn">
      {/* Top Header */}
      <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                Phase 0: Screening Gate
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Production ATS Parser & Keyword Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-zinc-300" />
              <span>ATS Resume Checker & Screening Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
              Audit your resume against production Applicant Tracking Systems (Workday, Greenhouse, Lever).
              Inspect parseability, technical keyword match rate, quantifiable impact metrics, and STAR bullet strength.
            </p>
          </div>

          {result && onNavigateToInterview && (
            <button
              type="button"
              onClick={() => onNavigateToInterview(resumeText, targetRole)}
              className="px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <Bot className="w-4 h-4" />
              <span>Launch Mock Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration & Resume Text Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-4">
            {/* Target Role Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Target Engineering Role</span>
                <span className="text-[11px] font-mono text-zinc-500">6 Specialized Presets</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      setResult(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium text-left truncate transition-colors cursor-pointer border ${
                      targetRole === role
                        ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                        : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Resume Input Area */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Candidate Resume / CV Plaintext</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-medium text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 cursor-pointer transition-colors flex items-center gap-1">
                    <UploadCloud className="w-3 h-3" />
                    <span>{isParsingFile ? "Extracting..." : "Upload File (PDF/TXT)"}</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md"
                      disabled={isParsingFile}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <span className="text-[10px] text-zinc-600">or Sample:</span>
                  {SAMPLE_RESUMES.map((sample) => (
                    <button
                      key={sample.role}
                      type="button"
                      onClick={() => {
                        setResumeText(sample.text);
                        setTargetRole(sample.targetRole);
                        setResult(null);
                      }}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
                    >
                      {sample.role.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {uploadedFileName && (
                <div className="flex items-center justify-between px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="flex items-center gap-1.5 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Loaded: {uploadedFileName}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedFileName(null);
                      setResumeText("");
                    }}
                    className="text-zinc-500 hover:text-zinc-300 cursor-pointer ml-2"
                  >
                    Clear
                  </button>
                </div>
              )}

              {uploadError && (
                <div className="flex items-center gap-2 p-2.5 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              <textarea
                rows={12}
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setResult(null);
                }}
                placeholder="Paste raw resume plaintext here or upload .txt / .md / .pdf file. Include your work experience, projects, skills, education, and links..."
                className="w-full bg-[#0a0a0d] border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-xs text-white placeholder-zinc-600 outline-none transition-all resize-y font-mono leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span>
                  Length: {resumeText.length} characters • {resumeText.split("\n").filter(Boolean).length} lines
                </span>
                <button
                  type="button"
                  onClick={() => setShowJdInput(!showJdInput)}
                  className="text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
                >
                  {showJdInput ? "Hide Custom Job Description" : "+ Add Custom Job Description"}
                </button>
              </div>
            </div>

            {/* Optional Custom Job Description */}
            {showJdInput && (
              <div className="space-y-2 pt-2 border-t border-zinc-850">
                <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                  <span>Custom Job Description (Optional)</span>
                  <span className="text-[11px] font-mono text-zinc-500">Extracts tailored JD keywords</span>
                </label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste specific job requirements, required technologies, and responsibilities to match exact keywords..."
                  className="w-full bg-[#0a0a0d] border border-zinc-800 focus:border-zinc-600 rounded-md p-3 text-xs text-white placeholder-zinc-600 outline-none font-mono"
                />
              </div>
            )}

            {/* Audit Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isScanning || !resumeText.trim()}
                className={`w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isScanning
                    ? "bg-zinc-800 text-zinc-400 cursor-not-allowed"
                    : "bg-white hover:bg-zinc-100 text-zinc-950 shadow-sm"
                }`}
              >
                {isScanning ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                    <span>Parsing Document & Matching Keyword Algorithms...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5 text-zinc-950" />
                    <span>Run ATS Screening Audit</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: ATS Score & Primary Diagnostics */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Overall Score Card */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
                    ATS Match Rating
                  </span>
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${getScoreColor(result.atsScore)}`}>
                    {result.verdict}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  {/* Circular Score Gauge */}
                  <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#27272a"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={getScoreStroke(result.atsScore)}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * result.atsScore) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-bold font-mono text-white block leading-none">
                        {result.atsScore}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">/ 100</span>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white block">
                      Target Role: {targetRole}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      {result.roleFitSummary}
                    </p>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-2 pt-2 border-t border-zinc-850">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider font-mono block">
                    Scoring Breakdown
                  </span>

                  <div className="space-y-1.5 text-xs">
                    {/* Keyword Match (30 pts) */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                        <span>Keyword Match ({result.scoreBreakdown.keywordMatch.matched.length} found)</span>
                        <span className="text-white">
                          {result.scoreBreakdown.keywordMatch.score} / {result.scoreBreakdown.keywordMatch.max} pts
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(result.scoreBreakdown.keywordMatch.score / result.scoreBreakdown.keywordMatch.max) * 100}%` }}
                          className="h-full bg-emerald-400"
                        />
                      </div>
                    </div>

                    {/* Experience Impact (25 pts) */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                        <span>Quantified Impact ({result.scoreBreakdown.experienceImpact.metricsFound} metrics)</span>
                        <span className="text-white">
                          {result.scoreBreakdown.experienceImpact.score} / {result.scoreBreakdown.experienceImpact.max} pts
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(result.scoreBreakdown.experienceImpact.score / result.scoreBreakdown.experienceImpact.max) * 100}%` }}
                          className="h-full bg-sky-400"
                        />
                      </div>
                    </div>

                    {/* Formatting & Parsing (20 pts) */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                        <span>Formatting & Parseability</span>
                        <span className="text-white">
                          {result.scoreBreakdown.formatting.score} / {result.scoreBreakdown.formatting.max} pts
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(result.scoreBreakdown.formatting.score / result.scoreBreakdown.formatting.max) * 100}%` }}
                          className="h-full bg-amber-400"
                        />
                      </div>
                    </div>

                    {/* Section Completeness (15 pts) */}
                    <div>
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                        <span>Section Completeness</span>
                        <span className="text-white">
                          {result.scoreBreakdown.sectionCompleteness.score} / {result.scoreBreakdown.sectionCompleteness.max} pts
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${(result.scoreBreakdown.sectionCompleteness.score / result.scoreBreakdown.sectionCompleteness.max) * 100}%` }}
                          className="h-full bg-indigo-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Critical Gaps Alert Box */}
              {result.criticalGaps.length > 0 && (
                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-2">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Critical ATS Attention Items</span>
                  </span>
                  <ul className="space-y-1 text-xs text-amber-200/80 list-disc list-inside">
                    {result.criticalGaps.map((gap, i) => (
                      <li key={i} className="leading-relaxed">
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Standby Card */
            <div className="p-8 rounded-lg bg-[#111115] border border-zinc-800 text-center space-y-3">
              <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-zinc-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">
                Ready for ATS Screening
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                Paste your resume or choose one of the sample candidates, then click
                &quot;Run ATS Screening Audit&quot; to review your keyword match rate and parseability score.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRunAudit}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
                >
                  Analyze Default Candidate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analysis Tabs (Rendered when Result is ready) */}
      {result && (
        <div className="space-y-4 pt-2">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            {[
              { id: "overview", label: "Audit Overview" },
              { id: "keywords", label: "Keyword Matrix" },
              { id: "bullets", label: "STAR Bullet Optimizer" },
              { id: "formatting", label: "Section & Format Audit" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-zinc-800 text-white border border-zinc-700 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Resume Strengths</span>
                </span>
                <ul className="space-y-2 text-xs text-zinc-300">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Real-World Interview Alignment Guide */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
                  <span>The Real Hiring Funnel</span>
                </span>
                <div className="space-y-2 text-xs text-zinc-400 leading-relaxed font-mono">
                  <div className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-200 block font-semibold">1. ATS Gate (Pre-Screen)</span>
                    <span className="text-zinc-400">Scored above 75%? Resume moves to recruiter inbox. Below 50% gets auto-rejected.</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-200 block font-semibold">2. Round 1: Behavioral & Projects</span>
                    <span className="text-zinc-400">Elevator pitch, background, why software engineering, and project deep dives.</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-200 block font-semibold">3. Round 2: Tech Fundamentals</span>
                    <span className="text-zinc-400">Conceptual drill: JS loops & closures, REST vs gRPC, OOP, SQL transactions.</span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-900/80 border border-zinc-800">
                    <span className="text-zinc-200 block font-semibold">4. Round 3: Live Coding Challenge</span>
                    <span className="text-zinc-400">Interactive DSA problem solving in Monaco editor with automated test assertions.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Keyword Matrix */}
          {activeTab === "keywords" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matched Keywords ({result.scoreBreakdown.keywordMatch.matched.length})</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Found in resume</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.scoreBreakdown.keywordMatch.matched.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Recommended Keywords to Add ({result.scoreBreakdown.keywordMatch.missing.length})</span>
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">Expected for {targetRole}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.scoreBreakdown.keywordMatch.missing.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: STAR Bullet Optimizer */}
          {activeTab === "bullets" && (
            <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    STAR Bullet Point Optimizer
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Transform passive statements into high-impact, quantified accomplishments using the STAR framework.
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {result.optimizedBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-md bg-[#0a0a0d] border border-zinc-800 space-y-2.5"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                        Original Bullet
                      </span>
                      <p className="text-xs text-zinc-400 font-mono line-through opacity-80 mt-0.5">
                        {bullet.original}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>ATS-Optimized Rewrite (STAR Framework)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(bullet.optimized, idx)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIdx === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-emerald-200 mt-1 leading-relaxed bg-emerald-950/20 p-2.5 rounded border border-emerald-900/40">
                        {bullet.optimized}
                      </p>
                    </div>

                    <p className="text-[11px] text-zinc-500 italic">
                      Why this scores higher: {bullet.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Section & Formatting Audit */}
          {activeTab === "formatting" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sections Checklist */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-white block">
                  Standard Section Detection
                </span>
                <div className="space-y-2">
                  {result.scoreBreakdown.sectionCompleteness.sections.map((sec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-zinc-850 text-xs font-mono"
                    >
                      <span className="text-zinc-300">{sec.name}</span>
                      {sec.found ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Detected</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1 text-[11px]">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Missing</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Formatting Notes */}
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
                <span className="text-xs font-semibold text-white block">
                  Parseability & Syntax Audit
                </span>
                <div className="space-y-2 text-xs">
                  {result.scoreBreakdown.formatting.strengths.map((str, i) => (
                    <div key={i} className="flex items-start gap-2 text-zinc-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                  {result.scoreBreakdown.formatting.issues.map((iss, i) => (
                    <div key={i} className="flex items-start gap-2 text-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{iss}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

