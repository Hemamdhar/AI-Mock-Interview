"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Cpu,
  Database,
  Network,
  Code2,
  Layers,
  BookOpen,
  CheckCircle2,
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ExternalLink,
  Terminal,
  HelpCircle,
  Zap,
  Bookmark,
  Share2,
  ArrowLeft,
  ArrowRight,
  FileText,
  Shield,
  ShieldCheck,
  Clock,
  Sparkles,
  Check,
  Copy,
  HardDrive,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  ARCH_MODULES,
  ARCH_REVISE_SECTIONS,
  ARCH_RECALL_QUESTIONS,
} from "@/data/computerArchitectureCurriculum";
import {
  OOP_MODULES,
  OOP_REVISE_SECTIONS,
  OOP_RECALL_QUESTIONS,
} from "@/data/oopCurriculum";
import {
  DBMS_MODULES,
  DBMS_REVISE_SECTIONS,
  DBMS_RECALL_QUESTIONS,
} from "@/data/dbmsCurriculum";
import {
  NETWORKS_MODULES,
  NETWORKS_REVISE_SECTIONS,
  NETWORKS_RECALL_QUESTIONS,
} from "@/data/computerNetworksCurriculum";
import { CoreCSVisualizer } from "@/components/subjects/CoreCSVisualizer";
import {
  recordProgressToggle,
  broadcastProgressUpdate,
  PROGRESS_EVENT_NAME,
  ProgressCategory,
} from "@/lib/progress";

export type SubjectSlug =
  | "operating-systems"
  | "dbms"
  | "computer-networks"
  | "oop"
  | "oops"
  | "modern-computer-architecture"
  | "computer-architecture";

export type StudyMode = "learn" | "revise" | "recall";

export interface TopicItem {
  id: string;
  title: string;
  moduleName: string;
  readTime: string;
  summary: string;
  theThreeJobs?: {
    resourceManager: string;
    protectionLayer: string;
    hardwareHelper: string;
  };
  keyInvariants: string[];
  detailedContent: string;
  diagram?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  interviewWatchout?: string;
}

export interface ModuleGroup {
  id: string;
  name: string;
  topics: TopicItem[];
}

export interface RecallQuestion {
  id: string;
  question: string;
  difficulty: "Essential" | "Very High" | "High";
  topics: string[];
  modelAnswer: string;
  keyTakeaway: string;
}

export interface ReviseSection {
  title: string;
  summary: string;
  bullets: string[];
  formulaOrCode?: string;
}

// =========================================================================
// OPERATING SYSTEMS: EXACT PREPLOOM CURRICULUM (7 MODULES, 31 TOPICS)
// =========================================================================

