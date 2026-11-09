"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { Architecture3DView } from "./Architecture3DView";
import {
  Server,
  Database,
  Layers,
  Network,
  Cpu,
  Shield,
  HardDrive,
  Workflow,
  Radio,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Download,
  Share2,
  ArrowRight,
  HelpCircle,
  Activity,
  Award,
  Grid,
} from "lucide-react";

export type ComponentType =
  | "client"
  | "cdn"
  | "gateway"
  | "loadbalancer"
  | "service"
  | "cache"
  | "queue"
  | "sqldb"
  | "nosqldb"
  | "storage";

export interface ArchitectureNode {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  techName: string;
}

export interface ArchitectureEdge {
  id: string;
  from: string;
  to: string;
  protocol: "HTTP/REST" | "gRPC" | "WebSocket" | "Kafka Event" | "TCP/SQL";
}

interface ComponentMeta {
  type: ComponentType;
  name: string;
  defaultTech: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const PALETTE: ComponentMeta[] = [
  { type: "client", name: "Client Browser / Mobile", defaultTech: "React Native / Web", icon: Network, color: "text-zinc-300" },
  { type: "cdn", name: "Edge CDN & DNS", defaultTech: "Cloudflare / Route53", icon: GlobeIcon, color: "text-sky-400" },
  { type: "loadbalancer", name: "Load Balancer", defaultTech: "AWS ALB / NGINX", icon: Workflow, color: "text-amber-400" },
  { type: "gateway", name: "API Gateway", defaultTech: "Envoy / Kong", icon: Shield, color: "text-violet-300" },
  { type: "service", name: "Backend Microservice", defaultTech: "Go / Node.js Service", icon: Cpu, color: "text-emerald-400" },
  { type: "cache", name: "Distributed Cache", defaultTech: "Redis Cluster", icon: Layers, color: "text-rose-400" },
  { type: "queue", name: "Message Broker / Stream", defaultTech: "Apache Kafka", icon: Radio, color: "text-amber-300" },
  { type: "sqldb", name: "Relational Database", defaultTech: "PostgreSQL (Master/Replica)", icon: Database, color: "text-blue-400" },
  { type: "nosqldb", name: "Distributed NoSQL", defaultTech: "Cassandra / DynamoDB", icon: HardDrive, color: "text-teal-400" },
  { type: "storage", name: "Object Storage", defaultTech: "AWS S3 / MinIO", icon: Server, color: "text-zinc-400" },
];

function GlobeIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// Production Blueprint Presets
const BLUEPRINTS: {
  title: string;
  description: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}[] = [
  {
    title: "High-Scale URL Shortener (TinyURL)",
    description: "Read-heavy distributed shortener with Redis caching layer and base62 key hashing service.",
    nodes: [
      { id: "node-1", type: "client", label: "Client App", techName: "Web / Mobile", x: 60, y: 160 },
      { id: "node-2", type: "cdn", label: "Edge CDN", techName: "Cloudflare", x: 230, y: 160 },
      { id: "node-3", type: "loadbalancer", label: "Layer 7 LB", techName: "AWS ALB", x: 390, y: 160 },
      { id: "node-4", type: "service", label: "Redirect API Service", techName: "Go Service", x: 560, y: 100 },
      { id: "node-5", type: "service", label: "Shortener Service", techName: "Go Service", x: 560, y: 220 },
      { id: "node-6", type: "cache", label: "Hot URLs Cache", techName: "Redis Cluster (LRU)", x: 740, y: 100 },
      { id: "node-7", type: "sqldb", label: "Primary Database", techName: "PostgreSQL Master", x: 740, y: 220 },
    ],
    edges: [
      { id: "edge-1", from: "node-1", to: "node-2", protocol: "HTTP/REST" },
      { id: "edge-2", from: "node-2", to: "node-3", protocol: "HTTP/REST" },
      { id: "edge-3", from: "node-3", to: "node-4", protocol: "gRPC" },
      { id: "edge-4", from: "node-3", to: "node-5", protocol: "gRPC" },
      { id: "edge-5", from: "node-4", to: "node-6", protocol: "TCP/SQL" },
      { id: "edge-6", from: "node-4", to: "node-7", protocol: "TCP/SQL" },
      { id: "edge-7", from: "node-5", to: "node-7", protocol: "TCP/SQL" },
    ],
  },
  {
    title: "Real-Time Social Feed (Twitter/X)",
    description: "Fanout-on-write event-driven architecture using Kafka streams and Redis timeline lists.",
    nodes: [
      { id: "f-1", type: "client", label: "Mobile Client", techName: "iOS / Android", x: 50, y: 180 },
      { id: "f-2", type: "gateway", label: "API Gateway", techName: "Envoy Gateway", x: 220, y: 180 },
      { id: "f-3", type: "service", label: "Tweet Ingestion Service", techName: "Go Microservice", x: 390, y: 110 },
      { id: "f-4", type: "service", label: "Timeline Query Service", techName: "Go Microservice", x: 390, y: 250 },
      { id: "f-5", type: "queue", label: "Fanout Message Stream", techName: "Apache Kafka", x: 570, y: 110 },
      { id: "f-6", type: "cache", label: "User Timeline Lists", techName: "Redis Cluster", x: 740, y: 180 },
      { id: "f-7", type: "nosqldb", label: "Tweet Permanent Store", techName: "Apache Cassandra", x: 570, y: 270 },
    ],
    edges: [
      { id: "fe-1", from: "f-1", to: "f-2", protocol: "WebSocket" },
      { id: "fe-2", from: "f-2", to: "f-3", protocol: "gRPC" },
      { id: "fe-3", from: "f-2", to: "f-4", protocol: "gRPC" },
      { id: "fe-4", from: "f-3", to: "f-5", protocol: "Kafka Event" },
      { id: "fe-5", from: "f-5", to: "f-6", protocol: "Kafka Event" },
      { id: "fe-6", from: "f-4", to: "f-6", protocol: "TCP/SQL" },
      { id: "fe-7", from: "f-3", to: "f-7", protocol: "TCP/SQL" },
    ],
  },
];

export const ArchitectureCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<ArchitectureNode[]>(BLUEPRINTS[0].nodes);
  const [edges, setEdges] = useState<ArchitectureEdge[]>(BLUEPRINTS[0].edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [activeProtocol, setActiveProtocol] = useState<ArchitectureEdge["protocol"]>("gRPC");

  // Canvas View Mode: 2D Schematic vs 3D Spatial Topology
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [is3dTrafficSimulating, setIs3dTrafficSimulating] = useState(false);

  // Dragging node state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // AI Review Audit State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    score: number;
    title: string;
    verdict: string;
    strengths: string[];
    risks: string[];
    latencyEst: string;
    qpsCapacity: string;
    recommendations: string[];
  } | null>(null);

