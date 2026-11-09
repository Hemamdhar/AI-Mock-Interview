"use client";

import React from "react";
import { ShieldCheck, Code, Cpu, Terminal, CheckCircle2 } from "lucide-react";
import { AmbientBackground } from "@/components/background/AmbientBackground";

interface AuthCardWrapperProps {
  children: React.ReactNode;
  mode: "login" | "signup";
}

export const AuthCardWrapper: React.FC<AuthCardWrapperProps> = ({
  children,
  mode,
}) => {
  return (
    <div
      data-auth-mode={mode}
      className="relative min-h-screen bg-[#09090b] text-zinc-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden"
    >
      <AmbientBackground />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl my-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Technical Overview (No Fake Reviews or Testimonials) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300 mb-6">
              <Terminal className="w-3.5 h-3.5 text-zinc-400" />
              <span>CANDIDATE CALIBRATION</span>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-3 leading-snug">
              Calibrated Technical Practice
            </h2>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Practice algorithmic challenges and system architecture rounds with
              interactive voice feedback and automated test case verification.
            </p>

            {/* Feature Highlights (Objective Features, Not Hype) */}
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                  <Code className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    In-Browser Sandbox
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Execute code with unit tests, complexity profiling, and edge validation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    Adaptive Dialogue
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Interviewer explores trade-offs and probing questions dynamically.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded bg-zinc-800 text-zinc-300 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-zinc-200">
                    Private & Encrypted
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Session transcripts and solutions are private; zero training on your code.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specs Box (Replaces Fake Review/Testimonial) */}
          <div className="mt-8 p-3.5 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 space-y-2">
            <div className="flex items-center justify-between text-zinc-300 pb-1.5 border-b border-zinc-800">
              <span>SANDBOX ENVIRONMENT</span>
              <span className="text-emerald-400">v1.2 ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Supported:</span>
              <span className="text-zinc-300">Python, TS, Go, Java</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Rubric Standard:</span>
              <span className="text-zinc-300">Senior Engineering Bar</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="p-6 sm:p-8 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
