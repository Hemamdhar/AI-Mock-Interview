import type { HiringRole, TestSection } from "@/data/hiringSimulatorData";

interface AssessmentSession {
  sections: TestSection[];
  isFreshAttempt: boolean;
  seenCount: number;
  totalAvailable: number;
  coveragePercent: number;
}

const HISTORY_KEY = "interviewai_assessment_question_history";

function readHistory(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeHistory(history: Record<string, string[]>): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function buildAssessmentSession(role: HiringRole): AssessmentSession {
  const history = readHistory();
  const roleHistory = new Set(history[role.id] || []);
  const allQuestions = role.technicalTest.sections.flatMap((section) => section.questions);
  const freshAvailable = allQuestions.filter((question) => !roleHistory.has(question.id));
  const isFreshAttempt = freshAvailable.length >= role.technicalTest.totalQuestions;
  const usedIds = new Set<string>();

  const sections = role.technicalTest.sections.map((section) => {
    const fresh = section.questions.filter((question) => !roleHistory.has(question.id));
    const ordered = [...fresh, ...section.questions.filter((question) => roleHistory.has(question.id))];
    const questions = ordered
      .filter((question) => {
        if (usedIds.has(question.id)) return false;
        usedIds.add(question.id);
        return true;
      })
      .slice(0, section.questions.length);
    return { ...section, questions, questionsCount: questions.length };
  });

  const nextHistory = [...new Set([...roleHistory, ...usedIds])];
  writeHistory({
    ...history,
    [role.id]: nextHistory.length >= allQuestions.length ? [] : nextHistory,
  });

  const totalAvailable = allQuestions.length;
  return {
    sections,
    isFreshAttempt,
    seenCount: roleHistory.size,
    totalAvailable,
    coveragePercent: totalAvailable
      ? Math.round((Math.min(roleHistory.size + usedIds.size, totalAvailable) / totalAvailable) * 100)
      : 100,
  };
}
