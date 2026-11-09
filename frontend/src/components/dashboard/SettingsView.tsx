"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bot,
  Volume2,
  Shield,
  Save,
  Check,
  Globe,
  Code2,
  FileText,
  Briefcase,
  Building2,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  Tag,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export interface CandidateProfileData {
  name: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  leetcodeUrl: string;
  targetRole: string;
  targetCompany: string;
  targetLevel: string;
  yearsExperience: string;
  techStack: string[];
  resumeBio: string;
  voicePersona: string;
}

export const STORAGE_PROFILE_KEY = "candidate_profile_data";

const POPULAR_TECH_STACKS = [
  "Python",
  "Go",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "Apache Kafka",
  "Kubernetes",
  "Docker",
  "AWS",
  "Distributed Systems",
  "PyTorch",
  "System Design",
];

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  // Profile and links state
  const [name, setName] = useState(user?.name || "Candidate");
  const [email] = useState(user?.email || "candidate@interviewai.dev");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");

  // Career track & resume vault state
  const [targetRole, setTargetRole] = useState("Software Engineer (Backend & Systems)");
  const [targetCompany, setTargetCompany] = useState("Google");
  const [targetLevel, setTargetLevel] = useState("L4 (Mid-Level Engineer)");
  const [yearsExperience, setYearsExperience] = useState("3 - 5 Years");
  const [techStack, setTechStack] = useState<string[]>([
    "Python",
    "Go",
    "PostgreSQL",
    "Redis",
    "Apache Kafka",
  ]);
  const [newTagInput, setNewTagInput] = useState("");
  const [resumeBio, setResumeBio] = useState(
    "Senior Full-Stack & Backend Engineer with 4 years of experience architecting distributed transaction services, event-driven streaming pipelines with Apache Kafka, and resilient PostgreSQL data layers. Focus on low-latency microservices, cache-aside Redis clusters, and fault-tolerant cloud infrastructure."
  );
  const [voicePersona, setVoicePersona] = useState("alexandria");

  // Load stored profile data on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (stored) {
        const parsed: CandidateProfileData = JSON.parse(stored);
        if (parsed.name) setName(parsed.name);
        if (parsed.githubUrl) setGithubUrl(parsed.githubUrl);
        if (parsed.linkedinUrl) setLinkedinUrl(parsed.linkedinUrl);
        if (parsed.portfolioUrl) setPortfolioUrl(parsed.portfolioUrl);
        if (parsed.leetcodeUrl) setLeetcodeUrl(parsed.leetcodeUrl);
        if (parsed.targetRole) setTargetRole(parsed.targetRole);
        if (parsed.targetCompany) setTargetCompany(parsed.targetCompany);
        if (parsed.targetLevel) setTargetLevel(parsed.targetLevel);
        if (parsed.yearsExperience) setYearsExperience(parsed.yearsExperience);
        if (parsed.techStack) setTechStack(parsed.techStack);
        if (parsed.resumeBio) setResumeBio(parsed.resumeBio);
        if (parsed.voicePersona) setVoicePersona(parsed.voicePersona);
      }
    } catch {
      // Ignore read errors
    }
  }, []);

  // Save profile and notify
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const profileData: CandidateProfileData = {
      name,
      email,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
      leetcodeUrl,
      targetRole,
      targetCompany,
      targetLevel,
      yearsExperience,
      techStack,
      resumeBio,
      voicePersona,
    };

    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profileData));
      // Dispatch an event so candidate context updates immediately
      window.dispatchEvent(new Event("candidate_profile_updated"));
    } catch (err) {
      console.warn("Error persisting profile:", err);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2400);
  };

  // Toggle tech stack tag
  const toggleTechTag = (tag: string) => {
    if (techStack.includes(tag)) {
      setTechStack(techStack.filter((t) => t !== tag));
    } else {
      setTechStack([...techStack, tag]);
    }
  };

  // Add custom tech stack tag
  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim();
      if (!techStack.includes(clean)) {
        setTechStack([...techStack, clean]);
      }
      setNewTagInput("");
    }
  };

  return (
    <div className="max-w-4xl space-y-6 select-none">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-zinc-300" />
          <span>Candidate Profile & Interview Vault</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Store your LinkedIn, GitHub, resume summary, and target tech stacks. The AI interviewer uses these details to generate personalized technical architecture scenarios.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Account & Identity */}
        <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Identity & Account</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Henderson"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                readOnly
                value={email}
                className="w-full px-3 py-2 rounded-md bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* 2. Professional Links Vault */}
        <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>Professional Links & Profiles</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">Synced to Interview Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LinkedIn */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>GitHub Profile URL</span>
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            {/* Portfolio / Personal Website */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Personal Portfolio / Blog URL</span>
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://myportfolio.dev"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>

            {/* LeetCode Handle */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1 flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>LeetCode / Competitive Profile URL</span>
              </label>
              <input
                type="url"
                value={leetcodeUrl}
                onChange={(e) => setLeetcodeUrl(e.target.value)}
                placeholder="https://leetcode.com/u/username"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 3. Resume & Career Experience Vault */}
        <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span>Resume Summary & Target Track</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Auto-Personalizes Questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Company</label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="Google">Google</option>
                <option value="Meta">Meta</option>
                <option value="Amazon">Amazon</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Uber">Uber</option>
                <option value="Stripe">Stripe</option>
                <option value="Netflix">Netflix</option>
                <option value="High-Growth Tier-1 Tech">High-Growth Tech</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Seniority Target</label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="L3 (Entry / New Grad)">L3 (Entry / New Grad)</option>
                <option value="L4 (Mid-Level Engineer)">L4 (Mid-Level Engineer)</option>
                <option value="L5 (Senior Software Engineer)">L5 (Senior Software Engineer)</option>
                <option value="L6 (Staff / Tech Lead)">L6 (Staff / Tech Lead)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Distributed Systems Engineer"
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Years of Experience</label>
              <select
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600"
              >
                <option value="0 - 2 Years">0 - 2 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="6 - 8 Years">6 - 8 Years</option>
                <option value="9+ Years">9+ Years</option>
              </select>
            </div>
          </div>

          {/* Primary Tech Stack Tags */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-zinc-300">
              Primary Tech Stack & Tools (Click to toggle or type new)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TECH_STACKS.map((tag) => {
                const isSelected = techStack.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTechTag(tag)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors border cursor-pointer ${
                      isSelected
                        ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                        : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline mr-1 text-emerald-400" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-1 flex items-center gap-2">
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="Type custom technology (e.g. GraphQL, Cassandra) and press Enter..."
                className="flex-1 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
              />
            </div>
          </div>

          {/* Resume Summary / Experience Text */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-medium text-zinc-300">
              Resume Experience Summary & Key Achievements
            </label>
            <textarea
              value={resumeBio}
              onChange={(e) => setResumeBio(e.target.value)}
              rows={4}
              placeholder="Paste your past engineering responsibilities, production systems delivered, key metrics achieved, and architecture leadership examples..."
              className="w-full p-3 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-600 leading-relaxed font-sans focus:outline-none focus:border-zinc-600 resize-none"
            />
            <p className="text-[11px] text-zinc-500 font-mono">
              The AI mock interviewer reads this summary to form custom resume follow-ups in Round 1 and architecture scenarios in Round 2.
            </p>
          </div>
        </div>

        {/* 4. AI Voice Persona Selection */}
        <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-zinc-400" />
            <span>Interviewer Voice Persona</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "alexandria", name: "Alex Vance", desc: "Staff Systems Architect (Rigorous & Technical Lead)" },
              { id: "marcus", name: "Marcus Reed", desc: "Principal Engineer (Algorithmic Depth & Concurrency)" },
              { id: "elena", name: "Elena Rostova", desc: "Engineering Director (High-Scale Distributed Systems)" },
            ].map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => setVoicePersona(persona.id)}
                className={`p-3 rounded-md text-left border transition-colors cursor-pointer ${
                  voicePersona === persona.id
                    ? "bg-zinc-800 border-zinc-600 text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{persona.name}</span>
                  <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">{persona.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Theme & Appearance Mode */}
        <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-zinc-400" />
                <span>Platform Theme &amp; Appearance</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Toggle between KrishanuBuilds Dark Craft mode and High-Craft Paper White mode across the entire platform.
              </p>
            </div>
            <div className="shrink-0">
              <ThemeToggle showLabel />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800 flex items-center justify-between">
          <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono">
            <Shield className="w-3.5 h-3.5" /> Profile stored locally & encrypted in transit
          </span>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Profile Saved</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
