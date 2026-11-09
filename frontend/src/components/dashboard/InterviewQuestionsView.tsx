"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  MessageSquare,
  Cpu,
  Network,
  Layers,
  Database,
  Code,
  Sparkles,
  Braces,
  Atom,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  Check,
  Search,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  INTERVIEW_QUESTION_SUBJECTS,
  PracticeQuestion,
  SubjectQuestionCategory,
} from "@/data/interviewQuestionsData";

export interface InterviewQuestionsViewProps {
  initialSubjectId?: string | null;
  onSelectSubject?: (subjectId: string | null) => void;
  onLaunchSimulation?: () => void;
}

export const InterviewQuestionsView: React.FC<InterviewQuestionsViewProps> = ({
  initialSubjectId = null,
  onSelectSubject,
  onLaunchSimulation,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialSubjectId);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("All questions");
  const [studyMode, setStudyMode] = useState<"learn" | "practice">("practice");
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedQuestionIds, setRevealedQuestionIds] = useState<Set<string>>(new Set());
  const [masteredQuestionIds, setMasteredQuestionIds] = useState<Set<string>>(new Set());

  // Synchronize initialSubjectId if provided
  useEffect(() => {
    if (initialSubjectId) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId]);

  // Load mastered questions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("interviewai_mastered_interview_questions");
      if (stored) {
        setMasteredQuestionIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Update mastered questions in localStorage
  const toggleMastered = (questionId: string) => {
    setMasteredQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      try {
        localStorage.setItem(
          "interviewai_mastered_interview_questions",
          JSON.stringify(Array.from(next))
        );
      } catch {
        // Fallback
      }
      return next;
    });
  };

  // Toggle reveal answer for an individual question
  const toggleReveal = (questionId: string) => {
    setRevealedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  // Reveal all or hide all
  const toggleRevealAll = () => {
    if (!currentSubject) return;
    if (revealedQuestionIds.size === filteredQuestions.length) {
      setRevealedQuestionIds(new Set());
    } else {
      setRevealedQuestionIds(new Set(filteredQuestions.map((q) => q.id)));
    }
  };

  // Current active subject
  const currentSubject: SubjectQuestionCategory | null = useMemo(() => {
    if (!selectedSubjectId) return null;
    return INTERVIEW_QUESTION_SUBJECTS[selectedSubjectId] || null;
  }, [selectedSubjectId]);

  // Filtered questions based on subcategory and search query
  const filteredQuestions = useMemo(() => {
    if (!currentSubject) return [];
    return currentSubject.questions.filter((q) => {
      const matchesCategory =
        activeCategoryFilter === "All questions" || q.category === activeCategoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.modelAnswer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [currentSubject, activeCategoryFilter, searchQuery]);

  // Handle selecting a subject card
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setActiveCategoryFilter("All questions");
    setSearchQuery("");
    setRevealedQuestionIds(new Set());
    if (onSelectSubject) {
      onSelectSubject(subjectId);
    }
  };

  // Return to all categories grid
  const handleBackToCategories = () => {
    setSelectedSubjectId(null);
    setActiveCategoryFilter("All questions");
    setSearchQuery("");
    setRevealedQuestionIds(new Set());
    if (onSelectSubject) {
      onSelectSubject(null);
    }
  };

  // Render icon helper
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "MessageSquare":
        return <MessageSquare className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Network":
        return <Network className={className} />;
      case "Layers":
        return <Layers className={className} />;
      case "Database":
        return <Database className={className} />;
      case "Code":
        return <Code className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Braces":
        return <Braces className={className} />;
      case "Atom":
        return <Atom className={className} />;
      default:
        return <Code className={className} />;
    }
  };

  // ----------------------------------------------------
  // VIEW 1: DOMAIN CATEGORIES GRID (Image 1)
  // ----------------------------------------------------
  if (!currentSubject) {
    return (
      <div className="space-y-6 animate-fadeIn pb-12">
        {/* Header Banner */}
        <div className="rounded-lg bg-[#111115] border border-zinc-800/80 p-6 sm:p-7">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-800/90 text-[11px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>CURATED INTERVIEW QUESTION BANK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Interview Questions
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Select a domain to practice high-frequency interview questions with structured model answers, evaluation rubrics, and STAR frameworks.
            </p>
          </div>
        </div>

        {/* 9 Domain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {Object.values(INTERVIEW_QUESTION_SUBJECTS).map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleSelectSubject(sub.id)}
              className="group rounded-lg bg-[#111115] border border-zinc-800/80 hover:border-zinc-700/90 hover:bg-[#15151a] p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top: Icon and Question Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    {renderIcon(sub.icon, "w-5 h-5")}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {sub.questionCount} questions
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-zinc-100 transition-colors">
                  {sub.title}
                </h2>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {sub.description}
                </p>
              </div>

              {/* Bottom: Start practicing link */}
              <div className="pt-5 mt-4 border-t border-zinc-850/60 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 group-hover:text-white transition-colors">
                  <span>Start practicing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400">
                  {sub.categories.length} tracks
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: PRACTICE QUESTIONS VIEW (Image 2)
  // ----------------------------------------------------
  const allRevealed = filteredQuestions.length > 0 && revealedQuestionIds.size === filteredQuestions.length;

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* Top Header Bar: Back to Categories & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Left: Breadcrumb / Category Back & Question Count */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={handleBackToCategories}
            className="text-xs font-medium text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-zinc-400" />
            <span>Categories</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {currentSubject.title}
            </h1>
            <span className="text-xs text-zinc-500 font-mono">
              Showing {filteredQuestions.length} of {currentSubject.questionCount}
            </span>
          </div>
        </div>

        {/* Right: Learn / Practice Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick Reveal / Hide All in Learn Mode */}
          <button
            type="button"
            onClick={toggleRevealAll}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border border-zinc-800 transition-colors"
          >
            {allRevealed ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Hide all answers</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Reveal all answers</span>
              </>
            )}
          </button>

          {/* Toggle Button Group: Learn vs Practice */}
          <div className="inline-flex rounded-lg bg-zinc-900 border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={() => {
                setStudyMode("learn");
                setRevealedQuestionIds(new Set(filteredQuestions.map((q) => q.id)));
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                studyMode === "learn"
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Learn</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStudyMode("practice");
                setRevealedQuestionIds(new Set());
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                studyMode === "practice"
                  ? "bg-white text-black font-semibold shadow-xs"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Practice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips / Subcategories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
        {/* All Questions Chip */}
        <button
          type="button"
          onClick={() => setActiveCategoryFilter("All questions")}
          className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeCategoryFilter === "All questions"
              ? "bg-white text-black font-semibold shadow-xs"
              : "bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
          }`}
        >
          All questions
        </button>

        {/* Dynamic Category Chips */}
        {currentSubject.categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCategoryFilter === cat
                ? "bg-white text-black font-semibold shadow-xs"
                : "bg-zinc-900/60 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="rounded-lg bg-[#111115] border border-zinc-800/80 p-12 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-semibold text-zinc-200">No questions found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              No questions matched the selected category filter. Try selecting &quot;All questions&quot; to view all questions.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategoryFilter("All questions")}
              className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
            >
              Reset filter
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isRevealed = revealedQuestionIds.has(q.id) || studyMode === "learn";
            const isMastered = masteredQuestionIds.has(q.id);

            return (
              <div
                key={q.id}
                className={`rounded-lg bg-[#111115] border transition-all duration-200 overflow-hidden ${
                  isRevealed
                    ? "border-zinc-700/80 shadow-xs"
                    : "border-zinc-800/80 hover:border-zinc-750"
                }`}
              >
                {/* Question Header Card */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                    {/* Index Number */}
                    <span className="text-xs sm:text-sm font-mono font-bold text-zinc-500 pt-0.5 shrink-0 select-none">
                      {q.number}
                    </span>

                    {/* Question Content */}
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider block">
                        {q.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-zinc-100 leading-snug">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Actions: Reveal Answer & Mastered Toggle */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    {/* Mastered Status Button */}
                    <button
                      type="button"
                      onClick={() => toggleMastered(q.id)}
                      title={isMastered ? "Marked as mastered" : "Mark as mastered"}
                      className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                        isMastered
                          ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>

                    {/* Reveal Answer Button */}
                    <button
                      type="button"
                      onClick={() => toggleReveal(q.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        isRevealed
                          ? "bg-zinc-800 text-zinc-200 border border-zinc-700/60"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 border border-transparent hover:border-zinc-800"
                      }`}
                    >
                      {isRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Hide answer</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Reveal answer</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isRevealed && (
                  <div className="border-t border-zinc-800/80 bg-[#0d0d10] p-4 sm:p-6 space-y-5 animate-fadeIn">
                    {/* Model Answer */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Model Answer & Strategy</span>
                      </h4>
                      <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line pl-0.5">
                        {q.modelAnswer}
                      </div>
                    </div>

                    {/* What Interviewers Look For */}
                    {q.whatInterviewerLooksFor && (
                      <div className="p-3.5 rounded-md bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                        <span className="text-[11px] font-mono font-semibold text-emerald-400 uppercase tracking-wide block">
                          Evaluation Signal
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {q.whatInterviewerLooksFor}
                        </p>
                      </div>
                    )}

                    {/* Key Points to Include */}
                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                          Key Takeaways & Guardrails
                        </h4>
                        <ul className="space-y-1.5">
                          {q.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Example High-Scoring Response (if available) */}
                    {q.exampleResponse && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider">
                          Example High-Scoring Delivery
                        </h4>
                        <div className="p-3.5 rounded-md bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-200 leading-relaxed italic border-l-2 border-l-emerald-500">
                          &quot;{q.exampleResponse}&quot;
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
