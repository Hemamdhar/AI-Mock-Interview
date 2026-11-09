export type ProgressCategory =
  | "dsa"
  | "aiml"
  | "system_design"
  | "core_cs_os"
  | "core_cs_cn"
  | "core_cs_dbms"
  | "core_cs_arch"
  | "core_cs_oop";

export interface ProgressStats {
  total_completed: number;
  dsa_total: number;
  dsa_easy: number;
  dsa_medium: number;
  dsa_hard: number;
  aiml_total: number;
  system_design_total: number;
  core_cs_total: number;
  core_cs_os_total: number;
  core_cs_cn_total: number;
  core_cs_dbms_total: number;
  core_cs_arch_total: number;
  core_cs_oop_total: number;
  readiness_score: number;
}

export interface ProgressSummary {
  dsa: string[];
  aiml: string[];
  system_design: string[];
  core_cs_os: string[];
  core_cs_cn: string[];
  core_cs_dbms: string[];
  core_cs_arch: string[];
  core_cs_oop: string[];
  stats: ProgressStats;
}

export const PROGRESS_EVENT_NAME = "interviewai:progress-updated";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.BACKEND_API_URL ||
  "http://localhost:8000";

function getGuestId(): string {
  if (typeof window === "undefined") return "guest_default";
  const key = "interviewai_guest_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = `guest_${crypto.randomUUID()}`;
  localStorage.setItem(key, id);
  return id;
}

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: ["Bearer", token].join(" ") } : {};
}

function broadcast(summary: ProgressSummary | null = null): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT_NAME, { detail: summary }));
  }
}

export function broadcastProgressUpdate(summary: ProgressSummary | null = null): void {
  broadcast(summary);
}

export async function fetchBackendProgress(): Promise<ProgressSummary | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/progress?guest_id=${encodeURIComponent(getGuestId())}`,
      { headers: getAuthHeaders() }
    );
    if (!response.ok) return null;
    return (await response.json()) as ProgressSummary;
  } catch {
    return null;
  }
}

export async function recordProgressToggle(
  category: ProgressCategory,
  itemId: string | number,
  completed: boolean,
  title?: string,
  difficulty?: string
): Promise<ProgressSummary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/progress/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        category,
        item_id: String(itemId),
        completed,
        title,
        difficulty,
        guest_id: getGuestId(),
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { summary?: ProgressSummary };
    broadcast(data.summary || null);
    return data.summary || null;
  } catch {
    return null;
  }
}

export async function syncLocalProgressWithBackend(
  dsaSolvedIds: Array<string | number>,
  aimlCompletedIds: string[],
  systemDesignCompletedIds: string[],
  coreCs: {
    os?: string[];
    cn?: string[];
    dbms?: string[];
    arch?: string[];
    oop?: string[];
  } = {}
): Promise<ProgressSummary | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/progress/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        guest_id: getGuestId(),
        dsa_solved_ids: dsaSolvedIds.map(String),
        aiml_completed_ids: aimlCompletedIds,
        system_design_completed_ids: systemDesignCompletedIds,
        core_cs_os_completed_ids: coreCs.os || [],
        core_cs_cn_completed_ids: coreCs.cn || [],
        core_cs_dbms_completed_ids: coreCs.dbms || [],
        core_cs_arch_completed_ids: coreCs.arch || [],
        core_cs_oop_completed_ids: coreCs.oop || [],
      }),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { summary?: ProgressSummary };
    broadcast(data.summary || null);
    return data.summary || null;
  } catch {
    return null;
  }
}
