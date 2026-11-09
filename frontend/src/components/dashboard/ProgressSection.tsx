"use client";

import React from "react";
import { Info, Code2, Network, Database, Brain } from "lucide-react";

export const ProgressSection: React.FC = () => {
  const categories = [
    {
      id: "dsa",
      name: "DSA",
      solved: "0/1007",
      percentage: "0%",
      icon: Code2,
    },
    {
      id: "system_design",
      name: "System Design",
      solved: "0/104",
      percentage: "0%",
      icon: Network,
    },
    {
      id: "core_subjects",
      name: "Core Subjects",
      solved: "0/944",
      percentage: "0%",
      icon: Database,
    },
    {
      id: "data_engineering",
      name: "Data Engineering",
      solved: "0/312",
      percentage: "0%",
      icon: Brain,
    },
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Title */}
      <h2 className="text-xl font-bold text-white tracking-tight">
        Your Progress
      </h2>

      {/* Two-Column Progress Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: DSA Progress Donut Chart */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11131c] border border-[#1d2232] shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-300">
              DSA Progress
            </span>
            <button
              type="button"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="DSA progress breakdown"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-auto py-2">
            {/* Donut Chart with Center 1 / 1369 */}
            <div className="sm:col-span-6 flex items-center justify-center">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Track Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#1c2136"
                    strokeWidth="7"
                  />
                  {/* Small Yellow Progress Indicator */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="7"
                    strokeDasharray="238.76"
                    strokeDashoffset="236"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Center Number Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    1
                  </span>
                  <span className="text-xs text-slate-500 font-medium mt-0.5">
                    / 1369
                  </span>
                </div>
              </div>
            </div>

            {/* Right Legend Breakdown (Basic, Core, Pro) */}
            <div className="sm:col-span-6 space-y-4 pl-2">
              {/* Basic */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#22c55e]" />
                  <span className="text-sm font-medium text-slate-300">Basic</span>
                </div>
                <p className="text-xs text-slate-500 font-medium pl-4.5">
                  <strong className="text-slate-200">0</strong> / 214
                </p>
              </div>

              {/* Core */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#eab308]" />
                  <span className="text-sm font-medium text-slate-300">Core</span>
                </div>
                <p className="text-xs text-slate-500 font-medium pl-4.5">
                  <strong className="text-slate-200">1</strong> / 843
                </p>
              </div>

              {/* Pro */}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#ef4444]" />
                  <span className="text-sm font-medium text-slate-300">Pro</span>
                </div>
                <p className="text-xs text-slate-500 font-medium pl-4.5">
                  <strong className="text-slate-200">0</strong> / 312
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Category-wise Progress */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#11131c] border border-[#1d2232] shadow-xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">
              Category-wise Progress
            </span>
          </div>

          <div className="space-y-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#151824]/60 hover:bg-[#181c2c] border border-[#1e2335]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1a1f33] flex items-center justify-center text-[#58a6ff]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {cat.solved}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    {cat.percentage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
