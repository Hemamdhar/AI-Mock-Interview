export interface PracticeQuestion {
  id: string;
  number: string;
  category: string;
  question: string;
  modelAnswer: string;
  keyPoints?: string[];
  whatInterviewerLooksFor?: string;
  exampleResponse?: string;
}

export interface SubjectQuestionCategory {
  id: string;
  title: string;
  questionCount: number;
  description: string;
  icon: string;
  categories: string[];
  questions: PracticeQuestion[];
}

export const INTERVIEW_QUESTION_SUBJECTS: Record<string, SubjectQuestionCategory> = {
  // ----------------------------------------------------
  // 1. BEHAVIORAL (36 Questions)
  // ----------------------------------------------------
  behavioral: {
    id: "behavioral",
    title: "Behavioral",
    questionCount: 36,
    description:
      "Ownership, teamwork, leadership, setbacks, and answers grounded in real experience.",
    icon: "MessageSquare",
    categories: [
      "Introduction and motivation",
      "Ownership and problem-solving",
      "Teamwork and communication",
      "Leadership and initiative",
      "Failure and growth",
      "Pressure and adaptability",
    ],
    questions: [
      // Introduction and motivation (1-6)
      {
        id: "beh-1",
        number: "01",
        category: "Introduction and motivation",
        question: "Tell me about yourself.",
        modelAnswer:
          "Use the Present-Past-Future framework:\n1. Present: State your current role, primary technical domain, and core engineering focus.\n2. Past: Highlight 2-3 specific accomplishments, scale metrics, or challenging systems you built that directly relate to the target role.\n3. Future: Articulate why this specific company and role represent the logical next step in your career trajectory.",
        whatInterviewerLooksFor:
          "Conciseness (keep under 2 minutes), relevance to the role, authentic passion for software engineering, and structured communication without rambling.",
        keyPoints: [
          "Do not recite your chronological resume line by line.",
          "Lead with your technical specialty and engineering impact.",
          "Conclude with why you are excited about this specific team's technical challenges.",
        ],
        exampleResponse:
          "I am a software engineer specializing in scalable backend systems and distributed services. At my current role at Acme Corp, I led the re-architecture of our real-time notification engine, reducing latency by 45% while handling over 10 million daily events. Prior to that, I built high-throughput data ingestion pipelines and microservices using TypeScript, Node, and PostgreSQL. What excites me about your team is the scale of your distributed streaming infrastructure, where I can apply my deep experience in performance optimization and high-availability design.",
      },
      {
        id: "beh-2",
        number: "02",
        category: "Introduction and motivation",
        question: "Why do you want to become a software engineer?",
        modelAnswer:
          "Anchor your answer in tangible problem-solving and the ability to build software that creates real-world impact. Contrast early fascination with computing against the satisfaction of designing maintainable systems that empower users.",
        whatInterviewerLooksFor:
          "Intrinsic motivation, intellectual curiosity, resilience when debugging tough problems, and dedication to craftsmanship.",
        keyPoints: [
          "Connect childhood or university curiosity with tangible engineering milestones.",
          "Emphasize the thrill of turning abstract logic into functioning software.",
          "Mention continuous learning and evolving technical ecosystems.",
        ],
      },
      {
        id: "beh-3",
        number: "03",
        category: "Introduction and motivation",
        question: "What kind of work environment helps you perform at your best?",
        modelAnswer:
          "Describe an environment characterized by high agency, transparent communication, blameless postmortems, collaborative code reviews, and strong engineering hygiene.",
        whatInterviewerLooksFor:
          "Cultural fit, self-direction, preference for autonomy balanced with team alignment, and proactive communication habits.",
        keyPoints: [
          "Highlight appreciation for peer code reviews and architectural RFCs.",
          "Value psychological safety where constructive technical debates are welcomed.",
          "Show adaptability to both focused deep work and cross-functional synchronization.",
        ],
      },
      {
        id: "beh-4",
        number: "04",
        category: "Introduction and motivation",
        question: "Why should we hire you?",
        modelAnswer:
          "Differentiate yourself across three pillars: technical execution (proven ability to ship robust code), velocity and ownership (proactively resolving blockers), and team elevation (mentoring peers and writing clean documentation).",
        whatInterviewerLooksFor:
          "Self-awareness of unique strengths, alignment with job requirements, and an outcome-driven mindset.",
        keyPoints: [
          "Avoid generic claims like 'I am a hard worker'.",
          "Tie your concrete track record directly to their current technical bottlenecks.",
          "Demonstrate rapid ramp-up ability on unfamiliar codebases.",
        ],
      },
      {
        id: "beh-5",
        number: "05",
        category: "Introduction and motivation",
        question: "Where do you see yourself in the next three to five years?",
        modelAnswer:
          "Frame your trajectory around technical depth and leadership impact: progressing from owning complex features to designing large-scale distributed architectures, mentoring junior engineers, and driving engineering best practices across teams.",
        whatInterviewerLooksFor:
          "Ambition aligned with engineering excellence, commitment to the discipline, and realistic milestones.",
        keyPoints: [
          "Focus on engineering impact, architectural scope, and technical leadership.",
          "Avoid mentioning shifting entirely away from coding into non-technical management unless applying for manager tracks.",
          "Express commitment to mastering systems design and operational resilience.",
        ],
      },
      {
        id: "beh-6",
        number: "06",
        category: "Introduction and motivation",
        question: "What is your proudest engineering accomplishment?",
        modelAnswer:
          "Use the STAR method (Situation, Task, Action, Result) to describe a project with high technical complexity, ambiguity, and measurable business impact.",
        whatInterviewerLooksFor:
          "Technical depth, personal ownership versus team contribution, ability to quantify impact (percentages, latencies, cost savings).",
        keyPoints: [
          "State the business context and technical bottleneck clearly.",
          "Detail your specific architectural and coding contributions.",
          "Highlight concrete metrics (e.g. 'reduced P99 latency from 800ms to 95ms').",
        ],
      },

      // Ownership and problem-solving (7-12)
      {
        id: "beh-7",
        number: "07",
        category: "Ownership and problem-solving",
        question: "Tell me about a complex technical problem you solved.",
        modelAnswer:
          "Describe diagnosing a difficult root cause (e.g. race condition, memory leak, or database deadlock) using systematic observability and telemetry rather than guessing.",
        whatInterviewerLooksFor:
          "Methodical debugging methodology, scientific hypothesis testing, and preventive mitigation.",
        keyPoints: [
          "Walk through metrics, logs, profiling, and stack traces.",
          "Explain why obvious intuitive fixes failed or were incomplete.",
          "Describe how you permanently prevented recurrence through tests and alerts.",
        ],
      },
      {
        id: "beh-8",
        number: "08",
        category: "Ownership and problem-solving",
        question: "Tell me about a time you took ownership of a task outside your core responsibilities.",
        modelAnswer:
          "Highlight a scenario where you identified an unowned systemic risk (e.g. flaky CI/CD pipeline, security vulnerability, missing documentation) and resolved it proactively.",
        whatInterviewerLooksFor:
          "Bias for action, customer obsession, and refusal to say 'that is not my job'.",
        keyPoints: [
          "Emphasize identifying the problem without being assigned.",
          "Show how you balanced this initiative with your primary commitments.",
          "Mention long-term benefits to the wider engineering organization.",
        ],
      },
      {
        id: "beh-9",
        number: "09",
        category: "Ownership and problem-solving",
        question: "How do you handle ambiguous or poorly defined requirements?",
        modelAnswer:
          "Outline your discovery framework: asking clarifying questions, identifying key user personas, documenting assumptions in an RFC, prototyping early, and iterating with stakeholders.",
        whatInterviewerLooksFor:
          "Tolerance for ambiguity, stakeholder communication, and mitigating architectural risk early.",
        keyPoints: [
          "Draft technical design documents with explicit trade-off analyses.",
          "Establish feedback loops with product managers and users.",
          "Break monumental ambiguous goals into verifiable milestones.",
        ],
      },
      {
        id: "beh-10",
        number: "10",
        category: "Ownership and problem-solving",
        question: "Describe a time you had to make a technical trade-off under tight constraints.",
        modelAnswer:
          "Discuss trading off perfect architectural elegance against shipping a critical feature on time, consciously accepting technical debt, and filing tickets to refactor later.",
        whatInterviewerLooksFor:
          "Pragmatism, business acumen, and understanding that engineering serves product value.",
        keyPoints: [
          "Detail the alternatives considered and why the chosen path was optimal.",
          "Document technical debt explicitly with a timeline for payoff.",
          "Ensure monitoring and circuit breakers were added to safeguard production.",
        ],
      },
      {
        id: "beh-11",
        number: "11",
        category: "Ownership and problem-solving",
        question: "Tell me about a time you optimized an inefficient algorithm or system bottleneck.",
        modelAnswer:
          "Focus on profiling first before optimizing: identifying algorithmic Big-O inefficiencies, database N+1 query patterns, or unnecessary serialized network calls.",
        whatInterviewerLooksFor:
          "Measurement-driven optimization, asymptotic analysis, and empirical verification.",
        keyPoints: [
          "Never optimize blindly without profiler data.",
          "State algorithmic transition (e.g. from O(N^2) to O(N log N)).",
          "Provide concrete before-and-after throughput or memory benchmarks.",
        ],
      },
      {
        id: "beh-12",
        number: "12",
        category: "Ownership and problem-solving",
        question: "How do you approach refactoring a legacy codebase with zero automated tests?",
        modelAnswer:
          "Explain the Strangler Fig pattern or characterization testing: wrapping legacy endpoints in regression tests before touching code, writing modular interfaces, and migrating incrementally.",
        whatInterviewerLooksFor:
          "Risk management, testing discipline, and respect for functioning production systems.",
        keyPoints: [
          "Never attempt a complete ground-up rewrite without tests.",
          "Capture golden master snapshots of input/output pairs.",
          "Deploy refactored paths behind feature flags with shadow verification.",
        ],
      },

      // Teamwork and communication (13-18)
      {
        id: "beh-13",
        number: "13",
        category: "Teamwork and communication",
        question: "Tell me about a time you disagreed with a colleague on a technical decision. How was it resolved?",
        modelAnswer:
          "Focus on 'disagree and commit' grounded in data: evaluating RFC proposals objectively against business goals, running benchmarks/spikes, and maintaining professional respect.",
        whatInterviewerLooksFor:
          "Ego management, collaborative problem-solving, objective criteria over subjective opinions, and team cohesion.",
        keyPoints: [
          "Focus on the technical problem, never personal conflicts.",
          "Use proof-of-concept benchmarks to let data decide.",
          "Once a decision is reached, commit 100% without passive-aggressive resistance.",
        ],
      },
      {
        id: "beh-14",
        number: "14",
        category: "Teamwork and communication",
        question: "How do you provide constructive feedback during code reviews without discouraging peers?",
        modelAnswer:
          "Emphasize reviewing the code, not the person: asking open questions ('What do you think about handling null here?'), praising clean logic, and distinguishing blockers from stylistic nitpicks.",
        whatInterviewerLooksFor:
          "Code review empathy, mentorship, maintaining high quality bars while fostering team morale.",
        keyPoints: [
          "Use prefixes like 'nit:' for non-blocking suggestions.",
          "Explain the 'why' behind architectural comments (link to docs or performance benchmarks).",
          "Praise elegant implementations and clever solutions.",
        ],
      },
      {
        id: "beh-15",
        number: "15",
        category: "Teamwork and communication",
        question: "Describe a situation where you had to explain a complex technical concept to a non-technical stakeholder.",
        modelAnswer:
          "Describe translating technical jargon (e.g. database connection pooling or Redis cache invalidation) into business impact (e.g. checkout speed and server cost reduction) using intuitive analogies.",
        whatInterviewerLooksFor:
          "Communication empathy, avoiding unnecessary acronyms, and bridging engineering with business outcomes.",
        keyPoints: [
          "Use relatable real-world analogies.",
          "Focus on user experience, latency, and business ROI rather than implementation trivia.",
          "Verify comprehension through interactive check-ins.",
        ],
      },
      {
        id: "beh-16",
        number: "16",
        category: "Teamwork and communication",
        question: "Tell me about a time you collaborated with cross-functional partners (Design, Product, QA).",
        modelAnswer:
          "Showcase participating in design handoffs early, identifying edge cases in Figma flows before engineering begins, and partnering with QA to automate end-to-end integration tests.",
        whatInterviewerLooksFor:
          "Cross-functional empathy, collaborative mindset, and proactive alignment across disciplines.",
        keyPoints: [
          "Involve QA and designers early during technical discovery.",
          "Highlight joint success rather than siloed engineering output.",
        ],
      },
      {
        id: "beh-17",
        number: "17",
        category: "Teamwork and communication",
        question: "How do you handle a teammate who is consistently missing sprint commitments or writing buggy code?",
        modelAnswer:
          "Approach with empathy and private dialogue: seek to understand root causes (personal blockers, unclear requirements), offer pair programming, and escalate to management only if systemic patterns persist.",
        whatInterviewerLooksFor:
          "Compassionate leadership, peer mentorship, and maintaining high team standards without toxicity.",
        keyPoints: [
          "Never shame peers publicly in group Slack channels or standups.",
          "Offer to pair program on difficult modules.",
          "Focus on shared team accountability and sprint success.",
        ],
      },
      {
        id: "beh-18",
        number: "18",
        category: "Teamwork and communication",
        question: "Tell me about a time you received critical feedback that was difficult to hear. How did you react?",
        modelAnswer:
          "Demonstrate emotional maturity: listening without defensiveness, asking clarifying questions, reflecting on valid points, and putting an action plan in place to improve.",
        whatInterviewerLooksFor:
          "Coachability, growth mindset, and resilience under criticism.",
        keyPoints: [
          "Do not justify or deflect blame onto others.",
          "Acknowledge the gap and outline specific behavioral changes made.",
          "Follow up later with the reviewer to confirm improvement.",
        ],
      },

      // Leadership and initiative (19-24)
      {
        id: "beh-19",
        number: "19",
        category: "Leadership and initiative",
        question: "Tell me about a time you led an engineering project from conception to deployment.",
        modelAnswer:
          "Detail authoring the technical design RFC, breaking work down into epics and sprint tickets, coordinating dependencies across teams, and running a phased canary rollout.",
        whatInterviewerLooksFor:
          "End-to-end technical leadership, project management competence, and risk mitigation.",
        keyPoints: [
          "Authoring RFC design documents and leading architecture reviews.",
          "Managing scope creep and timeline trade-offs.",
          "Implementing telemetry and post-launch monitoring dashboards.",
        ],
      },
      {
        id: "beh-20",
        number: "20",
        category: "Leadership and initiative",
        question: "How do you mentor junior developers or onboard new team members?",
        modelAnswer:
          "Explain creating comprehensive onboarding guides, assigning well-scoped starter tickets with paired PR reviews, scheduling regular 1-on-1 check-ins, and encouraging safe failure in sandbox environments.",
        whatInterviewerLooksFor:
          "Multiplication of team talent, patience, pedagogical skills, and building inclusive team cultures.",
        keyPoints: [
          "Teach engineering principles rather than just feeding syntax solutions.",
          "Establish psychologically safe environments where asking questions is celebrated.",
          "Celebrate early PR milestones to build confidence.",
        ],
      },
      {
        id: "beh-21",
        number: "21",
        category: "Leadership and initiative",
        question: "Tell me about a time you championed adopting a new tool, technology, or standard practice in your team.",
        modelAnswer:
          "Describe identifying an inefficiency, creating a lightweight proof of concept, presenting data-driven benefits to the team, and creating migration documentation to ensure seamless adoption.",
        whatInterviewerLooksFor:
          "Pragmatic innovation, ability to influence without formal authority, and thorough change management.",
        keyPoints: [
          "Highlight measured productivity gains (e.g. 50% faster build times).",
          "Acknowledge the learning curve and provide workshops or brown-bag demos.",
          "Avoid dogmatic tech evangelism without business rationale.",
        ],
      },
      {
        id: "beh-22",
        number: "22",
        category: "Leadership and initiative",
        question: "How do you balance tech debt reduction with feature delivery in sprint planning?",
        modelAnswer:
          "Advocate for dedicating a predictable percentage of sprint capacity (e.g. 15-20%) to tech debt, linking refactoring directly to feature velocity and incident frequency.",
        whatInterviewerLooksFor:
          "Strategic thinking, empathy for product timelines, and preventing codebase degradation.",
        keyPoints: [
          "Frame tech debt in terms of developer velocity and reliability risk.",
          "Bundle small refactors into related feature PRs (Boy Scout Rule).",
          "Track tech debt backlog items with clear impact scores.",
        ],
      },
      {
        id: "beh-23",
        number: "23",
        category: "Leadership and initiative",
        question: "Tell me about a time you identified a security vulnerability or performance regression before it reached production.",
        modelAnswer:
          "Walk through static analysis, code review inspection, or load testing that caught a critical flaw (e.g. missing authorization check, unindexed query) and how you patched it.",
        whatInterviewerLooksFor:
          "Security mindset, attention to detail, and proactive verification practices.",
        keyPoints: [
          "Explain the vulnerability and potential exploitation impact.",
          "Describe the automated linting or CI rule added to prevent regression.",
        ],
      },
      {
        id: "beh-24",
        number: "24",
        category: "Leadership and initiative",
        question: "How do you stay technically current in rapidly evolving software landscapes?",
        modelAnswer:
          "Mention reading engineering blogs (Netflix, Uber, Cloudflare), participating in open source, reading specs and RFCs, and building hands-on prototype side projects.",
        whatInterviewerLooksFor:
          "Genuine passion for engineering, self-directed learning, and discerning substance from fleeting hype.",
        keyPoints: [
          "Cite specific technical topics recently studied (e.g. eBPF, WebAssembly, Vector databases).",
          "Emphasize deep foundational knowledge (operating systems, networking) over shallow framework hopping.",
        ],
      },

      // Failure and growth (25-30)
      {
        id: "beh-25",
        number: "25",
        category: "Failure and growth",
        question: "Tell me about a time something didn't go as planned and you caused a production outage. How did you handle it?",
        modelAnswer:
          "Own the failure directly: roll back immediately to restore service, communicate transparently on incident channels, write a blameless postmortem, and add preventive guardrails.",
        whatInterviewerLooksFor:
          "Accountability, composure under fire, blameless mindset, and turning failures into permanent systemic improvements.",
        keyPoints: [
          "Take immediate personal responsibility without deflecting to teammates or tools.",
          "Focus on Mean Time to Recovery (MTTR) during the incident.",
          "Detail systemic fixes (canary deployments, automated integration tests).",
        ],
      },
      {
        id: "beh-26",
        number: "26",
        category: "Failure and growth",
        question: "Describe a project that failed or was cancelled. What lessons did you take away?",
        modelAnswer:
          "Analyze the root causes (market shifts, premature optimization, misaligned user needs), explain how code artifacts or learnings were salvaged, and how it refined your judgment.",
        whatInterviewerLooksFor:
          "Resilience, retrospective self-awareness, and extracting valuable institutional knowledge from failed experiments.",
        keyPoints: [
          "Acknowledge that fast experimentation sometimes requires graceful termination.",
          "Highlight reusable libraries or domain insights salvaged.",
          "Emphasize validating core assumptions with users earlier in future projects.",
        ],
      },
      {
        id: "beh-27",
        number: "27",
        category: "Failure and growth",
        question: "Tell me about a time you gave an inaccurate engineering estimate. How did you manage it?",
        modelAnswer:
          "Explain discovering unanticipated complexity, alerting stakeholders immediately with revised timelines and scope options, and incorporating buffer techniques into future estimates.",
        whatInterviewerLooksFor:
          "Early transparent communication, stakeholder management, and iterative estimation refinement.",
        keyPoints: [
          "Never hide delays until the last day of the sprint.",
          "Present scope-reduction trade-offs to keep release dates intact.",
          "Adopt spike tickets for high-uncertainty tasks.",
        ],
      },
      {
        id: "beh-28",
        number: "28",
        category: "Failure and growth",
        question: "Describe an architectural decision you made that you later regretted. What would you do differently?",
        modelAnswer:
          "Discuss an over-engineered pattern (e.g. premature microservices or over-abstracted generic factories) that added needless cognitive overhead, and your realization of the virtues of simplicity.",
        whatInterviewerLooksFor:
          "Maturity, humility, preference for simple maintainable code, and evolution from junior over-engineering to senior simplicity.",
        keyPoints: [
          "Admit the trap of 'clever' code.",
          "Emphasize the principle of YAGNI (You Aren't Gonna Need It).",
          "Show how you refactored back toward clear, readable code.",
        ],
      },
      {
        id: "beh-29",
        number: "29",
        category: "Failure and growth",
        question: "Tell me about a time you were blocked by another team and missing deadlines. How did you resolve it?",
        modelAnswer:
          "Explain establishing direct communication with the blocking team's lead, agreeing on a mock interface contract to unblock your development in parallel, and finding win-win priorities.",
        whatInterviewerLooksFor:
          "Proactive problem solving, contract-driven development, and inter-team collaboration.",
        keyPoints: [
          "Mock API contracts to decouple progress.",
          "Align on technical interfaces before waiting for implementation.",
        ],
      },
      {
        id: "beh-30",
        number: "30",
        category: "Failure and growth",
        question: "What is the biggest mistake you made early in your career, and how did it shape your engineering philosophy?",
        modelAnswer:
          "Reflect on a formative error (e.g. testing in production, neglecting database indexes, or skipping documentation) and how it instilled deep respect for engineering rigor and automated testing.",
        whatInterviewerLooksFor:
          "Authenticity, long-term trajectory, and deep commitment to reliable software engineering.",
        keyPoints: [
          "Choose a real technical mistake, not a humblebrag.",
          "Demonstrate how that event became the cornerstone of your engineering discipline.",
        ],
      },

      // Pressure and adaptability (31-36)
      {
        id: "beh-31",
        number: "31",
        category: "Pressure and adaptability",
        question: "Tell me about a time you worked under a tight deadline.",
        modelAnswer:
          "Describe prioritizing the critical path, triaging non-essential features, maintaining code review and testing rigor, and successfully shipping without burning out.",
        whatInterviewerLooksFor:
          "Execution under pressure, ruthless prioritization, and maintaining quality standards when rushed.",
        keyPoints: [
          "Break down core MVP versus nice-to-have capabilities.",
          "Communicate progress milestones proactively.",
          "Avoid cutting corners on core security or data integrity.",
        ],
      },
      {
        id: "beh-32",
        number: "32",
        category: "Pressure and adaptability",
        question: "How do you manage multiple competing priorities with conflicting deadlines?",
        modelAnswer:
          "Explain using Eisenhower matrix principles or impact-versus-effort scoring, aligning with engineering managers on business criticality, and communicating transparent trade-offs.",
        whatInterviewerLooksFor:
          "Time management, organizational prioritization, and boundary setting.",
        keyPoints: [
          "Seek explicit alignment on priority 1 vs priority 2.",
          "Prevent context switching by batching similar deep-work tasks.",
        ],
      },
      {
        id: "beh-33",
        number: "33",
        category: "Pressure and adaptability",
        question: "Tell me about a time a project requirement completely changed midway through implementation. How did you adapt?",
        modelAnswer:
          "Demonstrate adaptability: accepting the new business reality gracefully, auditing existing modular code for salvageable logic, and pivoting development cleanly.",
        whatInterviewerLooksFor:
          "Flexibility, customer orientation, and building modular systems that accommodate change.",
        keyPoints: [
          "Do not display resentment toward changing market realities.",
          "Show how clean decoupling enabled rapid adaptation.",
        ],
      },
      {
        id: "beh-34",
        number: "34",
        category: "Pressure and adaptability",
        question: "Describe your process for troubleshooting a high-severity production issue with executives watching.",
        modelAnswer:
          "Demonstrate calm crisis leadership: designate an incident commander, focus on immediate mitigation (rollback, traffic shedding) before root cause diagnosis, and maintain a clear timeline of events.",
        whatInterviewerLooksFor:
          "Poise under pressure, incident management hygiene, and clear executive communication.",
        keyPoints: [
          "Mitigation first (stop the bleeding), investigation second.",
          "Designate one person to communicate updates so engineers can debug.",
          "Conduct a thorough blameless postmortem afterward.",
        ],
      },
      {
        id: "beh-35",
        number: "35",
        category: "Pressure and adaptability",
        question: "How do you maintain mental clarity and avoid burnout during prolonged high-pressure cycles?",
        modelAnswer:
          "Discuss establishing clear boundaries, practicing disciplined task triage, transparently communicating team bandwidth limits to managers, and taking deliberate recovery intervals.",
        whatInterviewerLooksFor:
          "Sustainability, emotional intelligence, and long-term career resilience.",
        keyPoints: [
          "Recognize personal early warning signs of cognitive fatigue.",
          "Advocate for realistic sprint scope across the team.",
        ],
      },
      {
        id: "beh-36",
        number: "36",
        category: "Pressure and adaptability",
        question: "Tell me about a time you had to learn a completely unfamiliar programming language or framework in a matter of days.",
        modelAnswer:
          "Walk through your rapid ramp-up framework: reading official architectural docs, building a small end-to-end prototype, dissecting existing production code, and leveraging transferrable core CS concepts.",
        whatInterviewerLooksFor:
          "Meta-learning ability, foundational CS versatility over framework dependence, and speed of ramp-up.",
        keyPoints: [
          "Map concepts from known languages (e.g. async event loops, type systems).",
          "Build an interactive toy project before writing production features.",
          "Leverage peer code review to catch idiomatic nuances.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 2. OPERATING SYSTEMS (60 Questions)
  // ----------------------------------------------------
  "operating-systems": {
    id: "operating-systems",
    title: "Operating Systems",
    questionCount: 60,
    description:
      "Processes, scheduling, synchronization, memory, file systems, and practical scenarios.",
    icon: "Cpu",
    categories: [
      "Processes and threads",
      "CPU scheduling",
      "Process synchronization",
      "Deadlocks",
      "Memory management",
      "Virtual memory",
      "File systems and I/O",
    ],
    questions: [
      {
        id: "os-q-1",
        number: "01",
        category: "Processes and threads",
        question: "What is the fundamental difference between a Process and a Thread?",
        modelAnswer:
          "A Process is an executing instance of a program with its own isolated virtual address space, file descriptor table, and security context. A Thread is the smallest unit of execution scheduled by the OS, existing inside a process and sharing memory, open files, and address space with peer threads, while maintaining its own private register set and stack.",
        whatInterviewerLooksFor:
          "Memory isolation boundaries, IPC vs shared memory synchronization, and context switch overhead differences.",
        keyPoints: [
          "Process = unit of resource allocation; Thread = unit of CPU scheduling.",
          "Thread context switch is faster because page tables (CR3 register) do not need to be swapped, preserving TLB cache.",
          "Crash isolation: a crashed process does not bring down other processes; a crashed thread typically crashes the entire parent process.",
        ],
      },
      {
        id: "os-q-2",
        number: "02",
        category: "Processes and threads",
        question: "Explain what happens during an operating system Context Switch.",
        modelAnswer:
          "A Context Switch halts the executing process/thread, saves its CPU state (program counter, stack pointer, general-purpose registers) into its Process Control Block (PCB) or Thread Control Block (TCB), updates scheduling queues, and restores the saved state of the next selected thread. For process switches, it also flushes the TLB and switches the memory page directory (CR3 register in x86).",
        whatInterviewerLooksFor:
          "Hardware register saving, cache invalidation cost (TLB flushing), and performance overheads in high-concurrency systems.",
        keyPoints: [
          "Triggered by timer interrupts (preemption), I/O blockages, or voluntary yielding (`sched_yield`).",
          "TLB flushing during process switch causes expensive cold cache misses on the subsequent instructions.",
        ],
      },
      {
        id: "os-q-3",
        number: "03",
        category: "Processes and threads",
        question: "What is a Zombie Process, and how does it differ from an Orphan Process?",
        modelAnswer:
          "A Zombie Process is a process that has completed execution via `exit()`, but its parent has not yet read its exit status via `wait()` or `waitpid()`. It consumes no CPU or memory, only a slot in the OS process table. An Orphan Process is a child whose parent process terminated before calling `wait()`; it is immediately adopted by `init` (PID 1) or `systemd`, which periodically calls `wait()` to clean it up.",
        whatInterviewerLooksFor:
          "Process lifecycle knowledge, PID table exhaustion hazards, and proper signal handling (`SIGCHLD`).",
        keyPoints: [
          "Zombies consume process IDs; leaking thousands of zombies exhausts the PID limit, preventing new processes from spawning.",
          "Clean up zombies by having the parent call `wait()`/`waitpid()` or handle `SIGCHLD` signals.",
        ],
      },
      {
        id: "os-q-4",
        number: "04",
        category: "Process synchronization",
        question: "Explain the difference between a Mutex and a Semaphore.",
        modelAnswer:
          "A Mutex (Mutual Exclusion object) is a locking mechanism with strict ownership: only the thread that acquired the mutex can release it. A Semaphore is a signaling mechanism with an integer counter: a Counting Semaphore allows up to N threads concurrent access, while a Binary Semaphore can be signaled (unlocked) by any thread, not just the acquiring thread.",
        whatInterviewerLooksFor:
          "Ownership semantics, Priority Inversion handling (priority inheritance on mutexes), and synchronization design patterns.",
        keyPoints: [
          "Mutex has ownership; Semaphore does not.",
          "Mutex is used to protect critical sections; Semaphore is used for signaling and resource counting (producer-consumer buffer).",
        ],
      },
      {
        id: "os-q-5",
        number: "05",
        category: "Deadlocks",
        question: "What are the four necessary Coffman conditions for a Deadlock to occur?",
        modelAnswer:
          "1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n2. Hold and Wait: A process must hold at least one resource while waiting to acquire another.\n3. No Preemption: Resources cannot be forcibly seized from a process; they can only be released voluntarily.\n4. Circular Wait: A closed chain of processes exists such that each process holds a resource needed by the next.",
        whatInterviewerLooksFor:
          "All four conditions must hold simultaneously; breaking any single condition makes deadlock mathematically impossible.",
        keyPoints: [
          "Deadlock prevention breaks one condition (e.g. enforce global lock ordering to eliminate Circular Wait).",
          "Deadlock avoidance uses Banker's Algorithm; Deadlock detection uses Wait-For Graph cycle detection.",
        ],
      },
      {
        id: "os-q-6",
        number: "06",
        category: "Virtual memory",
        question: "How does Virtual Memory work, and what is the role of the Translation Lookaside Buffer (TLB)?",
        modelAnswer:
          "Virtual memory provides each process the illusion of a vast, contiguous address space while mapping virtual pages to physical frames via multi-level Page Tables. The Translation Lookaside Buffer (TLB) is an ultra-fast hardware content-addressable cache inside the MMU that stores recent Virtual-to-Physical address mappings. A TLB hit resolves addresses in 1 clock cycle; a TLB miss forces a slow multi-level Page Table Walk in main memory.",
        whatInterviewerLooksFor:
          "MMU role, multi-level page tables, page faults, and hardware memory access caching.",
        keyPoints: [
          "Page Fault: Triggered when virtual page is not resident in physical RAM (requires disk swap fetch).",
          "HugePages reduce TLB misses for large-memory workloads (databases, JVMs) by covering more memory per entry.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 3. COMPUTER NETWORKS (60 Questions)
  // ----------------------------------------------------
  "computer-networks": {
    id: "computer-networks",
    title: "Computer Networks",
    questionCount: 60,
    description:
      "Web protocols, TCP/IP, routing, addressing, security, and troubleshooting.",
    icon: "Network",
    categories: [
      "Network layers and models",
      "Application layer and web protocols",
      "Transport layer and TCP/UDP",
      "Network layer, IP, and routing",
      "Data link layer and local delivery",
      "Network security and troubleshooting",
    ],
    questions: [
      {
        id: "cn-q-1",
        number: "01",
        category: "Transport layer and TCP/UDP",
        question: "Explain the TCP Three-Way Handshake and why a Two-Way Handshake is insufficient.",
        modelAnswer:
          "The client sends a SYN packet with a random Initial Sequence Number (ISN x). The server responds with SYN-ACK containing its own random ISN y and acknowledging x+1. The client completes the handshake with an ACK packet acknowledging y+1. A 2-way handshake is insufficient because delayed duplicate SYN packets lingering in network buffers could open zombie connections on the server without client awareness.",
        whatInterviewerLooksFor:
          "Sequence number synchronization, prevention of duplicate connection reuse, and SYN Flood vulnerabilities.",
        keyPoints: [
          "Both sides must independently synchronize and confirm their sequence numbers.",
          "SYN Cookies allow servers to survive SYN floods without allocating connection state in memory.",
        ],
      },
      {
        id: "cn-q-2",
        number: "02",
        category: "Application layer and web protocols",
        question: "How does HTTP/2 multiplexing improve on HTTP/1.1, and why does HTTP/3 switch to QUIC over UDP?",
        modelAnswer:
          "HTTP/1.1 requires responses to arrive in sequential order, causing Application-Level Head-of-Line (HoL) blocking. HTTP/2 introduces binary framing to multiplex multiple streams over a single TCP connection. However, because all streams share one TCP pipe, any dropped packet stalls all streams in the kernel buffer (Transport HoL blocking). HTTP/3 replaces TCP with QUIC over UDP, ensuring that packet loss on one stream does not impact independent parallel streams.",
        whatInterviewerLooksFor:
          "Head-of-Line blocking nuances (application vs transport), binary framing, and 0-RTT connection setup in QUIC.",
        keyPoints: [
          "HTTP/1.1 worked around HoL blocking by opening up to 6 parallel TCP connections.",
          "HTTP/2 multiplexed streams, but suffered when TCP packets dropped.",
          "HTTP/3 QUIC embeds stream awareness directly into user-space transport over UDP.",
        ],
      },
      {
        id: "cn-q-3",
        number: "03",
        category: "Network layer, IP, and routing",
        question: "How does a router perform Longest Prefix Match (LPM) during packet forwarding?",
        modelAnswer:
          "When a router receives an IP packet, multiple routing table entries might match the destination IP. The router selects the entry with the longest subnet mask prefix (/24 over /16). In production core routers, LPM is executed in hardware using Ternary Content Addressable Memory (TCAM), evaluating hundreds of thousands of prefix routes in parallel in a single clock cycle.",
        whatInterviewerLooksFor:
          "Control Plane vs Data Plane separation, CIDR routing efficiency, and hardware TCAM lookups.",
        keyPoints: [
          "Longest prefix represents the most specific routing path.",
          "TCAM supports 'don't care' wildcard masks for sub-nanosecond wire-speed lookups.",
        ],
      },
      {
        id: "cn-q-4",
        number: "04",
        category: "Application layer and web protocols",
        question: "Explain the difference between a Forward Proxy and a Reverse Proxy.",
        modelAnswer:
          "A Forward Proxy sits in front of client devices, intercepting outbound requests to the Internet to enforce security filtering, anonymization, and corporate caching (the server does not know the true client). A Reverse Proxy sits in front of backend web servers, intercepting inbound requests to provide load balancing, SSL/TLS termination, DDoS mitigation, and response caching (the client does not know which backend server responded).",
        whatInterviewerLooksFor:
          "Proxy directionality, identity concealment, and architectural roles in high-scale systems.",
        keyPoints: [
          "Forward Proxy shields the client; Reverse Proxy shields the server.",
          "Common reverse proxies: NGINX, Envoy, Cloudflare, AWS ALB.",
        ],
      },
      {
        id: "cn-q-5",
        number: "05",
        category: "Network security and troubleshooting",
        question: "How does TLS 1.3 achieve 1-RTT handshake and guarantee Forward Secrecy?",
        modelAnswer:
          "In TLS 1.3, the client sends its supported cipher suites and an ephemeral Diffie-Hellman key share in the very first ClientHello message. The server replies with its key share in ServerHello, allowing both parties to derive the symmetric session key in just 1 round trip (1-RTT). Forward Secrecy is guaranteed because ephemeral ECDHE keys are discarded after the session ends, ensuring that stealing the server's private key in the future cannot decrypt past traffic.",
        whatInterviewerLooksFor:
          "Diffie-Hellman key exchange, elimination of static RSA key exchange, and latency reduction from TLS 1.2 to 1.3.",
        keyPoints: [
          "Eliminated vulnerable legacy ciphers (RC4, 3DES, static RSA).",
          "Supports 0-RTT session resumption for returning visitors.",
        ],
      },
      {
        id: "cn-q-6",
        number: "06",
        category: "Data link layer and local delivery",
        question: "What is Address Resolution Protocol (ARP), and how does an L2 switch handle unknown unicast traffic?",
        modelAnswer:
          "ARP resolves known 32-bit IPv4 addresses to local 48-bit hardware MAC addresses via broadcast requests (`FF:FF:FF:FF:FF:FF`) and unicast replies. When an L2 switch receives a frame destined for a MAC address not present in its CAM table, it performs Unknown Unicast Flooding, broadcasting the frame out all ports except the arrival port until the destination replies and the MAC is learned.",
        whatInterviewerLooksFor:
          "L2 vs L3 boundary, CAM table learning mechanics, and broadcast domain boundaries.",
        keyPoints: [
          "ARP operates strictly within the local broadcast domain and never crosses routers.",
          "Switches learn source MAC addresses and forward based on destination MAC addresses.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 4. OOP (60 Questions)
  // ----------------------------------------------------
  oop: {
    id: "oop",
    title: "OOP",
    questionCount: 60,
    description:
      "Objects, inheritance, polymorphism, SOLID principles, and practical design decisions.",
    icon: "Layers",
    categories: [
      "OOP foundations and classes",
      "Encapsulation and abstraction",
      "Inheritance and relationships",
      "Polymorphism and binding",
      "Class and object semantics",
      "Design principles and patterns",
    ],
    questions: [
      {
        id: "oop-q-1",
        number: "01",
        category: "Design principles and patterns",
        question: "Explain the Liskov Substitution Principle (LSP) with the classic Square vs Rectangle dilemma.",
        modelAnswer:
          "LSP states that derived classes must be substitutable for their base classes without altering program correctness. Mathematically, a Square is a Rectangle. However, in OOP with mutable objects, a Rectangle allows changing width without affecting height. If Square inherits from Rectangle and forces width and height to remain equal, code expecting independent dimensions breaks. The solution is avoiding inheritance and using an immutable Shape interface.",
        whatInterviewerLooksFor:
          "Understanding that OOP subtyping is about behavioral contracts, not geometric or real-world classification.",
        keyPoints: [
          "Preconditions cannot be strengthened in a subclass.",
          "Postconditions cannot be weakened in a subclass.",
        ],
      },
      {
        id: "oop-q-2",
        number: "02",
        category: "Polymorphism and binding",
        question: "How does Dynamic Method Dispatch work at runtime? Explain Virtual Method Tables (vtables).",
        modelAnswer:
          "When a class declares virtual methods, the compiler adds a hidden pointer (vptr) to the object header of each instance pointing to the class's Virtual Method Table (vtable). The vtable is an array of function pointers. When `obj.method()` is invoked, the CPU dereferences `vptr`, indexes into the vtable at a pre-calculated offset, and jumps to the concrete function address in O(1) time.",
        whatInterviewerLooksFor:
          "vptr in object header, compile-time offset indexing, and why static/private/final methods bypass dynamic dispatch.",
        keyPoints: [
          "Static binding binds at compile time; dynamic dispatch binds at runtime via vtable.",
          "Final/private methods enable compiler inlining because they cannot be overridden.",
        ],
      },
      {
        id: "oop-q-3",
        number: "03",
        category: "Class and object semantics",
        question: "What is the equals() and hashCode() contract, and what happens if it is violated in a HashMap?",
        modelAnswer:
          "If two objects are equal according to `equals()`, their `hashCode()` MUST return identical integers. If `equals()` is overridden to compare field values but `hashCode()` is neglected, equal objects hash to different bucket indices in a HashMap. When calling `map.get(key)`, the map searches the wrong bucket and returns `null`, causing silent lookup failures.",
        whatInterviewerLooksFor:
          "HashMap bucket indexing formula, hash collision handling, and memory identity vs value equality.",
        keyPoints: [
          "Equal objects must have equal hash codes; equal hash codes do not guarantee equal objects (collisions).",
          "Always override both methods together on immutable fields.",
        ],
      },
      {
        id: "oop-q-4",
        number: "04",
        category: "Inheritance and relationships",
        question: "Why should software architects 'Favor Composition Over Inheritance'?",
        modelAnswer:
          "Inheritance exposes parent internals to subclasses (white-box reuse), creating tight coupling and the Fragile Base Class problem where changes in parent code break child invariants. Composition provides black-box reuse via well-defined interfaces, allows swapping behaviors dynamically at runtime, and simplifies unit testing via mocking.",
        whatInterviewerLooksFor:
          "Fragile base class problem, compile-time vs runtime flexibility, and testability benefits.",
        keyPoints: [
          "Inheritance is static (is-a); composition is dynamic (has-a).",
          "Avoid deep inheritance trees exceeding 2-3 levels.",
        ],
      },
      {
        id: "oop-q-5",
        number: "05",
        category: "Encapsulation and abstraction",
        question: "What is the difference between Encapsulation and Abstraction?",
        modelAnswer:
          "Encapsulation is information hiding and invariant defense: bundling data and methods into a protective boundary to prevent external code from corrupting internal state. Abstraction is complexity reduction: exposing essential behavioral contracts (via interfaces) while hiding mechanical implementation details from the caller.",
        whatInterviewerLooksFor:
          "Encapsulation is about 'How do I protect state?'; Abstraction is about 'What does this component do?'",
        keyPoints: [
          "Encapsulation uses access modifiers (private) and defensive copies.",
          "Abstraction uses abstract classes and interfaces to decouple consumers from mechanics.",
        ],
      },
      {
        id: "oop-q-6",
        number: "06",
        category: "Design principles and patterns",
        question: "Explain the Law of Demeter (Principle of Least Knowledge).",
        modelAnswer:
          "The Law of Demeter states that a module should not know the internal details of the objects it manipulates. Informally: 'Only talk to your immediate friends.' Violations take the form of chained calls like `order.getCustomer().getAddress().getCity()`. If the Address schema changes, calling code breaks everywhere. Refactor by telling the immediate object: `order.getDeliveryCity()`.",
        whatInterviewerLooksFor:
          "Recognizing chained dot-navigation anti-patterns and applying delegation.",
        keyPoints: [
          "Prevents tight coupling across multiple layers of object graphs.",
          "Follow the 'Tell, Don't Ask' philosophy.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 5. DBMS (60 Questions)
  // ----------------------------------------------------
  dbms: {
    id: "dbms",
    title: "DBMS",
    questionCount: 60,
    description:
      "SQL, normalization, transactions, indexing, concurrency, and practical database decisions.",
    icon: "Database",
    categories: [
      "DBMS architecture and models",
      "Relational model and keys",
      "SQL and relational algebra",
      "Functional dependencies and normalization",
      "Transactions and concurrency",
      "Storage, indexing, and recovery",
    ],
    questions: [
      {
        id: "dbms-q-1",
        number: "01",
        category: "Storage, indexing, and recovery",
        question: "Why do relational database engines use B+ Trees instead of B-Trees or Binary Search Trees for indexes?",
        modelAnswer:
          "B+ Trees have massive fanout (500-1000 child pointers per page), resulting in shallow 3-4 level trees that require only 1 disk seek for lookups. In B+ Trees, internal nodes store only routing keys (maximizing fanout) while all actual data resides in leaf nodes. Furthermore, leaf nodes are linked in a bidirectional list, allowing O(K) sequential range scans without traversing up and down the tree.",
        whatInterviewerLooksFor:
          "Disk I/O cost reduction, internal node capacity maximization, and fast range scan mechanics.",
        keyPoints: [
          "BSTs require ~27 random disk seeks for 100M rows; B+ Trees require 3-4 seeks (mostly cached in RAM).",
          "Doubly-linked leaf nodes enable high-performance range queries and sorting.",
        ],
      },
      {
        id: "dbms-q-2",
        number: "02",
        category: "Transactions and concurrency",
        question: "Explain the ACID properties and the database mechanisms that enforce each.",
        modelAnswer:
          "Atomicity (all-or-nothing) is enforced via Undo Logs in the WAL. Consistency (valid state transitions) is enforced via declarative schema constraints and foreign keys. Isolation (in-flight transactions do not interfere) is enforced via 2-Phase Locking or MVCC. Durability (committed writes persist through crashes) is enforced via Redo Logs in the WAL flushed via fsync.",
        whatInterviewerLooksFor:
          "Connecting abstract ACID concepts to concrete engine mechanisms (WAL, MVCC, constraints).",
        keyPoints: [
          "Atomicity = Undo; Durability = Redo.",
          "ACID Consistency differs from CAP theorem Consistency (Linearizability).",
        ],
      },
      {
        id: "dbms-q-3",
        number: "03",
        category: "Transactions and concurrency",
        question: "How does Multi-Version Concurrency Control (MVCC) eliminate read-write contention?",
        modelAnswer:
          "In traditional 2PL systems, read locks block write locks and write locks block read locks. MVCC decouples them by writing new versions of rows stamped with transaction IDs (`xmin`/`xmax`). When a query reads data, it accesses a consistent historical snapshot valid at its start timestamp from the Undo Log without acquiring locks: 'Readers never block writers, and writers never block readers.'",
        whatInterviewerLooksFor:
          "Snapshot isolation, non-blocking reads, vacuuming/garbage collection of dead row versions.",
        keyPoints: [
          "Writers lock rows only to prevent concurrent write-write conflicts.",
          "PostgreSQL uses VACUUM to reclaim storage from obsolete row versions.",
        ],
      },
      {
        id: "dbms-q-4",
        number: "04",
        category: "Functional dependencies and normalization",
        question: "What is the difference between 3NF and BCNF? Provide an example where 3NF is satisfied but BCNF is violated.",
        modelAnswer:
          "For every non-trivial FD X -> Y: In 3NF, either X is a Super Key OR Y is a Prime Attribute (member of some candidate key). In BCNF, X MUST be a Super Key without exception. In a relation `Student_Counselor(student_id, major, counselor)` where `{student_id, major} -> counselor` and `counselor -> major`, candidate keys are `{student_id, major}` and `{student_id, counselor}`. In `counselor -> major`, `counselor` is not a super key, but `major` is prime (3NF compliant, but violates BCNF).",
        whatInterviewerLooksFor:
          "Prime attribute exception in 3NF and the trade-off of dependency preservation in BCNF.",
        keyPoints: [
          "Every BCNF relation is in 3NF; not all 3NF relations are in BCNF.",
          "3NF always guarantees dependency preservation; BCNF may lose functional dependencies.",
        ],
      },
      {
        id: "dbms-q-5",
        number: "05",
        category: "Storage, indexing, and recovery",
        question: "What is Write-Ahead Logging (WAL) and how does the ARIES recovery algorithm work?",
        modelAnswer:
          "WAL requires that log records describing changes must be written to non-volatile disk before the corresponding dirty data pages are flushed. ARIES operates in three passes after a crash: 1. Analysis Pass (scans forward from checkpoint to reconstruct Active Transactions and Dirty Pages); 2. Redo Pass (repeats history to bring the physical database to the exact crash state); 3. Undo Pass (scans backward to roll back uncommitted transactions, writing Compensation Log Records).",
        whatInterviewerLooksFor:
          "Steal + No-Force buffer policies, repeating history in Redo, and CLRs in Undo.",
        keyPoints: [
          "WAL turns random I/O into fast sequential append-only writes.",
          "Fuzzy checkpoints snapshot transaction state without freezing the database.",
        ],
      },
      {
        id: "dbms-q-6",
        number: "06",
        category: "SQL and relational algebra",
        question: "What is the difference between a Clustered Index and a Non-Clustered (Secondary) Index?",
        modelAnswer:
          "A Clustered Index determines the physical on-disk order of rows in the table; leaf nodes of the B+ Tree contain the actual complete row data (there can be only one clustered index per table). A Non-Clustered Index is an auxiliary structure whose leaf nodes store the indexed key along with a pointer (Row ID or Primary Key) to the clustered table, requiring a secondary bookmark lookup.",
        whatInterviewerLooksFor:
          "Physical layout differences, single clustered index limitation, and Covering Index optimization.",
        keyPoints: [
          "In MySQL InnoDB, the Primary Key is always the clustered index.",
          "Covering indexes satisfy queries entirely from leaf nodes without touching base table pages.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 6. HTML (39 Questions)
  // ----------------------------------------------------
  html: {
    id: "html",
    title: "HTML",
    questionCount: 39,
    description:
      "Document structure, semantics, forms, accessibility, and browser behavior.",
    icon: "Code",
    categories: [
      "Document structure and semantics",
      "Forms and validation",
      "Accessibility (a11y)",
      "Browser rendering and DOM",
      "SEO and meta tags",
    ],
    questions: [
      {
        id: "html-q-1",
        number: "01",
        category: "Document structure and semantics",
        question: "Why is semantic HTML critical for modern web applications?",
        modelAnswer:
          "Semantic HTML elements (`<main>`, `<article>`, `<section>`, `<nav>`, `<aside>`, `<header>`, `<footer>`) convey structural meaning to browsers, search engines, and screen readers. Semantics enable assistive technology navigation landmarks, improve SEO crawling, and provide built-in keyboard accessibility and browser default behaviors without relying on heavy JavaScript.",
        whatInterviewerLooksFor:
          "Accessibility compliance, SEO benefits, DOM readability, and avoiding 'div soup'.",
        keyPoints: [
          "Screen reader users jump directly between landmarks (`<nav>`, `<main>`).",
          "Semantic tags come with accessible roles built-in (e.g. `<button>` vs `<div onClick>`).",
        ],
      },
      {
        id: "html-q-2",
        number: "02",
        category: "Browser rendering and DOM",
        question: "What is the difference between 'script async' and 'script defer'?",
        modelAnswer:
          "Standard `<script>` halts HTML parsing while the script is downloaded and executed. Both `async` and `defer` download scripts asynchronously in the background without blocking the HTML parser. `async` executes immediately once downloaded, pausing parsing and running out of order. `defer` waits until the full HTML document is parsed, executing in strict DOM order right before `DOMContentLoaded` fires.",
        whatInterviewerLooksFor:
          "Browser parsing pipeline, execution timing, and script dependency management.",
        keyPoints: [
          "Use `defer` for scripts that depend on the DOM or on other scripts.",
          "Use `async` for independent third-party analytics or tracking scripts.",
        ],
      },
      {
        id: "html-q-3",
        number: "03",
        category: "Accessibility (a11y)",
        question: "What is the First Rule of ARIA, and how should it guide frontend development?",
        modelAnswer:
          "The First Rule of ARIA states: 'If you can use a native HTML element or attribute with the semantics and behavior you require already built in, then do so instead of re-purposing an element and adding an ARIA role.' For example, use `<button>` rather than `<div role='button' tabIndex='0'>` because native buttons handle Enter/Space keypresses, focus states, and disabled attributes automatically.",
        whatInterviewerLooksFor:
          "Native HTML priority, keyboard interaction handling, and accessibility standards.",
        keyPoints: [
          "Bad ARIA is worse than no ARIA.",
          "Native elements have keyboard events and focus semantics built-in.",
        ],
      },
      {
        id: "html-q-4",
        number: "04",
        category: "Forms and validation",
        question: "How do modern HTML5 form validation attributes work without JavaScript?",
        modelAnswer:
          "HTML5 provides declarative validation attributes: `required`, `pattern` (regex), `min`/`max`, `minlength`/`maxlength`, and input types (`email`, `url`, `number`). The browser validates inputs against these constraints automatically on submit, prevents invalid submission, displays localized tooltips, and exposes the CSS pseudo-classes `:valid` and `:invalid`.",
        whatInterviewerLooksFor:
          "Declarative browser constraints, Constraint Validation API (`checkValidity()`), and progressive enhancement.",
        keyPoints: [
          "Works even before JavaScript loads or if scripts fail.",
          "Always pair client-side validation with strict server-side validation.",
        ],
      },
      {
        id: "html-q-5",
        number: "05",
        category: "SEO and meta tags",
        question: "What are the essential meta tags required for modern mobile responsiveness and social sharing?",
        modelAnswer:
          "Essential tags include: 1. `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` (enables mobile viewport scaling); 2. `<meta charset='UTF-8'>`; 3. Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) for social platforms; 4. Twitter Card meta tags; 5. Canonical link tags (`<link rel='canonical'>`) to prevent duplicate content SEO penalties.",
        whatInterviewerLooksFor:
          "Mobile responsiveness, viewport scaling, SEO canonicalization, and Open Graph standards.",
        keyPoints: [
          "Without the viewport meta tag, mobile browsers render desktop width (980px) and scale down.",
          "Canonical tags tell search crawlers the authoritative master URL.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 7. CSS (31 Questions)
  // ----------------------------------------------------
  css: {
    id: "css",
    title: "CSS",
    questionCount: 31,
    description:
      "Layout, responsive design, selectors, the cascade, and rendering.",
    icon: "Sparkles",
    categories: [
      "Box model and sizing",
      "Flexbox and CSS Grid",
      "Positioning and stacking contexts",
      "The cascade, specificity, and inheritance",
      "Responsive design and media queries",
    ],
    questions: [
      {
        id: "css-q-1",
        number: "01",
        category: "Box model and sizing",
        question: "Explain the CSS Box Model and the difference between 'content-box' and 'border-box'.",
        modelAnswer:
          "The CSS Box Model consists of Content, Padding, Border, and Margin. Under the default `box-sizing: content-box`, declared width and height apply ONLY to the content area; adding 20px padding and 2px border increases the total rendered width. Under `box-sizing: border-box`, declared width includes content, padding, and border, making responsive layout math predictable.",
        whatInterviewerLooksFor:
          "Understanding why `* { box-sizing: border-box; }` is the universal CSS reset standard.",
        keyPoints: [
          "content-box: total width = width + padding + border.",
          "border-box: total width = width (padding and border carve inwards).",
        ],
      },
      {
        id: "css-q-2",
        number: "02",
        category: "Positioning and stacking contexts",
        question: "What creates a Stacking Context, and why does 'z-index: 99999' sometimes fail to bring an element to the front?",
        modelAnswer:
          "A Stacking Context is a 3D conceptual layering of HTML elements. An element with `z-index: 99999` fails to appear above another element if its parent container forms a lower stacking context. Stacking contexts are formed by: the root element (`<html>`), positioned elements (`relative`/`absolute`) with non-auto `z-index`, `position: fixed` or `sticky`, elements with `opacity < 1`, `transform` / `filter` / `backdrop-filter` non-none values, or `isolation: isolate`.",
        whatInterviewerLooksFor:
          "Stacking context root causes, parent isolation boundaries, and CSS debugging discipline.",
        keyPoints: [
          "Z-index is only evaluated among sibling elements within the same stacking context.",
          "`isolation: isolate` is modern CSS to safely scope stacking contexts without side effects.",
        ],
      },
      {
        id: "css-q-3",
        number: "03",
        category: "Flexbox and CSS Grid",
        question: "When should an engineer choose CSS Grid over Flexbox?",
        modelAnswer:
          "Flexbox is designed for 1-dimensional layouts (either a row OR a column), distributing space along a primary axis (content-first). CSS Grid is designed for 2-dimensional layouts (rows AND columns simultaneously), defining rigid or flexible grid tracks that children snap into (layout-first). Choose Flexbox for navigation bars, card rows, and button clusters; choose Grid for overall page layouts, photo galleries, and dashboards.",
        whatInterviewerLooksFor:
          "1D vs 2D architectural differences, content-first vs grid-track-first thinking.",
        keyPoints: [
          "Flexbox handles 1D wrapping, but rows do not align columns across rows.",
          "Grid handles 2D alignment across rows and columns simultaneously.",
        ],
      },
      {
        id: "css-q-4",
        number: "04",
        category: "The cascade, specificity, and inheritance",
        question: "How is CSS Specificity calculated?",
        modelAnswer:
          "Specificity is a 4-component score (Inline, IDs, Classes/Attributes/Pseudo-classes, Elements/Pseudo-elements):\n1. Inline styles (`style='...'`) = 1,0,0,0\n2. IDs (`#header`) = 0,1,0,0\n3. Classes, attributes, and pseudo-classes (`.btn`, `[type='text']`, `:hover`) = 0,0,1,0\n4. Type elements and pseudo-elements (`div`, `p`, `::before`) = 0,0,0,1\nUniversal selector (`*`) has 0 specificity. `!important` overrides normal specificity entirely.",
        whatInterviewerLooksFor:
          "Specificity tuple math, avoiding specificity escalation wars, and using BEM or CSS Modules.",
        keyPoints: [
          "Ten classes cannot beat one ID (it is not a base-10 number system).",
          "Never rely on `!important` to fix architecture problems.",
        ],
      },
      {
        id: "css-q-5",
        number: "05",
        category: "Responsive design and media queries",
        question: "Explain the difference between mobile-first and desktop-first responsive design.",
        modelAnswer:
          "Mobile-first design writes base CSS styles for small screen viewports and progressively layers on layout enhancements using `min-width` media queries (`@media (min-width: 768px)`). Desktop-first writes complex multi-column layouts first and shrinks them down using `max-width`. Mobile-first is the industry standard because mobile devices parse lighter base CSS and progressive enhancement yields cleaner cascades.",
        whatInterviewerLooksFor:
          "Progressive enhancement, performance on low-end mobile devices, and media query discipline.",
        keyPoints: [
          "Mobile-first uses `min-width`; Desktop-first uses `max-width`.",
          "Prevents overriding heavy desktop styles with resets on mobile.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 8. JAVASCRIPT (41 Questions)
  // ----------------------------------------------------
  javascript: {
    id: "javascript",
    title: "JavaScript",
    questionCount: 41,
    description:
      "Language fundamentals, the runtime, asynchronous code, and the DOM.",
    icon: "Braces",
    categories: [
      "Language fundamentals and types",
      "Scoping, closures, and execution context",
      "Asynchronous JavaScript and Event Loop",
      "Prototypes and modern classes",
      "DOM manipulation and performance",
    ],
    questions: [
      {
        id: "js-q-1",
        number: "01",
        category: "Asynchronous JavaScript and Event Loop",
        question: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue, and Macrotask Queue.",
        modelAnswer:
          "JavaScript is single-threaded with a single Call Stack. When asynchronous operations execute: Web APIs (like timers, network fetches) handle background work. Upon completion: Promise callbacks and `queueMicrotask` enter the Microtask Queue; `setTimeout`, `setInterval`, and I/O enter the Macrotask (Task) Queue. The Event Loop checks the Call Stack: once the stack is empty, it flushes the ENTIRE Microtask Queue before processing the next Macrotask.",
        whatInterviewerLooksFor:
          "Microtask priority over macrotasks, non-blocking asynchronous concurrency, and execution order prediction.",
        keyPoints: [
          "Microtasks (Promises) always run before the next Macrotask (setTimeout).",
          "A recursive microtask starvation loop can freeze the browser rendering engine.",
        ],
      },
      {
        id: "js-q-2",
        number: "02",
        category: "Scoping, closures, and execution context",
        question: "What is a Closure in JavaScript, and what are practical use cases and memory leak risks?",
        modelAnswer:
          "A Closure is the combination of a function bundled together with references to its surrounding lexical environment. A closure gives an inner function access to an outer function's scope even after the outer function has returned. Practical use cases: data privacy/encapsulation (module pattern), memoization caches, and event handlers. Memory leak risk: retaining closures in global event listeners or timers prevents garbage collection of large captured objects.",
        whatInterviewerLooksFor:
          "Lexical environment retention, memory leak mechanics, and practical design patterns.",
        keyPoints: [
          "Functions retain pointers to their outer scope variables.",
          "Clean up event listeners and intervals to release captured closure memory.",
        ],
      },
      {
        id: "js-q-3",
        number: "03",
        category: "Language fundamentals and types",
        question: "What is the difference between '==' and '===' in JavaScript?",
        modelAnswer:
          "`===` (Strict Equality) checks both value and type without performing type coercion; if types differ, it returns false. `==` (Loose Equality) performs implicit Abstract Equality Comparison type coercion, converting operands to common types before comparing. For instance, `0 == false` is true, `' ' == 0` is true, but `0 === false` is false. Always use `===` to prevent subtle bugs.",
        whatInterviewerLooksFor:
          "Type coercion mechanics, truthy/falsy coercion, and best practices.",
        keyPoints: [
          "Loose equality coerces primitives (strings to numbers, booleans to numbers).",
          "The only acceptable loose equality idiom: `x == null` (checks for both null and undefined).",
        ],
      },
      {
        id: "js-q-4",
        number: "04",
        category: "Prototypes and modern classes",
        question: "How does Prototypal Inheritance work under the hood in JavaScript?",
        modelAnswer:
          "Every JavaScript object has an internal link (`[[Prototype]]`, accessible via `Object.getPrototypeOf()` or `__proto__`) pointing to another object. When property lookup fails on an object, the JS engine traverses up the Prototype Chain until it finds the property or hits `null` (end of `Object.prototype`). ES6 `class` syntax is purely syntactic sugar over this prototypal delegation model.",
        whatInterviewerLooksFor:
          "Prototype chain lookup, method sharing on prototypes to conserve memory, and syntactic sugar clarification.",
        keyPoints: [
          "Methods declared on `Prototype` are shared by all instances, saving RAM.",
          "Property shadowing occurs when an instance property masks a prototype property.",
        ],
      },
      {
        id: "js-q-5",
        number: "05",
        category: "DOM manipulation and performance",
        question: "What is the difference between Debouncing and Throttling?",
        modelAnswer:
          "Debouncing delays executing a function until a specified quiet period has elapsed with no new calls; every incoming call resets the timer (ideal for search input autocomplete). Throttling enforces a maximum execution frequency, executing the function at most once per defined time window regardless of how many times it is triggered (ideal for window resize, scroll, or mousemove handlers).",
        whatInterviewerLooksFor:
          "Implementation mechanics, timer resets, and performance optimization for high-frequency events.",
        keyPoints: [
          "Debounce = execute after user stops typing (trailing edge).",
          "Throttle = execute periodically at steady intervals while event fires.",
        ],
      },
    ],
  },

  // ----------------------------------------------------
  // 9. REACT (56 Questions)
  // ----------------------------------------------------
  react: {
    id: "react",
    title: "React",
    questionCount: 56,
    description:
      "Components, hooks, state, rendering, and application architecture.",
    icon: "Atom",
    categories: [
      "React fundamentals and JSX",
      "Components, props, and state",
      "Hooks deep dive",
      "Component lifecycle and effects",
      "Performance optimization and memoization",
      "Context and state management",
    ],
    questions: [
      {
        id: "react-q-1",
        number: "01",
        category: "React fundamentals and JSX",
        question: "How does React's Reconciliation and Virtual DOM Diffing algorithm work?",
        modelAnswer:
          "React maintains a lightweight in-memory representation of the UI (the Virtual DOM). When state changes, React renders a new virtual tree and runs a heuristic O(N) Diffing algorithm against the previous tree: 1. Two elements of different types produce completely different trees (unmounts old, mounts new); 2. Elements with matching keys are reused across renders; 3. Once diffing is complete, React reconciles changes and commits minimal batch mutations to the real browser DOM.",
        whatInterviewerLooksFor:
          "Virtual DOM tree comparison, Fiber architecture (interruptible render phase vs synchronous commit phase), and key prop importance.",
        keyPoints: [
          "Without keys, inserting at the start of a list forces re-rendering every item.",
          "Fiber decouples rendering (scheduling) from committing (DOM mutation).",
        ],
      },
      {
        id: "react-q-2",
        number: "02",
        category: "Hooks deep dive",
        question: "What are the Rules of Hooks, and why must hooks never be called inside loops, conditions, or nested functions?",
        modelAnswer:
          "The Rules of Hooks mandate: 1. Only call hooks at the top level of function components or custom hooks; 2. Never call hooks inside loops, conditions, or nested functions. React relies on the exact sequential order of hook calls across renders to associate internal state stored in a linked list on the component's Fiber node. Placing hooks inside conditions shifts indices and causes state misalignment bugs.",
        whatInterviewerLooksFor:
          "Fiber linked list storage model, state index tracking, and static linting enforcement.",
        keyPoints: [
          "State hooks are stored sequentially in a linked list on the Fiber node.",
          "A conditional hook shifts all subsequent hook state pointers.",
        ],
      },
      {
        id: "react-q-3",
        number: "03",
        category: "Performance optimization and memoization",
        question: "Compare 'React.memo', 'useMemo', and 'useCallback'. When does premature memoization hurt performance?",
        modelAnswer:
          "`React.memo` is a higher-order component that skips re-rendering a component if its props have not shallowly changed. `useMemo` caches the calculated result of an expensive computation across renders. `useCallback` caches a function reference across renders to prevent unnecessary re-renders of memoized child components. Premature memoization hurts performance because dependency array comparisons and closure allocations consume CPU cycles that often cost more than cheap re-renders.",
        whatInterviewerLooksFor:
          "Referential equality, shallow comparison, when memoization actually helps vs adds overhead.",
        keyPoints: [
          "useCallback is only useful if the function is passed to a memoized child component or dependency array.",
          "Profile with React DevTools Profiler before adding memoization.",
        ],
      },
      {
        id: "react-q-4",
        number: "04",
        category: "Component lifecycle and effects",
        question: "Why does useEffect run twice in React 18 Strict Mode in development?",
        modelAnswer:
          "In React 18 development mode, Strict Mode automatically mounts, unmounts, and re-mounts every component to help developers identify missing cleanup functions in effects. This stress-tests components against race conditions and memory leaks, ensuring resilience under Concurrent React features like Offscreen and fast navigation.",
        whatInterviewerLooksFor:
          "Concurrent React resilience, effect cleanup hygiene (abort controllers, unsubscribes).",
        keyPoints: [
          "Strict Mode double-mount occurs ONLY in development, never in production.",
          "Every effect that subscribes or fetches should have a proper cleanup function.",
        ],
      },
      {
        id: "react-q-5",
        number: "05",
        category: "Context and state management",
        question: "Why can the Context API cause performance bottlenecks in high-frequency update applications?",
        modelAnswer:
          "When a Context value changes (by reference), EVERY component that subscribes to that context via `useContext` is forced to re-render, even if it only consumes an unrelated property of the context value. In high-frequency update applications (e.g. streaming dashboards, animations), this triggers massive cascade re-renders. Solutions: split contexts into separate fine-grained contexts, or use external state managers (Zustand, Redux) that support selective subscription selectors.",
        whatInterviewerLooksFor:
          "Context re-render propagation, context splitting, and selective subscription state architecture.",
        keyPoints: [
          "Context is designed for low-frequency updates (theme, authenticated user).",
          "Split state context from dispatch context to avoid re-rendering action callers.",
        ],
      },
    ],
  },
};