const OS_MODULES: ModuleGroup[] = [
  // ----------------------------------------------------
  // Module 1: OS Fundamentals (3 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-fundamentals",
    name: "1. OS Fundamentals",
    topics: [
      {
        id: "os-intro",
        title: "Introduction to Operating Systems",
        moduleName: "1. OS Fundamentals",
        readTime: "4 min read",
        summary:
          "An Operating System is foundational system software that acts as an intermediary between physical computer hardware and user software applications, managing resources and providing safety.",
        theThreeJobs: {
          resourceManager:
            "Coordinates and shares finite hardware resources (CPU time, RAM memory, storage, and peripheral devices) among multiple competing applications so they run concurrently without conflicts.",
          protectionLayer:
            "Enforces process isolation, hardware privilege levels (Dual-mode operation), memory bounds, and file access permissions to prevent faulty or malicious programs from crashing the entire system.",
          hardwareHelper:
            "Abstracts low-level physical hardware complexities (e.g. disk sector heads, memory chips, packet buffers) into clean, high-level programming interfaces (files, virtual addresses, network sockets).",
        },
        keyInvariants: [
          "Without an OS, applications would require custom device drivers and could overwrite each other's memory.",
          "Bootstrap loader stored in non-volatile ROM/UEFI initializes CPU registers and loads the OS kernel into RAM at boot time.",
          "System calls act as the guarded gate between unprivileged user code and privileged kernel services.",
        ],
        detailedContent:
          "Operating systems exist to make computer hardware convenient, reliable, and efficient to use. The kernel is the core program running at all times. All other programs are either system programs (supporting background services, daemons) or application programs (browsers, text editors, databases).\n\nWhy Do We Need an OS?\n1. Convenience: Users interact with friendly graphical or terminal interfaces instead of manually toggling electrical hardware registers.\n2. Concurrency: Modern computers execute dozens of background services while running user applications. The OS multiplexes the CPU in milliseconds, giving the illusion of simultaneous execution.\n3. Hardware Independence: An application written in C or Python runs on Intel, AMD, or ARM CPUs because the OS provides standardized system call APIs (like POSIX).",
        diagram: `+------------------------------------------------------+
|                 User Applications                    |
|      (Web Browser, Text Editor, Database Engine)     |
+------------------------------------------------------+
|             Standard C Library / API (POSIX)         |
+------------------------------------------------------+
|                System Call Interface                 |
+======================================================+
|                  OPERATING SYSTEM                    |
|    [ CPU Scheduler ]    [ Virtual Memory Manager ]   |
|    [ File System   ]    [ Device Drivers / I/O   ]   |
+======================================================+
|                   Physical Hardware                  |
|    (CPU Registers, RAM Memory, SSD/NVMe, Network)    |
+------------------------------------------------------+`,
        interviewWatchout:
          "When asked 'What are the main goals of an OS?', structure your answer around the three main jobs: Resource Allocation, Protection/Security, and Hardware Abstraction.",
      },
      {
        id: "os-kernel-modes",
        title: "Kernel, Modes & Interrupts",
        moduleName: "1. OS Fundamentals",
        readTime: "5 min read",
        summary:
          "Hardware-enforced privilege rings (Dual-Mode Operation) ensuring that unprivileged application crashes cannot compromise the host kernel.",
        keyInvariants: [
          "User Mode (Ring 3): Unprivileged mode. Direct access to hardware I/O and privileged CPU instructions is strictly forbidden by CPU circuitry.",
          "Kernel Mode (Ring 0): Privileged mode. The OS kernel executes with full access to all machine instructions, registers, and physical memory.",
          "Mode Bit in CPU flag register determines current execution privilege (0 for kernel, 1 for user).",
          "Hardware Interrupts are asynchronous electrical signals triggered by external devices (keyboard, mouse, network card, disk controller).",
          "Software Interrupts (Traps / Exceptions) are synchronous events triggered by software execution (division by zero, page fault, or syscall instruction).",
        ],
        detailedContent:
          "When an application requires an I/O operation (such as reading a file from disk), it cannot access the hardware controller directly. It must execute a software trap instruction (such as 'syscall' or 'int 0x80'). The CPU hardware transitions from User Mode to Kernel Mode, saves the program state, and jumps to the Interrupt Vector Table (IVT) entry corresponding to the service.\n\nKernel Architectures:\n1. Monolithic Kernel (Linux): All OS services (VFS, drivers, scheduler, network stack) run in kernel space. Ultra-fast, but a bug in one driver can crash the entire system.\n2. Microkernel (Mach, QNX): Only minimal core mechanisms (IPC, basic scheduling, memory management) run in kernel space. File systems and drivers run as unprivileged user-space servers.\n3. Hybrid Kernel (Windows NT, macOS XNU): Combines microkernel modularity with monolithic speed for performance-critical subsystems.",
        comparisonTable: {
          headers: ["Feature", "User Mode (Ring 3)", "Kernel Mode (Ring 0)"],
          rows: [
            ["Privilege Level", "Unprivileged / Restricted", "Highest Privilege"],
            ["Hardware Access", "Indirect (via System Calls)", "Direct & Unrestricted"],
            ["Memory Access", "Own virtual address space only", "All physical & kernel memory"],
            ["Crash Impact", "Only the process terminates", "System crash / Kernel panic"],
          ],
        },
        interviewWatchout:
          "Emphasize that the transition between User Mode and Kernel Mode is enforced at the hardware CPU level, not purely in software.",
      },
      {
        id: "os-syscalls",
        title: "System Calls",
        moduleName: "1. OS Fundamentals",
        readTime: "4 min read",
        summary:
          "The programmatic gateway through which user processes request services from the kernel, spanning process control, file I/O, device management, and communication.",
        keyInvariants: [
          "Applications rarely invoke raw syscall instructions directly; they call standard library functions (libc, POSIX, Win32) which wrap the syscall.",
          "Arguments are placed into CPU registers (e.g. %rdi, %rsi, %rdx in x86-64), and the system call number is placed into %rax.",
          "Executing the trap instruction transfers control to the kernel's system call dispatcher table.",
        ],
        detailedContent:
          "Core system call categories:\n- Process Control: fork(), execve(), wait(), exit(), getpid()\n- File Manipulation: open(), read(), write(), close(), lseek()\n- Device Management: ioctl(), read(), write()\n- Information Maintenance: time(), alarm(), getppid()\n- Inter-Process Communication: pipe(), shmget(), socket(), connect()",
        codeSnippet: {
          language: "c",
          code: `// Low-level write system call demonstration in C
#include <unistd.h>

int main() {
    const char msg[] = "Direct system call invocation\\n";
    // write(file_descriptor, buffer_pointer, byte_count)
    // 1 = STDOUT_FILENO
    write(1, msg, sizeof(msg) - 1);
    return 0;
}`,
        },
      },
    ],
  },

  // ----------------------------------------------------
  // Module 2: Processes & Threads (2 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-processes",
    name: "2. Processes & Threads",
    topics: [
      {
        id: "os-processes",
        title: "Processes",
        moduleName: "2. Processes & Threads",
        readTime: "6 min read",
        summary:
          "A process is a program in execution containing dedicated virtual memory, stack, heap, and resource state.",
        keyInvariants: [
          "Process States: New -> Ready -> Running -> Waiting/Blocked -> Terminated.",
          "Process Control Block (PCB): Kernel data structure storing PID, Program Counter, CPU registers, memory management info (page tables), and open file descriptors.",
          "Context Switch: Saving the state of the currently running process to its PCB and loading the saved state of another process from its PCB.",
          "Context Switch Overhead: CPU time spent saving registers, switching page directory pointers, flushing CPU caches, and invalidating TLB entries.",
        ],
        detailedContent:
          "Special Process States:\n- Zombie Process: A process that has completed execution via exit(), but its parent has not yet read its exit status via wait(). It occupies an entry in the process table.\n- Orphan Process: A process whose parent has terminated before it. In Linux, orphan processes are immediately adopted by the init process (systemd, PID 1), which automatically calls wait() to clean them up.\n- Daemon Process: A background process running indefinitely without an attached controlling terminal (e.g., httpd, sshd, cron).",
        diagram: `+-------+       Admit        +-------+   Dispatch   +---------+
|  New  | -----------------> | Ready | -----------> | Running |
+-------+                    +-------+ <----------- +---------+
                                 ^       Interrupt       |
                                 |                       | I/O or Event
                                 +-----------------------+ Wait
                                       I/O Complete
                                       +---------+
                                       | Waiting |
                                       +---------+`,
        interviewWatchout:
          "Remember: A Zombie process uses zero CPU and zero memory; it only occupies a PID entry in the OS process table.",
      },
      {
        id: "os-threads",
        title: "Threads",
        moduleName: "2. Processes & Threads",
        readTime: "5 min read",
        summary:
          "Threads are lightweight units of execution within a process that share memory while executing independently.",
        keyInvariants: [
          "Shared across threads of same process: Code/Text segment, Data segment, Heap memory, Open file descriptors, Environment variables.",
          "Private to each thread: Thread ID (TID), Program Counter (PC), CPU registers state, Call Stack (local variables), Thread-Local Storage (TLS).",
          "Thread Context Switching is significantly faster than process context switching because virtual memory mappings remain identical.",
          "Kernel-Level Threads (1:1 model) are scheduled directly by the OS kernel, allowing true parallel execution on multi-core CPUs.",
        ],
        detailedContent:
          "Why use threads?\nCreating a thread is roughly 10x-30x faster than creating a process (fork). Inter-thread communication is instantaneous through shared memory variables, though it requires strict synchronization (mutexes, locks) to prevent race conditions.\n\nMultithreading Models:\n- Many-to-One (Green Threads): User-level library maps many user threads to 1 kernel thread. If one thread blocks on I/O, all threads freeze.\n- One-to-One: Every user thread maps to 1 kernel thread (standard in modern Linux NPTL, Windows, macOS). Enables multi-core parallelism.\n- Many-to-Many: Multiplexes M user threads across N kernel threads.",
        comparisonTable: {
          headers: ["Attribute", "Process", "Thread"],
          rows: [
            ["Address Space", "Independent & Isolated", "Shared with peer threads"],
            ["Creation Cost", "Heavyweight (copies address space)", "Lightweight (shares address space)"],
            ["Context Switch", "Slow (TLB flush, cache invalidate)", "Fast (shares virtual memory map)"],
            ["Communication", "IPC (Pipes, Sockets, Shared Memory)", "Direct memory read/write"],
            ["Failure Impact", "One crash does not affect peers", "Uncaught crash terminates process"],
          ],
        },
      },
    ],
  },

  // ----------------------------------------------------
  // Module 3: CPU Scheduling (4 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-scheduling",
    name: "3. CPU Scheduling",
    topics: [
      {
        id: "os-sched-fundamentals",
        title: "CPU Scheduling Fundamentals",
        moduleName: "3. CPU Scheduling",
        readTime: "5 min read",
        summary:
          "Core concepts governing how the operating system short-term scheduler selects processes from the ready queue for CPU allocation.",
        keyInvariants: [
          "CPU Burst vs I/O Burst Cycle: Processes alternate between periods of CPU calculation and I/O wait.",
          "Preemptive vs Non-Preemptive: Preemptive scheduling allows the OS to take the CPU away from a running process when a higher-priority task arrives or time quantum expires.",
          "Dispatcher: Module that gives control of the CPU to the process selected by the short-term scheduler (performs context switch and jump to instruction).",
        ],
        detailedContent:
          "Key Performance Metrics:\n1. Turnaround Time (TAT) = Completion Time - Arrival Time\n2. Waiting Time (WT) = Turnaround Time - Burst Time\n3. Response Time (RT) = Time of First CPU Execution - Arrival Time\n4. Throughput = Number of processes completed per unit time\n5. CPU Utilization = Percentage of time the CPU is actively executing tasks",
      },
      {
        id: "os-sched-algorithms",
        title: "Scheduling Algorithms",
        moduleName: "3. CPU Scheduling",
        readTime: "6 min read",
        summary:
          "Comparative study of standard CPU scheduling policies: FCFS, SJF, SRTF, Round Robin, and Priority Scheduling.",
        keyInvariants: [
          "FCFS (First-Come, First-Served): Simple FIFO queue. Suffers from the Convoy Effect where short I/O tasks wait behind a long CPU-bound process.",
          "SJF (Shortest Job First): Provably optimal for minimum average waiting time. Impossible to implement perfectly in practice without knowing future CPU burst lengths.",
          "SRTF (Shortest Remaining Time First): Preemptive version of SJF.",
          "Round Robin (RR): Preemptive scheduling with a fixed Time Quantum (TQ). If TQ is too large, degrades to FCFS; if too small, context-switch overhead destroys throughput.",
          "Priority Scheduling: Each process has a priority integer. Starvation of low-priority tasks is solved via Aging.",
        ],
        detailedContent:
          "Round Robin Rule of Thumb: Roughly 80% of CPU bursts should be shorter than the time quantum (typically 10ms - 50ms) to ensure interactive responsiveness without excessive context-switch penalties.",
      },
      {
        id: "os-sched-numerical",
        title: "Numerical",
        moduleName: "3. CPU Scheduling",
        readTime: "6 min read",
        summary:
          "Step-by-step Gantt chart calculations and mathematical problems for average waiting time and turnaround time.",
        keyInvariants: [
          "Always draw the Gantt chart starting from time t = 0.",
          "For preemptive algorithms, re-evaluate the ready queue at every arrival and completion event.",
          "Average TAT = Sum of all TAT / Number of processes.",
          "Average WT = Sum of all WT / Number of processes.",
        ],
        detailedContent:
          "Example Problem:\nProcesses P1 (Arrival=0, Burst=8), P2 (Arrival=1, Burst=4), P3 (Arrival=2, Burst=9), P4 (Arrival=3, Burst=5).\nUsing Non-Preemptive SJF:\n- At t=0, only P1 is available -> P1 runs [0 to 8].\n- At t=8, P2, P3, P4 are in queue. Shortest is P2 (Burst=4) -> P2 runs [8 to 12].\n- At t=12, shortest is P4 (Burst=5) -> P4 runs [12 to 17].\n- At t=17, P3 runs [17 to 26].\nCalculated Average Waiting Time = 6.5 ms.",
      },
      {
        id: "os-sched-advanced",
        title: "Advanced Scheduling",
        moduleName: "3. CPU Scheduling",
        readTime: "5 min read",
        summary:
          "Production schedulers: Multilevel Queue (MLQ), Multilevel Feedback Queue (MLFQ), and Linux Completely Fair Scheduler (CFS).",
        keyInvariants: [
          "Multilevel Queue: Processes permanently assigned to separate priority queues (e.g. Foreground interactive vs Background batch).",
          "Multilevel Feedback Queue (MLFQ): Processes move between queues based on observed burst behavior. CPU hogs are demoted; I/O tasks remain at high priority.",
          "Linux CFS (Completely Fair Scheduler): Uses a Red-Black Tree indexed by virtual runtime (vruntime). The process with smallest vruntime is dispatched next.",
        ],
        detailedContent:
          "MLFQ Rules:\n1. If Priority(A) > Priority(B), A runs.\n2. If Priority(A) == Priority(B), A and B run in Round Robin.\n3. When a job enters the system, it is placed at the top queue.\n4. Once a job uses up its time allotment at a given level, its priority is reduced.\n5. After some time period S, boost all jobs in the system to the topmost queue (prevents starvation).",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 4: Synchronization (9 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-sync",
    name: "4. Synchronization",
    topics: [
      {
        id: "os-sync-race",
        title: "Race Conditions & Critical Sections",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "The nature of race conditions and the three mathematical requirements for solving the critical section problem.",
        keyInvariants: [
          "Race Condition: An undesirable situation where the final output depends on the non-deterministic timing or interleaving of threads.",
          "Critical Section: The segment of code where shared resources or memory are accessed and modified.",
          "1. Mutual Exclusion: If process P is executing in its critical section, no other processes can be executing in their critical sections.",
          "2. Progress: If no process is in its critical section and some processes wish to enter, only those not in their remainder section can participate in deciding who enters next.",
          "3. Bounded Waiting: A bound must exist on the number of times other processes are allowed to enter their critical sections after a process has made a request.",
        ],
        detailedContent:
          "Without proper synchronization, concurrent memory updates like `count++` (which compiles to 3 assembly instructions: READ register, ADD 1, WRITE memory) can lose updates due to preemptive thread switches.",
      },
      {
        id: "os-sync-software",
        title: "Software-Based Solutions",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Algorithmic solutions for 2-process synchronization: Lock variables, Strict Alternation, and Peterson's Algorithm.",
        keyInvariants: [
          "Peterson's Algorithm uses two shared variables: boolean flag[2] (intent to enter) and int turn (whose turn it is).",
          "Guarantees Mutual Exclusion, Progress, and Bounded Waiting for 2 processes.",
          "Limitation: Modern out-of-order CPUs and optimizing compilers can reorder independent memory reads/writes, breaking pure software solutions without memory barriers.",
        ],
        detailedContent:
          "Peterson's Code Structure:\nProcess i sets `flag[i] = true; turn = j;` and loops `while (flag[j] && turn == j);` before entering its critical section, setting `flag[i] = false;` upon exit.",
      },
      {
        id: "os-sync-hardware",
        title: "Hardware-Based Solutions",
        moduleName: "4. Synchronization",
        readTime: "4 min read",
        summary:
          "Hardware atomic instructions: Test-and-Set and Compare-and-Swap (CAS) underpinning all modern locking primitives.",
        keyInvariants: [
          "Atomic instruction executes as a single indivisible hardware operation without interrupt.",
          "TestAndSet(boolean *target): Atomically reads the old value of target and sets target to true.",
          "CompareAndSwap(int *value, int expected, int new_value): Atomically updates *value to new_value only if *value == expected.",
          "Lock-free data structures in modern software (e.g. Java java.util.concurrent, C++ std::atomic) rely directly on CAS instructions.",
        ],
        detailedContent:
          "Hardware instructions lock the memory bus or cache line during execution, ensuring no other CPU core can modify the variable simultaneously.",
      },
      {
        id: "os-sync-mutex",
        title: "Locks, Mutexes, and Spinlocks",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Comparison of blocking mutex locks, spinlocks, and reentrant locks.",
        keyInvariants: [
          "Mutex (Mutual Exclusion): Blocking lock with strict thread ownership. Only the thread that acquired the mutex can release it.",
          "Spinlock: Busy-waits in a tight CPU loop until the lock becomes available. Avoids context-switch overhead.",
          "When to use Spinlocks: Critical sections that are very short (a few CPU cycles) or inside interrupt service routines where sleeping is forbidden.",
          "When to use Mutexes: Critical sections with I/O or longer execution where yielding the CPU is preferred.",
        ],
        detailedContent:
          "Spinlocks waste CPU cycles if the lock holder is preempted; sleeping locks (mutexes) incur 2 context switches (putting caller to sleep and waking it up).",
      },
      {
        id: "os-sync-semaphores",
        title: "Semaphores",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Integer signaling variables accessed via atomic wait() / P() and signal() / V() operations.",
        keyInvariants: [
          "Counting Semaphore: Integer value represents the number of available units of a shared resource.",
          "Binary Semaphore: Integer value ranges between 0 and 1 (functions as a signaling lock).",
          "wait() / P(): Decrements semaphore counter. If count < 0, caller is placed into waiting queue and blocked.",
          "signal() / V(): Increments semaphore counter. If count <= 0, unblocks one waiting process from the queue.",
        ],
        detailedContent:
          "Crucial distinction from Mutex: A semaphore has no ownership! Thread A can call wait(), and Thread B can call signal() to notify completion.",
      },
      {
        id: "os-sync-monitors",
        title: "Monitors and Condition Variables",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "High-level language synchronization constructs encapsulating shared data, mutexes, and condition variables (e.g. Java synchronized).",
        keyInvariants: [
          "Monitor guarantees that only one thread can be active within the monitor at any given moment.",
          "Condition Variables provide wait() and signal() operations without an internal counter.",
          "wait(): Releases the monitor lock and blocks until signaled.",
          "signal(): Wakes up one thread waiting on the condition variable.",
        ],
        detailedContent:
          "Monitors eliminate low-level semaphore sequencing bugs (such as forgetting to call signal or accidental double-wait).",
      },
      {
        id: "os-sync-producer",
        title: "Producer-Consumer Problem",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Classic bounded-buffer synchronization problem between producers generating data and consumers removing data.",
        keyInvariants: [
          "Uses 3 semaphores: mutex (binary, initialized to 1), empty (counting, initialized to Buffer_Size), full (counting, initialized to 0).",
          "Producer: wait(empty) -> wait(mutex) -> Add item -> signal(mutex) -> signal(full).",
          "Consumer: wait(full) -> wait(mutex) -> Remove item -> signal(mutex) -> signal(empty).",
        ],
        detailedContent:
          "Crucial ordering: wait(empty) MUST precede wait(mutex)! Swapping the order creates an immediate deadlock if the buffer is full.",
      },
      {
        id: "os-sync-readers",
        title: "Readers-Writers Problem",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Allowing concurrent readers while ensuring exclusive access for writers.",
        keyInvariants: [
          "Multiple readers can read the database concurrently without interference.",
          "Only one writer can update the database at a time, requiring exclusive access.",
          "First Readers-Writers Problem (Reader Preference): Starves writers if readers arrive continuously.",
          "Second Readers-Writers Problem (Writer Preference): Prevents writer starvation.",
        ],
        detailedContent:
          "Implemented in modern OSs as Reader-Writer Locks (RWLocks, e.g. pthread_rwlock_t).",
      },
      {
        id: "os-sync-philosophers",
        title: "Dining Philosophers Problem",
        moduleName: "4. Synchronization",
        readTime: "5 min read",
        summary:
          "Classic benchmark illustrating deadlock, resource hierarchy, and starvation.",
        keyInvariants: [
          "5 philosophers sit around a circular table with 5 chopsticks; each needs 2 chopsticks to eat.",
          "Deadlock scenario: Every philosopher simultaneously picks up their left chopstick and waits indefinitely for their right chopstick.",
          "Solutions: 1) Allow at most 4 philosophers to sit simultaneously. 2) Asymmetric solution: Odd philosophers pick left-then-right, even philosophers pick right-then-left.",
        ],
        detailedContent:
          "Demonstrates why acquiring multiple shared resources without a consistent global order inevitably produces deadlocks.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 5: Deadlocks (4 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-deadlocks",
    name: "5. Deadlocks",
    topics: [
      {
        id: "os-deadlock-fundamentals",
        title: "Deadlock Fundamentals",
        moduleName: "5. Deadlocks",
        readTime: "5 min read",
        summary:
          "Definition of deadlocks and the 4 Coffman conditions required for deadlocks to occur.",
        keyInvariants: [
          "Deadlock Definition: A state where a set of processes are blocked because each process is holding a resource and waiting for another resource held by another process in the set.",
          "The 4 Coffman Conditions (Must ALL hold simultaneously):",
          "1. Mutual Exclusion: Resources are non-shareable.",
          "2. Hold and Wait: A process holds resources while requesting new ones.",
          "3. No Preemption: Resources cannot be forcibly revoked.",
          "4. Circular Wait: A closed chain of processes P0, P1... Pn exists where P(i) waits for P(i+1) and P(n) waits for P0.",
        ],
        detailedContent:
          "Resource Allocation Graph (RAG): If the graph contains no cycles, no deadlock exists. If a cycle exists with single-instance resource types, a deadlock is guaranteed.",
      },
      {
        id: "os-deadlock-prevention",
        title: "Deadlock Prevention and Avoidance",
        moduleName: "5. Deadlocks",
        readTime: "6 min read",
        summary:
          "Techniques to eliminate deadlocks at design time (Prevention) or dynamically during runtime (Banker's Algorithm Avoidance).",
        keyInvariants: [
          "Deadlock Prevention: Invalidate at least one Coffman condition (e.g. impose total ordering on all resources to prevent Circular Wait).",
          "Deadlock Avoidance: The OS requires advance information about the maximum resources each process will ever claim.",
          "Safe State: A state is safe if there exists a safe sequence <P1, P2, ... Pn> such that for each Pi, its remaining resource needs can be satisfied by currently available resources plus resources held by all preceding processes.",
        ],
        detailedContent:
          "Banker's Algorithm: Tests whether granting a resource request leaves the system in a safe state. If yes, allocate; if no, defer the request.",
      },
      {
        id: "os-deadlock-detection",
        title: "Deadlock Detection and Recovery",
        moduleName: "5. Deadlocks",
        readTime: "5 min read",
        summary:
          "Permitting deadlocks to happen, detecting cycles periodically, and recovering via process termination or preemption.",
        keyInvariants: [
          "Detection Algorithm: Periodically checks the wait-for graph for cycles (cost O(N^2) or O(M * N^2)).",
          "Recovery Options: 1) Abort all deadlocked processes (costly). 2) Abort processes one at a time until the deadlock cycle is broken.",
          "Resource Preemption: Successively preempt resources from processes and give them to others until deadlock is resolved; requires checkpoint rollback.",
        ],
        detailedContent:
          "Starvation Risk in Recovery: A process selected as a victim for resource preemption could be picked repeatedly unless the OS tracks its victim count.",
      },
      {
        id: "os-deadlock-numericals",
        title: "Deadlock Numericals",
        moduleName: "5. Deadlocks",
        readTime: "6 min read",
        summary:
          "Solving Banker's Algorithm safety and resource-request calculations with Allocation, Max, Need, and Available matrices.",
        keyInvariants: [
          "Need Matrix formula: Need[i][j] = Max[i][j] - Allocation[i][j].",
          "Check condition: Need[i] <= Available.",
          "If condition is satisfied: Available = Available + Allocation[i]; process Pi finishes.",
        ],
        detailedContent:
          "Step-by-step example with 5 processes and 3 resource types (A, B, C). Calculation verifies whether a given request can be granted immediately or must wait.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 6: Memory Management (8 Topics)
  // ----------------------------------------------------
  {
    id: "os-mod-memory",
    name: "6. Memory Management",
    topics: [
      {
        id: "os-mem-fundamentals",
        title: "Memory Management Fundamentals",
        moduleName: "6. Memory Management",
        readTime: "5 min read",
        summary:
          "Physical vs logical addresses, contiguous memory allocation, internal vs external fragmentation, and compaction.",
        keyInvariants: [
          "Logical Address: Generated by the CPU; translated by the Memory Management Unit (MMU) into a Physical Address.",
          "Internal Fragmentation: Allocated memory block is slightly larger than requested; unused memory within the partition is wasted.",
          "External Fragmentation: Total free memory space exists to satisfy a request, but it is fragmented into non-contiguous blocks.",
          "Compaction: Moving all allocated blocks to one end of memory to combine free blocks (requires dynamic relocation).",
        ],
        detailedContent:
          "Allocation strategies for contiguous partitions: First-Fit (fastest), Best-Fit (searches smallest block, produces tiny leftovers), Worst-Fit (leaves largest leftover).",
      },
      {
        id: "os-mem-paging",
        title: "Paging",
        moduleName: "6. Memory Management",
        readTime: "6 min read",
        summary:
          "Non-contiguous memory allocation dividing logical memory into fixed-size Pages and physical RAM into fixed-size Frames.",
        keyInvariants: [
          "Page Size is strictly equal to Frame Size (typically 4 KB = 2^12 bytes).",
          "Virtual Address is split into: Page Number (p) and Page Offset (d).",
          "Physical Address = Frame Number (f) concatenated with Offset (d).",
          "Paging completely eliminates External Fragmentation; it produces minimal Internal Fragmentation (at most half a page on average for the final frame).",
        ],
        detailedContent:
          "Because pages can be placed into any free frame in RAM, processes no longer require contiguous physical memory chunks.",
      },
      {
        id: "os-mem-page-tables",
        title: "Page Tables",
        moduleName: "6. Memory Management",
        readTime: "5 min read",
        summary:
          "Data structures mapping page numbers to frame numbers, including hierarchical and inverted page tables.",
        keyInvariants: [
          "Page Table Entry (PTE) bits: Frame Number, Valid/Invalid bit, Dirty/Modified bit, Reference bit, Read/Write permissions.",
          "Single-level page table for a 32-bit system with 4 KB pages requires 2^20 entries = 4 MB per process.",
          "Hierarchical (Multi-Level) Paging: Breaks the page table into multiple levels to avoid allocating contiguous memory for unused address regions.",
        ],
        detailedContent:
          "Modern 64-bit architectures (x86-64) use 4-level or 5-level page tables (PML4, PML5) to span massive virtual address ranges.",
      },
      {
        id: "os-mem-tlb",
        title: "TLB",
        moduleName: "6. Memory Management",
        readTime: "5 min read",
        summary:
          "High-speed associative hardware cache storing recently accessed page-to-frame translations to accelerate memory lookups.",
        keyInvariants: [
          "TLB Hit: Frame number retrieved in ~1 CPU clock cycle.",
          "TLB Miss: CPU must access page tables in RAM (adding 1 to 4 memory access cycles), then updates the TLB.",
          "Effective Memory Access Time (EMAT) = Hit_Ratio * (t_TLB + t_RAM) + (1 - Hit_Ratio) * (t_TLB + 2 * t_RAM).",
        ],
        detailedContent:
          "Context switching traditionally invalidates the entire TLB, which causes a temporary performance penalty until the new process warms up the cache.",
      },
      {
        id: "os-mem-virtual",
        title: "Virtual Memory & Demand Paging",
        moduleName: "6. Memory Management",
        readTime: "7 min read",
        summary:
          "Decoupling user logical memory from physical memory, executing processes larger than RAM via Demand Paging and Page Faults.",
        keyInvariants: [
          "Demand Paging: Pages are loaded into physical RAM only when referenced during execution.",
          "Page Fault: Hardware interrupt triggered when accessing a page whose Valid/Invalid bit is 0 (not in RAM).",
          "Page Fault Resolution Steps: 1) Trap to OS, 2) Check PCB legality, 3) Find free frame, 4) Read page from swap disk via DMA, 5) Update page table valid bit, 6) Restart trapped instruction.",
        ],
        detailedContent:
          "Virtual memory provides huge logical address spaces, enables shared memory between processes via shared frames, and accelerates process creation via Copy-On-Write (COW).",
      },
      {
        id: "os-mem-page-replacement",
        title: "Page Replacement Algorithms",
        moduleName: "6. Memory Management",
        readTime: "6 min read",
        summary:
          "Selecting which resident page frame to evict when RAM is full: FIFO, Belady's Anomaly, Optimal, LRU, and Clock.",
        keyInvariants: [
          "FIFO (First-In, First-Out): Replaces oldest page. Suffers from Belady's Anomaly (increasing frames can increase page faults!).",
          "Optimal (OPT / MIN): Replaces page not referenced for longest time in the future. Provably optimal; used as theoretical benchmark.",
          "LRU (Least Recently Used): Replaces page not referenced for longest time in the past. Stack-based algorithm; immune to Belady's Anomaly.",
          "Clock (Second-Chance): Hardware approximation of LRU using a single reference bit and a circular pointer.",
        ],
        detailedContent:
          "Stack Algorithms satisfy the inclusion property: the set of pages in memory for N frames is always a subset of the pages for N+1 frames.",
      },
      {
        id: "os-mem-frame-allocation",
        title: "Frame Allocation",
        moduleName: "6. Memory Management",
        readTime: "4 min read",
        summary:
          "Strategies for dividing available physical frames among competing processes.",
        keyInvariants: [
          "Minimum Number of Frames: Defined by computer architecture (must hold all pages referenced by a single machine instruction).",
          "Equal Allocation: Divide m frames equally among n processes (m/n frames each).",
          "Proportional Allocation: Allocate frames proportionally according to the virtual memory size of each process.",
          "Global vs Local Replacement: Global replacement allows a process to select a replacement frame from the set of all frames; local replacement restricts eviction to its own allocated frames.",
        ],
        detailedContent:
          "Global replacement gives higher system throughput, but leaves processes vulnerable to memory hoarding by peer processes.",
      },
      {
        id: "os-mem-thrashing",
        title: "Thrashing",
        moduleName: "6. Memory Management",
        readTime: "5 min read",
        summary:
          "A catastrophic performance collapse where the system spends more time paging than executing instructions.",
        keyInvariants: [
          "Cause: Degree of multiprogramming is too high; the sum of working set sizes of all active processes exceeds total physical RAM.",
          "Symptom: CPU utilization drops toward zero as all processes wait for disk I/O to swap pages in and out.",
          "Working Set Model: Based on the principle of locality. Allocates enough frames to cover each process's working set window Delta.",
          "Page Fault Frequency (PFF): Sets upper and lower bounds on page fault rates to dynamically adjust frame allocations.",
        ],
        detailedContent:
          "Remedy for Thrashing: The OS must decrease the degree of multiprogramming by suspending/swapping out processes until memory pressure subsides.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 7: I/O Systems (1 Topic)
  // ----------------------------------------------------
  {
    id: "os-mod-io",
    name: "7. I/O Systems",
    topics: [
      {
        id: "os-io-systems",
        title: "I/O Systems & Storage",
        moduleName: "7. I/O Systems",
        readTime: "6 min read",
        summary:
          "Device management, data transfer modes (polling, interrupts, DMA), disk scheduling algorithms, and UNIX Inode file systems.",
        keyInvariants: [
          "Programmed I/O (Polling): CPU repeatedly reads status register in a tight loop (wastes cycles).",
          "Interrupt-Driven I/O: Device controller interrupts CPU when ready; CPU transfers data word-by-word.",
          "Direct Memory Access (DMA): Dedicated DMA controller transfers entire blocks between device buffer and RAM without CPU intervention.",
          "Disk Scheduling: FCFS, SSTF (Shortest Seek Time First - starvation risk), SCAN (Elevator), C-SCAN (Circular SCAN).",
          "Inodes: File system metadata record with 12 direct pointers, 1 single indirect, 1 double indirect, 1 triple indirect pointer.",
        ],
        detailedContent:
          "Inodes allow instant access to small files via direct block pointers while seamlessly scaling to terabyte-sized files via multi-level indirect pointer trees.",
      },
    ],
  },
];

// Recall / Questions Data
const OS_RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: "rec-1",
    question: "What are The Three Main Jobs of an Operating System?",
    difficulty: "Essential",
    topics: ["OS Fundamentals", "Architecture"],
    modelAnswer:
      "1. Resource Manager: Coordinates and shares finite hardware resources (CPU time, RAM memory, storage, and peripheral devices) among multiple competing applications so they run concurrently without conflict.\n2. Protection Layer: Enforces process isolation, hardware privilege levels (Dual-mode operation), memory bounds, and file access permissions to prevent faulty or malicious programs from crashing the entire system.\n3. Hardware Helper: Abstracts away physical hardware details (e.g. disk sector heads, memory chips, packet buffers) into clean, standardized programming interfaces (files, virtual addresses, network sockets).",
    keyTakeaway:
      "Structure your answer around the three core pillars: Resource Allocation, Protection/Security, and Hardware Abstraction.",
  },
  {
    id: "rec-2",
    question: "What is the difference between a Process and a Thread? What is shared and what is private?",
    difficulty: "Essential",
    topics: ["Processes", "Threads", "Memory Layout"],
    modelAnswer:
      "A process is an isolated instance of an executing program with its own dedicated virtual address space, file descriptor table, and security tokens. A thread is an execution stream inside a process.\n\nShared across threads:\n- Code (text) segment, Data segment, and Heap memory.\n- Open file descriptors and network sockets.\n- Signal handlers and environment variables.\n\nPrivate to each thread:\n- Thread ID (TID), Program Counter (PC), and CPU registers state.\n- Dedicated call stack (local variables, return addresses).\n- Thread-Local Storage (TLS).",
    keyTakeaway:
      "Processes provide strong fault isolation at higher context-switching cost; threads provide lightweight concurrency with shared memory, requiring synchronization.",
  },
  {
    id: "rec-3",
    question: "What are the 4 Coffman conditions for Deadlock, and how does Banker's Algorithm avoid deadlocks?",
    difficulty: "Essential",
    topics: ["Deadlock", "Banker's Algorithm", "Concurrency"],
    modelAnswer:
      "The 4 Coffman conditions that must hold simultaneously for a deadlock are:\n1. Mutual Exclusion: Resources cannot be shared.\n2. Hold and Wait: A process holds resources while requesting new ones.\n3. No Preemption: Resources cannot be taken by force.\n4. Circular Wait: A closed loop of processes where each waits for a resource held by the next.\n\nBanker's Algorithm avoids deadlocks by simulating resource allocation for each request. It checks whether granting the request keeps the system in a 'Safe State' - meaning there exists at least one sequence of process executions where all can finish without deadlock. If the state would become unsafe, the request is denied or deferred.",
    keyTakeaway:
      "Deadlock avoidance requires advance knowledge of maximum resource demands; deadlock prevention breaks one of the 4 conditions at design time.",
  },
  {
    id: "rec-4",
    question: "What is Belady's Anomaly? Which page replacement algorithms suffer from it?",
    difficulty: "Very High",
    topics: ["Memory Management", "Paging", "Algorithms"],
    modelAnswer:
      "Belady's Anomaly is the counter-intuitive phenomenon where increasing the number of page frames in physical memory results in an INCREASE in the number of page faults for a given memory reference string.\n\nFIFO (First-In, First-Out) suffers from Belady's Anomaly.\nStack-based algorithms (such as LRU and Optimal Page Replacement) never suffer from Belady's Anomaly because the set of pages in memory for N frames is always a strict subset of the pages for N+1 frames (inclusion property).",
    keyTakeaway:
      "Stack algorithms satisfy the inclusion property and are mathematically immune to Belady's Anomaly.",
  },
  {
    id: "rec-5",
    question: "Explain Thrashing in operating systems. What causes it and how can it be eliminated?",
    difficulty: "Very High",
    topics: ["Virtual Memory", "Paging", "Thrashing"],
    modelAnswer:
      "Thrashing occurs when the CPU spends the vast majority of its time swapping pages in and out of secondary storage (paging activity) rather than executing useful instructions. CPU utilization plummets toward zero.\n\nCauses: High degree of multiprogramming where the sum of working set sizes of all active processes exceeds total physical RAM.\n\nRemedies:\n1. Working Set Model: Monitor the set of pages referenced by each process in the last Delta time units. Allocate enough frames to satisfy each process's working set; suspend/swap out processes if memory is oversubscribed.\n2. Page Fault Frequency (PFF): Set upper and lower thresholds for page fault rates. If a process faults too often, assign it more frames; if too rarely, reclaim frames.",
    keyTakeaway:
      "Thrashing is solved by decreasing the degree of multiprogramming and enforcing working-set memory allocations.",
  },
];

// Revise Flash Summaries
const OS_REVISE_SECTIONS: ReviseSection[] = [
  {
    title: "1. OS Fundamentals",
    summary: "The Three Main Jobs, Kernel Modes, and System Calls.",
    bullets: [
      "Three Main Jobs: Resource Manager (allocates CPU/RAM), Protection Layer (restricts unauthorized access), Hardware Helper (provides clean APIs).",
      "User Mode (Ring 3) has restricted privileges; Kernel Mode (Ring 0) has full machine access. Hardware Mode Bit enforces the boundary.",
      "System Calls use software trap instructions (e.g. syscall in x86-64) to transfer control to the kernel via the Interrupt Vector Table.",
    ],
  },
  {
    title: "2. Processes & Threads",
    summary: "Process states, PCBs, multithreading models, and context switching.",
    bullets: [
      "Process is a program in execution with isolated virtual memory. Thread is an execution stream sharing heap, data, and code segments.",
      "Context Switch saves CPU registers to the current PCB/TCB and restores registers from the next PCB/TCB.",
      "Zombie process has finished execution but has not been reaped via wait(). Orphan process has lost its parent and is adopted by init (PID 1).",
    ],
  },
  {
    title: "3. CPU Scheduling",
    summary: "Turnaround, waiting time, and scheduling algorithms.",
    bullets: [
      "Turnaround Time (TAT) = Completion - Arrival. Waiting Time (WT) = TAT - Burst Time.",
      "FCFS suffers from the Convoy Effect. SJF is optimal for minimum average waiting time. Round Robin uses a fixed Time Quantum.",
      "Linux CFS uses a Red-Black Tree indexed by virtual runtime (vruntime) to guarantee fair scheduling.",
    ],
  },
  {
    title: "4. Synchronization",
    summary: "Race conditions, Mutex, Semaphores, and classic problems.",
    bullets: [
      "Critical Section requirements: Mutual Exclusion, Progress, and Bounded Waiting.",
      "Mutex is an ownership lock; Semaphore is an integer signaling mechanism without ownership.",
      "Producer-Consumer requires wait(empty) before wait(mutex) to avoid deadlock.",
    ],
  },
  {
    title: "5. Deadlocks",
    summary: "The 4 Coffman conditions and Banker's Algorithm.",
    bullets: [
      "4 Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
      "Deadlock Prevention invalidates one of the 4 conditions (e.g. strict resource ordering breaks circular wait).",
      "Banker's Algorithm avoids deadlocks by dynamically ensuring the system remains in a Safe State.",
    ],
  },
  {
    title: "6. Memory Management",
    summary: "Paging, TLB, Virtual Memory, and Page Replacement.",
    bullets: [
      "Page Size == Frame Size. Logical address = (Page p, Offset d). Physical address = (Frame f, Offset d).",
      "Effective Memory Access Time (EMAT) considers TLB hit ratio: EMAT = h * (t_TLB + t_RAM) + (1-h) * (t_TLB + 2*t_RAM).",
      "Belady's Anomaly affects FIFO page replacement. LRU and Optimal are stack-based and immune.",
      "Thrashing is resolved by reducing the degree of multiprogramming and using the Working Set Model.",
    ],
  },
  {
    title: "7. I/O Systems",
    summary: "DMA, Disk Scheduling, and Inodes.",
    bullets: [
      "Direct Memory Access (DMA) transfers blocks directly between device and RAM without continuous CPU intervention.",
      "SCAN (Elevator) and C-SCAN (Circular SCAN) disk scheduling reduce head seek times.",
      "Inodes store 12 direct pointers, single indirect, double indirect, and triple indirect block pointers.",
    ],
  },
];

export const SUBJECT_CONFIGS: Record<string, {
  id: string;
  name: string;
  badge: string;
  curriculumLabel: string;
  storageKey: string;
  category: ProgressCategory;
  modules: ModuleGroup[];
  reviseSections: ReviseSection[];
  recallQuestions: RecallQuestion[];
}> = {
  "operating-systems": {
    id: "operating-systems",
    name: "Operating Systems",
    badge: "7 Modules · 31 Topics",
    curriculumLabel: "PrepLoom OS",
    storageKey: "interviewai_os_mastered_topics",
    category: "core_cs_os",
    modules: OS_MODULES,
    reviseSections: OS_REVISE_SECTIONS,
    recallQuestions: OS_RECALL_QUESTIONS,
  },
  "modern-computer-architecture": {
    id: "modern-computer-architecture",
    name: "Modern Computer Architecture",
    badge: "5 Modules · 27 Topics",
    curriculumLabel: "PrepLoom Modern Computer Architecture",
    storageKey: "interviewai_arch_mastered_topics",
    category: "core_cs_arch",
    modules: ARCH_MODULES,
    reviseSections: ARCH_REVISE_SECTIONS,
    recallQuestions: ARCH_RECALL_QUESTIONS,
  },
  "oop": {
    id: "oop",
    name: "Object-Oriented Programming",
    badge: "6 Modules · 23 Topics",
    curriculumLabel: "PrepLoom OOP",
    storageKey: "interviewai_oop_mastered_topics",
    category: "core_cs_oop",
    modules: OOP_MODULES,
    reviseSections: OOP_REVISE_SECTIONS,
    recallQuestions: OOP_RECALL_QUESTIONS,
  },
  "dbms": {
    id: "dbms",
    name: "Database Management Systems",
    badge: "6 Modules · 32 Topics",
    curriculumLabel: "PrepLoom DBMS",
    storageKey: "interviewai_dbms_mastered_topics",
    category: "core_cs_dbms",
    modules: DBMS_MODULES,
    reviseSections: DBMS_REVISE_SECTIONS,
    recallQuestions: DBMS_RECALL_QUESTIONS,
  },
  "computer-networks": {
    id: "computer-networks",
    name: "Computer Networks",
    badge: "7 Modules · 35 Topics",
    curriculumLabel: "PrepLoom Computer Networks",
    storageKey: "interviewai_cn_mastered_topics",
    category: "core_cs_cn",
    modules: NETWORKS_MODULES,
    reviseSections: NETWORKS_REVISE_SECTIONS,
    recallQuestions: NETWORKS_RECALL_QUESTIONS,
  },
};

interface CoreCSViewProps {
  initialSubjectId?: string;
  onSelectSubject?: (subjectSlug: string) => void;
}

export const CoreCSView: React.FC<CoreCSViewProps> = ({
  initialSubjectId = "operating-systems",
  onSelectSubject,
}) => {
  const [internalSubjectSlug, setInternalSubjectSlug] = useState<string>(initialSubjectId);

  useEffect(() => {
    if (initialSubjectId) {
      setInternalSubjectSlug(initialSubjectId);
    }
  }, [initialSubjectId]);

  const activeSubjectSlug = useMemo(() => {
    const slug = internalSubjectSlug;
    if (
      slug === "modern-computer-architecture" ||
      slug === "computer-architecture" ||
      slug === "architecture"
    ) {
      return "modern-computer-architecture";
    }
    if (
      slug === "oop" ||
      slug === "oops" ||
      slug === "object-oriented-programming"
    ) {
      return "oop";
    }
    if (
      slug === "dbms" ||
      slug === "database" ||
      slug === "database-management-systems"
    ) {
      return "dbms";
    }
    if (
      slug === "computer-networks" ||
      slug === "cn" ||
      slug === "networks"
    ) {
      return "computer-networks";
    }
    return "operating-systems";
  }, [internalSubjectSlug]);

  const currentSubjectConfig = useMemo(() => {
    return SUBJECT_CONFIGS[activeSubjectSlug] || SUBJECT_CONFIGS["operating-systems"];
  }, [activeSubjectSlug]);

  // All topics flattened for active subject
  const allCurrentTopics = useMemo(() => {
    return currentSubjectConfig.modules.flatMap((m) => m.topics);
  }, [currentSubjectConfig]);

  // Active topic state
  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    return currentSubjectConfig.modules[0]?.topics[0]?.id || "os-intro";
  });

  // Switch active topic whenever subject changes
  useEffect(() => {
    if (currentSubjectConfig.modules[0]?.topics[0]?.id) {
      setActiveTopicId(currentSubjectConfig.modules[0].topics[0].id);
    }
  }, [activeSubjectSlug, currentSubjectConfig]);

  // Study mode state: Learn vs Revise vs Recall
  const [studyMode, setStudyMode] = useState<StudyMode>("learn");

  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // Mastered progress tracking
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>({});

  // Accordion open modules in sidebar
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  // Auto-expand all modules when subject changes
  useEffect(() => {
    const initialOpen: Record<string, boolean> = {};
    currentSubjectConfig.modules.forEach((m) => {
      initialOpen[m.id] = true;
    });
    setOpenModules(initialOpen);
  }, [currentSubjectConfig]);

  // Recall expanded questions
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    if (currentSubjectConfig.recallQuestions.length > 0) {
      setExpandedQuestionId(currentSubjectConfig.recallQuestions[0].id);
    }
  }, [currentSubjectConfig]);

  // Code copied state
  const [copiedCode, setCopiedCode] = useState(false);

  // Load progress from localStorage and synchronize with global progress events
  useEffect(() => {
    const loadLocalProgress = () => {
      try {
        const stored = localStorage.getItem(currentSubjectConfig.storageKey);
        if (stored) {
          setMasteredTopics(JSON.parse(stored));
        } else {
          setMasteredTopics({});
        }
      } catch {
        setMasteredTopics({});
      }
    };

    loadLocalProgress();

    const handleProgressChange = () => {
      loadLocalProgress();
    };

    window.addEventListener(PROGRESS_EVENT_NAME, handleProgressChange);
    return () => window.removeEventListener(PROGRESS_EVENT_NAME, handleProgressChange);
  }, [currentSubjectConfig.storageKey]);

  const toggleMastered = (topicId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextVal = !masteredTopics[topicId];
    const updated = { ...masteredTopics, [topicId]: nextVal };
    setMasteredTopics(updated);

    try {
      localStorage.setItem(currentSubjectConfig.storageKey, JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // Identify topic title for backend logging
    const topicObj = allCurrentTopics.find((t) => t.id === topicId);

    // Optimistically broadcast event to all components (Dashboard, Sidebar, etc.)
    broadcastProgressUpdate();

    // Persist to backend PostgreSQL database
    recordProgressToggle(
      currentSubjectConfig.category,
      topicId,
      nextVal,
      topicObj?.title || topicId
    );
  };

  const toggleModuleOpen = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  // Currently active topic object
  const currentTopic = useMemo(() => {
    return allCurrentTopics.find((t) => t.id === activeTopicId) || allCurrentTopics[0];
  }, [allCurrentTopics, activeTopicId]);

  // Current topic index for Next / Previous buttons
  const currentIndex = useMemo(() => {
    return allCurrentTopics.findIndex((t) => t.id === activeTopicId);
  }, [allCurrentTopics, activeTopicId]);

  const prevTopic = currentIndex > 0 ? allCurrentTopics[currentIndex - 1] : null;
  const nextTopic = currentIndex < allCurrentTopics.length - 1 ? allCurrentTopics[currentIndex + 1] : null;

  // Mastered count & percentage
  const masteredCount = useMemo(() => {
    return allCurrentTopics.filter((t) => masteredTopics[t.id]).length;
  }, [allCurrentTopics, masteredTopics]);

  const progressPercentage = Math.round((masteredCount / (allCurrentTopics.length || 1)) * 100);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* 5-Subject Quick Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: "operating-systems", name: "Operating Systems", icon: Cpu, total: 31 },
          { id: "dbms", name: "DBMS", icon: Database, total: 32 },
          { id: "computer-networks", name: "Computer Networks", icon: Network, total: 35 },
          { id: "oop", name: "OOP", icon: Code2, total: 23 },
          { id: "modern-computer-architecture", name: "Computer Architecture", icon: Layers, total: 27 },
        ].map((subj) => {
          const isActive = activeSubjectSlug === subj.id;
          const Icon = subj.icon;
          return (
            <button
              key={subj.id}
              type="button"
              onClick={() => {
                setInternalSubjectSlug(subj.id);
                if (onSelectSubject) {
                  onSelectSubject(subj.id);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? "bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold"
                  : "bg-[#111115] text-zinc-400 border border-zinc-800/80 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
              <span>{subj.name}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Subject Header & Mode Switcher */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Subject Identity & Live Progress */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#16161c] border border-zinc-750 flex items-center justify-center text-zinc-200 shrink-0">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold tracking-wider">
                  Core CS Curriculum
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/40">
                  {currentSubjectConfig.badge}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {currentSubjectConfig.name}
              </h1>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 pt-0.5">
            <div className="w-44 bg-zinc-850 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              <strong className="text-white">{masteredCount}</strong> of {allCurrentTopics.length} completed ({progressPercentage}%)
            </span>
          </div>
        </div>

        {/* Right: Learn / Revise / Recall Study Mode Toggle (Exact PrepLoom Framework) */}
        <div className="flex items-center gap-1 bg-[#111115] p-1 rounded-md border border-zinc-800 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setStudyMode("learn")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              studyMode === "learn"
                ? "bg-zinc-800 text-white font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Learn</span>
          </button>

          <button
            type="button"
            onClick={() => setStudyMode("revise")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              studyMode === "revise"
                ? "bg-zinc-800 text-white font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Revise</span>
          </button>

          <button
            type="button"
            onClick={() => setStudyMode("recall")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              studyMode === "recall"
                ? "bg-zinc-800 text-white font-semibold shadow-xs"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Recall / Questions ({currentSubjectConfig.recallQuestions.length})</span>
          </button>
        </div>
      </div>

      {/* 2. MODE: LEARN (Refined Editorial Split-Pane Reading Canvas) */}
      {studyMode === "learn" && (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* LEFT SIDEBAR: Table of Contents / Topic Navigator (Fixed 280px / w-72) */}
          <aside className="w-full lg:w-72 shrink-0 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 p-3 space-y-3 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. Paging, Mutex)..."
                className="w-full bg-[#111115] border border-zinc-800 rounded-md pl-8 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-700 font-mono"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Modules and Topics Accordions */}
            <div className="space-y-1.5 text-xs">
              {currentSubjectConfig.modules.map((module) => {
                const isOpen = openModules[module.id] ?? true;
                const matchingTopics = module.topics.filter((t) =>
                  !searchQuery.trim()
                    ? true
                    : t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      t.summary.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (matchingTopics.length === 0) return null;

                const completedInModule = module.topics.filter((t) => masteredTopics[t.id]).length;

                return (
                  <div key={module.id} className="rounded-md border border-zinc-800/60 bg-[#111115]/40 overflow-hidden">
                    {/* Module Header */}
                    <button
                      type="button"
                      onClick={() => toggleModuleOpen(module.id)}
                      className="w-full flex items-center justify-between p-2.5 text-left font-mono text-[11px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{module.name}</span>
                        <span className="text-[10px] text-zinc-500 font-normal">
                          ({completedInModule}/{module.topics.length})
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                      )}
                    </button>

                    {/* Topics List */}
                    {isOpen && (
                      <div className="p-1 space-y-0.5 border-t border-zinc-800/60">
                        {matchingTopics.map((topic) => {
                          const isCurrent = topic.id === activeTopicId;
                          const isCompleted = !!masteredTopics[topic.id];

                          return (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => setActiveTopicId(topic.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left cursor-pointer ${
                                isCurrent
                                  ? "bg-zinc-800/80 text-white font-medium border-l-2 border-emerald-400 pl-2 shadow-xs"
                                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30"
                              }`}
                            >
                              <span className="truncate pr-2">{topic.title}</span>

                              <div
                                onClick={(e) => toggleMastered(topic.id, e)}
                                className="shrink-0 p-0.5 rounded hover:bg-zinc-700/40"
                                title={isCompleted ? "Mark uncompleted" : "Mark completed"}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <span className="w-3.5 h-3.5 rounded-full border border-zinc-700 block" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* RIGHT READING CANVAS: Clean, Open Editorial Document Canvas */}
          <main className="flex-1 min-w-0 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 p-6 sm:p-10 shadow-sm">
            <article className="max-w-3xl mx-auto space-y-8">
              {/* Header Breadcrumb & Actions */}
              <header className="space-y-4 border-b border-zinc-800/80 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                    <span>{currentSubjectConfig.name}</span>
                    <span>/</span>
                    <span className="text-zinc-400">{currentTopic.moduleName}</span>
                    <span>/</span>
                    <span className="text-zinc-300 font-medium">Topic {currentIndex + 1} of {allCurrentTopics.length}</span>
                  </div>

                  {/* Mark as Completed Button */}
                  <button
                    type="button"
                    onClick={() => toggleMastered(currentTopic.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer shrink-0 self-start sm:self-auto ${
                      masteredTopics[currentTopic.id]
                        ? "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                        : "bg-[#111115] text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        masteredTopics[currentTopic.id] ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    />
                    <span>
                      {masteredTopics[currentTopic.id] ? "Completed" : "Mark as Complete"}
                    </span>
                  </button>
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentTopic.title}
                  </h1>

                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{currentTopic.readTime}</span>
                    </span>
                    <span>•</span>
                    <span className="text-zinc-500">Curriculum standard: {currentSubjectConfig.curriculumLabel}</span>
                  </div>
                </div>
              </header>

              {/* High-Level Editorial Lead Summary */}
              <div className="border-l-2 border-emerald-500/80 pl-4 py-2 bg-gradient-to-r from-emerald-950/20 via-emerald-950/5 to-transparent rounded-r-md">
                <p className="text-[15px] sm:text-base text-zinc-200 leading-relaxed font-normal">
                  {currentTopic.summary}
                </p>
              </div>

              {/* The Three Main Pillars / Jobs (Feature Cards for Intro) */}
              {currentTopic.theThreeJobs && (
                <section className="space-y-4 pt-2">
                  <div className="border-b border-zinc-800/80 pb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-zinc-100 tracking-tight flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-400" />
                      <span>
                        {activeSubjectSlug === "modern-computer-architecture"
                          ? "Three Core Hardware Architecture Pillars"
                          : activeSubjectSlug === "oop"
                          ? "Three Core Object-Oriented Principles"
                          : activeSubjectSlug === "dbms"
                          ? "Three Core Database Engine Pillars"
                          : activeSubjectSlug === "computer-networks"
                          ? "Three Core Network Architecture Pillars"
                          : "The Three Main Jobs of an Operating System"}
                      </span>
                    </h2>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Core Foundations</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Job 1 */}
                    <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          <h3 className="text-xs sm:text-sm font-semibold text-white">
                            {activeSubjectSlug === "modern-computer-architecture"
                              ? "Logic & Compute"
                              : activeSubjectSlug === "oop"
                              ? "State & Data Hiding"
                              : activeSubjectSlug === "dbms"
                              ? "Storage Engine & Buffer Pool"
                              : activeSubjectSlug === "computer-networks"
                              ? "Packet Encapsulation & Transport"
                              : "Resource Manager"}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          01
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {currentTopic.theThreeJobs.resourceManager}
                      </p>
                    </div>

                    {/* Job 2 */}
                    <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <h3 className="text-xs sm:text-sm font-semibold text-white">
                            {activeSubjectSlug === "modern-computer-architecture"
                              ? "Noise & Voltage Margins"
                              : activeSubjectSlug === "oop"
                              ? "Behavioral Abstraction"
                              : activeSubjectSlug === "dbms"
                              ? "ACID & Concurrency Coordinator"
                              : activeSubjectSlug === "computer-networks"
                              ? "Routing & Global Interconnection"
                              : "Protection Layer"}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          02
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {currentTopic.theThreeJobs.protectionLayer}
                      </p>
                    </div>

                    {/* Job 3 */}
                    <div className="p-4 rounded-lg bg-[#111115] border border-zinc-800/80 hover:border-zinc-700/80 transition-colors space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                          <h3 className="text-xs sm:text-sm font-semibold text-white">
                            {activeSubjectSlug === "modern-computer-architecture"
                              ? "Universal Building Blocks"
                              : activeSubjectSlug === "oop"
                              ? "Modular Composition"
                              : activeSubjectSlug === "dbms"
                              ? "Query Optimizer & Index Engine"
                              : activeSubjectSlug === "computer-networks"
                              ? "Reliability & Flow Management"
                              : "Hardware Helper"}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          03
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {currentTopic.theThreeJobs.hardwareHelper}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* Core Technical Invariants List */}
              {currentTopic.keyInvariants && currentTopic.keyInvariants.length > 0 && (
                <section className="space-y-3 pt-2">
                  <h2 className="text-sm font-semibold text-zinc-100 tracking-tight border-b border-zinc-800/80 pb-2">
                    Key Technical Rules & Invariants
                  </h2>
                  <div className="space-y-2">
                    {currentTopic.keyInvariants.map((inv, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-md bg-[#111115]/70 border border-zinc-800/70 flex items-start gap-3 text-xs sm:text-[13px] text-zinc-300 leading-relaxed"
                      >
                        <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/40 mt-0.5 shrink-0">
                          #{idx + 1}
                        </span>
                        <span>{inv}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Detailed Breakdown Prose */}
              {currentTopic.detailedContent && (
                <section className="space-y-3 pt-2">
                  <h2 className="text-sm font-semibold text-zinc-100 tracking-tight border-b border-zinc-800/80 pb-2">
                    Architectural Breakdown
                  </h2>
                  <div className="text-[15px] text-zinc-300 leading-7 space-y-4 font-normal whitespace-pre-line">
                    {currentTopic.detailedContent}
                  </div>
                </section>
              )}

              {/* Comparative Table */}
              {currentTopic.comparisonTable && (
                <section className="space-y-3 pt-2">
                  <h2 className="text-sm font-semibold text-zinc-100 tracking-tight border-b border-zinc-800/80 pb-2">
                    Comparative Analysis
                  </h2>
                  <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-[#111115]">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#16161c] border-b border-zinc-800 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                        <tr>
                          {currentTopic.comparisonTable.headers.map((h, i) => (
                            <th key={i} className="px-4 py-3 font-semibold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                        {currentTopic.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-zinc-800/20 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-4 py-3 leading-relaxed">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Interactive Visualizer & System Architecture Diagram */}
              {(currentTopic.diagram ||
                currentTopic.id.startsWith("dbms") ||
                currentTopic.id.startsWith("os") ||
                currentTopic.id.startsWith("cn") ||
                currentTopic.id.startsWith("arch")) && (
                <CoreCSVisualizer
                  topic={currentTopic}
                  subjectSlug={activeSubjectSlug}
                />
              )}

              {/* Code Snippet with Copy Action */}
              {currentTopic.codeSnippet && (
                <section className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-zinc-400 font-mono bg-[#111115] px-3.5 py-2 rounded-t-md border border-b-0 border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-semibold text-zinc-300">
                        Sample Code ({currentTopic.codeSnippet.language})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(currentTopic.codeSnippet!.code)}
                      className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 sm:p-5 rounded-b-md bg-[#070709] border border-zinc-800 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
                    {currentTopic.codeSnippet.code}
                  </pre>
                </section>
              )}

              {/* Editorial Callout: Interview Watchout & Pitfall */}
              {currentTopic.interviewWatchout && (
                <aside className="border-l-2 border-amber-500 bg-amber-950/20 p-4 rounded-r-lg space-y-1.5">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
                      Interview Tip & Watchout
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {currentTopic.interviewWatchout}
                  </p>
                </aside>
              )}

              {/* Bottom Linear Navigation (Previous / Next) */}
              <nav className="pt-8 border-t border-zinc-800/80 flex items-center justify-between gap-3 text-xs">
                {prevTopic ? (
                  <button
                    type="button"
                    onClick={() => setActiveTopicId(prevTopic.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#111115] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span className="max-w-[220px] truncate">Previous: {prevTopic.title}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextTopic && (
                  <button
                    type="button"
                    onClick={() => setActiveTopicId(nextTopic.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-white hover:bg-zinc-200 text-zinc-950 font-semibold transition-colors shadow-xs cursor-pointer"
                  >
                    <span className="max-w-[220px] truncate">Next: {nextTopic.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-950" />
                  </button>
                )}
              </nav>
            </article>
          </main>
        </div>
      )}

      {/* 3. MODE: REVISE (Module Summaries) */}
      {studyMode === "revise" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>
              High-Yield Revision Points for <strong className="text-white">{currentSubjectConfig.name}</strong>
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              {currentSubjectConfig.reviseSections.length} Modules Summarized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSubjectConfig.reviseSections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 space-y-3 shadow-sm hover:border-zinc-700/80 transition-colors"
              >
                <div className="border-b border-zinc-800 pb-2">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>{sec.title}</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{sec.summary}</p>
                </div>

                <div className="space-y-2 text-xs">
                  {sec.bullets.map((b, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2 text-zinc-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MODE: RECALL / QUESTIONS (Curated Interview Questions) */}
      {studyMode === "recall" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-[#0c0c0f] border border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Top Frequently Asked Interview Questions for{" "}
              <strong className="text-white">{currentSubjectConfig.name}</strong>
            </span>
            <span className="font-mono text-[11px] text-zinc-500">
              {currentSubjectConfig.recallQuestions.length} Questions
            </span>
          </div>

          <div className="space-y-3">
            {currentSubjectConfig.recallQuestions.map((q) => {
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-lg bg-[#0c0c0f] border border-zinc-800/80 shadow-sm overflow-hidden"
                >
                  {/* Question Header */}
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${
                            q.difficulty === "Essential"
                              ? "bg-amber-950/40 text-amber-300 border-amber-900/40"
                              : "bg-blue-950/40 text-blue-300 border-blue-900/40"
                          }`}
                        >
                          {q.difficulty} Frequency
                        </span>

                        {q.topics.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                        {q.question}
                      </h3>
                    </div>

                    <div className="p-1 rounded text-zinc-400 hover:text-white shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Model Answer */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 space-y-3 border-t border-zinc-800/80 pt-4 text-xs text-zinc-300">
                      <span className="font-mono text-[11px] uppercase font-bold text-zinc-400 block">
                        Staff-Level Model Answer
                      </span>
                      <div className="p-4 rounded-md bg-[#111115] border border-zinc-800 leading-relaxed whitespace-pre-line font-sans">
                        {q.modelAnswer}
                      </div>

                      <div className="p-3 rounded-md bg-emerald-950/15 border border-emerald-900/40 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                          <span className="block font-mono text-[11px] uppercase font-bold text-emerald-400">
                            Interviewer Key Takeaway
                          </span>
                          <p className="text-zinc-300 leading-relaxed">{q.keyTakeaway}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
