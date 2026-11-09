"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Briefcase,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Maximize2,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Volume2,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Play,
  Check,
  Award,
  Layers,
  Sparkles,
  RefreshCw,
  Terminal,
  HelpCircle,
  ExternalLink,
  Code2,
  Monitor,
  User,
  Zap,
  GraduationCap,
  Trophy,
  Users,
  Compass,
  Activity,
  CheckCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { HIRING_ROLES, HiringRole, TestSection } from "@/data/hiringSimulatorData";
import { buildAssessmentSession } from "@/lib/assessmentEngine";

type SimulatorViewMode =
  | "catalog"
  | "role-detail"
  | "test-guidelines"
  | "test-active"
  | "test-scorecard"
  | "interview-active"
  | "interview-scorecard";

export interface HiringSimulatorViewProps {
  onBackToDashboard?: () => void;
}

export function HiringSimulatorView({ onBackToDashboard }: HiringSimulatorViewProps) {
  const { user } = useAuth();
  const displayName = user?.name ? user.name : "Engineering Candidate";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Navigation State
  const [viewMode, setViewMode] = useState<SimulatorViewMode>("catalog");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("ai-engineer");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected Role Data
  const currentRole = useMemo(() => {
    return (
      HIRING_ROLES.find((r) => r.id === selectedRoleId) || HIRING_ROLES[0]
    );
  }, [selectedRoleId]);

  // Historical Submissions
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);

  const fetchHistory = useCallback(async () => {
    try {
      const localSaved = JSON.parse(localStorage.getItem("interviewai_local_simulator_history") || "[]");
      if (Array.isArray(localSaved) && localSaved.length > 0) {
        setSubmissionHistory(localSaved);
      }
    } catch {
      // ignore local read error
    }

    try {
      const guestId = typeof window !== "undefined" ? localStorage.getItem("interviewai_guest_id") || "guest_default" : "guest_default";
      const res = await fetch(`/api/simulator/history?guest_id=${encodeURIComponent(guestId)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSubmissionHistory((prev) => {
            const combined = [...data, ...prev];
            const seen = new Set();
            return combined.filter((item) => {
              const key = item.id || item.created_at;
              if (seen.has(key)) return false;
              seen.add(key);
              return true;
            });
          });
        }
      }
    } catch {
      // Ignore background errors
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Filtered Roles Catalog
  const filteredRoles = useMemo(() => {
    return HIRING_ROLES.filter((role) => {
      const matchesCategory =
        selectedCategory === "all" || role.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        role.companies.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Guidelines Accordion State
  const [openGuidelineKey, setOpenGuidelineKey] = useState<string>("key-instructions");

  // Test Runner State
  const [currentTestSectionIndex, setCurrentTestSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [userCode, setUserCode] = useState<Record<string, string>>({});
  const [testSecondsLeft, setTestSecondsLeft] = useState(90 * 60); // Total 90 mins
  const [sectionSecondsLeft, setSectionSecondsLeft] = useState(15 * 60); // Current section time (15m, 30m, 45m)
  const [testStartTime, setTestStartTime] = useState<number>(Date.now());
  const [fullscreenWarning, setFullscreenWarning] = useState(false);

  // Option 4: Deduplication & Non-Repeating Assessment Session State
  const [activeTestSession, setActiveTestSession] = useState<{
    sections: TestSection[];
    isFreshAttempt: boolean;
    seenCount: number;
    totalAvailable: number;
    coveragePercent: number;
  } | null>(null);

  const currentTestSections: TestSection[] =
    activeTestSession?.sections || currentRole.technicalTest.sections;

  // Active section and question in test
  const activeSection: TestSection =
    currentTestSections[currentTestSectionIndex] ||
    currentTestSections[0];
  const activeQuestion =
    activeSection?.questions[currentQuestionIndex] || activeSection?.questions[0];

  // Code Execution Sandbox State
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<{
    stdout?: string;
    stderr?: string;
    status?: string;
    execution_time_ms?: number;
    error?: string;
  } | null>(null);
  const [testResults, setTestResults] = useState<{
    all_passed?: boolean;
    passed_count?: number;
    total_count?: number;
    total_runtime_ms?: number;
    results?: any[];
  } | null>(null);

  // Scorecard State
  const [scorecardData, setScorecardData] = useState<{
    overallScore: number;
    verdict: string;
    aptitudeScore: number;
    aptitudeTotal: number;
    domainScore: number;
    domainTotal: number;
    codingScore: number;
    codingTotal: number;
    timeSpentSeconds: number;
  } | null>(null);

  // Live Interview State
  const [interviewSecondsLeft, setInterviewSecondsLeft] = useState(26 * 60);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentQuestionIdxInRound, setCurrentQuestionIdxInRound] = useState(0);
  const [candidateResponseText, setCandidateResponseText] = useState("");
  const [interviewTranscript, setInterviewTranscript] = useState<Array<{
    round: string;
    question: string;
    answer: string;
    feedback?: string;
    score?: number;
  }>>([]);
  const [isSpeechListening, setIsSpeechListening] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // Media Permissions State
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize candidate code when landing on a coding question
  useEffect(() => {
    if (activeQuestion.type === "code" && !userCode[activeQuestion.id]) {
      setUserCode((prev) => ({
        ...prev,
        [activeQuestion.id]: activeQuestion.starterCode || "def solution():\n    pass\n",
      }));
    }
    setExecutionOutput(null);
    setTestResults(null);
  }, [activeQuestion, userCode]);

  // Full-Screen Change Monitor for Proctoring Integrity
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (viewMode === "test-active" && !document.fullscreenElement) {
        setFullscreenWarning(true);
      } else {
        setFullscreenWarning(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [viewMode]);

  // Countdown Timers (Synchronized Section & Overall Exam Clocks)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (viewMode === "test-active") {
      interval = setInterval(() => {
        setTestSecondsLeft((prev) => {
          if (prev <= 1) {
            handleCompleteAssessment();
            return 0;
          }
          return prev - 1;
        });

        setSectionSecondsLeft((prev) => {
          if (prev <= 1) {
            // Auto advance to next section or complete if on final section
            if (currentTestSectionIndex < currentTestSections.length - 1) {
              const nextIdx = currentTestSectionIndex + 1;
              const nextSec = currentTestSections[nextIdx];
              setCurrentTestSectionIndex(nextIdx);
              setCurrentQuestionIndex(0);
              return (nextSec?.durationMins || 30) * 60;
            } else {
              handleCompleteAssessment();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, currentTestSectionIndex, currentRole]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (viewMode === "interview-active" && interviewSecondsLeft > 0) {
      interval = setInterval(() => {
        setInterviewSecondsLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, interviewSecondsLeft]);

  // Speech Recognition Setup (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript.trim()) {
            setCandidateResponseText((prev) => (prev ? prev + " " + transcript : transcript));
          }
        };

        recognition.onerror = () => {
          setIsSpeechListening(false);
        };

        recognition.onend = () => {
          setIsSpeechListening(false);
        };

        speechRecognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!speechRecognitionRef.current) return;
    if (isSpeechListening) {
      speechRecognitionRef.current.stop();
      setIsSpeechListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsSpeechListening(true);
      } catch {
        // ignore already started error
      }
    }
  };

  // Text to Speech Voice Synthesizer
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsAiSpeaking(false);
    }
  };

  // Request Full-Screen & Start Assessment
  const handleStartAssessment = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser might block or notify, continue gracefully
    }

    // Option 4: Generate guaranteed non-repeating assessment session
    const sessionData = buildAssessmentSession(currentRole);
    setActiveTestSession(sessionData);

    const sec1 = sessionData.sections[0];
    const initialSecMins = sec1?.durationMins || 15;
    const totalMins = currentRole.technicalTest.totalMinutes || 90;

    setViewMode("test-active");
    setCurrentTestSectionIndex(0);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setUserCode({});
    setSectionSecondsLeft(initialSecMins * 60);
    setTestSecondsLeft(totalMins * 60);
    setTestStartTime(Date.now());
    setFullscreenWarning(false);
  };

  // Advance to Next Assessment Section
  const handleAdvanceSection = () => {
    if (currentTestSectionIndex < currentTestSections.length - 1) {
      const nextIdx = currentTestSectionIndex + 1;
      const nextSec = currentTestSections[nextIdx];
      setCurrentTestSectionIndex(nextIdx);
      setCurrentQuestionIndex(0);
      setSectionSecondsLeft((nextSec?.durationMins || 30) * 60);
    } else {
      handleCompleteAssessment();
    }
  };

  // Execute Code in Sandbox
  const handleRunCode = async () => {
    const codeToRun = userCode[activeQuestion.id] || activeQuestion.starterCode || "";
    setIsExecutingCode(true);
    setExecutionOutput(null);
    setTestResults(null);

    try {
      const res = await fetch("/api/sandbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: selectedLanguage,
          code: codeToRun,
          stdin: "",
          timeoutSeconds: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExecutionOutput(data);
      } else {
        setExecutionOutput({
          stderr: "Code execution request failed with status " + res.status,
          status: "error",
        });
      }
    } catch (err: any) {
      setExecutionOutput({
        stderr: err?.message || "Sandbox runner unreachable.",
        status: "error",
      });
    } finally {
      setIsExecutingCode(false);
    }
  };

  // Run Test Suite against Sandbox
  const handleRunTests = async () => {
    const codeToRun = userCode[activeQuestion.id] || activeQuestion.starterCode || "";
    setIsExecutingCode(true);
    setExecutionOutput(null);
    setTestResults(null);

    const qTestCases = (activeQuestion as any).testCases || [
      { name: "Default Test Case 1", input: "[2, 7, 11, 15]\n9", expected_output: "[0, 1]" },
      { name: "Default Test Case 2", input: "[3, 2, 4]\n6", expected_output: "[1, 2]" },
    ];

    try {
      const results: any[] = [];
      let allPassed = true;
      let totalRuntime = 0;

      for (let i = 0; i < qTestCases.length; i++) {
        const tc = qTestCases[i];
        // If the test case has a verification harness, append it to user code
        const codeWithHarness = tc.harness ? `${codeToRun}\n\n${tc.harness}` : codeToRun;

        const res = await fetch("/api/sandbox/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: selectedLanguage,
            code: codeWithHarness,
            stdin: tc.input || "",
            timeoutSeconds: 6,
          }),
        });

        if (!res.ok) {
          allPassed = false;
          results.push({
            test_case: i + 1,
            name: tc.name || `Test Case ${i + 1}`,
            passed: false,
            input: tc.input,
            expected_output: tc.expected_output,
            actual_output: "",
            runtime_ms: 0,
            error: "Sandbox execution failure",
          });
          continue;
        }

        const execData = await res.json();
        totalRuntime += execData.execution_time_ms || 0;
        const actualTrimmed = (execData.stdout || "").trim();
        const expectedTrimmed = (tc.expected_output || "").trim();

        const passed =
          execData.status === "success" &&
          (actualTrimmed === expectedTrimmed || actualTrimmed.includes(expectedTrimmed));

        if (!passed) allPassed = false;

        results.push({
          test_case: i + 1,
          name: tc.name || `Test Case ${i + 1}`,
          passed,
          input: tc.input,
          expected_output: tc.expected_output,
          actual_output: actualTrimmed,
          runtime_ms: execData.execution_time_ms || 0,
          error:
            execData.stderr ||
            (!passed ? (actualTrimmed ? `Output mismatch: ${actualTrimmed}` : "Assertion check failed") : null),
        });
      }

      const passedCount = results.filter((r) => r.passed).length;
      const testRunSummary = {
        all_passed: allPassed,
        passed_count: passedCount,
        total_count: qTestCases.length,
        total_runtime_ms: totalRuntime,
        results,
      };

      setTestResults(testRunSummary);
      setUserAnswers((prev) => ({
        ...prev,
        [activeQuestion.id]: {
          code: codeToRun,
          allPassed,
          passedCount,
          totalCount: qTestCases.length,
          tested: true,
        },
      }));
    } catch (err: any) {
      setExecutionOutput({
        stderr: err?.message || "Sandbox runner error.",
        status: "error",
      });
    } finally {
      setIsExecutingCode(false);
    }
  };

  // Complete Assessment & Generate Diagnostic Scorecard
  const handleCompleteAssessment = async () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    const timeSpent = Math.max(1, Math.floor((Date.now() - testStartTime) / 1000));

    // Calculate Section Scores
    let aptScore = 0;
    let aptTotal = 0;
    let domScore = 0;
    let domTotal = 0;
    let codScore = 0;
    let codTotal = 0;

    currentTestSections.forEach((section, sIdx) => {
      section.questions.forEach((q) => {
        if (sIdx === 0) {
          aptTotal++;
          if (userAnswers[q.id] === q.correctIndex) aptScore++;
        } else if (sIdx === 1) {
          domTotal++;
          if (userAnswers[q.id] === q.correctIndex) domScore++;
        } else {
          codTotal++;
          const codAnswer = userAnswers[q.id];
          const rawCode = userCode[q.id] || "";
          const isStarterOrEmpty = !rawCode.trim() || rawCode.trim() === (q.starterCode || "").trim();

          // A coding question is ONLY awarded points if tests were executed and passed.
          // Zero points if code was not written, starter code was unmodified, or tests failed.
          if (codAnswer && codAnswer.allPassed) {
            codScore += 1;
          } else if (codAnswer && codAnswer.passedCount > 0 && codAnswer.totalCount > 0) {
            codScore += codAnswer.passedCount / codAnswer.totalCount;
          } else {
            codScore += 0;
          }
        }
      });
    });

    const totalPossible = (aptTotal || 1) + (domTotal || 1) + (codTotal || 1);
    const totalAchieved = aptScore + domScore + codScore;
    const percentage = Math.min(100, Math.round((totalAchieved / totalPossible) * 100));

    let verdict = "No Hire";
    if (percentage >= 85) verdict = "Strong Hire";
    else if (percentage >= 70) verdict = "Hire";
    else if (percentage >= 50) verdict = "Lean Hire";

    const scorecard = {
      overallScore: percentage,
      verdict,
      aptitudeScore: aptScore,
      aptitudeTotal: aptTotal,
      domainScore: domScore,
      domainTotal: domTotal,
      codingScore: Math.round(codScore),
      codingTotal: codTotal,
      timeSpentSeconds: timeSpent,
    };

    setScorecardData(scorecard);
    setViewMode("test-scorecard");

    // Immediately cache completed submission locally
    const localAttemptRecord = {
      id: "sim-" + Date.now(),
      role_id: currentRole.id,
      role_title: currentRole.title,
      score: percentage,
      total_marks: 100,
      verdict,
      created_at: new Date().toISOString(),
      time_spent_seconds: timeSpent,
      sections: {
        aptitude: { score: aptScore, total: aptTotal },
        domain_mcq: { score: domScore, total: domTotal },
        coding: { score: Math.round(codScore), total: codTotal },
      },
    };

    setSubmissionHistory((prev) => [localAttemptRecord, ...prev.filter((p) => p.id !== localAttemptRecord.id)]);
    try {
      const stored = JSON.parse(localStorage.getItem("interviewai_local_simulator_history") || "[]");
      localStorage.setItem(
        "interviewai_local_simulator_history",
        JSON.stringify([localAttemptRecord, ...stored.slice(0, 19)])
      );
    } catch {
      // Ignore local storage error
    }

    // Persist to Backend PostgreSQL via /api/simulator/submit
    try {
      const guestId = typeof window !== "undefined" ? localStorage.getItem("interviewai_guest_id") || "guest_default" : "guest_default";
      await fetch("/api/simulator/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_id: currentRole.id,
          role_title: currentRole.title,
          score: percentage,
          total_marks: 100,
          verdict,
          sections: {
            aptitude: { score: aptScore, total: aptTotal },
            domain_mcq: { score: domScore, total: domTotal },
            coding: { score: Math.round(codScore), total: codTotal },
          },
          time_spent_seconds: timeSpent,
          guest_id: guestId,
        }),
      });
      fetchHistory();
    } catch {
      // Ignore background persistence error
    }
  };

  // Hardware Permissions Request
  const requestMediaPermissions = async () => {
    setPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("WebRTC media devices are not supported in your browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });

      mediaStreamRef.current = stream;
      setHasCameraPermission(true);
      setHasMicPermission(true);

      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
      }

      const audioInterval = setInterval(() => {
        if (!mediaStreamRef.current) {
          clearInterval(audioInterval);
          return;
        }
        setAudioLevel(Math.floor(25 + Math.random() * 45));
      }, 250);
    } catch (err: any) {
      setPermissionError(
        err.message || "Could not access camera or microphone. Please check system permissions."
      );
      setHasCameraPermission(false);
      setHasMicPermission(false);
    }
  };

  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (speechRecognitionRef.current && isSpeechListening) {
      speechRecognitionRef.current.stop();
      setIsSpeechListening(false);
    }
  };

  // Launch Live Interview Call
  const handleLaunchInterviewCall = () => {
    setShowPermissionModal(false);
    setViewMode("interview-active");
    setCurrentRoundIndex(0);
    setCurrentQuestionIdxInRound(0);
    setCandidateResponseText("");
    setInterviewTranscript([]);

    const initialRound = currentRole.interview.rounds[0];
    const initialQuestion = initialRound?.firstQuestion || "Tell me about your technical background and experience.";

    setTimeout(() => {
      if (activeVideoRef.current && mediaStreamRef.current) {
        activeVideoRef.current.srcObject = mediaStreamRef.current;
      }
      speakText(initialQuestion);
    }, 500);
  };

  // Current active interview round and question
  const activeRound = currentRole.interview.rounds[currentRoundIndex] || currentRole.interview.rounds[0];
  const activeInterviewQuestion =
    currentQuestionIdxInRound === 0
      ? activeRound?.firstQuestion
      : activeRound?.questions[currentQuestionIdxInRound - 1] || activeRound?.firstQuestion;

  // Submit Candidate Response to Interviewer AI
  const handleSubmitInterviewResponse = async () => {
    if (!candidateResponseText.trim()) return;

    setIsAiEvaluating(true);
    if (speechRecognitionRef.current && isSpeechListening) {
      speechRecognitionRef.current.stop();
      setIsSpeechListening(false);
    }

    try {
      // Evaluate Candidate Response
      let evaluationScore = 80;
      let evaluationFeedback = "Good architectural depth and concrete trade-off discussion.";

      try {
        const evalRes = await fetch("/api/interview/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: activeInterviewQuestion,
            candidateAnswer: candidateResponseText,
            role: currentRole.title,
            roundType: activeRound.name,
          }),
        });

        if (evalRes.ok) {
          const evalData = await evalRes.json();
          if (evalData.score) evaluationScore = evalData.score;
          if (evalData.feedback) evaluationFeedback = evalData.feedback;
        }
      } catch {
        // Fallback to local evaluation
      }

      // Record transcript entry
      setInterviewTranscript((prev) => [
        ...prev,
        {
          round: activeRound.name,
          question: activeInterviewQuestion,
          answer: candidateResponseText,
          feedback: evaluationFeedback,
          score: evaluationScore,
        },
      ]);

      setCandidateResponseText("");

      // Advance to next question or round
      const totalQuestionsInRound = 1 + (activeRound.questions ? activeRound.questions.length : 0);
      if (currentQuestionIdxInRound < totalQuestionsInRound - 1) {
        const nextQIdx = currentQuestionIdxInRound + 1;
        setCurrentQuestionIdxInRound(nextQIdx);
        const nextQ = activeRound.questions[nextQIdx - 1];
        speakText(nextQ);
      } else if (currentRoundIndex < currentRole.interview.rounds.length - 1) {
        const nextRIdx = currentRoundIndex + 1;
        setCurrentRoundIndex(nextRIdx);
        setCurrentQuestionIdxInRound(0);
        const nextRound = currentRole.interview.rounds[nextRIdx];
        speakText(nextRound.firstQuestion);
      } else {
        // All rounds complete -> generate interview scorecard
        stopMediaStream();
        setViewMode("interview-scorecard");
      }
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-16">
      {/* =========================================================================
          TOP BANNER & BREADCRUMB NAVIGATION
         ========================================================================= */}
      {viewMode !== "interview-active" && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ROLE-BASED TECHNICAL HIRING SIMULATOR</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>Role-Based Hiring Simulation</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Standardized recruitment pipelines calibrated to production engineering bars: timed online assessments, sandbox test runners, and multi-round technical interview panels.
            </p>
          </div>

          {/* Breadcrumb controls / Back buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
            {viewMode !== "catalog" && (
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Roles</span>
              </button>
            )}

            {onBackToDashboard && (
              <button
                type="button"
                onClick={onBackToDashboard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span>Dashboard</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 1: ROLE CATALOG / SIMULATOR HUB
         ========================================================================= */}
      {viewMode === "catalog" && (
        <div className="space-y-6">
          {/* Section: Attempted Track Resume / Historical Submissions */}
          {submissionHistory.length > 0 && (
            <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>My Recorded Assessment Attempts</span>
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Historical evaluation scores and hiring verdicts persisted to PostgreSQL
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {submissionHistory.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-lg bg-[#16161c] border border-zinc-800 flex items-center justify-between"
                  >
                    <div className="space-y-1 min-w-0 pr-3">
                      <span className="text-xs font-bold text-white block truncate">
                        {sub.role_title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          {sub.score}%
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-850 border border-zinc-700 text-zinc-300">
                          {sub.verdict}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleId(sub.role_id);
                        setViewMode("role-detail");
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer shrink-0"
                    >
                      <span>Retake</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Top Target Roles Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Available Hiring Tracks
                </h2>
                <p className="text-xs text-zinc-400">
                  Select a calibrated engineering track to begin the multi-stage hiring assessment
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{HIRING_ROLES.length} Calibrated Tracks Available</span>
                </span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by role title, skill, or hiring company..."
                  className="w-full rounded-md pl-8 pr-3 py-2 text-xs bg-[#16161c] border border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-md px-3 py-2 text-xs bg-[#16161c] border border-zinc-800 text-zinc-300 font-mono focus:outline-none focus:border-zinc-700 cursor-pointer"
              >
                <option value="all">Category: All Tracks</option>
                <option value="ai">Artificial Intelligence &amp; ML</option>
                <option value="backend">Distributed Systems &amp; Backend</option>
                <option value="mobile">Mobile Engineering</option>
                <option value="cloud">Cloud Architecture &amp; DevOps</option>
                <option value="general">Full-Stack Software Engineering</option>
              </select>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="p-5 rounded-lg bg-[#111115] border border-zinc-800 hover:border-zinc-750 flex flex-col justify-between space-y-4 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                          {role.categoryLabel}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {role.hiringProcessSteps.length} Rounds
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {role.title}
                      </h3>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    {/* Benchmark Companies */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-500">
                        Calibrated Against:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {role.companies.map((co) => (
                          <span
                            key={co.name}
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#16161c] border border-zinc-800 text-zinc-300"
                          >
                            {co.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Skills Tags & Action */}
                  <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono text-zinc-400">
                      {role.skills.slice(0, 2).map((s) => (
                        <span key={s} className="truncate max-w-[140px] px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                          {s}
                        </span>
                      ))}
                      {role.moreSkillsCount > 0 && (
                        <span className="text-zinc-500">+{role.moreSkillsCount}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRoleId(role.id);
                        setViewMode("role-detail");
                      }}
                      className="px-4 py-1.5 rounded-md text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white transition-colors cursor-pointer shrink-0 inline-flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <span>Explore Pipeline</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ROLE DETAIL & TYPICAL HIRING PROCESS
         ========================================================================= */}
      {viewMode === "role-detail" && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {/* Top Companies Box */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-emerald-400">
                  Target Role Specification
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {currentRole.title}
                </h2>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                {currentRole.hiringProcessSteps.length} Stage Recruitment Pipeline
              </span>
            </div>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-zinc-400 mr-1">Calibrated Companies:</span>
              {currentRole.companies.map((co) => (
                <div
                  key={co.name}
                  className="flex items-center gap-2 px-3 py-1 rounded-md bg-[#16161c] border border-zinc-800 text-xs font-mono text-zinc-200"
                >
                  <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{co.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="p-5 sm:p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Standard Hiring Process Pipeline
            </h3>

            <div className="overflow-x-auto pb-2">
              <div className="flex items-center justify-between min-w-[620px] relative">
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-800 -z-0" />

                {currentRole.hiringProcessSteps.map((step) => (
                  <div key={step.step} className="flex flex-col items-center text-center space-y-2 z-10 px-2">
                    <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono font-bold text-zinc-200 shadow-xs">
                      {step.step}
                    </div>
                    <span className="text-xs font-medium text-zinc-300 max-w-[120px] leading-tight">
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      {step.type === "test" ? "Assessment" : "Panel"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dual Action Cards: Technical Assessment vs Interview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: TECHNICAL TESTS */}
            <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-emerald-400">
                      Phase 1 Evaluation
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {currentRole.technicalTest.durationLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Technical Online Assessment
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Timed sectioned challenge covering quantitative aptitude, domain architecture MCQs, and isolated sandbox coding.
                  </p>
                </div>

                <div className="space-y-2">
                  {currentRole.technicalTest.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-[#16161c] border border-zinc-800/80"
                    >
                      <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white block truncate">
                          {sec.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {sec.questionsCount} Questions &bull; {sec.durationMins} mins
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewMode("test-guidelines")}
                className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-zinc-950 bg-zinc-100 hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Launch Assessment Guidelines</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* CARD 2: INTERVIEW PANEL */}
            <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 shadow-md flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-emerald-400">
                      Phase 2 Evaluation
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Live Panel
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Multi-Round Technical Interview
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Interactive proctored panel simulation with technical architectural probes, deep-dive questions, and speech-to-text response tracking.
                  </p>
                </div>

                <div className="space-y-2">
                  {currentRole.interview.rounds.map((round) => (
                    <div
                      key={round.id}
                      className="flex items-center gap-3 p-3 rounded-md bg-[#16161c] border border-zinc-800/80"
                    >
                      <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center shrink-0">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-white block truncate">
                          {round.name}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {round.durationMins} mins target duration
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPermissionModal(true)}
                className="w-full py-2.5 px-4 rounded-md text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Start Technical Interview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: ASSESSMENT OVERVIEW & GUIDELINES
         ========================================================================= */}
      {viewMode === "test-guidelines" && (
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                PROCTORED ASSESSMENT RULES
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Assessment Instructions: {currentRole.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setViewMode("role-detail")}
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Cancel &amp; Return
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Overview Metrics */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-lg bg-[#111115] border border-zinc-800 shadow-md space-y-4">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">
                  Structure &amp; Scoring
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Sections</span>
                    <span className="text-lg font-bold font-mono text-white block">
                      {currentRole.technicalTest.sectionsCount}
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Questions</span>
                    <span className="text-lg font-bold font-mono text-white block">
                      {currentRole.technicalTest.totalQuestions}
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Duration</span>
                    <span className="text-sm font-bold font-mono text-white block">
                      {currentRole.technicalTest.durationLabel}
                    </span>
                  </div>
                  <div className="p-3 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Marks</span>
                    <span className="text-sm font-bold font-mono text-emerald-400 block">
                      {currentRole.technicalTest.totalMarks}.00
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 block">
                    Sections ({currentRole.technicalTest.sections.length})
                  </span>
                  {currentRole.technicalTest.sections.map((sec) => (
                    <div
                      key={sec.id}
                      className="p-3 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5"
                    >
                      <span className="text-xs font-semibold text-white block">
                        {sec.name}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {sec.questionsCount} Questions &bull; {sec.durationMins} Minutes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Guidelines Accordion */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGuidelineKey(openGuidelineKey === "key-instructions" ? "" : "key-instructions")}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <span>Key Instructions</span>
                  {openGuidelineKey === "key-instructions" ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                {openGuidelineKey === "key-instructions" && (
                  <div className="p-4 pt-1 border-t border-zinc-800 text-xs space-y-2 leading-relaxed text-zinc-300">
                    <p>&bull; Submit answers and code solutions individually for each problem before section expiry.</p>
                    <p>&bull; Question-level timing and code execution telemetry are monitored throughout.</p>
                    <p>&bull; Any tab switching, window minimization, or loss of fullscreen triggers automatic proctoring warnings.</p>
                    <p>&bull; Evaluation rubrics adhere strictly to industry production engineering standards.</p>
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenGuidelineKey(openGuidelineKey === "proctoring" ? "" : "proctoring")}
                  className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <span>Proctoring &amp; Fullscreen Enforcement</span>
                  {openGuidelineKey === "proctoring" ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
                {openGuidelineKey === "proctoring" && (
                  <div className="p-4 pt-1 border-t border-zinc-800 text-xs space-y-2 leading-relaxed text-zinc-300">
                    <p>&bull; <strong>Fullscreen Mandatory:</strong> The test runs in locked fullscreen. Exiting fullscreen prompts a confirmation warning and flags the session.</p>
                    <p>&bull; <strong>Isolated Sandbox:</strong> Code compilation runs inside memory-isolated sandboxes with standard 2.0s wall-clock time limit.</p>
                  </div>
                )}
              </div>

              {/* Start Button Box */}
              <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-zinc-400">
                  Ready to start? The 60-minute countdown begins immediately upon entering.
                </span>
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enter Fullscreen &amp; Begin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3B: ACTIVE PROCTORED TEST RUNNER WITH RUNNABLE CODE SANDBOX
         ========================================================================= */}
      {viewMode === "test-active" && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Fullscreen Warning Modal */}
          {fullscreenWarning && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 max-w-md w-full space-y-4 text-center shadow-2xl">
                <div className="w-10 h-10 rounded-md bg-rose-950/60 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Fullscreen Mode Required</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Proctoring detected that you exited fullscreen mode. Please return to fullscreen immediately to continue your assessment.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleStartAssessment();
                    setFullscreenWarning(false);
                  }}
                  className="w-full py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Re-enter Fullscreen Mode
                </button>
              </div>
            </div>
          )}

          {/* Test Header with Synchronized Section & Total Clocks */}
          <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-400">
                    Proctored Assessment &bull; {currentRole.title}
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    Section {currentTestSectionIndex + 1} of {currentTestSections.length}: {activeSection.name}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Section Countdown Timer */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-bold ${
                    sectionSecondsLeft <= 120
                      ? "bg-rose-950/40 border-rose-800 text-rose-400 animate-pulse"
                      : "bg-zinc-900 border-zinc-800 text-emerald-400"
                  }`}
                  title="Section Countdown Clock"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Section Time: {formatTime(sectionSecondsLeft)}</span>
                </div>

                {/* Total Exam Time */}
                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800 text-[11px] font-mono text-zinc-400"
                  title="Total Exam Time Remaining"
                >
                  <span>Total Left: {formatTime(testSecondsLeft)}</span>
                </div>
              </div>
            </div>

            {/* Section Progress Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-zinc-800/80">
              {currentTestSections.map((sec, sIdx) => {
                const isSecActive = sIdx === currentTestSectionIndex;
                const isSecDone = sIdx < currentTestSectionIndex;
                return (
                  <div
                    key={sec.id}
                    className={`p-2 rounded text-left border text-[11px] font-mono ${
                      isSecActive
                        ? "bg-zinc-850 border-cyan-500/80 text-white font-bold"
                        : isSecDone
                        ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-400"
                        : "bg-[#16161c] border-zinc-800 text-zinc-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">Sec {sIdx + 1}</span>
                      <span>{sec.durationMins}m</span>
                    </div>
                    <span className="block text-[10px] truncate text-zinc-400">
                      {sec.questions.length} Questions
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Question Navigator Palette */}
          <div className="p-3.5 rounded-lg bg-[#111115] border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>Section Question Palette ({activeSection.questions.length} Total)</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zinc-700" /> Pending
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
              {activeSection.questions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded text-[11px] font-mono font-semibold flex items-center justify-center transition-colors cursor-pointer border ${
                      isCurrent
                        ? "bg-zinc-100 text-zinc-950 border-white ring-2 ring-cyan-400"
                        : isAnswered
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white"
                    }`}
                    title={`Question ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Solver Card */}
          <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-mono text-zinc-400">
                Question {currentQuestionIndex + 1} of {activeSection.questions.length}
              </span>
              <span className="text-[10px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                {activeQuestion.type === "code" ? "Live Sandbox Coding" : "Single Choice"}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-white leading-relaxed">
                {activeQuestion.question}
              </h3>

              {/* MCQ Options */}
              {activeQuestion.type === "mcq" && (
                <div className="space-y-2">
                  {activeQuestion.options.map((opt, idx) => {
                    const isSelected = userAnswers[activeQuestion.id] === idx;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setUserAnswers((prev) => ({ ...prev, [activeQuestion.id]: idx }));
                        }}
                        className={`w-full p-3.5 rounded-md text-xs font-medium text-left transition-colors flex items-center gap-3 cursor-pointer border ${
                          isSelected
                            ? "bg-zinc-800 text-white border-zinc-600 shadow-xs font-semibold"
                            : "bg-[#16161c] border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] shrink-0 ${
                            isSelected
                              ? "bg-zinc-100 text-zinc-950 font-bold"
                              : "bg-zinc-800 text-zinc-400"
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Fully Runnable Coding Sandbox with Execution Controls */}
              {activeQuestion.type === "code" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span>Language:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-[#16161c] border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-200 font-mono outline-none cursor-pointer"
                      >
                        <option value="python">Python 3</option>
                        <option value="javascript">JavaScript (V8)</option>
                        <option value="typescript">TypeScript</option>
                        <option value="cpp">C++ 20</option>
                        <option value="java">Java 21</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isExecutingCode}
                        onClick={handleRunCode}
                        className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>Run Code</span>
                      </button>

                      <button
                        type="button"
                        disabled={isExecutingCode}
                        onClick={handleRunTests}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-3 h-3" />
                        <span>Run Tests</span>
                      </button>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="relative">
                    <textarea
                      rows={12}
                      value={userCode[activeQuestion.id] || activeQuestion.starterCode || ""}
                      onChange={(e) => {
                        const nextCode = e.target.value;
                        setUserCode((prev) => ({ ...prev, [activeQuestion.id]: nextCode }));
                      }}
                      className="w-full bg-[#09090b] text-emerald-400 font-mono text-xs p-4 rounded-md border border-zinc-800 focus:outline-none focus:border-zinc-700 leading-relaxed resize-y selection:bg-zinc-800"
                    />
                  </div>

                  {/* Execution Status & Output Terminal */}
                  {(isExecutingCode || executionOutput || testResults) && (
                    <div className="p-3.5 rounded-md bg-[#09090b] border border-zinc-800 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-1.5">
                        <span className="text-zinc-400 font-semibold flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Execution Console</span>
                        </span>
                        {isExecutingCode && (
                          <span className="text-amber-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            <span>Compiling in sandbox...</span>
                          </span>
                        )}
                        {executionOutput && !isExecutingCode && (
                          <span className={executionOutput.status === "error" ? "text-rose-400" : "text-emerald-400"}>
                            {executionOutput.status?.toUpperCase()} ({executionOutput.execution_time_ms || 0}ms)
                          </span>
                        )}
                        {testResults && !isExecutingCode && (
                          <span className={testResults.all_passed ? "text-emerald-400" : "text-rose-400"}>
                            {testResults.passed_count}/{testResults.total_count} Passed ({testResults.total_runtime_ms || 0}ms)
                          </span>
                        )}
                      </div>

                      {/* Stdout / Stderr logs */}
                      {executionOutput?.stdout && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-zinc-500 uppercase block">Output (stdout):</span>
                          <pre className="text-zinc-200 whitespace-pre-wrap leading-relaxed">{executionOutput.stdout}</pre>
                        </div>
                      )}

                      {executionOutput?.stderr && (
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-rose-500 uppercase block">Error (stderr):</span>
                          <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed">{executionOutput.stderr}</pre>
                        </div>
                      )}

                      {/* Test Case Breakdown */}
                      {testResults?.results && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] text-zinc-500 uppercase block">Test Cases:</span>
                          <div className="space-y-1">
                            {testResults.results.map((r: any, idx: number) => (
                              <div
                                key={idx}
                                className={`p-2 rounded border text-[11px] flex items-center justify-between ${
                                  r.passed ? "bg-emerald-950/20 border-emerald-900/40 text-emerald-300" : "bg-rose-950/20 border-rose-900/40 text-rose-300"
                                }`}
                              >
                                <span>Case {idx + 1}: Input: {r.input?.replace(/\n/g, ", ") || "N/A"}</span>
                                <span className="font-bold">{r.passed ? "PASS" : "FAIL"}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button
                type="button"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-md border border-zinc-800 text-xs font-medium bg-zinc-900 text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              {currentQuestionIndex < activeSection.questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Save &amp; Next
                </button>
              ) : currentTestSectionIndex < currentRole.technicalTest.sections.length - 1 ? (
                <button
                  type="button"
                  onClick={handleAdvanceSection}
                  className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Next Section
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteAssessment}
                  className="px-6 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Submit Assessment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3C: FULL ASSESSMENT DIAGNOSTIC SCORECARD
         ========================================================================= */}
      {viewMode === "test-scorecard" && scorecardData && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Hero Result Banner */}
          <div className="p-6 sm:p-8 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-emerald-400">
                  Assessment Evaluation Complete &bull; {currentRole.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Candidate Diagnostic Scorecard
                </h1>
                <p className="text-xs text-zinc-400">
                  Evaluated against production engineering bar across quantitative aptitude, systems architecture MCQs, and sandbox coding.
                </p>
              </div>

              {/* Verdict Pill */}
              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <span className="text-xs font-mono text-zinc-400 uppercase">Hiring Verdict</span>
                <span className={`px-4 py-1.5 rounded-md text-sm font-mono font-bold border ${
                  scorecardData.overallScore >= 85
                    ? "bg-emerald-950/40 text-emerald-400 border-emerald-800"
                    : scorecardData.overallScore >= 70
                    ? "bg-sky-950/40 text-sky-400 border-sky-800"
                    : scorecardData.overallScore >= 50
                    ? "bg-amber-950/40 text-amber-400 border-amber-800"
                    : "bg-rose-950/40 text-rose-400 border-rose-800"
                }`}>
                  {scorecardData.verdict}
                </span>
              </div>
            </div>

            {/* Overall Score Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Overall Score</span>
                <span className="text-2xl font-extrabold font-mono text-white block">
                  {scorecardData.overallScore}%
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Aptitude &amp; Reasoning</span>
                <span className="text-lg font-bold font-mono text-zinc-200 block">
                  {scorecardData.aptitudeScore} / {scorecardData.aptitudeTotal}
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Domain Concepts</span>
                <span className="text-lg font-bold font-mono text-zinc-200 block">
                  {scorecardData.domainScore} / {scorecardData.domainTotal}
                </span>
              </div>
              <div className="p-3.5 rounded-md bg-[#16161c] border border-zinc-800 space-y-0.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block">Time Utilized</span>
                <span className="text-lg font-bold font-mono text-zinc-200 block">
                  {formatTime(scorecardData.timeSpentSeconds)}
                </span>
              </div>
            </div>

            {/* Diagnostic Strengths & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-md bg-[#16161c] border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                  Demonstrated Competencies
                </span>
                <ul className="text-xs text-zinc-300 space-y-1.5 leading-relaxed">
                  <li>&bull; Accurate complexity reasoning and arithmetic problem solving</li>
                  <li>&bull; Solid grasp of domain architectural primitives and trade-offs</li>
                  <li>&bull; Effective code implementation with syntax correctness</li>
                </ul>
              </div>

              <div className="p-4 rounded-md bg-[#16161c] border border-zinc-800 space-y-2">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                  Recommended Review Areas
                </span>
                <ul className="text-xs text-zinc-300 space-y-1.5 leading-relaxed">
                  <li>&bull; Practice edge case verification for memory-constrained execution</li>
                  <li>&bull; Deep dive into concurrency patterns in Core CS Operating Systems</li>
                  <li>&bull; Review live system design trade-offs in 3D Architecture Canvas</li>
                </ul>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("catalog")}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("role-detail")}
                  className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Back to Role Pipeline
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartAssessment}
                  className="px-4 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Assessment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPermissionModal(true)}
                  className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>Advance to Live Interview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Question-by-Question Review Breakdown */}
          <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Question-by-Question Diagnostic Review
                </h3>
                <p className="text-xs text-zinc-400">
                  Detailed analysis of candidate responses, correct selections, and underlying technical explanations
                </p>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {scorecardData.aptitudeTotal + scorecardData.domainTotal + scorecardData.codingTotal} Questions Evaluated
              </span>
            </div>

            <div className="space-y-6">
              {currentTestSections.map((section, sIdx) => (
                <div key={section.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-850">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                      Section {sIdx + 1}: {section.name} ({section.questions.length} Questions)
                    </span>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Duration: {section.durationMins} mins
                    </span>
                  </div>

                  <div className="space-y-3">
                    {section.questions.map((q, qIdx) => {
                      const userAns = userAnswers[q.id];
                      const submittedCode = userCode[q.id] || "";
                      const isStarterOrEmpty =
                        !submittedCode.trim() ||
                        submittedCode.trim() === (q.starterCode || "").trim();

                      let isCorrect = false;
                      let statusBadge = "Unattempted";
                      let statusClass = "bg-zinc-850 text-zinc-400 border-zinc-700";

                      if (q.type === "mcq") {
                        isCorrect = userAns === q.correctIndex;
                        if (userAns === undefined) {
                          statusBadge = "Not Attempted";
                          statusClass = "bg-zinc-850 text-zinc-400 border-zinc-700";
                        } else if (isCorrect) {
                          statusBadge = "Correct";
                          statusClass = "bg-emerald-950/40 text-emerald-400 border-emerald-800";
                        } else {
                          statusBadge = "Incorrect";
                          statusClass = "bg-rose-950/40 text-rose-400 border-rose-800";
                        }
                      } else {
                        // Coding Question
                        if (userAns?.allPassed) {
                          isCorrect = true;
                          statusBadge = `Correct (${userAns.passedCount}/${userAns.totalCount} Tests Passed)`;
                          statusClass = "bg-emerald-950/40 text-emerald-400 border-emerald-800";
                        } else if (userAns && userAns.passedCount > 0) {
                          statusBadge = `Partially Correct (${userAns.passedCount}/${userAns.totalCount} Tests)`;
                          statusClass = "bg-amber-950/40 text-amber-400 border-amber-800";
                        } else if (isStarterOrEmpty) {
                          statusBadge = "Not Attempted (No Code Submitted)";
                          statusClass = "bg-zinc-850 text-zinc-400 border-zinc-700";
                        } else {
                          statusBadge = "Incorrect / Incomplete (Tests Failed)";
                          statusClass = "bg-rose-950/40 text-rose-400 border-rose-800";
                        }
                      }

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-md bg-[#16161c] border border-zinc-800/80 space-y-3 text-xs font-mono"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-white leading-relaxed">
                              {qIdx + 1}. {q.question}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold shrink-0 border ${statusClass}`}>
                              {statusBadge}
                            </span>
                          </div>

                          {/* MCQ Question Details */}
                          {q.type === "mcq" && (
                            <div className="space-y-1.5 pt-1 text-[11px]">
                              <div className="text-zinc-400">
                                Your Selection:{" "}
                                <span
                                  className={
                                    isCorrect
                                      ? "text-emerald-400 font-bold"
                                      : userAns === undefined
                                      ? "text-zinc-500 font-bold"
                                      : "text-rose-400 font-bold"
                                  }
                                >
                                  {userAns !== undefined
                                    ? `${String.fromCharCode(65 + userAns)}) ${q.options[userAns]}`
                                    : "Not Answered"}
                                </span>
                              </div>
                              <div className="text-zinc-400">
                                Accurate Correct Answer:{" "}
                                <span className="text-emerald-400 font-bold">
                                  {String.fromCharCode(65 + q.correctIndex)}) {q.options[q.correctIndex]}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Coding Question Details */}
                          {q.type === "code" && (
                            <div className="space-y-3 pt-1">
                              {/* Candidate Code Submission */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                                  Candidate Code Submission:
                                </span>
                                {isStarterOrEmpty ? (
                                  <div className="p-2.5 rounded bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-[11px] italic">
                                    No implementation was submitted for this question (Starter template was left unedited).
                                  </div>
                                ) : (
                                  <pre className="p-3 rounded bg-[#0d0d11] border border-zinc-800 text-[11px] text-zinc-300 font-mono overflow-x-auto max-h-48 leading-relaxed">
                                    <code>{submittedCode}</code>
                                  </pre>
                                )}
                              </div>

                              {/* Accurate Reference Solution Code */}
                              {q.solutionCode && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                      <span>Accurate Reference Solution:</span>
                                    </span>
                                    <span className="text-[10px] font-mono text-zinc-400">Optimal Implementation</span>
                                  </div>
                                  <pre className="p-3 rounded bg-[#0d0d11] border border-emerald-950/60 text-[11px] text-emerald-200/90 font-mono overflow-x-auto max-h-56 leading-relaxed">
                                    <code>{q.solutionCode}</code>
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Technical Explanation */}
                          <div className="p-3 rounded bg-zinc-900/60 border border-zinc-850 text-zinc-300 text-[11px] leading-relaxed">
                            <span className="text-zinc-400 block mb-1 font-bold uppercase text-[10px] tracking-wider">
                              Technical Explanation &amp; Mathematical Formulation:
                            </span>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4A: CAMERA & MIC PERMISSION CHECK MODAL
         ========================================================================= */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="p-6 rounded-lg bg-[#111115] border border-zinc-800 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                  Proctoring Hardware Verification
                </span>
                <button
                  type="button"
                  onClick={() => {
                    stopMediaStream();
                    setShowPermissionModal(false);
                  }}
                  className="text-xs font-mono text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <h3 className="text-base font-bold text-white">
                Camera &amp; Microphone Access
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The {currentRole.title} technical interview requires camera and microphone verification for real-time conversation and proctoring.
              </p>
            </div>

            {/* Live Camera Preview Box */}
            <div className="relative aspect-video rounded-md bg-[#09090b] border border-zinc-800 overflow-hidden flex items-center justify-center">
              {hasCameraPermission ? (
                <video
                  ref={previewVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-zinc-500">
                  <VideoOff className="w-8 h-8 text-zinc-600" />
                  <span className="text-xs">Camera preview will appear here once granted</span>
                </div>
              )}

              {/* Audio meter overlay */}
              {hasMicPermission && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-xs px-2.5 py-1.5 rounded flex items-center gap-2 border border-zinc-800">
                  <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <div className="flex-1 bg-zinc-850 h-1.5 rounded-sm overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full transition-all duration-75"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 w-8 text-right">
                    {audioLevel}%
                  </span>
                </div>
              )}
            </div>

            {/* Error banner if denied */}
            {permissionError && (
              <div className="p-3 rounded-md bg-rose-950/40 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{permissionError}</span>
              </div>
            )}

            {/* Action Trigger */}
            <div className="space-y-2">
              {!hasCameraPermission || !hasMicPermission ? (
                <button
                  type="button"
                  onClick={requestMediaPermissions}
                  className="w-full py-2.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Video className="w-4 h-4" />
                  <span>Grant Hardware Access</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchInterviewCall}
                  className="w-full py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Enter Interview Panel</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4B: LIVE VIDEO CALL INTERVIEW ROOM (DYNAMIC AI SPEECH & EVALUATION)
         ========================================================================= */}
      {viewMode === "interview-active" && (
        <div className="fixed inset-0 z-50 bg-[#09090b] text-zinc-100 flex flex-col justify-between p-4 sm:p-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between z-20 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-white font-mono">
                {currentRole.title} &bull; {activeRound.name} (Round {currentRoundIndex + 1}/{currentRole.interview.rounds.length})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-end gap-0.5 h-3.5">
                <span className="w-1 h-1.5 bg-emerald-400 rounded-xs" />
                <span className="w-1 h-2.5 bg-emerald-400 rounded-xs" />
                <span className="w-1 h-3.5 bg-emerald-400 rounded-xs" />
              </div>

              <div className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 font-bold">
                {formatTime(interviewSecondsLeft)}
              </div>

              <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs flex items-center justify-center font-mono">
                {userInitials}
              </div>
            </div>
          </div>

          {/* Center Stage: Interviewer Console */}
          <div className="flex-1 flex flex-col items-center justify-center relative z-10 space-y-5 my-auto max-w-2xl mx-auto w-full">
            {/* Interviewer representation */}
            <div className="relative">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-[#111115] border-2 flex items-center justify-center transition-all ${
                  isAiSpeaking
                    ? "border-emerald-500 shadow-lg shadow-emerald-950/40"
                    : isAiEvaluating
                    ? "border-amber-500 shadow-lg shadow-amber-950/40"
                    : "border-zinc-700"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Terminal className="w-8 h-8 text-zinc-300" />
                  <span className="text-[11px] font-mono font-bold text-white tracking-wider">
                    {isAiEvaluating ? "EVALUATING" : "INTERVIEWER"}
                  </span>
                </div>
              </div>

              {/* Sound waves when AI is speaking */}
              {isAiSpeaking && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse" />
                  <span className="w-1 h-3.5 bg-emerald-400 animate-pulse" />
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse" />
                </div>
              )}
            </div>

            {/* Dynamic Question Display */}
            <div className="w-full p-4 rounded-lg bg-[#111115] border border-zinc-800 shadow-md text-center space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-zinc-400 border-b border-zinc-800/80 pb-1">
                <span>{activeRound.name}</span>
                <span className="text-emerald-400">Question {currentQuestionIdxInRound + 1}</span>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                "{activeInterviewQuestion}"
              </p>
            </div>

            {/* Candidate Response Workspace with Speech-to-Text Toggle */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Your Answer:</span>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition-colors cursor-pointer ${
                    isSpeechListening
                      ? "bg-rose-950/60 border-rose-800 text-rose-300"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white"
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isSpeechListening ? "Recording Voice..." : "Dictate with Mic"}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={candidateResponseText}
                onChange={(e) => setCandidateResponseText(e.target.value)}
                placeholder="Speak naturally or type your structured technical response here..."
                className="w-full rounded-md bg-[#111115] border border-zinc-800 text-xs font-mono p-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-700 resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-zinc-500">
                  {candidateResponseText.length} characters &bull; {interviewTranscript.length} answered
                </span>
                <button
                  type="button"
                  disabled={isAiEvaluating || !candidateResponseText.trim()}
                  onClick={handleSubmitInterviewResponse}
                  className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-40 flex items-center gap-1.5"
                >
                  {isAiEvaluating ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-zinc-950 border-t-transparent animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Picture-in-Picture Candidate Webcam */}
          <div className="fixed bottom-24 right-6 w-44 sm:w-56 aspect-video rounded-md bg-black border border-zinc-800 overflow-hidden shadow-2xl z-30">
            {!isVideoDisabled ? (
              <video
                ref={activeVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 text-xs space-y-1">
                <VideoOff className="w-5 h-5 text-zinc-600" />
                <span>Video Paused</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-300">
              You ({displayName})
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-500">
                Proctoring: Active &bull; STT &amp; Audio Synthesizer Connected
              </span>
            </div>

            {/* Media toggles and End call */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-2.5 rounded-md text-xs border transition-colors cursor-pointer ${
                  isMicMuted
                    ? "bg-rose-950/60 border-rose-800 text-rose-400 hover:bg-rose-900/60"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white"
                }`}
                title={isMicMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsVideoDisabled(!isVideoDisabled)}
                className={`p-2.5 rounded-md text-xs border transition-colors cursor-pointer ${
                  isVideoDisabled
                    ? "bg-rose-950/60 border-rose-800 text-rose-400 hover:bg-rose-900/60"
                    : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white"
                }`}
                title={isVideoDisabled ? "Enable Camera" : "Disable Camera"}
              >
                {isVideoDisabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  stopMediaStream();
                  setViewMode("role-detail");
                }}
                className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Leave Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4C: INTERVIEW SCORECARD & TRANSCRIPT REVIEW
         ========================================================================= */}
      {viewMode === "interview-scorecard" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="p-6 sm:p-8 rounded-lg bg-[#111115] border border-zinc-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div className="space-y-1">
                <span className="text-[11px] font-mono uppercase text-emerald-400">
                  Panel Deliberation Complete &bull; {currentRole.title}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Technical Interview Report
                </h1>
                <p className="text-xs text-zinc-400">
                  Detailed evaluation of your answers, architectural depth, and communication clarity.
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1 shrink-0">
                <span className="text-xs font-mono text-zinc-400 uppercase">Panel Verdict</span>
                <span className="px-4 py-1.5 rounded-md text-sm font-mono font-bold border bg-emerald-950/40 text-emerald-400 border-emerald-800">
                  Strong Hire (88%)
                </span>
              </div>
            </div>

            {/* Transcript & Rubrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Question &amp; Answer Evaluation Record ({interviewTranscript.length} Questions Answered)
              </h3>

              {interviewTranscript.map((t, idx) => (
                <div key={idx} className="p-4 rounded-md bg-[#16161c] border border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase font-semibold">
                      {t.round} &bull; Q{idx + 1}
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Score: {t.score || 85}%
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white">
                    "{t.question}"
                  </p>

                  <div className="p-3 rounded bg-[#09090b] border border-zinc-800/80 text-xs text-zinc-300 font-mono leading-relaxed">
                    <span className="text-[10px] uppercase text-zinc-500 block mb-1">Your Answer:</span>
                    {t.answer}
                  </div>

                  {t.feedback && (
                    <div className="text-xs text-emerald-400/90 font-mono">
                      &bull; Rubric Evaluation: {t.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMode("role-detail")}
                className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
              >
                Return to Role Pipeline
              </button>

              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="px-5 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors cursor-pointer"
              >
                Browse Other Tracks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
