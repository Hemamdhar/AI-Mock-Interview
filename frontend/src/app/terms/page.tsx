"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="border-b border-zinc-800 pb-6 mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-zinc-800 text-zinc-300">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Legal Documentation
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Effective date: October 10, 2026 • Version 1.1
          </p>
        </div>

        {/* Document Content */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or using InterviewAI (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to all terms and conditions, you may not access or use any part of the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">2. Scope of Services</h2>
            <p>
              InterviewAI provides interactive technical mock interviews, algorithm practice environments, system design dialogue simulations, and automated performance rubrics. The platform is designed for career preparation, skill benchmarking, and interview readiness practice.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">3. Candidate Code Ownership</h2>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You Retain 100% Intellectual Property</span>
              </div>
              <p className="text-zinc-300">
                You retain all rights, title, and ownership of the original code, architectural diagrams, notes, and responses you draft within our sandboxes. InterviewAI does not claim any intellectual property rights over candidate submissions.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">4. Compute Sandbox and Fair Usage</h2>
            <p>
              Our code execution sandbox is provided for testing algorithm solutions and system implementations. You agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300 text-xs">
              <li>Attempt to escape the sandbox or access underlying cluster hosts.</li>
              <li>Execute malicious software, cryptomining workloads, or denial-of-service traffic.</li>
              <li>Exceed automated rate limits or reverse engineer the evaluation engines.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">5. Educational Simulation Disclaimer</h2>
            <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 text-zinc-400">
              <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                <AlertCircle className="w-4 h-4 text-zinc-400" />
                <span>Simulation Disclaimer</span>
              </div>
              <p>
                Feedback, readiness scores, and rubric assessments provided by InterviewAI are simulation heuristics intended to support your study. They do not constitute a formal guarantee of employment, job offer, or specific interview outcome at any third-party company.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">6. Limitation of Liability</h2>
            <p>
              In no event shall InterviewAI, its developers, or affiliates be liable for indirect, incidental, special, or consequential damages resulting from the use or inability to use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">7. Termination and Governing Law</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate fair compute policies. These Terms shall be governed by and construed in accordance with the laws applicable to digital platform services.
            </p>
            <p>
              For legal inquiries regarding these Terms, contact:
            </p>
            <p className="font-mono text-xs text-zinc-200 bg-zinc-900 px-3 py-2 rounded border border-zinc-800 inline-block">
              legal@interviewai.dev
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
