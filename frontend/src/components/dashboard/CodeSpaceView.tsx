"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Code2,
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Play,
  Copy,
  Check,
  Search,
  RotateCcw,
  Terminal,
  FileCode,
  X,
  Plus,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";

export type CompilerLanguage = "python" | "cpp" | "java" | "javascript" | "typescript" | "c";

export interface CodeFolder {
  id: string;
  name: string;
  isOpen: boolean;
}

export interface CodeFile {
  id: string;
  name: string;
  folderId: string; // references CodeFolder.id or 'root'
  language: CompilerLanguage;
  code: string;
  stdin?: string;
  updatedAt: string;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  status: "idle" | "running" | "success" | "error";
  executionTimeMs: number;
  exitCode: number;
}

const STORAGE_FOLDERS_KEY = "interviewai_codespace_folders_v2";
const STORAGE_FILES_KEY = "interviewai_codespace_files_v2";

const LANGUAGE_CONFIG: Record<
  CompilerLanguage,
  {
    name: string;
    extension: string;
    badge: string;
    badgeBg: string;
    badgeText: string;
    defaultCode: string;
  }
> = {
  python: {
    name: "Python 3",
    extension: ".py",
    badge: "PY",
    badgeBg: "bg-amber-950/40 border-amber-800/60",
    badgeText: "text-amber-400",
    defaultCode: `# Python 3 Online Runner
import sys

def solve():
    nums = [2, 7, 11, 15]
    target = 9
    lookup = {}
    
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

if __name__ == "__main__":
    result = solve()
    print("Two Sum Result Indices:", result)
`,
  },
  cpp: {
    name: "C++ (Clang 17)",
    extension: ".cpp",
    badge: "C++",
    badgeBg: "bg-blue-950/40 border-blue-800/60",
    badgeText: "text-blue-400",
    defaultCode: `// C++ 17 Online Runner
#include <iostream>
#include <vector>
#include <numeric>

int main() {
    std::cout << "Running C++ Sandbox..." << std::endl;
    std::vector<int> numbers = {10, 20, 30, 40, 50};
    int sum = std::accumulate(numbers.begin(), numbers.end(), 0);
    std::cout << "Sum of elements: " << sum << std::endl;
    return 0;
}
`,
  },
  java: {
    name: "Java 21",
    extension: ".java",
    badge: "JAVA",
    badgeBg: "bg-orange-950/40 border-orange-800/60",
    badgeText: "text-orange-400",
    defaultCode: `// Java 21 Online Runner
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("Running Java 21 Sandbox...");
        List<String> list = Arrays.asList("Algorithms", "System Design", "Distributed Systems");
        System.out.println("Available tracks: " + list.size());
        for (String track : list) {
            System.out.println(" - " + track);
        }
    }
}
`,
  },
  javascript: {
    name: "JavaScript (Node 20)",
    extension: ".js",
    badge: "JS",
    badgeBg: "bg-yellow-950/40 border-yellow-800/60",
    badgeText: "text-yellow-400",
    defaultCode: `// JavaScript (Node.js) Online Runner
console.log("Running Node.js Sandbox...");

const dataset = [
  { topic: "Two Sum", difficulty: "Easy" },
  { topic: "LRU Cache", difficulty: "Medium" },
  { topic: "Word Ladder", difficulty: "Hard" }
];

console.log("Sample test problems registered:", dataset.length);
console.table(dataset);
`,
  },
  typescript: {
    name: "TypeScript (TS 5)",
    extension: ".ts",
    badge: "TS",
    badgeBg: "bg-sky-950/40 border-sky-800/60",
    badgeText: "text-sky-400",
    defaultCode: `// TypeScript Online Runner
interface Problem {
  id: number;
  name: string;
  solved: boolean;
}

const problems: Problem[] = [
  { id: 1, name: "Binary Search", solved: true },
  { id: 2, name: "Merge Intervals", solved: false },
];

console.log("TypeScript interface validation passed:");
console.log(problems);
`,
  },
  c: {
    name: "C (C17)",
    extension: ".c",
    badge: "C",
    badgeBg: "bg-zinc-800 border-zinc-700",
    badgeText: "text-zinc-300",
    defaultCode: `// C Language Online Runner
#include <stdio.h>

int main() {
    printf("Running C17 Sandbox Engine...\\n");
    int arr[] = {1, 2, 3, 4, 5};
    int total = 0;
    for (int i = 0; i < 5; i++) {
        total += arr[i];
    }
    printf("Array elements sum: %d\\n", total);
    return 0;
}
`,
  },
};

