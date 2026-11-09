"use client";

import React from "react";
import { Code, Cpu, Server, Network, Brain, Briefcase, Check } from "lucide-react";

export interface RoleOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const TARGET_ROLES: RoleOption[] = [
  {
    id: "fullstack",
    label: "Full-Stack Engineer",
    icon: Code,
    description: "React, Node, DBs & APIs",
  },
  {
    id: "backend",
    label: "Backend & Systems",
    icon: Server,
    description: "Distributed systems, Python/Go",
  },
  {
    id: "frontend",
    label: "Frontend Specialist",
    icon: Cpu,
    description: "Modern UI architecture",
  },
  {
    id: "system_design",
    label: "System Design Lead",
    icon: Network,
    description: "High-scale architecture",
  },
  {
    id: "ai_ml",
    label: "AI / ML Engineer",
    icon: Brain,
    description: "LLMs, PyTorch, RAG",
  },
  {
    id: "product_manager",
    label: "Technical PM",
    icon: Briefcase,
    description: "Strategy & Tech execution",
  },
];

interface RoleSelectorProps {
  selectedRole: string;
  onSelectRole: (role: string) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Target Track
        </label>
        <span className="text-[11px] font-mono text-zinc-400">Calibrates Question Pool</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TARGET_ROLES.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`group relative p-2.5 rounded-md text-left transition-colors border flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
                isSelected
                  ? "bg-zinc-800 border-zinc-600 text-white"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div
                  className={`p-1 rounded ${
                    isSelected ? "bg-zinc-700 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-zinc-200" />
                )}
              </div>

              <div>
                <p
                  className={`text-xs font-medium leading-tight ${
                    isSelected ? "text-white" : "text-zinc-300"
                  }`}
                >
                  {role.label}
                </p>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5 leading-tight">
                  {role.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
