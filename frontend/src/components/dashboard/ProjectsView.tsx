"use client";

import React, { useState, useMemo } from "react";
import {
  FolderGit2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Code2,
  ArrowRight,
  X,
  Play,
  RotateCcw,
} from "lucide-react";

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export type ProjectLevel = "All" | "Beginner" | "Intermediate" | "Advanced";

export interface ProjectItem {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  targetSeniority: "L4" | "L5" | "L6";
  domainLabel: string;
  techStack: string[];
  explanation: string;
  elevatorPitch: string;
  coreFeatures: string[];
  metrics?: { label: string; value: string }[];
  starStory: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  githubUrl: string;
  demoUrl: string;
}

const CURATED_PROJECTS: ProjectItem[] = [
  // ===================== BEGINNER LEVEL =====================
  {
    id: "beg-1",
    title: "Interactive Markdown Notes App",
    level: "Beginner",
    targetSeniority: "L4",
    domainLabel: "Frontend & Web Apps",
    techStack: ["JavaScript", "HTML5", "CSS3", "LocalStorage"],
    explanation:
      "A responsive markdown editor and live previewer with local storage persistence, syntax highlighting, and document export.",
    elevatorPitch:
      "Client-side markdown editor providing real-time split-pane rendering, offline persistence, and formatted export options.",
    coreFeatures: [
      "Live split-pane markdown parsing and synchronized HTML preview",
      "Client-side localStorage auto-saving with debounced updates",
      "Dark and light theme toggling using CSS custom properties",
      "Export notes as raw markdown (.md) or rendered HTML",
    ],
    metrics: [
      { label: "Render Latency", value: "< 16ms" },
      { label: "Bundle Size", value: "0 External Deps" },
    ],
    starStory: {
      situation: "Users needed a lightweight, offline-first notes editor without login walls.",
      task: "Develop an accessible markdown editor with instant preview and zero backend dependencies.",
      action: "Built real-time parsing with debounced localStorage sync and CSS-based responsive themes.",
      result: "Delivered sub-16ms typing latency and zero-data-loss client storage.",
    },
    githubUrl: "https://github.com/topics/markdown-editor",
    demoUrl: "https://stackedit.io",
  },
  {
    id: "beg-2",
    title: "Kanban Task Board & Sprint Tracker",
    level: "Beginner",
    targetSeniority: "L4",
    domainLabel: "Frontend & State Management",
    techStack: ["React", "JavaScript", "Tailwind CSS", "HTML5 Drag & Drop"],
    explanation:
      "Interactive drag-and-drop workflow board with customizable columns, priority tags, and column state persistence.",
    elevatorPitch:
      "Agile task organizer utilizing native HTML5 drag-and-drop events and reactive state management for sprint tracking.",
    coreFeatures: [
      "HTML5 native drag-and-drop column-to-column task reordering",
      "Create, edit, tag, and delete task cards with priority badges",
      "State persistence via browser local storage",
      "Instant search filter across task titles and priority labels",
    ],
    metrics: [
      { label: "Interaction Speed", value: "60 FPS Drag" },
      { label: "Data Persistence", value: "LocalStorage" },
    ],
    starStory: {
      situation: "Team members required a clutter-free agile board to track daily sprint deliverables.",
      task: "Implement a smooth drag-and-drop interface with persistent column reordering.",
      action: "Architected state transitions via React reducers and native drag-and-drop handlers.",
      result: "Achieved seamless drag interactions with full offline data retention.",
    },
    githubUrl: "https://github.com/topics/kanban-board",
    demoUrl: "https://trello.com",
  },
  {
    id: "beg-3",
    title: "Weather & Air Quality Dashboard",
    level: "Beginner",
    targetSeniority: "L4",
    domainLabel: "API Integration & Frontend",
    techStack: ["React", "TypeScript", "Tailwind CSS", "OpenWeather API"],
    explanation:
      "Clean meteorological dashboard fetching live weather conditions, 5-day forecasts, and air pollution metrics by city.",
    elevatorPitch:
      "TypeScript weather console consuming asynchronous REST APIs to present atmospheric telemetry and multi-day projections.",
    coreFeatures: [
      "Geolocation auto-detection and global city search with debounce",
      "Dynamic weather metrics (wind speed, humidity, UV index, air quality)",
      "5-day forecast cards with temperature trend visualization",
      "Graceful offline handling and error boundaries for rate limits",
    ],
    metrics: [
      { label: "API Response", value: "< 250ms" },
      { label: "Type Safety", value: "100% Strict TS" },
    ],
    starStory: {
      situation: "Users struggled with cluttered weather websites that fail on slow mobile connections.",
      task: "Build a fast, type-safe meteorological dashboard with resilient error boundaries.",
      action: "Integrated OpenWeather REST endpoints with cached local responses and strict TypeScript schemas.",
      result: "Reduced page load time by 60% compared to typical ad-heavy weather portals.",
    },
    githubUrl: "https://github.com/topics/weather-app",
    demoUrl: "https://weather.com",
  },
  {
    id: "beg-4",
    title: "Developer Portfolio & Tech Blog",
    level: "Beginner",
    targetSeniority: "L4",
    domainLabel: "Static Web & UI Craft",
    techStack: ["HTML5", "CSS3", "JavaScript", "GitHub Pages"],
    explanation:
      "Minimalist, accessible developer portfolio featuring responsive layouts, project showcase cards, and contact form integration.",
    elevatorPitch:
      "Fast, high-accessibility static developer portfolio built with semantic HTML5, CSS Grid, and zero build tool overhead.",
    coreFeatures: [
      "Semantic HTML5 and mobile-first responsive flexbox/grid layout",
      "Custom SVG iconography and smooth-scroll section anchors",
      "Dynamic project filter by technology category",
      "Static contact form with Formspree validation",
    ],
    metrics: [
      { label: "Lighthouse Score", value: "100 Performance" },
      { label: "Accessibility", value: "WCAG AAA" },
    ],
    starStory: {
      situation: "Needed an ultra-fast portfolio to showcase engineering projects to hiring managers.",
      task: "Develop a zero-bloat static site scoring 100 on all Google Lighthouse metrics.",
      action: "Wrote semantic HTML5, pure CSS variables, and native vanilla JavaScript animations.",
      result: "Achieved a 100/100 Lighthouse score and instant sub-100ms first contentful paint.",
    },
    githubUrl: "https://github.com/topics/developer-portfolio",
    demoUrl: "https://brittanychiang.com",
  },
  {
    id: "beg-5",
    title: "Cryptocurrency Price & Trend Tracker",
    level: "Beginner",
    targetSeniority: "L4",
    domainLabel: "Async APIs & Data Viz",
    techStack: ["React", "TypeScript", "Tailwind CSS", "CoinGecko API"],
    explanation:
      "Real-time cryptocurrency tracking web app with live market charts, 24-hour volume changes, and custom watchlists.",
    elevatorPitch:
      "Financial data dashboard rendering live coin pricing, market cap rankings, and historical sparkline graphs.",
    coreFeatures: [
      "Real-time coin price polling with percentage changes and sparkline charts",
      "Persistent user watchlist stored in browser localStorage",
      "Instant search filter across top 100 cryptocurrencies",
      "Currency converter supporting USD, EUR, and GBP conversions",
    ],
    metrics: [
      { label: "Refresh Interval", value: "30s Polling" },
      { label: "Coins Tracked", value: "Top 100" },
    ],
    starStory: {
      situation: "Crypto investors needed quick price checks without downloading heavyweight exchange apps.",
      task: "Create a lightweight web application displaying live market capitalization and percentage trends.",
      action: "Built async polling against CoinGecko with optimistic UI caching and responsive data tables.",
      result: "Enabled instant price tracking with under 300ms initial data hydration.",
    },
    githubUrl: "https://github.com/topics/crypto-tracker",
    demoUrl: "https://coingecko.com",
  },

  // ===================== INTERMEDIATE LEVEL =====================
  {
    id: "int-1",
    title: "DevCommerce: Full-Stack E-Commerce Store",
    level: "Intermediate",
    targetSeniority: "L5",
    domainLabel: "Full Stack & Cloud",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Prisma", "PostgreSQL"],
    explanation:
      "Full-stack developer merchandise storefront with server-side rendered catalogs, persistent shopping cart, and Stripe checkout.",
    elevatorPitch:
      "Production-grade e-commerce application with SSR product catalogs, optimistic cart synchronization, and secure webhook payments.",
    coreFeatures: [
      "Server-rendered product catalog with dynamic filtering and sorting",
      "Optimistic client cart state managed via React Context / Zustand",
      "Stripe Checkout session integration with cryptographic webhook verification",
      "PostgreSQL database integration via Prisma ORM with connection pooling",
    ],
    metrics: [
      { label: "SSR TTFB", value: "< 120ms" },
      { label: "Payment Success", value: "100% Webhook Verified" },
    ],
    starStory: {
      situation: "Traditional e-commerce platforms suffered from sluggish client-side rendering and stale inventory sync.",
      task: "Architect a modern Next.js store with server-side caching and atomic inventory decrements.",
      action: "Configured Incremental Static Regeneration (ISR), Prisma transactions, and Stripe webhook handlers.",
      result: "Reduced page load time to under 120ms and eliminated cart race conditions.",
    },
    githubUrl: "https://github.com/vercel/commerce",
    demoUrl: "https://demo.vercel.store",
  },
  {
    id: "int-2",
    title: "Real-Time Collaborative Code Snippets",
    level: "Intermediate",
    targetSeniority: "L5",
    domainLabel: "Real-Time Systems & WebSockets",
    techStack: ["React", "Node.js", "Express", "Socket.io", "Monaco Editor"],
    explanation:
      "Collaborative developer tool allowing engineers to share, execute, and live-edit code snippets across multiple browser tabs.",
    elevatorPitch:
      "Multiplayer developer workspace synchronizing Monaco Editor keystrokes and terminal output over bidirectional WebSockets.",
    coreFeatures: [
      "Monaco Editor integration with syntax highlighting for 10+ languages",
      "WebSocket real-time synchronized typing and cursor position broadcasting",
      "Forking, starring, and tagging public snippets",
      "REST API backend built with Express and MongoDB with JWT authentication",
    ],
    metrics: [
      { label: "Sync Latency", value: "< 45ms P95" },
      { label: "Concurrent Peers", value: "50 Users/Room" },
    ],
    starStory: {
      situation: "Remote technical interviewers needed to collaborate on code without sharing screen lag.",
      task: "Build a real-time web editor that broadcasts keystrokes and cursors instantly.",
      action: "Implemented Socket.io rooms, operational delta diffing, and Monaco Editor decorations.",
      result: "Delivered sub-45ms multi-user synchronization with zero cursor drift.",
    },
    githubUrl: "https://github.com/topics/code-sharing",
    demoUrl: "https://codeshare.io",
  },
  {
    id: "int-3",
    title: "AI Prompt & Chat Assistant with Streaming",
    level: "Intermediate",
    targetSeniority: "L5",
    domainLabel: "AI & Full Stack",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel AI SDK", "OpenAI"],
    explanation:
      "Clean chat interface featuring streaming AI completions, customizable system prompts, and conversational history.",
    elevatorPitch:
      "Edge-streamed conversational assistant with markdown code highlighting, token estimation, and client-side history storage.",
    coreFeatures: [
      "Edge runtime streaming responses using Server-Sent Events (SSE)",
      "Multi-turn conversation history preserved with IndexedDB",
      "Markdown and code block syntax highlighting with copy buttons",
      "Adjustable system prompt templates and temperature parameters",
    ],
    metrics: [
      { label: "First Token Latency", value: "< 350ms" },
      { label: "Streaming Protocol", value: "SSE Edge" },
    ],
    starStory: {
      situation: "Candidates needed a fast playground to test LLM prompts without waiting for full response timeouts.",
      task: "Implement a streaming chatbot UI with token streaming and local chat persistence.",
      action: "Used Vercel AI SDK on Next.js Edge Routes with Server-Sent Events and IndexedDB storage.",
      result: "Achieved first-token delivery within 350ms and zero server-side chat storage overhead.",
    },
    githubUrl: "https://github.com/vercel/ai-chatbot",
    demoUrl: "https://chat.vercel.ai",
  },
  {
    id: "int-4",
    title: "RESTful Task & Team Management API",
    level: "Intermediate",
    targetSeniority: "L5",
    domainLabel: "Backend & Systems",
    techStack: ["Node.js", "Express", "PostgreSQL", "JWT", "Docker"],
    explanation:
      "Production-ready backend API service with role-based access control, JWT authentication, and automated integration tests.",
    elevatorPitch:
      "Containerized microservice API with cryptographic token authentication, connection pooling, and automated schema migrations.",
    coreFeatures: [
      "JWT authentication with refresh token rotation and bcrypt password hashing",
      "Role-based access control (Admin, Member, Viewer) middleware",
      "PostgreSQL migrations and connection pooling via Knex.js",
      "Comprehensive Swagger / OpenAPI documentation and Docker Compose setup",
    ],
    metrics: [
      { label: "Test Coverage", value: "92% Integration" },
      { label: "RPS Throughput", value: "1,200 req/sec" },
    ],
    starStory: {
      situation: "A microservice team required a standardized authentication and team permission backend.",
      task: "Develop a secure, dockerized REST API with RBAC authorization and automated test suites.",
      action: "Engineered Express middleware with dual-token JWT lifecycle and Jest integration tests.",
      result: "Passed security audits with zero critical vulnerabilities and 92% test coverage.",
    },
    githubUrl: "https://github.com/topics/rest-api-nodejs",
    demoUrl: "https://httpbin.org",
  },
  {
    id: "int-5",
    title: "Full-Stack Social Microblogging Platform",
    level: "Intermediate",
    targetSeniority: "L5",
    domainLabel: "Full Stack & Real-Time",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL"],
    explanation:
      "Real-time microblogging application featuring threaded discussions, media uploads, follower graphs, and instant notifications.",
    elevatorPitch:
      "Social communication platform utilizing Postgres Row-Level Security, real-time change data capture, and optimistic feeds.",
    coreFeatures: [
      "Row-level security (RLS) data policies with Supabase Auth",
      "Infinite scrolling post feed with optimistic like and bookmark updates",
      "Real-time comments and notification badges via Postgres changes",
      "Image uploads with automatic thumbnail generation and CDN caching",
    ],
    metrics: [
      { label: "Feed Load Time", value: "< 180ms" },
      { label: "Live Event Sync", value: "Sub-100ms" },
    ],
    starStory: {
      situation: "Legacy community forum suffered from high database load during viral post events.",
      task: "Architect a scalable microblog with real-time push notifications and optimistic client state.",
      action: "Leveraged Supabase CDC subscriptions, database RLS policies, and TanStack Virtual feed windowing.",
      result: "Supported 10,000 active concurrent readers with zero database thread locks.",
    },
    githubUrl: "https://github.com/topics/social-media-app",
    demoUrl: "https://twitter.com",
  },

  // ===================== ADVANCED LEVEL =====================
  {
    id: "adv-1",
    title: "Real-Time Collaborative Canvas & Whiteboard",
    level: "Advanced",
    targetSeniority: "L6",
    domainLabel: "Distributed Systems & Algorithms",
    techStack: ["Next.js", "TypeScript", "WebSockets", "CRDT (Yjs)", "Canvas API"],
    explanation:
      "Conflict-free collaborative vector canvas supporting multi-user sketching, shape manipulation, and infinite pan/zoom.",
    elevatorPitch:
      "Multiplayer architectural whiteboard utilizing CRDT data structures for conflict-free state resolution and 60 FPS rendering.",
    coreFeatures: [
      "Yjs Conflict-free Replicated Data Type (CRDT) document sync",
      "High-performance HTML5 Canvas rendering engine with 60 FPS transform matrix",
      "Multi-cursor multiplayer presence with sub-50ms sync latency",
      "Room-based WebSocket channel multiplexing and state snapshotting",
    ],
    metrics: [
      { label: "Frame Rate", value: "60 FPS Fixed" },
      { label: "State Conflict Rate", value: "0.0% (CRDT)" },
    ],
    starStory: {
      situation: "Engineers required a collaborative sketching board that never lost strokes when offline.",
      task: "Implement a vector canvas with peer synchronization that seamlessly handles network partitions.",
      action: "Built custom CRDT bindings with Yjs and optimized canvas redraw loops via requestAnimationFrame.",
      result: "Delivered flawless 60 FPS drawing with zero state divergence across network reconnections.",
    },
    githubUrl: "https://github.com/tldraw/tldraw",
    demoUrl: "https://www.tldraw.com",
  },
  {
    id: "adv-2",
    title: "Distributed High-Throughput Event Streaming Broker",
    level: "Advanced",
    targetSeniority: "L6",
    domainLabel: "Distributed Systems & Infra",
    techStack: ["Go", "gRPC", "Apache Kafka", "ClickHouse", "Prometheus"],
    explanation:
      "High-throughput partition-tolerant event telemetry pipeline handling 100,000+ msgs/sec with zero loss and batch compression.",
    elevatorPitch:
      "Distributed telemetry broker written in Go with Kafka partition keys, ClickHouse columnar storage, and gRPC streaming.",
    coreFeatures: [
      "Partition-aware event hashing and concurrent Go worker consumer groups",
      "Binary protocol serialization via Protocol Buffers and gRPC streaming",
      "Columnar ClickHouse ingestion with snappy block compression",
      "Prometheus telemetry exporter tracking P99 latency and buffer saturation",
    ],
    metrics: [
      { label: "Throughput", value: "120k msgs/sec" },
      { label: "P99 Latency", value: "< 24ms" },
    ],
    starStory: {
      situation: "Telemetry pipelines crashed under bursty 50,000 event/sec traffic spikes during cloud outages.",
      task: "Re-engineer ingestion pipeline to handle 100k+ events/sec with backpressure controls.",
      action: "Wrote a Go worker pool with gRPC streaming buffers and batch flush to ClickHouse columnar tables.",
      result: "Processed 120,000 events/sec with under 24ms P99 latency and zero dropped packets.",
    },
    githubUrl: "https://github.com/topics/event-driven-architecture",
    demoUrl: "https://github.com",
  },
  {
    id: "adv-3",
    title: "Cloud IDE & In-Browser Code Sandbox",
    level: "Advanced",
    targetSeniority: "L6",
    domainLabel: "WebAssembly & Compilers",
    techStack: ["React", "TypeScript", "WebContainers", "Monaco Editor", "Tailwind CSS"],
    explanation:
      "Full Node.js runtime executing directly inside the browser using WebAssembly and WebContainers without remote server latency.",
    elevatorPitch:
      "In-browser cloud IDE running Node.js development servers, package managers, and live dev previews purely client-side.",
    coreFeatures: [
      "WebAssembly-powered in-browser POSIX terminal and Node.js execution",
      "Virtual filesystem supporting nested folders and hot module reloading",
      "Embedded live iframe preview with bidirectional console capturing",
      "Zero-backend security isolation running strictly in browser memory",
    ],
    metrics: [
      { label: "Server Cost", value: "$0 (Client WASM)" },
      { label: "Cold Boot Time", value: "< 1.2s" },
    ],
    starStory: {
      situation: "Cloud sandbox servers cost thousands monthly and suffered from high cold-start boot times.",
      task: "Build an in-browser code runner that executes npm packages without remote container spinning.",
      action: "Integrated WebContainers WASM virtual filesystem and hooked Monaco Editor to terminal PTY streams.",
      result: "Eliminated server compute costs completely while achieving instant 1.2s boot times.",
    },
    githubUrl: "https://github.com/stackblitz/webcontainer-core",
    demoUrl: "https://stackblitz.com",
  },
  {
    id: "adv-4",
    title: "Microservices API Gateway & Rate Limiter",
    level: "Advanced",
    targetSeniority: "L6",
    domainLabel: "Systems, Security & Infra",
    techStack: ["Go", "Redis", "Docker", "Kubernetes", "OAuth2"],
    explanation:
      "High-performance reverse proxy and API gateway implementing sliding-window rate limiting and OAuth2/OIDC token verification.",
    elevatorPitch:
      "Ultra-low-latency API edge gateway intercepting HTTP requests with sliding-window Redis token bucket rate limiters.",
    coreFeatures: [
      "Sliding-window counter rate limiting backed by Redis pipeline Lua scripts",
      "Cryptographic JWT verification with automated JWKS public key rotation",
      "Reverse proxy request forwarding with connection keep-alive pooling",
      "Kubernetes Helm charts with Horizontal Pod Autoscaling (HPA)",
    ],
    metrics: [
      { label: "Overhead Latency", value: "< 1.4ms" },
      { label: "Peak Load Capacity", value: "45k req/sec" },
    ],
    starStory: {
      situation: "Microservice backends were overwhelmed by DDoS scrapers bypassing application-layer checks.",
      task: "Construct an edge reverse proxy that throttles malicious IP traffic in under 2ms.",
      action: "Built an asynchronous Go gateway executing atomic Redis Lua scripts for token bucket tracking.",
      result: "Blocked 99.8% of abusive traffic with less than 1.4ms added proxy latency.",
    },
    githubUrl: "https://github.com/topics/api-gateway",
    demoUrl: "https://konghq.com",
  },
];