const DEFAULT_FOLDERS: CodeFolder[] = [
  { id: "folder-dsa", name: "DSA & LeetCode", isOpen: true },
  { id: "folder-system-design", name: "System Design Prototypes", isOpen: true },
  { id: "folder-concurrency", name: "Concurrency & Workers", isOpen: false },
  { id: "folder-scratchpad", name: "Scratchpad", isOpen: false },
];

const DEFAULT_FILES: CodeFile[] = [
  {
    id: "file-1",
    name: "two_sum.py",
    folderId: "folder-dsa",
    language: "python",
    updatedAt: "Today, 11:20 AM",
    code: `# Two Sum Hash Map Pattern
def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        complement = target - n
        if complement in seen:
            return [seen[complement], i]
        seen[n] = i
    return []

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    print(f"Target: {target}")
    print("Indices:", two_sum(nums, target))
`,
  },
  {
    id: "file-2",
    name: "rate_limiter.cpp",
    folderId: "folder-system-design",
    language: "cpp",
    updatedAt: "Yesterday",
    code: `// Token Bucket Rate Limiter Prototype
#include <iostream>
#include <chrono>
#include <algorithm>

class TokenBucket {
private:
    double capacity;
    double tokens;
    double refillRatePerSec;
    std::chrono::steady_clock::time_point lastRefillTime;

public:
    TokenBucket(double cap, double rate) 
        : capacity(cap), tokens(cap), refillRatePerSec(rate), 
          lastRefillTime(std::chrono::steady_clock::now()) {}

    bool allowRequest(double cost = 1.0) {
        auto now = std::chrono::steady_clock::now();
        std::chrono::duration<double> elapsed = now - lastRefillTime;
        lastRefillTime = now;

        tokens = std::min(capacity, tokens + elapsed.count() * refillRatePerSec);

        if (tokens >= cost) {
            tokens -= cost;
            return true;
        }
        return false;
    }
};

int main() {
    TokenBucket limiter(5.0, 1.0); // 5 tokens max, 1 token/sec
    for (int i = 1; i <= 7; ++i) {
        std::cout << "Request " << i << ": " 
                  << (limiter.allowRequest() ? "ALLOWED" : "RATE LIMITED") 
                  << std::endl;
    }
    return 0;
}
`,
  },
  {
    id: "file-3",
    name: "lru_cache.ts",
    folderId: "folder-dsa",
    language: "typescript",
    updatedAt: "Oct 18, 2026",
    code: `// LRU Cache using Map preserving insertion order
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map<K, V>();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache<string, number>(2);
lru.put("a", 1);
lru.put("b", 2);
console.log("Get 'a':", lru.get("a")); // 1
lru.put("c", 3); // evicts 'b'
console.log("Get 'b' (should be undefined):", lru.get("b")); // undefined
console.log("Get 'c':", lru.get("c")); // 3
`,
  },
];

