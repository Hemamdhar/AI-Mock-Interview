"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

export default function PrivacyPolicyPage() {
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
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Compliance & Security
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Last modified: October 10, 2026 • Version 1.2
          </p>
        </div>

        {/* Document Content */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">1. Scope and Principles</h2>
            <p>
              InterviewAI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the platform&rdquo;) provides technical interview simulation tools, live code evaluation sandboxes, and automated speech dialogue. We believe privacy and candidate data autonomy are fundamental. This Privacy Policy details how we collect, process, and protect your information when using our services.
            </p>
            <p>
              We adhere to strict data minimization principles: we only collect the data required to facilitate real-time interview simulations and calibrate evaluation rubrics.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">2. Information We Collect</h2>
            <div className="space-y-2 pl-3 border-l-2 border-zinc-800">
              <p>
                <strong className="text-white">Account Information:</strong> Your name, email address, authentication credentials, and chosen engineering track (e.g., Backend, Frontend, Distributed Systems).
              </p>
              <p>
                <strong className="text-white">Interview Transcripts and Audio:</strong> When you practice an interview with voice enabled, your audio stream is processed in real time to generate text transcripts. We do not retain raw audio recordings indefinitely; audio buffers are discarded after session completion.
              </p>
              <p>
                <strong className="text-white">Code Submissions and Test Outputs:</strong> Source code written in the browser sandbox, test outputs, and execution metrics are saved to generate your scorecard and dashboard progress analytics.
              </p>
              <p>
                <strong className="text-white">Resume and Background Context:</strong> If you upload a resume or paste background experience to calibrate questions, this text is extracted solely for question personalization during the active session.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">3. Third-Party AI Models and Zero-Training Guarantee</h2>
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero AI Training Policy</span>
              </div>
              <p className="text-zinc-300">
                Your code submissions, resume excerpts, and interview transcripts are processed via enterprise API endpoints with strict zero-data-retention agreements. Your private practice sessions are never utilized to train foundation AI models.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">4. Data Encryption and Storage</h2>
            <p>
              All candidate data in transit is encrypted using TLS 1.3. User account data and scorecards are encrypted at rest using industry-standard AES-256 encryption. We enforce least-privilege access controls across our infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">5. Candidate Rights and Data Deletion</h2>
            <p>
              You maintain complete ownership of your data. You may at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-zinc-300 text-xs">
              <li>Request an export of all past mock interview scorecards and notes.</li>
              <li>Delete specific interview sessions, code history, or resume records.</li>
              <li>Permanently delete your user account and all associated telemetry from our databases.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white">6. Contact and Security Inquiries</h2>
            <p>
              For inquiries regarding this policy or to exercise your privacy rights, please reach out directly to our security engineering team at:
            </p>
            <p className="font-mono text-xs text-zinc-200 bg-zinc-900 px-3 py-2 rounded border border-zinc-800 inline-block">
              security@interviewai.dev
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