interface ProjectsViewProps {
  onLaunchInterviewForProject?: (project: any) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  onLaunchInterviewForProject,
}) => {
  // Filters
  const [selectedLevel, setSelectedLevel] = useState<ProjectLevel>("All");
  const [selectedTech, setSelectedTech] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected project for modal
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Extract all unique tech stack tags across projects for the filter
  const allTechStacks = useMemo(() => {
    const set = new Set<string>();
    CURATED_PROJECTS.forEach((p) => {
      p.techStack.forEach((t) => set.add(t));
    });
    return ["All", ...Array.from(set).sort()];
  }, []);

  // Filter projects by Level, Tech, and Search Query
  const filteredProjects = useMemo(() => {
    return CURATED_PROJECTS.filter((p) => {
      // 1. Level filter
      if (selectedLevel !== "All" && p.level !== selectedLevel) {
        return false;
      }
      // 2. Tech Stack filter
      if (selectedTech !== "All") {
        const hasTech = p.techStack.some(
          (t) => t.toLowerCase() === selectedTech.toLowerCase()
        );
        if (!hasTech) return false;
      }
      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesExpl = p.explanation.toLowerCase().includes(q);
        const matchesTech = p.techStack.some((t) => t.toLowerCase().includes(q));
        const matchesFeatures = p.coreFeatures.some((f) => f.toLowerCase().includes(q));
        return matchesTitle || matchesExpl || matchesTech || matchesFeatures;
      }
      return true;
    });
  }, [selectedLevel, selectedTech, searchQuery]);

  // Level Badge Styler
  const getLevelBadge = (level: "Beginner" | "Intermediate" | "Advanced") => {
    switch (level) {
      case "Beginner":
        return {
          label: "Beginner",
          badgeClass: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
          dotClass: "bg-emerald-400",
        };
      case "Intermediate":
        return {
          label: "Intermediate",
          badgeClass: "bg-blue-950/50 text-blue-300 border-blue-800/50",
          dotClass: "bg-blue-400",
        };
      case "Advanced":
        return {
          label: "Advanced",
          badgeClass: "bg-amber-950/50 text-amber-300 border-amber-800/50",
          dotClass: "bg-amber-400",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Top Header Banner */}
      <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 border border-zinc-700/60">
              Curated Roadmaps
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-900/40 text-[10px] font-mono">
              {CURATED_PROJECTS.length} Projects Available
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-zinc-300" />
            <span>Web Development Project Roadmap</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Step-by-step project directory structured from beginner foundations to production-grade distributed architectures. Filter by difficulty level or tech stack to inspect specifications and live deployments.
          </p>
        </div>

        {/* 2. Primary Level Filter Tabs (All, Beginner, Intermediate, Advanced) */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-[#0e0e12] p-1 rounded-lg border border-zinc-800 overflow-x-auto">
            {(["All", "Beginner", "Intermediate", "Advanced"] as ProjectLevel[]).map((lvl) => {
              const count =
                lvl === "All"
                  ? CURATED_PROJECTS.length
                  : CURATED_PROJECTS.filter((p) => p.level === lvl).length;

              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedLevel(lvl)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-zinc-800 text-white border border-zinc-700/80 shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <span>{lvl}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900/80 text-zinc-400 border border-zinc-800">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects or technologies..."
              className="w-full bg-[#0e0e12] border border-zinc-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Tech Stack / Language Filter Chips */}
      <div className="p-3.5 rounded-lg bg-[#111115] border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-400">
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Filter by Language or Tech Stack:</span>
          </span>
          {(selectedTech !== "All" || selectedLevel !== "All" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedLevel("All");
                setSelectedTech("All");
                setSearchQuery("");
              }}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Scrollable Tech Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {allTechStacks.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => setSelectedTech(tech)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                selectedTech === tech
                  ? "bg-white text-zinc-950 font-semibold shadow-xs"
                  : "bg-[#0e0e12] text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Results Counter */}
      <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
        <span>
          Showing <strong className="text-white font-mono">{filteredProjects.length}</strong>{" "}
          {filteredProjects.length === 1 ? "project" : "projects"}
          {selectedLevel !== "All" && (
            <span>
              {" "}
              in <span className="text-zinc-200 font-medium">{selectedLevel}</span>
            </span>
          )}
          {selectedTech !== "All" && (
            <span>
              {" "}
              matching <span className="text-zinc-200 font-mono">{selectedTech}</span>
            </span>
          )}
        </span>
      </div>

      {/* 5. Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
          <FolderGit2 className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No projects found</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            No projects match the selected difficulty level or tech stack filter. Try resetting your filters to explore all available projects.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setSelectedLevel("All");
                setSelectedTech("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset all filters</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const badge = getLevelBadge(project.level);

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group p-5 rounded-lg bg-[#111115] hover:bg-[#141419] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl relative"
              >
                <div className="space-y-3">
                  {/* Card Header: Level Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${badge.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white tracking-tight group-hover:text-zinc-100 transition-colors line-clamp-1">
                    {project.title}
                  </h3>

                  {/* Short Explanation */}
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {project.explanation}
                  </p>

                  {/* Preview Core Features */}
                  <div className="space-y-1 pt-1">
                    {project.coreFeatures.slice(0, 2).map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-1.5 text-[11px] text-zinc-400 line-clamp-1"
                      >
                        <span className="text-zinc-600 mt-0.5">•</span>
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="pt-2 flex flex-wrap gap-1">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 mt-4 border-t border-zinc-850 flex items-center justify-between text-xs text-zinc-400">
                  <span className="text-[11px] font-mono text-zinc-500">Click to inspect</span>
                  <div className="inline-flex items-center gap-1 font-medium text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Project Pop-Open Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl p-6 space-y-6 text-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {(() => {
                    const badge = getLevelBadge(selectedProject.level);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md border ${badge.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                        <span>{badge.label} Level</span>
                      </span>
                    );
                  })()}
                  <span className="text-[11px] font-mono text-zinc-500">
                    {selectedProject.domainLabel}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {selectedProject.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tech Stack Pills */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Technologies & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-900 text-zinc-200 border border-zinc-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Small Explanation / Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                Project Overview
              </h3>
              <div className="p-3.5 rounded-md bg-[#0a0a0d] border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {selectedProject.explanation}
              </div>
            </div>

            {/* Core Features */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Features</span>
              </h3>
              <div className="space-y-2">
                {selectedProject.coreFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-md bg-[#0e0e12] border border-zinc-800/60 text-xs text-zinc-300 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions: View Code (Left) and Live Link (Right) */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left Side: View Code Button */}
              <div className="flex items-center gap-2">
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700/80 font-medium text-xs transition-colors cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4 text-zinc-300" />
                  <span>View Code</span>
                </a>

                {onLaunchInterviewForProject && (
                  <button
                    type="button"
                    onClick={() => {
                      onLaunchInterviewForProject(selectedProject);
                      setSelectedProject(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                    title="Practice technical interview questions on this project"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Practice Interview</span>
                  </button>
                )}
              </div>

              {/* Right Side: Live Link Button */}
              <div className="flex items-center gap-2">
                <a
                  href={selectedProject.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-950" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
