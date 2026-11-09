"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  FilePlus,
  ChevronRight,
  ChevronDown,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  Eye,
  Columns,
  FileEdit,
  Download,
  MoreVertical,
  CheckSquare,
  List,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Bold,
  Italic,
  Strikethrough,
  X,
  Sparkles,
} from "lucide-react";

export interface NoteFolder {
  id: string;
  name: string;
  isOpen: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  folderId: string; // references NoteFolder.id or 'root'
  updatedAt: string;
  content: string;
}

const STORAGE_FOLDERS_KEY = "interviewai_notes_folders_v2";
const STORAGE_NOTES_KEY = "interviewai_notes_items_v2";

const DEFAULT_FOLDERS: NoteFolder[] = [
  { id: "folder-system-design", name: "System Design", isOpen: true },
  { id: "folder-dsa", name: "Algorithms & DSA", isOpen: true },
  { id: "folder-distributed", name: "Distributed Systems", isOpen: true },
  { id: "folder-general", name: "Quick Notes", isOpen: false },
];

const DEFAULT_NOTES: NoteItem[] = [
  {
    id: "note-1",
    title: "Caching Patterns & Redis Invalidation",
    folderId: "folder-system-design",
    updatedAt: "Today, 10:45 AM",
    content: `# Caching Patterns & Redis Invalidation

A high-performance caching layer prevents database saturation and reduces P99 latency.

### Topologies & Patterns
- **Cache-Aside (Lazy Loading):** Application queries cache first. On miss, fetches from database and writes back to cache.
- **Write-Through:** Application writes to cache, which synchronously writes to the database.
- **Write-Behind (Write-Back):** Writes acknowledge immediately from cache; asynchronous batch writes persist to DB.

### Pre-Launch Production Checklist
- [x] Cache-Aside pattern implemented for user profile queries
- [x] Cache stampede prevention via singleflight pattern or distributed mutex
- [ ] Redis Cluster failover and multi-AZ replica sync verified
- [ ] Memory eviction policy set to volatile-lru with alert at 85% capacity
- [ ] Negative caching (caching nulls with 30s TTL) to prevent cache penetration

### Cache Sizing Formula
\`\`\`
Daily Memory = Daily Active Users (DAU) * Avg Bytes/User * 1.35 (Overhead)
Example: 10,000,000 DAU * 2 KB * 1.35 = 27 GB RAM required
\`\`\`
`,
  },
  {
    id: "note-2",
    title: "Graph Traversal & Cycle Detection",
    folderId: "folder-dsa",
    updatedAt: "Yesterday",
    content: `# Graph Traversal & Cycle Detection Patterns

Key algorithm patterns for topological ordering, shortest paths, and state space tree exploration.

### 1. Directed Graphs: 3-Color DFS
Use 3-color states to differentiate tree edges from back edges:
- **0 (White / Unvisited):** Node has not been visited yet.
- **1 (Gray / Processing):** Node is in current recursion stack. If seen again -> CYCLE DETECTED!
- **2 (Black / Finished):** Node and all descendants fully explored.

\`\`\`python
def has_cycle(num_courses, prerequisites):
    graph = {i: [] for i in range(num_courses)}
    for dest, src in prerequisites:
        graph[src].append(dest)
        
    state = [0] * num_courses # 0=unvisited, 1=visiting, 2=visited
    
    def dfs(node):
        if state[node] == 1:
            return True # Found back-edge (cycle)
        if state[node] == 2:
            return False
            
        state[node] = 1
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        state[node] = 2
        return False

    return any(dfs(i) for i in range(num_courses) if state[i] == 0)
\`\`\`

### 2. Kahn's Algorithm (BFS Topological Sort)
1. Compute in-degree for all vertices.
2. Initialize Queue with all nodes of in-degree 0.
3. Pop from queue, append to result, decrement in-degree of neighbors.
4. If result length != total vertices, graph contains a directed cycle!
`,
  },
  {
    id: "note-3",
    title: "CAP Theorem & PACELC Trade-offs",
    folderId: "folder-distributed",
    updatedAt: "Oct 15, 2026",
    content: `# CAP Theorem & PACELC Trade-offs

Understanding distributed systems consistency models and failure handling under network partitions.

### PACELC Principles
If there is a **Partition (P)**, trade off **Availability (A)** vs **Consistency (C)**.
**Else (E)**, when running normally, trade off **Latency (L)** vs **Consistency (C)**.

| Database | Partition Behavior | Normal Behavior | Archetype |
| :--- | :--- | :--- | :--- |
| **MongoDB** | Consistency (CP) | Consistency (PC/EC) | Strong Consistency |
| **Cassandra** | Availability (AP) | Latency (PA/EL) | Tunable Eventual |
| **Amazon DynamoDB** | Availability (AP) | Latency (PA/EL) | High Throughput |
| **Spanner / CockroachDB** | Consistency (CP) | Consistency (PC/EC) | TrueTime Distributed |

### Key Takeaway
Network partitions are inevitable across WAN connections. Always choose explicit timeout thresholds and fallback strategies rather than blocking unbounded connections.
`,
  },
];