  const canvasRef = useRef<SVGSVGElement>(null);

  // Load a preset blueprint
  const handleLoadBlueprint = (index: number) => {
    setNodes(BLUEPRINTS[index].nodes);
    setEdges(BLUEPRINTS[index].edges);
    setSelectedNodeId(null);
    setConnectSourceId(null);
    setAuditResult(null);
  };

  // Add component node
  const handleAddComponent = (meta: ComponentMeta) => {
    const newNode: ArchitectureNode = {
      id: `node-${Date.now()}`,
      type: meta.type,
      label: meta.name,
      techName: meta.defaultTech,
      x: 320 + Math.round(Math.random() * 80),
      y: 140 + Math.round(Math.random() * 80),
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setAuditResult(null);
  };

  // Remove node and incident edges
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) => prev.filter((e) => e.from !== selectedNodeId && e.to !== selectedNodeId));
    setSelectedNodeId(null);
    setConnectSourceId(null);
    setAuditResult(null);
  };

  // Node mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const node = nodes.find((n) => n.id === id);
    if (!node) return;

    if (connectSourceId) {
      // Complete connection edge
      if (connectSourceId !== id) {
        const edgeExists = edges.some(
          (edge) =>
            (edge.from === connectSourceId && edge.to === id) ||
            (edge.from === id && edge.to === connectSourceId)
        );
        if (!edgeExists) {
          const newEdge: ArchitectureEdge = {
            id: `edge-${Date.now()}`,
            from: connectSourceId,
            to: id,
            protocol: activeProtocol,
          };
          setEdges((prev) => [...prev, newEdge]);
          setAuditResult(null);
        }
      }
      setConnectSourceId(null);
      return;
    }

    setSelectedNodeId(id);
    setDraggingNodeId(id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  // Canvas mouse move for node dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(30, Math.min(rect.width - 160, e.clientX - dragOffset.x));
    const newY = Math.max(30, Math.min(rect.height - 80, e.clientY - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Run AI Architectural Audit on topology
  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      // Analyze nodes and connectivity
      const hasClient = nodes.some((n) => n.type === "client");
      const hasLB = nodes.some((n) => n.type === "loadbalancer" || n.type === "gateway");
      const hasCache = nodes.some((n) => n.type === "cache");
      const hasQueue = nodes.some((n) => n.type === "queue");
      const hasDB = nodes.some((n) => n.type === "sqldb" || n.type === "nosqldb");
      const serviceCount = nodes.filter((n) => n.type === "service").length;

      let score = 70;
      const strengths: string[] = [];
      const risks: string[] = [];
      const recommendations: string[] = [];

      if (hasLB) {
        score += 8;
        strengths.push("Traffic gateway / load balancer terminates SSL and distributes layer 7 traffic.");
      } else {
        score -= 15;
        risks.push("Single Point of Failure (SPOF): Direct client routing to microservice without ingress load balancer.");
        recommendations.push("Place an Application Load Balancer or API Gateway in front of internal backend services.");
      }

      if (hasCache) {
        score += 10;
        strengths.push("In-memory distributed caching decouples database read path, maintaining low P99 latency.");
      } else {
        score -= 12;
        risks.push("Database Saturation Risk: All read requests hit the database tier directly under peak traffic.");
        recommendations.push("Introduce a Cache-Aside Redis cluster with explicit TTL to reduce database IOPS.");
      }

      if (hasQueue) {
        score += 8;
        strengths.push("Asynchronous message broker isolates bursts and enables event-driven pub/sub fanout.");
      } else if (serviceCount > 1) {
        risks.push("Synchronous Cascading Latency: Services rely on direct RPC calls without buffer queues.");
        recommendations.push("Add a streaming queue (e.g. Apache Kafka) for write operations and background task processing.");
      }

      if (hasDB) {
        strengths.push("Persistent state tier isolated from stateless compute layer.");
      } else {
        score -= 20;
        risks.push("Missing permanent storage tier for data consistency.");
      }

      const finalScore = Math.min(96, Math.max(48, score));
      const verdict =
        finalScore >= 85
          ? "Production-Ready Tier-1 Architecture"
          : finalScore >= 70
          ? "Viable Architecture with Optimization Needs"
          : "Vulnerable to Saturation & Cascading Outages";

      setAuditResult({
        score: finalScore,
        title: "Staff Systems Architecture Audit",
        verdict,
        strengths: strengths.slice(0, 3),
        risks: risks.length > 0 ? risks : ["No major structural single points of failure detected."],
        latencyEst: hasCache ? "8ms - 24ms (P99)" : "120ms - 340ms (P99 under load)",
        qpsCapacity: hasLB && hasCache ? "45,000+ RPS" : "3,500 RPS (DB bound)",
        recommendations:
          recommendations.length > 0
            ? recommendations
            : ["Ensure multi-AZ database replication and automated failover tests are configured."],
      });
      setIsAuditing(false);
    }, 700);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Top Action Bar */}
      <div className="p-3.5 px-4 rounded-lg bg-[#111115] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-4 h-4 text-zinc-300" />
            <span>Interactive System Design Architecture Canvas</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Drag components, connect communication protocols (REST, gRPC, Kafka, SQL), and run automated architectural evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Blueprint Selectors */}
          <div className="flex items-center gap-1.5">
            {BLUEPRINTS.map((bp, idx) => (
              <button
                key={bp.title}
                type="button"
                onClick={() => handleLoadBlueprint(idx)}
                className="px-2.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                {bp.title.split(" ")[0]} Preset
              </button>
            ))}
          </div>

          {/* Run Architecture Audit Button */}
          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isAuditing || nodes.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Shield className="w-3.5 h-3.5 text-zinc-950" />
            <span>{isAuditing ? "Auditing Architecture..." : "Run AI Architecture Review"}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px]">
        {/* Left Infrastructure Palette */}
        <div className="lg:col-span-3 flex flex-col rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden shadow-sm">
          <div className="p-3 bg-[#0d0d11] border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-zinc-400" />
              <span>Components Palette</span>
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Click to place</span>
          </div>

          <div className="p-3 space-y-2 overflow-y-auto max-h-[520px]">
            {PALETTE.map((meta) => {
              const Icon = meta.icon;
              return (
                <button
                  key={meta.type}
                  type="button"
                  onClick={() => handleAddComponent(meta)}
                  className="w-full flex items-center justify-between p-2 rounded-md bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800/80 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700/80 flex items-center justify-center shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors">
                        {meta.name}
                      </h4>
                      <p className="text-[10px] font-mono text-zinc-500">{meta.defaultTech}</p>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Connection Protocol Selector */}
          <div className="p-3 border-t border-zinc-800 bg-[#0c0c10] space-y-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
              Edge Protocol Type:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(["HTTP/REST", "gRPC", "WebSocket", "Kafka Event", "TCP/SQL"] as const).map(
                (proto) => (
                  <button
                    key={proto}
                    type="button"
                    onClick={() => setActiveProtocol(proto)}
                    className={`px-2 py-1 rounded text-[10px] font-mono transition-colors border cursor-pointer ${
                      activeProtocol === proto
                        ? "bg-zinc-800 text-white border-zinc-600 font-bold"
                        : "bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                    }`}
                  >
                    {proto}
                  </button>
                )
              )}
            </div>
            <p className="text-[10px] text-zinc-500 pt-1 font-mono">
              Click &quot;Connect&quot; on any node, then click target node to create directed edge.
            </p>
          </div>
        </div>

        {/* Right Diagram Canvas */}
        <div className="lg:col-span-9 flex flex-col rounded-lg bg-[#0a0a0d] border border-zinc-800 overflow-hidden shadow-lg relative">
          {/* Canvas Sub-toolbar */}
          <div className="p-2.5 px-3 bg-[#0f0f13] border-b border-zinc-800 flex items-center justify-between text-xs z-10 flex-wrap gap-2">
            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
              <span>{nodes.length} Components</span>
              <span>•</span>
              <span>{edges.length} Data Edges</span>
              {connectSourceId && (
                <span className="text-amber-400 font-semibold animate-pulse">
                  Connecting from: {nodes.find((n) => n.id === connectSourceId)?.label}...
                </span>
              )}
            </div>

            {/* 2D Schematic vs 3D Spatial Topology Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-zinc-900 border border-zinc-800">
              <button
                type="button"
                onClick={() => setViewMode("2d")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  viewMode === "2d"
                    ? "bg-zinc-800 text-white font-medium shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Grid className="w-3 h-3 text-zinc-400" />
                <span>2D Schematic</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                  viewMode === "3d"
                    ? "bg-zinc-800 text-white font-medium shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Cpu className="w-3 h-3 text-emerald-400" />
                <span>3D Spatial Topology</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {selectedNodeId && (
                <>
                  <button
                    type="button"
                    onClick={() => setConnectSourceId(selectedNodeId)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-400" />
                    <span>Connect Edge</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/60 hover:bg-red-900/80 border border-red-900/80 text-red-300 text-xs font-mono transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => {
                  setNodes([]);
                  setEdges([]);
                  setSelectedNodeId(null);
                  setConnectSourceId(null);
                  setAuditResult(null);
                }}
                className="p-1 rounded-md text-zinc-400 hover:text-white transition-colors"
                title="Clear Canvas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* View Mode: 3D Spatial Topology vs 2D Schematic */}
          {viewMode === "3d" ? (
            <Architecture3DView
              nodes={nodes}
              edges={edges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              isSimulatingTraffic={is3dTrafficSimulating}
              onToggleTraffic={() => setIs3dTrafficSimulating(!is3dTrafficSimulating)}
            />
          ) : (
            /* Interactive SVG Rendering Plane */
            <div
              className="flex-1 w-full h-[520px] relative overflow-hidden bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:16px_16px]"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <svg
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#71717a" />
                  </marker>
                  <marker
                    id="arrowhead-active"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
                  </marker>
                </defs>

                {/* Render Connection Edges */}
                {edges.map((edge) => {
                  const source = nodes.find((n) => n.id === edge.from);
                  const target = nodes.find((n) => n.id === edge.to);
                  if (!source || !target) return null;

                  const sx = source.x + 70;
                  const sy = source.y + 25;
                  const tx = target.x + 70;
                  const ty = target.y + 25;

                  const midX = (sx + tx) / 2;
                  const midY = (sy + ty) / 2;

                  return (
                    <g key={edge.id}>
                      <line
                        x1={sx}
                        y1={sy}
                        x2={tx}
                        y2={ty}
                        stroke="#52525b"
                        strokeWidth="1.5"
                        strokeDasharray={edge.protocol.includes("Event") ? "4,4" : undefined}
                        markerEnd="url(#arrowhead)"
                      />
                      <rect
                        x={midX - 30}
                        y={midY - 9}
                        width="60"
                        height="16"
                        rx="3"
                        fill="#111115"
                        stroke="#27272a"
                      />
                      <text
                        x={midX}
                        y={midY + 3}
                        fill="#a1a1aa"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {edge.protocol.split("/")[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Render Draggable Nodes */}
              {nodes.map((node) => {
                const meta = PALETTE.find((p) => p.type === node.type) || PALETTE[0];
                const Icon = meta.icon;
                const isSelected = selectedNodeId === node.id;
                const isSource = connectSourceId === node.id;

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    style={{
                      transform: `translate(${node.x}px, ${node.y}px)`,
                      cursor: "grab",
                    }}
                    className={`absolute w-36 p-2 rounded-lg border shadow-lg transition-shadow select-none ${
                      isSelected
                        ? "bg-[#18181f] border-zinc-400 ring-1 ring-zinc-400 shadow-zinc-900/50"
                        : isSource
                        ? "bg-[#18181f] border-emerald-500 ring-1 ring-emerald-500"
                        : "bg-[#111115] border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                        <Icon className={`w-3 h-3 ${meta.color}`} />
                      </div>
                      <span className="text-[11px] font-bold text-white truncate">{node.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-400 block truncate">
                      {node.techName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* AI Architectural Audit Report Drawer */}
          {auditResult && (
            <div className="p-4 bg-[#111115] border-t border-zinc-800 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">{auditResult.title}</span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs font-semibold text-emerald-300">{auditResult.verdict}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-zinc-400">Latency: <strong className="text-white">{auditResult.latencyEst}</strong></span>
                  <span className="text-zinc-400">Throughput: <strong className="text-white">{auditResult.qpsCapacity}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-white font-bold">
                    Score: {auditResult.score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
                    Strengths & Patterns Detected
                  </span>
                  <ul className="space-y-0.5 text-zinc-300 font-sans list-disc ml-3.5 text-[11px]">
                    {auditResult.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/80 border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">
                    Identified Bottlenecks & Recommendations
                  </span>
                  <ul className="space-y-0.5 text-zinc-300 font-sans list-disc ml-3.5 text-[11px]">
                    {auditResult.recommendations.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
