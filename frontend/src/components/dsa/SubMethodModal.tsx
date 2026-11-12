"use client";

import React, { useState } from "react";
import {
  X,
  Play,
  BookOpen,
  Code2,
  Box,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  Clock,
  HardDrive,
  AlertTriangle,
  Lightbulb,
  Activity,
} from "lucide-react";
import { SubMethodData } from "@/data/dsaSubMethods";
import { DSA2DLab } from "./DSA2DLab";

interface SubMethodModalProps {
  subMethod: SubMethodData;
  onClose: () => void;
  solvedProblemIds: number[];
  onToggleProblemSolved: (problemId: number, e?: React.MouseEvent) => void;
}

export const SubMethodModal: React.FC<SubMethodModalProps> = ({
  subMethod,
  onClose,
  solvedProblemIds,
  onToggleProblemSolved,
}) => {
  const [activeTab, setActiveTab] = useState<"lab" | "video" | "resources" | "problems">("lab");

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111115] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* 1. Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-start justify-between gap-4 bg-zinc-900/40 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-bold text-zinc-300">
                LEVEL {subMethod.parentLevelId}.{subMethod.subNumber}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                  subMethod.tag === "CORE"
                    ? "bg-blue-950/40 text-blue-300 border border-blue-900/40"
                    : subMethod.tag === "HARD"
                    ? "bg-rose-950/40 text-rose-300 border border-rose-900/40"
                    : subMethod.tag === "MEDIUM"
                    ? "bg-amber-950/40 text-amber-300 border border-amber-900/40"
                    : "bg-emerald-950/40 text-emerald-300 border border-emerald-900/40"
                }`}
              >
                {subMethod.tag}
              </span>

              {/* Complexity Badges */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 ml-1">
                <span className="px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-zinc-400" />
                  <span>Time: {subMethod.timeComplexity.average}</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-zinc-800 flex items-center gap-1">
                  <HardDrive className="w-2.5 h-2.5 text-zinc-400" />
                  <span>Space: {subMethod.spaceComplexity}</span>
                </span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {subMethod.title}
            </h3>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              {subMethod.description}
            </p>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors shrink-0"
            title="Close sub-method drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-5 border-b border-zinc-800 bg-[#0e0e12] shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("lab")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 text-xs font-semibold transition-colors shrink-0 ${
              activeTab === "lab"
                ? "border-cyan-400 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>2D Interactive Lab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 text-xs font-semibold transition-colors shrink-0 ${
              activeTab === "video"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>Video Tutorial</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("resources")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 text-xs font-semibold transition-colors shrink-0 ${
              activeTab === "resources"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Study Resources</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("problems")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 text-xs font-semibold transition-colors shrink-0 ${
              activeTab === "problems"
                ? "border-white text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>
              LeetCode Problems (
              {subMethod.problems.filter((p) => solvedProblemIds.includes(p.id)).length}/
              {subMethod.problems.length})
            </span>
          </button>
        </div>

        {/* 3. Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {/* TAB 1: 2D INTERACTIVE LAB */}
          {activeTab === "lab" && (
            <div className="space-y-4">
              <DSA2DLab subMethod={subMethod} />
            </div>
          )}

          {/* TAB 2: CONCEPT VIDEO */}
          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-zinc-800 shadow-xl">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${subMethod.youtubeVideoId}?rel=0&modestbranding=1`}
                  title={subMethod.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <h4 className="font-bold text-white text-sm">{subMethod.videoTitle}</h4>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Channel: {subMethod.videoChannel} • Duration: {subMethod.videoDuration}
                  </p>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${subMethod.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-zinc-300 hover:text-white transition-colors font-medium self-start sm:self-auto"
                >
                  <span>Open in YouTube</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: STUDY RESOURCES */}
          {activeTab === "resources" && (
            <div className="space-y-5">
              {/* Complexity Analysis Matrix */}
              <div className="p-4 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Asymptotic Runtime & Space Bounds</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-md bg-zinc-950/70 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-mono block">Best Case</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {subMethod.timeComplexity.best}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-950/70 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-mono block">Average Case</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {subMethod.timeComplexity.average}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-950/70 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-mono block">Worst Case</span>
                    <span className="font-mono font-bold text-rose-400 text-sm">
                      {subMethod.timeComplexity.worst}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-md bg-zinc-950/70 border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 font-mono block">Auxiliary Space</span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {subMethod.spaceComplexity}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Algorithmic Invariants */}
              <div className="p-4 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2.5">
                <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Key Invariants & Guarantees</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {subMethod.keyInvariants.map((inv, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-600 font-mono font-bold">•</span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pseudocode / Implementation */}
              {subMethod.studyResources.pseudocode && (
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                    Algorithmic Pseudocode
                  </h4>
                  <pre className="p-3 rounded-md bg-black/60 border border-zinc-800/80 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed">
                    {subMethod.studyResources.pseudocode}
                  </pre>
                </div>
              )}

              {/* Implementation Snippet */}
              {subMethod.studyResources.codeSnippet && (
                <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Reference Implementation ({subMethod.studyResources.codeSnippet.language})
                    </h4>
                  </div>
                  <pre className="p-3 rounded-md bg-black/60 border border-zinc-800/80 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                    {subMethod.studyResources.codeSnippet.code}
                  </pre>
                </div>
              )}

              {/* Pitfalls & Edge Cases */}
              {subMethod.studyResources.pitfalls.length > 0 && (
                <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Interview Pitfalls & Anti-Patterns</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {subMethod.studyResources.pitfalls.map((pit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-rose-500 font-mono font-bold">✕</span>
                        <span>{pit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LEETCODE PROBLEMS */}
          {activeTab === "problems" && (
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>
                  Solved: {subMethod.problems.filter((p) => solvedProblemIds.includes(p.id)).length} of {subMethod.problems.length}
                </span>
                <span>Click checkmark to toggle your progress</span>
              </div>

              <div className="space-y-2">
                {subMethod.problems.map((prob) => {
                  const isSolved = solvedProblemIds.includes(prob.id);
                  return (
                    <div
                      key={prob.id}
                      className="flex items-center justify-between p-3.5 rounded-md bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => onToggleProblemSolved(prob.id, e)}
                          className="text-zinc-500 hover:text-white transition-colors"
                          title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                        >
                          {isSolved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                          )}
                        </button>

                        <div className="min-w-0">
                          <h5
                            className={`text-xs sm:text-sm font-semibold truncate ${
                              isSolved ? "text-zinc-400 line-through" : "text-white"
                            }`}
                          >
                            {prob.title}
                          </h5>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {prob.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[10px] font-mono text-zinc-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            prob.difficulty === "Hard"
                              ? "bg-rose-950/25 text-rose-300 border border-rose-900/40"
                              : prob.difficulty === "Medium"
                              ? "bg-amber-950/25 text-amber-300 border border-amber-900/40"
                              : "bg-emerald-950/25 text-emerald-300 border border-emerald-900/40"
                          }`}
                        >
                          {prob.difficulty}
                        </span>

                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                        >
                          <span>Solve</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

