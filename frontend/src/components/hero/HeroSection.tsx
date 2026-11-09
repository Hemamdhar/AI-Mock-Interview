"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Code, BookOpen, Cpu, Terminal, HelpCircle } from "lucide-react";
import { ProductTerminalPreview } from "./ProductTerminalPreview";

export function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto text-center space-y-8">
        {/* Eyebrow Tech Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-zinc-800 bg-zinc-900/70 text-xs font-mono text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>CALIBRATED ENGINEERING INTERVIEW PLATFORM</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Technical Mock Interviews &amp; Core CS Curricula
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Master 5 core computer science curricula, drill 440+ curated questions across 9 engineering domains, and simulate realistic 3-phase technical mock interviews with live audio, isolated sandbox execution, and standardized hiring rubrics.
          </p>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 transition-colors shadow-xs cursor-pointer"
          >
            <span>Start Practice Session</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/subjects"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-zinc-400" />
            <span>Explore Core Subjects</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>5 Core CS Curricula</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
            <span>440+ Curated Questions</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-zinc-400" />
            <span>3-Phase Mock Engine</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-zinc-400" />
            <span>Multi-Language Runner</span>
          </div>
        </div>

        {/* Product Workspace Preview */}
        <div className="pt-6">
          <ProductTerminalPreview />
        </div>
      </div>
    </section>
  );
}