export const CodeSpaceView: React.FC = () => {
  const [folders, setFolders] = useState<CodeFolder[]>([]);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>("");
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Editor states
  const [currentCode, setCurrentCode] = useState("");
  const [currentStdin, setCurrentStdin] = useState("");
  const [consoleTab, setConsoleTab] = useState<"output" | "stdin">("output");
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);

  // Folder creation & renaming states
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");

  // Execution states
  const [execution, setExecution] = useState<ExecutionResult>({
    stdout: "Compiler runtime ready. Select a file and click 'Run Code'.",
    stderr: "",
    status: "idle",
    executionTimeMs: 0,
    exitCode: 0,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount (with migration support)
  useEffect(() => {
    try {
      const storedFolders = localStorage.getItem(STORAGE_FOLDERS_KEY);
      const storedFiles = localStorage.getItem(STORAGE_FILES_KEY);

      if (storedFolders && storedFiles) {
        const parsedF = JSON.parse(storedFolders);
        const parsedFiles = JSON.parse(storedFiles);
        if (Array.isArray(parsedF) && Array.isArray(parsedFiles) && parsedFiles.length > 0) {
          setFolders(parsedF);
          setFiles(parsedFiles);
          setActiveFileId(parsedFiles[0].id);
          setOpenTabs([parsedFiles[0].id]);
          setCurrentCode(parsedFiles[0].code);
          setCurrentStdin(parsedFiles[0].stdin || "");
          return;
        }
      }

      // Check legacy compilers storage
      const legacyCompilers = localStorage.getItem("interviewai_custom_compilers");
      if (legacyCompilers) {
        const parsed = JSON.parse(legacyCompilers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migratedFiles: CodeFile[] = parsed.map((item: any, i: number) => ({
            id: item.id || `migrated-file-${i}`,
            name: item.fileName || `${item.name || "script"}.${LANGUAGE_CONFIG[item.language as CompilerLanguage]?.extension || "py"}`,
            folderId: "folder-dsa",
            language: item.language || "python",
            code: item.code || "",
            stdin: item.stdin || "",
            updatedAt: item.lastUpdated || "Recent",
          }));
          setFolders(DEFAULT_FOLDERS);
          setFiles(migratedFiles);
          setActiveFileId(migratedFiles[0].id);
          setOpenTabs([migratedFiles[0].id]);
          setCurrentCode(migratedFiles[0].code);
          return;
        }
      }
    } catch {
      // Fallback
    }

    setFolders(DEFAULT_FOLDERS);
    setFiles(DEFAULT_FILES);
    setActiveFileId(DEFAULT_FILES[0].id);
    setOpenTabs([DEFAULT_FILES[0].id]);
    setCurrentCode(DEFAULT_FILES[0].code);
    setCurrentStdin(DEFAULT_FILES[0].stdin || "");
  }, []);

  // Save changes to localStorage
  const saveState = (updatedFolders: CodeFolder[], updatedFiles: CodeFile[]) => {
    setFolders(updatedFolders);
    setFiles(updatedFiles);
    try {
      localStorage.setItem(STORAGE_FOLDERS_KEY, JSON.stringify(updatedFolders));
      localStorage.setItem(STORAGE_FILES_KEY, JSON.stringify(updatedFiles));
    } catch {
      // Ignore storage errors
    }
  };

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || null;
  }, [files, activeFileId]);

  // Handle file selection
  const handleOpenFile = (file: CodeFile) => {
    setActiveFileId(file.id);
    setCurrentCode(file.code);
    setCurrentStdin(file.stdin || "");
    if (!openTabs.includes(file.id)) {
      setOpenTabs([...openTabs, file.id]);
    }
  };

  // Close tab
  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((id) => id !== fileId);
    setOpenTabs(remaining);
    if (activeFileId === fileId && remaining.length > 0) {
      const nextFile = files.find((f) => f.id === remaining[remaining.length - 1]);
      if (nextFile) handleOpenFile(nextFile);
    }
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      setIsCreatingFolder(false);
      return;
    }
    const newFolder: CodeFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName.trim(),
      isOpen: true,
    };
    const updatedFolders = [...folders, newFolder];
    saveState(updatedFolders, files);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  // Toggle Folder open/closed
  const toggleFolder = (folderId: string) => {
    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, isOpen: !f.isOpen } : f
    );
    saveState(updated, files);
  };

  // Rename folder
  const handleRenameFolder = (folderId: string) => {
    if (!editingFolderName.trim()) {
      setEditingFolderId(null);
      return;
    }
    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, name: editingFolderName.trim() } : f
    );
    saveState(updated, files);
    setEditingFolderId(null);
  };

  // Delete folder
  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this folder? Files inside will be moved to Root.")) {
      const updatedFolders = folders.filter((f) => f.id !== folderId);
      const updatedFiles = files.map((f) =>
        f.folderId === folderId ? { ...f, folderId: "root" } : f
      );
      saveState(updatedFolders, updatedFiles);
    }
  };

  // Create new File
  const handleCreateFile = (folderId: string = "root", lang: CompilerLanguage = "python") => {
    const ext = LANGUAGE_CONFIG[lang].extension;
    const baseName = `solution_${Date.now().toString().slice(-4)}`;
    const newFile: CodeFile = {
      id: `file-${Date.now()}`,
      name: `${baseName}${ext}`,
      folderId,
      language: lang,
      code: LANGUAGE_CONFIG[lang].defaultCode,
      updatedAt: "Just now",
    };

    // Ensure target folder is open
    if (folderId !== "root") {
      const updatedFolders = folders.map((f) =>
        f.id === folderId ? { ...f, isOpen: true } : f
      );
      const updatedFiles = [...files, newFile];
      saveState(updatedFolders, updatedFiles);
    } else {
      const updatedFiles = [...files, newFile];
      saveState(folders, updatedFiles);
    }

    handleOpenFile(newFile);
  };

  // Delete file
  const handleDeleteFile = (fileId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (files.length <= 1) {
      alert("At least one file must remain in CodeSpace.");
      return;
    }
    const updatedFiles = files.filter((f) => f.id !== fileId);
    const updatedTabs = openTabs.filter((id) => id !== fileId);
    setOpenTabs(updatedTabs);
    saveState(folders, updatedFiles);

    if (activeFileId === fileId && updatedFiles.length > 0) {
      handleOpenFile(updatedFiles[0]);
    }
  };

  // Update Code
  const handleUpdateCode = (code: string) => {
    setCurrentCode(code);
    if (!activeFileId) return;
    const updatedFiles = files.map((f) =>
      f.id === activeFileId ? { ...f, code, updatedAt: "Just now" } : f
    );
    saveState(folders, updatedFiles);
  };

  // Change language of active file
  const handleChangeLanguage = (newLang: CompilerLanguage) => {
    if (!activeFile) return;
    const oldExt = LANGUAGE_CONFIG[activeFile.language].extension;
    const newExt = LANGUAGE_CONFIG[newLang].extension;
    const baseName = activeFile.name.endsWith(oldExt)
      ? activeFile.name.slice(0, -oldExt.length)
      : activeFile.name.replace(/\.[^/.]+$/, "");
    const updatedName = `${baseName}${newExt}`;

    const isCodeUnchanged =
      !currentCode.trim() ||
      currentCode.trim() === LANGUAGE_CONFIG[activeFile.language].defaultCode.trim();

    const nextCode = isCodeUnchanged ? LANGUAGE_CONFIG[newLang].defaultCode : currentCode;
    if (isCodeUnchanged) setCurrentCode(nextCode);

    const updatedFiles = files.map((f) =>
      f.id === activeFileId
        ? {
            ...f,
            name: updatedName,
            language: newLang,
            code: nextCode,
            updatedAt: "Just now",
          }
        : f
    );
    saveState(folders, updatedFiles);
  };

  // Move active file to folder
  const handleMoveFileFolder = (folderId: string) => {
    if (!activeFileId) return;
    const updatedFiles = files.map((f) =>
      f.id === activeFileId ? { ...f, folderId, updatedAt: "Just now" } : f
    );
    saveState(folders, updatedFiles);
  };

  // Rename active file
  const handleRenameFile = (newName: string) => {
    if (!activeFileId || !newName.trim()) return;
    const updatedFiles = files.map((f) =>
      f.id === activeFileId ? { ...f, name: newName.trim(), updatedAt: "Just now" } : f
    );
    saveState(folders, updatedFiles);
  };

  // Run Code Execution
  const handleRunCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setConsoleTab("output");
    setIsConsoleExpanded(true);

    setExecution({
      stdout: "",
      stderr: "",
      status: "running",
      executionTimeMs: 0,
      exitCode: 0,
    });

    const startTime = Date.now();

    try {
      // Execute via Isolated Sandbox API route
      const response = await fetch("/api/sandbox/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: activeFile?.language || "python",
          code: currentCode,
          stdin: currentStdin,
          timeoutSeconds: 8,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const duration = Date.now() - startTime;
        const isSuccess = (data.exit_code === 0 || data.exit_code === undefined) && data.status === "success";

        setExecution({
          stdout: data.stdout || (isSuccess ? "Process executed with exit code 0 (no stdout output)." : ""),
          stderr: data.stderr || "",
          status: isSuccess ? "success" : "error",
          executionTimeMs: data.execution_time_ms || duration,
          exitCode: data.exit_code ?? (isSuccess ? 0 : 1),
        });
        setIsRunning(false);
        return;
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setExecution({
        stdout: "",
        stderr: `Failed to connect to isolated execution sandbox: ${err.message || String(err)}`,
        status: "error",
        executionTimeMs: duration,
        exitCode: 1,
      });
      setIsRunning(false);
      return;
    }
  };

  // Copy Output
  const handleCopyOutput = () => {
    navigator.clipboard.writeText(execution.stdout || execution.stderr);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  // Tab key indentation support in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const val = el.value;
      const nextCode = val.substring(0, start) + "    " + val.substring(end);
      handleUpdateCode(nextCode);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Filter files by search
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(
      (f) => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
    );
  }, [files, searchQuery]);

  // Group files by folder
  const filesByFolder = useMemo(() => {
    const map: Record<string, CodeFile[]> = { root: [] };
    folders.forEach((f) => {
      map[f.id] = [];
    });
    filteredFiles.forEach((file) => {
      const fid = file.folderId && map[file.folderId] ? file.folderId : "root";
      map[fid].push(file);
    });
    return map;
  }, [folders, filteredFiles]);

  // Generate line numbers
  const lineCount = useMemo(() => {
    return Math.max(1, currentCode.split("\n").length);
  }, [currentCode]);

  return (
    <div className="space-y-4">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[#111115] border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 text-white">
            <Code2 className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">CodeSpace Cloud IDE</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {files.length} {files.length === 1 ? "source file" : "source files"} in {folders.length} folders
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              In-browser sandboxed code workspace with multi-language execution, competitive stdin, and directory tree.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingFolder(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-zinc-400" />
            <span>New Folder</span>
          </button>

          <button
            type="button"
            onClick={() => handleCreateFile(folders[0]?.id || "root", "python")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-zinc-950" />
            <span>New File</span>
          </button>
        </div>
      </div>

      {/* Main IDE Workspace: Left Explorer, Right Editor & Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[640px]">
        {/* Left Explorer Pane */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden flex flex-col h-[700px]">
          {/* Explorer Header */}
          <div className="p-3 border-b border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                WORKSPACE EXPLORER
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(true)}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Create folder"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateFile("root", "python")}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Create file in root"
                >
                  <FilePlus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-8 pr-2.5 py-1 rounded-md bg-[#0a0a0d] border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-zinc-700"
              />
            </div>

            {/* Inline Folder Creator */}
            {isCreatingFolder && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#0a0a0d] border border-zinc-700">
                <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") setIsCreatingFolder(false);
                  }}
                  placeholder="Folder name..."
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  className="p-1 text-emerald-400 hover:text-emerald-300"
                  title="Save folder"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="p-1 text-zinc-500 hover:text-zinc-300"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Directory Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs">
            {folders.map((folder) => {
              const folderFiles = filesByFolder[folder.id] || [];
              const isEditing = editingFolderId === folder.id;

              return (
                <div key={folder.id} className="space-y-0.5">
                  {/* Folder Row */}
                  <div
                    onClick={() => toggleFolder(folder.id)}
                    className="group flex items-center justify-between px-2 py-1.5 rounded-md text-zinc-300 hover:bg-zinc-850 hover:text-white cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {folder.isOpen ? (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      )}

                      {folder.isOpen ? (
                        <FolderOpen className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      ) : (
                        <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}

                      {isEditing ? (
                        <input
                          type="text"
                          autoFocus
                          value={editingFolderName}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameFolder(folder.id);
                            if (e.key === "Escape") setEditingFolderId(null);
                          }}
                          className="px-1 py-0.5 bg-zinc-900 border border-zinc-700 rounded text-xs text-white outline-none w-full"
                        />
                      ) : (
                        <span className="font-semibold text-xs truncate">{folder.name}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono text-zinc-500 mr-1">
                        {folderFiles.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateFile(folder.id, "python");
                        }}
                        className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                        title="Add file in folder"
                      >
                        <FilePlus className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                          setEditingFolderName(folder.name);
                        }}
                        className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                        title="Rename folder"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteFolder(folder.id, e)}
                        className="p-0.5 rounded text-zinc-400 hover:text-red-400 hover:bg-zinc-700"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Files inside folder */}
                  {folder.isOpen && (
                    <div className="pl-4 space-y-0.5 border-l border-zinc-800 ml-3.5 my-0.5">
                      {folderFiles.length === 0 ? (
                        <div className="px-2 py-1 text-[11px] text-zinc-500 italic">Empty folder</div>
                      ) : (
                        folderFiles.map((file) => {
                          const isSelected = file.id === activeFileId;
                          const langCfg = LANGUAGE_CONFIG[file.language] || LANGUAGE_CONFIG.python;

                          return (
                            <div
                              key={file.id}
                              onClick={() => handleOpenFile(file)}
                              className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-zinc-800 text-white font-medium shadow-xs"
                                  : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                <span
                                  className={`text-[9px] font-mono px-1 py-0.2 rounded border ${langCfg.badgeBg} ${langCfg.badgeText} shrink-0`}
                                >
                                  {langCfg.badge}
                                </span>
                                <span className="truncate text-xs font-mono">{file.name}</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteFile(file.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 transition-opacity"
                                title="Delete file"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Unfiled / Root Files Section */}
            {filesByFolder.root && filesByFolder.root.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
                <span className="px-2 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Root Files
                </span>
                {filesByFolder.root.map((file) => {
                  const isSelected = file.id === activeFileId;
                  const langCfg = LANGUAGE_CONFIG[file.language] || LANGUAGE_CONFIG.python;

                  return (
                    <div
                      key={file.id}
                      onClick={() => handleOpenFile(file)}
                      className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-zinc-800 text-white font-medium shadow-xs"
                          : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 pr-1">
                        <span
                          className={`text-[9px] font-mono px-1 py-0.2 rounded border ${langCfg.badgeBg} ${langCfg.badgeText} shrink-0`}
                        >
                          {langCfg.badge}
                        </span>
                        <span className="truncate text-xs font-mono">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteFile(file.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 transition-opacity"
                        title="Delete file"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Editor & Terminal Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden flex flex-col h-[700px]">
          {/* Open Tabs Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0e0e12] overflow-x-auto select-none">
            {/* Tabs */}
            <div className="flex items-center min-w-0">
              {openTabs.map((tabId) => {
                const tabFile = files.find((f) => f.id === tabId);
                if (!tabFile) return null;
                const isActive = tabFile.id === activeFileId;
                const langCfg = LANGUAGE_CONFIG[tabFile.language] || LANGUAGE_CONFIG.python;

                return (
                  <div
                    key={tabId}
                    onClick={() => handleOpenFile(tabFile)}
                    className={`flex items-center gap-2 px-3 py-2 border-r border-zinc-800 text-xs font-mono cursor-pointer transition-colors ${
                      isActive
                        ? "bg-[#09090c] text-white border-t-2 border-t-white font-medium"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                    }`}
                  >
                    <span className={`text-[9px] ${langCfg.badgeText}`}>{langCfg.badge}</span>
                    <span className="truncate max-w-[140px]">{tabFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => handleCloseTab(tabId, e)}
                      className="p-0.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white"
                      title="Close tab"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Run Code Button */}
            <div className="p-1.5 flex items-center gap-2 pr-3">
              <button
                type="button"
                onClick={handleRunCode}
                disabled={isRunning}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 active:bg-zinc-300 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>{isRunning ? "Compiling..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          {/* Editor Action Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-zinc-800/80 bg-[#0c0c10] text-xs">
            {/* Left Controls: File Name, Language Selector, Folder selector */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={activeFile?.name || ""}
                onChange={(e) => handleRenameFile(e.target.value)}
                placeholder="filename.ext"
                className="bg-transparent font-mono text-xs font-semibold text-white outline-none max-w-[180px] focus:border-b focus:border-zinc-500"
                title="Click to rename file"
              />

              {/* Language Selector */}
              <select
                value={activeFile?.language || "python"}
                onChange={(e) => handleChangeLanguage(e.target.value as CompilerLanguage)}
                className="px-2 py-0.5 rounded-md bg-[#18181c] border border-zinc-700 text-[11px] font-mono text-zinc-300 outline-none cursor-pointer"
              >
                {(Object.keys(LANGUAGE_CONFIG) as CompilerLanguage[]).map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_CONFIG[lang].name}
                  </option>
                ))}
              </select>

              {/* Folder Selector */}
              <select
                value={activeFile?.folderId || "root"}
                onChange={(e) => handleMoveFileFolder(e.target.value)}
                className="px-2 py-0.5 rounded-md bg-[#18181c] border border-zinc-700 text-[11px] text-zinc-300 outline-none cursor-pointer"
                title="Move file to folder"
              >
                <option value="root">/ Root</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    / {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Controls: Reset Code */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (activeFile && confirm("Reset code to default template?")) {
                    handleUpdateCode(LANGUAGE_CONFIG[activeFile.language].defaultCode);
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Reset to default code"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Template</span>
              </button>
            </div>
          </div>

          {/* Main Code Editing Canvas */}
          <div className="flex-1 flex overflow-hidden bg-[#09090c]">
            {/* Line Numbers Gutter */}
            <div
              aria-hidden="true"
              className="py-3 px-2 text-right font-mono text-xs text-zinc-600 bg-[#09090c] border-r border-zinc-800/60 select-none min-w-[42px] leading-relaxed"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              value={currentCode}
              onChange={(e) => handleUpdateCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              placeholder="Write your code here..."
              className="flex-1 p-3 bg-transparent text-zinc-100 font-mono text-xs leading-relaxed outline-none resize-none custom-scrollbar"
            />
          </div>

          {/* Bottom Console / Terminal Drawer */}
          <div className="border-t border-zinc-800 bg-[#0b0b0e] flex flex-col">
            {/* Console Bar Tabs */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/80 bg-[#0e0e12] select-none">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setConsoleTab("output");
                    setIsConsoleExpanded(true);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    consoleTab === "output" && isConsoleExpanded
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>OUTPUT</span>
                  {execution.status === "running" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  )}
                  {execution.status === "success" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  {execution.status === "error" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setConsoleTab("stdin");
                    setIsConsoleExpanded(true);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                    consoleTab === "stdin" && isConsoleExpanded
                      ? "bg-zinc-800 text-white font-medium"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>STDIN (Input)</span>
                </button>
              </div>

              {/* Console Action Tools */}
              <div className="flex items-center gap-2">
                {consoleTab === "output" && (
                  <>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {execution.executionTimeMs > 0 ? `${execution.executionTimeMs}ms` : "0ms"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOutput}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Copy terminal output"
                    >
                      {copiedOutput ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setIsConsoleExpanded(!isConsoleExpanded)}
                  className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  title={isConsoleExpanded ? "Collapse terminal" : "Expand terminal"}
                >
                  {isConsoleExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Console Content Window */}
            {isConsoleExpanded && (
              <div className="h-[180px] p-3 overflow-y-auto font-mono text-xs leading-relaxed custom-scrollbar bg-[#09090c]">
                {consoleTab === "output" ? (
                  <div className="space-y-1">
                    {execution.status === "running" ? (
                      <div className="flex items-center gap-2 text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                        <span>Running code in sandbox environment...</span>
                      </div>
                    ) : execution.stderr ? (
                      <div className="text-red-400 whitespace-pre-wrap">{execution.stderr}</div>
                    ) : (
                      <div className="text-zinc-300 whitespace-pre-wrap">{execution.stdout}</div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={currentStdin}
                    onChange={(e) => setCurrentStdin(e.target.value)}
                    placeholder="Enter custom input (passed via standard input / sys.stdin / cin)..."
                    className="w-full h-full bg-transparent text-zinc-200 outline-none resize-none font-mono text-xs"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