export const NotesView: React.FC = () => {
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");

  // Inline renaming states
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState("");
  const [newFolderNameInput, setNewFolderNameInput] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Active Note state
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentContent, setCurrentContent] = useState("");
  const [currentFolderId, setCurrentFolderId] = useState("root");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount (with migration support)
  useEffect(() => {
    try {
      const storedFolders = localStorage.getItem(STORAGE_FOLDERS_KEY);
      const storedNotes = localStorage.getItem(STORAGE_NOTES_KEY);

      if (storedFolders && storedNotes) {
        const parsedF = JSON.parse(storedFolders);
        const parsedN = JSON.parse(storedNotes);
        if (Array.isArray(parsedF) && Array.isArray(parsedN) && parsedN.length > 0) {
          setFolders(parsedF);
          setNotes(parsedN);
          setSelectedNoteId(parsedN[0].id);
          setCurrentTitle(parsedN[0].title);
          setCurrentContent(parsedN[0].content);
          setCurrentFolderId(parsedN[0].folderId || "root");
          return;
        }
      }

      // Check legacy notes key
      const legacyNotes = localStorage.getItem("interviewai_user_notespace_pages");
      if (legacyNotes) {
        const parsed = JSON.parse(legacyNotes);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const migrated: NoteItem[] = parsed.map((p: any, idx: number) => ({
            id: p.id || `migrated-${idx}`,
            title: p.title || "Untitled Note",
            folderId: "folder-system-design",
            updatedAt: p.updatedAt || "Recent",
            content: p.content || "",
          }));
          setFolders(DEFAULT_FOLDERS);
          setNotes(migrated);
          setSelectedNoteId(migrated[0].id);
          setCurrentTitle(migrated[0].title);
          setCurrentContent(migrated[0].content);
          setCurrentFolderId(migrated[0].folderId);
          return;
        }
      }
    } catch {
      // Fallback
    }

    setFolders(DEFAULT_FOLDERS);
    setNotes(DEFAULT_NOTES);
    setSelectedNoteId(DEFAULT_NOTES[0].id);
    setCurrentTitle(DEFAULT_NOTES[0].title);
    setCurrentContent(DEFAULT_NOTES[0].content);
    setCurrentFolderId(DEFAULT_NOTES[0].folderId);
  }, []);

  // Save changes to localStorage
  const saveState = (updatedFolders: NoteFolder[], updatedNotes: NoteItem[]) => {
    setFolders(updatedFolders);
    setNotes(updatedNotes);
    try {
      localStorage.setItem(STORAGE_FOLDERS_KEY, JSON.stringify(updatedFolders));
      localStorage.setItem(STORAGE_NOTES_KEY, JSON.stringify(updatedNotes));
    } catch {
      // Ignore storage errors
    }
  };

  const selectedNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Handle Note selection
  const handleSelectNote = (note: NoteItem) => {
    setSelectedNoteId(note.id);
    setCurrentTitle(note.title);
    setCurrentContent(note.content);
    setCurrentFolderId(note.folderId);
  };

  // Create new folder
  const handleCreateFolder = () => {
    if (!newFolderNameInput.trim()) {
      setIsCreatingFolder(false);
      return;
    }
    const newFolder: NoteFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderNameInput.trim(),
      isOpen: true,
    };
    const updatedFolders = [...folders, newFolder];
    saveState(updatedFolders, notes);
    setNewFolderNameInput("");
    setIsCreatingFolder(false);
  };

  // Toggle Folder open/closed
  const toggleFolder = (folderId: string) => {
    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, isOpen: !f.isOpen } : f
    );
    saveState(updated, notes);
  };

  // Rename Folder
  const handleRenameFolder = (folderId: string) => {
    if (!editingFolderName.trim()) {
      setEditingFolderId(null);
      return;
    }
    const updated = folders.map((f) =>
      f.id === folderId ? { ...f, name: editingFolderName.trim() } : f
    );
    saveState(updated, notes);
    setEditingFolderId(null);
  };

  // Delete Folder
  const handleDeleteFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this folder? Notes inside will be moved to Unfiled.")) {
      const updatedFolders = folders.filter((f) => f.id !== folderId);
      const updatedNotes = notes.map((n) =>
        n.folderId === folderId ? { ...n, folderId: "root" } : n
      );
      saveState(updatedFolders, updatedNotes);
      if (currentFolderId === folderId) {
        setCurrentFolderId("root");
      }
    }
  };

  // Create new Note
  const handleCreateNote = (folderId: string = "root") => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: "Untitled Note",
      folderId,
      updatedAt: "Just now",
      content: `# Untitled Note\n\nStart writing technical notes, complexity breakdowns, or system design trade-offs here...\n`,
    };

    // Ensure target folder is expanded
    if (folderId !== "root") {
      const updatedFolders = folders.map((f) =>
        f.id === folderId ? { ...f, isOpen: true } : f
      );
      const updatedNotes = [newNote, ...notes];
      saveState(updatedFolders, updatedNotes);
    } else {
      const updatedNotes = [newNote, ...notes];
      saveState(folders, updatedNotes);
    }

    handleSelectNote(newNote);
  };

  // Delete current Note
  const handleDeleteNote = (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (notes.length <= 1) {
      alert("At least one note must be maintained in NoteSpace.");
      return;
    }
    const updated = notes.filter((n) => n.id !== noteId);
    saveState(folders, updated);
    if (selectedNoteId === noteId && updated.length > 0) {
      handleSelectNote(updated[0]);
    }
  };

  // Update Note Title
  const handleUpdateTitle = (title: string) => {
    setCurrentTitle(title);
    if (!selectedNoteId) return;
    const updated = notes.map((n) =>
      n.id === selectedNoteId ? { ...n, title, updatedAt: "Just now" } : n
    );
    saveState(folders, updated);
  };

  // Update Note Content
  const handleUpdateContent = (content: string) => {
    setCurrentContent(content);
    if (!selectedNoteId) return;
    const updated = notes.map((n) =>
      n.id === selectedNoteId ? { ...n, content, updatedAt: "Just now" } : n
    );
    saveState(folders, updated);
  };

  // Move Note to Folder
  const handleMoveFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
    if (!selectedNoteId) return;
    const updated = notes.map((n) =>
      n.id === selectedNoteId ? { ...n, folderId, updatedAt: "Just now" } : n
    );
    saveState(folders, updated);
  };

  // Copy Note markdown
  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download markdown file
  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentTitle.replace(/[^a-zA-Z0-9_-]/g, "_") || "note"}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Toolbar formatting injection helper
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const replacement = prefix + (selected || "text") + suffix;
    const nextContent = text.substring(0, start) + replacement + text.substring(end);
    handleUpdateContent(nextContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 10);
  };

  // Filter notes by search
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase();
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  // Group notes by folder
  const notesByFolder = useMemo(() => {
    const map: Record<string, NoteItem[]> = { root: [] };
    folders.forEach((f) => {
      map[f.id] = [];
    });
    filteredNotes.forEach((n) => {
      const fid = n.folderId && map[n.folderId] ? n.folderId : "root";
      map[fid].push(n);
    });
    return map;
  }, [folders, filteredNotes]);

  // Clean Markdown preview parser
  const renderMarkdown = (src: string) => {
    const lines = src.split("\n");
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div
              key={`code-${idx}`}
              className="my-3 p-3.5 rounded-md bg-[#0a0a0d] border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto leading-relaxed"
            >
              <pre>{codeBlockContent.join("\n")}</pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={idx} className="text-xl sm:text-2xl font-bold text-white mt-5 mb-2 pb-1 border-b border-zinc-800">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="text-lg font-bold text-white mt-4 mb-2">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="text-sm font-semibold text-zinc-200 mt-3 mb-1.5 uppercase tracking-wide">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- [x] ") || line.startsWith("- [ ] ")) {
        const checked = line.startsWith("- [x] ");
        const text = line.replace(/- \[[x ]\] /, "");
        elements.push(
          <div key={idx} className="flex items-center gap-2 py-0.5 text-xs text-zinc-300">
            <span
              className={`w-3.5 h-3.5 rounded-sm flex items-center justify-center border ${
                checked
                  ? "bg-zinc-200 border-zinc-200 text-zinc-950"
                  : "border-zinc-700 bg-zinc-900"
              }`}
            >
              {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </span>
            <span className={checked ? "line-through text-zinc-500" : ""}>{text}</span>
          </div>
        );
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-zinc-300 leading-relaxed py-0.5">
            {line.replace(/^[-*] /, "")}
          </li>
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={idx}
            className="border-l-2 border-zinc-500 pl-3 py-1 my-2 text-xs italic text-zinc-400 bg-zinc-900/40"
          >
            {line.replace("> ", "")}
          </blockquote>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-zinc-300 leading-relaxed py-0.5">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Breadcrumbs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[#111115] border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 text-white">
            <FileText className="w-4 h-4 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">NoteSpace</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {notes.length} {notes.length === 1 ? "document" : "documents"} in {folders.length} folders
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Structured markdown workspace for system design patterns, algorithm templates, and interview prep notes.
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
            onClick={() => handleCreateNote(folders[0]?.id || "root")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <FilePlus className="w-3.5 h-3.5 text-zinc-950" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left File Explorer, Right Document Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start min-h-[640px]">
        {/* Left Explorer Pane */}
        <div className="lg:col-span-4 xl:col-span-3 rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden flex flex-col h-[700px]">
          {/* Explorer Header */}
          <div className="p-3 border-b border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                EXPLORER
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
                  onClick={() => handleCreateNote("root")}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  title="Create note in root"
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
                placeholder="Search notes..."
                className="w-full pl-8 pr-2.5 py-1 rounded-md bg-[#0a0a0d] border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-hidden focus:border-zinc-700"
              />
            </div>

            {/* Inline Folder Creator input */}
            {isCreatingFolder && (
              <div className="flex items-center gap-1.5 p-1.5 rounded-md bg-[#0a0a0d] border border-zinc-700">
                <Folder className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={newFolderNameInput}
                  onChange={(e) => setNewFolderNameInput(e.target.value)}
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

          {/* Folder & File Tree */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar text-xs">
            {folders.map((folder) => {
              const folderNotes = notesByFolder[folder.id] || [];
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
                        {folderNotes.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateNote(folder.id);
                        }}
                        className="p-0.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-700"
                        title="Add note in folder"
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

                  {/* Notes Inside Folder */}
                  {folder.isOpen && (
                    <div className="pl-4 space-y-0.5 border-l border-zinc-800 ml-3.5 my-0.5">
                      {folderNotes.length === 0 ? (
                        <div className="px-2 py-1 text-[11px] text-zinc-500 italic">Empty folder</div>
                      ) : (
                        folderNotes.map((note) => {
                          const isSelected = note.id === selectedNoteId;
                          return (
                            <div
                              key={note.id}
                              onClick={() => handleSelectNote(note)}
                              className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                                isSelected
                                  ? "bg-zinc-800 text-white font-medium shadow-xs"
                                  : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                                <span className="truncate text-xs">{note.title}</span>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteNote(note.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 transition-opacity"
                                title="Delete note"
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

            {/* Unfiled / Root Notes Section */}
            {notesByFolder.root && notesByFolder.root.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
                <span className="px-2 text-[10px] font-mono uppercase text-zinc-500 tracking-wider">
                  Unfiled Notes
                </span>
                {notesByFolder.root.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`group flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-zinc-800 text-white font-medium shadow-xs"
                          : "text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 pr-1">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                        <span className="truncate text-xs">{note.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-500 hover:text-red-400 transition-opacity"
                        title="Delete note"
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

        {/* Right Editor & Canvas Workspace */}
        <div className="lg:col-span-8 xl:col-span-9 rounded-lg bg-[#111115] border border-zinc-800 overflow-hidden flex flex-col h-[700px]">
          {/* Editor Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-[#0e0e12]">
            {/* Note Title Input & Folder Assignment */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => handleUpdateTitle(e.target.value)}
                placeholder="Note Title..."
                className="bg-transparent text-sm sm:text-base font-bold text-white outline-none w-full max-w-md focus:border-b focus:border-zinc-500"
              />

              {/* Move to Folder Dropdown */}
              <select
                value={currentFolderId}
                onChange={(e) => handleMoveFolder(e.target.value)}
                className="px-2 py-1 rounded-md bg-[#18181c] border border-zinc-700 text-xs text-zinc-300 outline-none cursor-pointer"
                title="Move to folder"
              >
                <option value="root">Unfiled / Root</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode & Export Actions */}
            <div className="flex items-center gap-2">
              {/* Segmented View Mode */}
              <div className="flex items-center p-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("edit")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    viewMode === "edit"
                      ? "bg-zinc-800 text-white font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Editor only"
                >
                  <FileEdit className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    viewMode === "split"
                      ? "bg-zinc-800 text-white font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Split view"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    viewMode === "preview"
                      ? "bg-zinc-800 text-white font-semibold shadow-xs"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                  title="Preview only"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Copy Markdown */}
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Copy markdown content"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* Download .md */}
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Download as markdown file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => handleDeleteNote(selectedNoteId)}
                className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Markdown Toolbar */}
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-zinc-800/80 bg-[#0c0c10] overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => insertFormatting("**", "**")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("*", "*")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("~~", "~~")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-3.5 bg-zinc-800 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting("# ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("## ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("### ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Heading 3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <span className="w-px h-3.5 bg-zinc-800 mx-1" />
            <button
              type="button"
              onClick={() => insertFormatting("`", "`")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Inline Code"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("```python\n", "\n```")}
              className="p-1 text-[11px] font-mono rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Code Block"
            >
              {"{ }"}
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- [ ] ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Task List"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("- ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("> ")}
              className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Editor & Preview Panes */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
            {/* Editor Area */}
            {(viewMode === "edit" || viewMode === "split") && (
              <div className={`h-full flex flex-col ${viewMode === "edit" ? "md:col-span-2" : ""}`}>
                <textarea
                  ref={textareaRef}
                  value={currentContent}
                  onChange={(e) => handleUpdateContent(e.target.value)}
                  placeholder="Start typing your markdown..."
                  className="w-full flex-1 p-4 bg-[#09090c] text-zinc-200 font-mono text-xs leading-relaxed outline-none resize-none custom-scrollbar"
                />
              </div>
            )}

            {/* Markdown Preview Area */}
            {(viewMode === "preview" || viewMode === "split") && (
              <div
                className={`h-full p-4 overflow-y-auto bg-[#0e0e12] custom-scrollbar ${
                  viewMode === "preview" ? "md:col-span-2" : ""
                }`}
              >
                {currentContent.trim() ? (
                  renderMarkdown(currentContent)
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-zinc-500 italic">
                    Preview will render here...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
