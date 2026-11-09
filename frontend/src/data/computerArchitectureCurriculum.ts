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
// MODERN COMPUTER ARCHITECTURE: EXACT PREPLOOM CURRICULUM (5 MODULES, 27 TOPICS)
// =========================================================================

export const ARCH_MODULES: ModuleGroup[] = [
  // ----------------------------------------------------
  // Module 1: Digital Logic Foundations (5 Topics)
  // ----------------------------------------------------
  {
    id: "arch-mod-1",
    name: "1. Digital Logic Foundations",
    topics: [
      {
        id: "arch-1-1",
        title: "Introduction to Boolean Algebra & Logic Gates",
        moduleName: "1. Digital Logic Foundations",
        readTime: "5 min read",
        summary:
          "Digital processors operate on binary voltages representing 0 and 1. Boolean algebra and semiconductor logic gates form the mathematical and physical foundation of every computing machine.",
        theThreeJobs: {
          resourceManager:
            "Logic gates combine electrical potentials (CMOS transistor networks) to execute deterministic truth operations in fractions of a nanosecond.",
          protectionLayer:
            "Noise margins and threshold voltages guarantee that slight voltage fluctuations do not flip binary state bits during high-frequency switching.",
          hardwareHelper:
            "NAND and NOR gates act as Universal Gates, meaning any combinational circuit or computing machine can be constructed entirely from either gate alone.",
        },
        keyInvariants: [
          "NAND and NOR gates are functionally complete (Universal Gates).",
          "De Morgan's Laws: NOT (A AND B) == (NOT A) OR (NOT B); NOT (A OR B) == (NOT A) AND (NOT B).",
          "A CMOS inverter requires 2 transistors (1 pMOS pull-up to Vdd, 1 nMOS pull-down to GND).",
        ],
        detailedContent:
          "All digital computation is implemented via complementary metal-oxide-semiconductor (CMOS) field-effect transistors. A CMOS inverter uses a pull-up pMOS network and a pull-down nMOS network to switch between logical 0 (ground, 0V) and logical 1 (Vdd, e.g. 0.8V - 1.2V).\n\nPropagation Delay (t_pd):\nThe maximum time between an input voltage transition and the corresponding output voltage transition. In high-speed CPU clocking, the longest combinational path between two synchronous registers defines the critical path and determines the maximum clock frequency: f_max = 1 / (t_cq + t_comb + t_setup).",
        diagram: `+--------------------------------------------------------+
|          CMOS Inverter (NOT Gate) Architecture         |
+--------------------------------------------------------+
|         Vdd (e.g. 1.0V)                                |
|            |                                           |
|       +----+----+                                      |
|       |  pMOS   |  Input LOW (0V) -> pMOS ON, nMOS OFF |
|   +---| Trans.  |  Output pulled to Vdd (Logical 1)    |
|   |   +----+----+                                      |
|   |        |------> Output Vout                        |
|   |   +----+----+                                      |
|   +---|  nMOS   |  Input HIGH (1V) -> pMOS OFF, nMOS ON|
|       | Trans.  |  Output pulled to GND (Logical 0)    |
|       +----+----+                                      |
|            |                                           |
|         GND (0V)                                       |
+--------------------------------------------------------+`,
        comparisonTable: {
          headers: ["Gate Type", "Boolean Equation", "Transistor Count (CMOS)", "Universal Gate?"],
          rows: [
            ["NOT (Inverter)", "Y = NOT(A)", "2 (1 pMOS + 1 nMOS)", "No"],
            ["NAND", "Y = NOT(A AND B)", "4 (2 pMOS + 2 nMOS)", "Yes (Industry Standard)"],
            ["NOR", "Y = NOT(A OR B)", "4 (2 pMOS + 2 nMOS)", "Yes"],
            ["AND", "Y = A AND B", "6 (NAND + Inverter)", "No"],
            ["XOR (Parity)", "Y = A XOR B", "8 to 10 transistors", "No"],
          ],
        },
        interviewWatchout:
          "When asked why NAND gates are preferred over NOR gates in silicon, mention that electrons in nMOS have roughly twice the mobility of holes in pMOS, making NAND gates faster and more compact.",
      },
      {
        id: "arch-1-2",
        title: "Universal Logic Gates (NAND & NOR Implementation)",
        moduleName: "1. Digital Logic Foundations",
        readTime: "4 min read",
        summary:
          "A gate is universal if any Boolean function can be built entirely using only instances of that gate. NAND and NOR form the elemental basis for VLSI silicon fabrication.",
        keyInvariants: [
          "NAND as NOT: Connect both inputs together (A NAND A = NOT A).",
          "NAND as AND: Invert a NAND output with a second NAND gate.",
          "NAND as OR: Invert both inputs using NANDs, then feed into a third NAND gate (De Morgan).",
          "Silicon foundries design standard cell libraries primarily with NAND gates to optimize die area and speed.",
        ],
        detailedContent:
          "Constructing Basic Gates with NAND:\n- Inverter (NOT A): A NAND A\n- AND Gate (A AND B): NOT(A NAND B) = (A NAND B) NAND (A NAND B)\n- OR Gate (A OR B): (NOT A) NAND (NOT B) = (A NAND A) NAND (B NAND B)\n- NOR Gate: (A OR B) NAND (A OR B)\n- XOR Gate: Can be constructed with exactly 4 NAND gates: Y = (A NAND (A NAND B)) NAND (B NAND (A NAND B))",
      },
      {
        id: "arch-1-3",
        title: "Circuit Minimization with Karnaugh Maps (K-Maps)",
        moduleName: "1. Digital Logic Foundations",
        readTime: "5 min read",
        summary:
          "K-Maps provide a systematic visual method for simplifying Boolean expressions, minimizing hardware transistor count, reducing propagation delay, and eliminating circuit glitches.",
        keyInvariants: [
          "Gray Code Ordering: Adjacent cells in a K-Map differ by exactly 1 bit (00, 01, 11, 10).",
          "Grouping Rule: Group adjacent 1s in powers of two (1, 2, 4, 8, 16). Larger groups yield simpler terms.",
          "Wrap-Around: Edges of K-Maps are continuous (top wraps to bottom, left wraps to right).",
          "Don't Care terms (X) can be treated as 1 or 0 to form larger groupings and reduce gate count.",
        ],
        detailedContent:
          "Why Minimize Circuits?\n1. Propagation Delay: Fewer gate stages reduce latency along the processor's critical path.\n2. Power Dissipation: Each CMOS switching event burns dynamic power (P = C * V^2 * f). Fewer gates mean lower capacitive load C.\n3. Die Area: Smaller gate footprints leave more silicon area for multi-level caches and execution units.",
      },
      {
        id: "arch-1-4",
        title: "Binary Number Systems & 2's Complement Arithmetic",
        moduleName: "1. Digital Logic Foundations",
        readTime: "6 min read",
        summary:
          "Processors represent negative numbers using 2's complement, enabling hardware adders to perform subtraction without separate subtractor circuitry.",
        keyInvariants: [
          "2's Complement representation of -X is (~X) + 1.",
          "There is only one zero in 2's complement (0x00000000), eliminating sign-magnitude dual-zero anomalies.",
          "An N-bit 2's complement integer has range [-2^(N-1), 2^(N-1) - 1] (e.g. 8-bit: -128 to +127).",
          "Overflow occurs if adding two positive numbers yields a negative result, or adding two negative numbers yields a positive result.",
        ],
        detailedContent:
          "Why 2's Complement Dominates Hardware:\n1. Unified Adder Hardware: Subtraction A - B is computed simply as A + (~B + 1). The hardware ALU uses an identical adder circuit with an inverted input carry bit.\n2. Single Zero: Sign-magnitude has both +0 (0000) and -0 (1000), requiring extra comparator logic. 2's complement has a single representation for zero.\n3. Asymmetry: An N-bit number has one more negative number than positive numbers (e.g., 8-bit can represent -128, but only up to +127). The negation of the most negative number results in overflow!",
        codeSnippet: {
          language: "c",
          code: `// Safe 32-bit signed addition overflow check in C
#include <stdbool.h>
#include <stdint.h>

bool check_signed_add_overflow(int32_t a, int32_t b, int32_t *result) {
    if ((b > 0 && a > INT32_MAX - b) || 
        (b < 0 && a < INT32_MIN - b)) {
        return true; // Overflow detected
    }
    *result = a + b;
    return false;
}`,
        },
      },
      {
        id: "arch-1-5",
        title: "Arithmetic Logic Unit (ALU) & Fast Adders",
        moduleName: "1. Digital Logic Foundations",
        readTime: "6 min read",
        summary:
          "The Arithmetic Logic Unit (ALU) executes binary arithmetic (ADD, SUB) and logical operations (AND, OR, XOR, SHIFT) directed by control signals.",
        keyInvariants: [
          "Half Adder computes Sum = A XOR B and Carry = A AND B.",
          "Full Adder computes Sum = A XOR B XOR Cin and Cout = (A·B) + (Cin·(A XOR B)).",
          "Ripple Carry Adder has O(N) propagation delay because the carry bit ripples from bit 0 to bit N-1.",
          "Carry Lookahead Adder (CLA) achieves O(log N) latency by pre-computing Generate (G = A·B) and Propagate (P = A XOR B) signals.",
        ],
        detailedContent:
          "Arithmetic Adder Evolution:\n1. Ripple Carry Adder (RCA):\nSimple to implement by chaining Full Adders. For a 64-bit adder with 2-gate delays per stage, the critical path is 2 * 64 = 128 gate delays! This is too slow for GHz clock frequencies.\n\n2. Carry Lookahead Adder (CLA):\nAvoids waiting for the carry to ripple by expressing each carry as a function of the primary inputs and initial carry:\n- Generate signal: Gi = Ai · Bi (a carry is guaranteed to generate)\n- Propagate signal: Pi = Ai XOR Bi (an incoming carry will propagate through)\nCarry equations:\n- C1 = G0 + P0·C0\n- C2 = G1 + P1·G0 + P1·P0·C0\n- C3 = G2 + P2·G1 + P2·P1·G0 + P2·P1·P0·C0\nBecause fan-in is physically limited in silicon, multi-level CLA tree adders (e.g. Kogge-Stone or Brent-Kung) are deployed in production CPUs to compute 64-bit addition in 4-6 gate delays.",
        diagram: `+-------------------------------------------------------------+
|              Arithmetic Logic Unit (ALU) Symbol             |
+-------------------------------------------------------------+
|        Operand A (64-bit)       Operand B (64-bit)          |
|                 \\                      /                    |
|                  \\                    /                     |
|                   +------------------+                      |
|                   \\       ALU        /                      |
|     ALUControl --->\\   (ADD/SUB/    /                       |
|     (e.g. 4-bit)    \\   AND/OR/XOR)/                        |
|                      +------------+                         |
|                            |                                |
|                 Result Out (64-bit)                         |
|                 Flags: [ Zero, Negative, Overflow, Carry ]  |
+-------------------------------------------------------------+`,
      },
    ],
  },

  // ----------------------------------------------------
  // Module 2: Sequential Logic & Memory Elements (5 Topics)
  // ----------------------------------------------------
  {
    id: "arch-mod-2",
    name: "2. Sequential Logic, Clocking & Memory",
    topics: [
      {
        id: "arch-2-1",
        title: "Latches vs Edge-Triggered Flip-Flops",
        moduleName: "2. Sequential Logic, Clocking & Memory",
        readTime: "5 min read",
        summary:
          "Sequential circuits introduce state and memory through feedback loops. Latches are level-sensitive, while Flip-Flops sample inputs strictly on clock transitions.",
        keyInvariants: [
          "Latches are level-sensitive (transparent while clock is HIGH).",
          "Flip-Flops are edge-triggered (sample inputs exclusively on clock transition 0 -> 1).",
          "Master-Slave D Flip-Flop uses two back-to-back latches to eliminate race-around conditions.",
          "Flip-flops form the fundamental building block for processor registers and pipeline stage barriers.",
        ],
        detailedContent:
          "The Anatomy of an Edge-Triggered D Flip-Flop:\nA standard positive-edge-triggered D flip-flop is built from two back-to-back D latches in a Master-Slave configuration. When the clock is LOW, the Master latch is transparent and tracks input D, while the Slave latch is opaque and holds previous state Q. When the clock transitions from LOW to HIGH, the Master latch locks its captured state, and the Slave latch becomes transparent, transmitting the locked value to Q.",
      },
      {
        id: "arch-2-2",
        title: "Clocking, Timing Margins & Setup/Hold Constraints",
        moduleName: "2. Sequential Logic, Clocking & Memory",
        readTime: "6 min read",
        summary:
          "Timing margins (Setup Time and Hold Time) dictate maximum CPU clock frequency and reliability. Violations cause metastability.",
        keyInvariants: [
          "Setup Time (t_setup): Minimum duration input data must remain stable BEFORE the active clock edge.",
          "Hold Time (t_hold): Minimum duration input data must remain stable AFTER the active clock edge.",
          "Max Clock Frequency: T_clk >= t_cq + t_comb_max + t_setup + t_skew.",
          "Setup violations can be resolved by lowering clock frequency; Hold violations are frequency-independent and cause catastrophic hardware failure.",
        ],
        detailedContent:
          "Timing Violations & Clock Frequencies:\nTo guarantee error-free operation without metastability, two constraints must hold:\n1. Maximum Frequency Constraint (Setup time):\nT_clk >= t_cq + t_comb,max + t_setup + t_skew\nIf t_comb is too long, the signal arrives too late, causing a setup violation. This can be fixed by lowering clock frequency.\n2. Minimum Delay Constraint (Hold time):\nt_cq + t_comb,min >= t_hold + t_skew\nIf the path is too short, new data overwrites old data before the flip-flop can finish latching. Hold violations cannot be fixed by changing clock frequency; buffer delays must be physically inserted into the silicon path!",
        diagram: `+------------------------------------------------------------+
|             D Flip-Flop Setup and Hold Window              |
+------------------------------------------------------------+
|  Clock Line:          ______                        ______ |
|  ____________________/      \\______________________/       |
|                      ^                                     |
|               Clock Edge (0 -> 1)                          |
|                  |<->|<->|                                 |
|                 t_setup t_hold                             |
|  Data Line:    ===========\\                                |
|  --------------------------X------------------------------ |
|                 Data must be stable                        |
|                 inside this window!                        |
+------------------------------------------------------------+`,
        interviewWatchout:
          "Notice the critical distinction: Setup violations are solvable by lowering clock speed; Hold violations cannot be resolved by changing clock frequency.",
      },
      {
        id: "arch-2-3",
        title: "Synchronous Registers & Multi-Port Register Files",
        moduleName: "2. Sequential Logic, Clocking & Memory",
        readTime: "5 min read",
        summary:
          "A Register File is an array of processor registers providing multi-port read and write access, allowing ALUs to read two source operands and write one destination operand simultaneously.",
        keyInvariants: [
          "Standard CPU Register File: 2 Read Ports + 1 Write Port (2R1W) operating in a single clock cycle.",
          "Reading from a register file is purely combinational (address in -> data out).",
          "Writing to a register file is synchronous on the active clock edge, gated by a Write Enable (RegWrite) signal.",
          "Register $0 is hardwired to zero in RISC-V and MIPS architectures (reads always return 0, writes are ignored).",
        ],
        detailedContent:
          "Multi-Porting Mechanics:\nIn a superscalar processor, reading 4 registers and writing 2 registers in a single cycle requires a 4R2W register file. Each register bit cell has multiple read bit-lines and multiple write bit-lines. Hardware complexity and silicon area scale quadratically with port count (O(P^2)), which is why register renaming and clustered register files are deployed in modern processors.",
      },
      {
        id: "arch-2-4",
        title: "SRAM vs DRAM Circuit Architecture",
        moduleName: "2. Sequential Logic, Clocking & Memory",
        readTime: "5 min read",
        summary:
          "SRAM uses 6 transistors for blistering speed in CPU caches, while DRAM uses a single transistor and capacitor for high-density, low-cost system memory.",
        keyInvariants: [
          "SRAM (Static RAM): 6 Transistors (6T cell), bistable latch, non-destructive read, zero refresh required, ~1ns access latency.",
          "DRAM (Dynamic RAM): 1 Transistor + 1 Capacitor (1T-1C cell), stores charge, destructive read, requires periodic refresh every ~64ms, ~50-80ns latency.",
          "DRAM destructive read requires an immediate precharge and write-back cycle by on-chip sense amplifiers.",
        ],
        detailedContent:
          "Why Not Make All Memory SRAM?\n- Area: An SRAM 6T cell requires roughly 6x to 10x more physical silicon surface area than a DRAM 1T-1C cell. A 32GB SRAM main memory would cost thousands of dollars and consume massive static leakage power.\n- Density: DRAM achieves maximum memory density because charge is stored in a micro-capacitor built vertically into deep silicon trenches.\n\nDRAM Refresh Cycle:\nThe charge in a DRAM capacitor leaks over time through semiconductor junction leakage. The memory controller must issue periodic REFRESH commands (typically every 64ms across 8,192 rows) to read and restore the charge, introducing periodic refresh stalls in memory throughput.",
        comparisonTable: {
          headers: ["Attribute", "SRAM (Static RAM)", "DRAM (Dynamic RAM)"],
          rows: [
            ["Cell Design", "6 Transistors (cross-coupled inverters)", "1 Transistor + 1 Capacitor (1T-1C)"],
            ["Speed / Latency", "0.5 ns - 2.5 ns", "50 ns - 80 ns (DDR4/DDR5)"],
            ["Density (bits/mm²)", "Low (Large cell area)", "Extremely High"],
            ["Cost per Gigabyte", "Very High (~$1000/GB)", "Low (~$3/GB)"],
            ["Primary Use Case", "L1, L2, L3 Processor Caches", "Main System Memory (RAM)"],
            ["Refresh Needed?", "No (Holds data as long as powered)", "Yes (Every 32-64 ms)"],
          ],
        },
      },
      {
        id: "arch-2-5",
        title: "Memory Arrays, Decoding & Bus Interconnects",
        moduleName: "2. Sequential Logic, Clocking & Memory",
        readTime: "5 min read",
        summary:
          "Memory arrays organize millions of bit cells into 2D grid structures using Row Decoders (Word Lines) and Column Multiplexers (Bit Lines) to minimize wiring complexity.",
        keyInvariants: [
          "2D Grid Addressing: Address is partitioned into Row Address and Column Address, reducing address decoding gates from 2^N to 2^(N/2) + 2^(N/2).",
          "Word Line (Row) activates all cells in that row; Bit Lines (Columns) read or write the cell states via sense amplifiers.",
          "Memory Bus Protocols (PCIe, AXI, UPI) use differential signaling and serialized packets to transfer data between CPU, memory, and devices.",
        ],
        detailedContent:
          "The Need for 2D Memory Organization:\nA naive 1D memory with 64K words would require a 16-to-65,536 decoder. This is physically impossible to wire on silicon. By organizing the memory into a 256 x 256 matrix, an 8-bit row decoder selects 1 of 256 rows, and an 8-bit column multiplexer selects 1 of 256 columns, cutting decoder circuitry by 99%!",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 3: Hack CPU & Instruction Set Architecture (5 Topics)
  // ----------------------------------------------------
  {
    id: "arch-mod-3",
    name: "3. Hack CPU & Instruction Set Architecture",
    topics: [
      {
        id: "arch-3-1",
        title: "The Hardware-Software Contract: ISA vs Microarchitecture",
        moduleName: "3. Hack CPU & Instruction Set Architecture",
        readTime: "6 min read",
        summary:
          "The Instruction Set Architecture is the contract between software compilers and CPU hardware, defining registers, memory addressing, data types, and instruction encoding.",
        keyInvariants: [
          "ISA defines the programmer-visible state: Program Counter (PC), General Purpose Registers (GPRs), Status Flags, and Memory Address Space.",
          "Microarchitecture is the physical hardware implementation of an ISA. Multiple microarchitectures can execute the same ISA (e.g. Intel Alder Lake and AMD Zen 4 both execute x86-64).",
          "Instruction formats dictate how opcode bits, source registers, destination registers, and immediate constants are packed into 32-bit or variable-length words.",
        ],
        detailedContent:
          "Architectural State vs Microarchitectural State:\n- Architectural State: Everything that must be preserved across an operating system context switch or thread interrupt (e.g. PC, R0-R31, condition flags, page table root register CR3/SATP).\n- Microarchitectural State: Internal physical structures that are transparent to software but critical for performance (e.g. branch prediction tables, store buffers, L1/L2 cache lines, reorder buffer entries).",
      },
      {
        id: "arch-3-2",
        title: "Machine Language & Instruction Formats (R, I, S, B, U, J)",
        moduleName: "3. Hack CPU & Instruction Set Architecture",
        readTime: "6 min read",
        summary:
          "RISC architectures standardize instruction bit formats to simplify hardware decoding. RISC-V organizes instructions into 6 canonical formats.",
        keyInvariants: [
          "R-Type (Register): Operates on two source registers (rs1, rs2) and writes to destination (rd). e.g. ADD, SUB, AND.",
          "I-Type (Immediate): Operates on rs1 and a 12-bit signed immediate constant. e.g. ADDI, LW, JALR.",
          "S-Type (Store): Stores rs2 into memory address rs1 + offset. Split immediate fields keep rs1 and rs2 in fixed bit positions.",
          "B-Type (Branch): Conditional branch with PC-relative offset. e.g. BEQ, BNE, BLT.",
          "U-Type (Upper Immediate): Loads 20-bit immediate into top bits of register (LUI, AUIPC).",
          "J-Type (Jump): Unconditional jump and link with 20-bit PC-relative offset (JAL).",
        ],
        detailedContent:
          "Why Fixed-Width Instruction Formats Matter:\nIn CISC architectures like x86, instruction length varies from 1 to 15 bytes. The CPU cannot determine where instruction 2 starts until it has finished decoding instruction 1. In RISC-V, every instruction is exactly 32 bits wide, and the source register specifiers (rs1 and rs2) are always located in bits [19:15] and [24:20]. The register file can begin reading operands before the opcode is even finished decoding!",
      },
      {
        id: "arch-3-3",
        title: "Addressing Modes & Memory Operands",
        moduleName: "3. Hack CPU & Instruction Set Architecture",
        readTime: "5 min read",
        summary:
          "Addressing modes define how machine instructions specify the location of data: Immediate, Register Direct, Base-Plus-Offset, and PC-Relative.",
        keyInvariants: [
          "Immediate Addressing: Operand value is embedded directly inside the instruction bits (e.g. `addi x1, x0, 42`).",
          "Register Addressing: Operand is stored in a CPU general-purpose register (e.g. `add x3, x1, x2`).",
          "Base-Plus-Offset (Displacement): Effective Address = Register + Sign-Extended Immediate (e.g. `lw x1, 8(x2)`).",
          "PC-Relative Addressing: Target Address = PC + Offset. Used for relocatable code and conditional branches.",
        ],
        detailedContent:
          "Why PC-Relative Addressing Enables Relocatable Binaries:\nIf a branch jumped to an absolute memory address (e.g. `JUMP 0x00401050`), the program could only execute if loaded at that exact memory address. PC-relative branches specify how many bytes forward or backward to jump relative to the current Program Counter (PC). This allows the operating system to load shared libraries (.so / .dll) at any arbitrary memory address via ASLR (Address Space Layout Randomization).",
      },
      {
        id: "arch-3-4",
        title: "CISC vs RISC Architectures (x86-64 vs ARM64 & RISC-V)",
        moduleName: "3. Hack CPU & Instruction Set Architecture",
        readTime: "7 min read",
        summary:
          "CISC optimizes for code density with rich variable-length instructions, while RISC optimizes for simple, fixed-length load/store pipelines.",
        keyInvariants: [
          "CISC (x86-64): Variable length (1 to 15 bytes), memory operands directly in arithmetic instructions, complex addressing modes.",
          "RISC (ARM64, RISC-V): Fixed length (32-bit), Load/Store architecture (arithmetic executes exclusively on registers), 32 general-purpose registers.",
          "Modern CISC CPUs (Intel/AMD) contain hardware decoders that dynamically translate x86 instructions into internal fixed-length RISC micro-operations.",
        ],
        detailedContent:
          "The Classic RISC Philosophy:\nIn the 1970s, researchers discovered that compilers used only a small fraction of CISC instructions. Most complex instructions were slower than a sequence of simple instructions because the CPU's microcode engine was slow. RISC focuses on:\n1. 1 instruction per cycle execution target.\n2. Fixed 32-bit instruction formats to allow parallel hardware instruction decoding.\n3. Dedicated LOAD and STORE instructions: no memory access inside ALU instructions.\n\nModern Convergence:\nToday, modern x86 processors translate complex variable-length x86 instructions into internal RISC-like micro-ops at the decoder stage. Meanwhile, RISC architectures incorporate advanced instruction fusion, vector extensions (Neon/SVE), and complex branch predictors.",
        codeSnippet: {
          language: "asm",
          code: `# Comparison: Increment memory variable x by 5
# x86-64 (CISC: single instruction with memory operand)
add dword ptr [rdi], 5

# RISC-V (RISC: Load/Store architecture requires 3 distinct instructions)
lw   t0, 0(a0)       # Load memory at address a0 into register t0
addi t0, t0, 5       # Perform ALU addition in register t0
sw   t0, 0(a0)       # Store result back from register t0 to memory`,
        },
        comparisonTable: {
          headers: ["Dimension", "CISC (x86-64)", "RISC (ARM64 / RISC-V)"],
          rows: [
            ["Instruction Length", "Variable (1 to 15 bytes)", "Fixed (32 bits, or 16-bit compressed)"],
            ["Memory Access", "Allowed in any arithmetic instruction", "Restricted to LOAD / STORE instructions"],
            ["Registers", "16 GPRs in x86-64", "31-32 General Purpose Registers"],
            ["Decoding Complexity", "High (Requires multi-byte pre-decoders)", "Simple (Immediate and register fields fixed)"],
            ["Internal Execution", "Decoded into micro-ops", "Executed directly or simple micro-ops"],
          ],
        },
      },
      {
        id: "arch-3-5",
        title: "The Hack CPU Datapath: Fetch-Decode-Execute Cycle",
        moduleName: "3. Hack CPU & Instruction Set Architecture",
        readTime: "6 min read",
        summary:
          "The Hack CPU (Nand2Tetris) is a 16-bit computer architecture demonstrating how an ALU, Address Register (A), Data Register (D), and Program Counter (PC) execute instructions.",
        keyInvariants: [
          "A-Instruction (@value): Loads a 15-bit constant into the A-register, used for addressing RAM or setting jump targets.",
          "C-Instruction: Specifies a computation (comp), destination register (dest), and jump condition (jump).",
          "Harvard Memory: Separate Instruction ROM32K (code) and Data RAM16K (data).",
          "Single-Cycle Execution: Every instruction completes in exactly 1 clock cycle.",
        ],
        detailedContent:
          "The Hack Datapath Mechanics:\n1. Instruction Fetch: The Program Counter (PC) outputs an address to Instruction Memory (ROM). The 16-bit instruction word is fetched.\n2. Decode: If MSB is 0, it is an A-instruction, routing the 15-bit value into the A-register. If MSB is 1, it is a C-instruction; control bits configure the ALU.\n3. Execute: The ALU operates on the D-register and either the A-register or memory M (RAM[A]).\n4. Writeback & Jump: Output is written to destination registers (A, D, M). If the jump condition matches ALU flags (Zero, Negative), PC is loaded with A; otherwise, PC increments by 1.",
        diagram: `+-------------------------------------------------------------+
|                     Hack CPU Datapath Flow                  |
+-------------------------------------------------------------+
|    [ ROM Instruction ] ---> Instruction Register             |
|                                |                            |
|             +------------------+------------------+         |
|             | (Opcode = 0: @value)   (Opcode = 1) |         |
|             v                                     v         |
|      [ A-Register ] <--------------------+  [ D-Register ]  |
|             |                            |        |         |
|             v                            |        v         |
|      Mux (A vs RAM[A]) ---------------------> [ ALU ]       |
|                                                   |         |
|                                                   v         |
|      [ Program Counter (PC) ] <------------- Out to Dest    |
+-------------------------------------------------------------+`,
      },
    ],
  },

  // ----------------------------------------------------
  // Module 4: Processor Pipelining & Hazards (6 Topics)
  // ----------------------------------------------------
  {
    id: "arch-mod-4",
    name: "4. Processor Pipelining & Hazards",
    topics: [
      {
        id: "arch-4-1",
        title: "The Classic 5-Stage RISC Pipeline",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "7 min read",
        summary:
          "Pipelining overlaps instruction execution across sequential hardware stages, transforming instruction latency into high execution throughput.",
        keyInvariants: [
          "The 5 Stages: IF (Fetch), ID (Decode & RegRead), EX (Execute / ALU), MEM (Memory Access), WB (Register Writeback).",
          "Pipeline Registers (IF/ID, ID/EX, EX/MEM, MEM/WB) isolate each stage synchronously on clock ticks.",
          "Ideal throughput: CPI = 1.0 (1 completed instruction retired per clock cycle).",
          "Pipelining does NOT decrease the latency of an individual instruction; it increases the throughput of the program.",
        ],
        detailedContent:
          "The 5 Classic RISC Stages:\n1. IF (Instruction Fetch): Send Program Counter (PC) to Instruction Cache, fetch 32-bit instruction, compute PC + 4.\n2. ID (Instruction Decode): Decode opcode, read source registers Rs1 and Rs2 from the Register File, sign-extend immediate fields.\n3. EX (Execute / Address Calculation): ALU operates on operands to compute arithmetic result or effective memory address (Rs1 + offset).\n4. MEM (Data Memory Access): If Load, read data from Data Cache. If Store, write data to Data Cache. Pass ALU results through.\n5. WB (Write Back): Write the final result into destination register Rd in the Register File.",
        diagram: `+-------------------------------------------------------------+
|               Classic 5-Stage RISC CPU Pipeline             |
+-------------------------------------------------------------+
| Clock:  Cycle 1   Cycle 2   Cycle 3   Cycle 4   Cycle 5     |
| Inst 1: [ IF ] -> [ ID ] -> [ EX ] -> [ MEM] -> [ WB  ]     |
| Inst 2:           [ IF ] -> [ ID ] -> [ EX ] -> [ MEM] -> WB|
| Inst 3:                     [ IF ] -> [ ID ] -> [ EX ] -> MEM|
| Inst 4:                               [ IF ] -> [ ID ] -> EX|
| Inst 5:                                         [ IF ] -> ID|
+-------------------------------------------------------------+`,
      },
      {
        id: "arch-4-2",
        title: "Structural Hazards & Resource Arbitration",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "5 min read",
        summary:
          "Structural hazards arise when two concurrent pipeline stages compete for the exact same physical hardware resource in the same clock cycle.",
        keyInvariants: [
          "Unified Memory Conflict: IF stage fetching an instruction while MEM stage reads data from a single memory port.",
          "Register File Port Conflict: Simultaneous reads and writes to the register file.",
          "Solution 1 (Harvard L1): Physically separating L1 Instruction Cache and L1 Data Cache eliminates memory port structural hazards.",
          "Solution 2 (Split Phase Register Clocking): Write to registers during the first half of the clock cycle, read during the second half.",
        ],
        detailedContent:
          "Eliminating Register Port Conflicts:\nIn cycle 5, Instruction 1 is in the WB stage writing to register Rd, while Instruction 4 is in the ID stage reading registers Rs1 and Rs2. By writing on the falling clock edge and reading on the rising edge, the write finishes before the read commences, allowing concurrent 2-read, 1-write access without structural stalls.",
      },
      {
        id: "arch-4-3",
        title: "Data Hazards (RAW, WAR, WAW) & Hardware Forwarding",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "7 min read",
        summary:
          "Data hazards occur when an instruction depends on the result of an earlier instruction that is still in flight. Hardware Forwarding eliminates stalls for ALU operations.",
        keyInvariants: [
          "RAW (Read After Write / True Dependency): Inst 2 needs data before Inst 1 writes it to registers. The only true data hazard in in-order pipelines.",
          "WAR (Write After Read / Anti-Dependency): Inst 2 overwrites a register before Inst 1 reads it. Only occurs in out-of-order execution.",
          "WAW (Write After Write / Output Dependency): Inst 2 writes a register before Inst 1 writes it, leaving stale data. Only in out-of-order execution.",
          "Forwarding / Bypassing routes ALU results directly from EX/MEM or MEM/WB pipeline registers to the ALU input multiplexers.",
        ],
        detailedContent:
          "Hardware Forwarding Solution:\nThe output of the ALU in the EX/MEM pipeline register is wired directly to the multiplexer inputs of the ALU execution stage. The forwarding control unit checks: if (EX/MEM.RegisterRd == ID/EX.RegisterRs1), select the forwarded result rather than the stale value from the register file. This completely eliminates stalls between consecutive ALU instructions!",
      },
      {
        id: "arch-4-4",
        title: "Load-Use Delay Stalls & Compiler Scheduling",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "6 min read",
        summary:
          "A Load instruction receives its data only at the end of the MEM stage. An instruction immediately following that uses the loaded data must stall for 1 cycle.",
        keyInvariants: [
          "Load-Use Hazard requires a mandatory 1-cycle pipeline bubble because data is not available until cycle 4.",
          "Hardware Hazard Detection Unit detects: if (ID/EX.MemRead && (ID/EX.RegisterRd == IF/ID.RegisterRs1)), insert bubble.",
          "A pipeline bubble is inserted by disabling PC and IF/ID register writes and zeroing out ID/EX control signals.",
          "Compiler Instruction Scheduling reorders independent instructions to fill the load-use delay slot, eliminating the bubble.",
        ],
        detailedContent:
          "Compiler Scheduling Example:\nConsider:\n`lw x1, 0(x2)`\n`add x3, x1, x4` (stalls 1 cycle!)\n`addi x6, x7, 10` (independent!)\nAn optimizing compiler reorders the sequence:\n`lw x1, 0(x2)`\n`addi x6, x7, 10` (executes during load latency!)\n`add x3, x1, x4` (x1 is now ready in MEM/WB! Zero stalls!)",
        codeSnippet: {
          language: "asm",
          code: `# Naive code (Causes 1-cycle Load-Use stall)
lw   x1, 0(x2)
add  x3, x1, x4      # STALL 1 CYCLE!

# Compiler optimized code (Zero stalls)
lw   x1, 0(x2)
addi x6, x7, 10      # Fills the delay slot with independent work!
add  x3, x1, x4      # Executes with forwarded data! Zero stall cycles!`,
        },
      },
      {
        id: "arch-4-5",
        title: "Control Hazards & Static Branch Prediction",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "5 min read",
        summary:
          "Conditional branch instructions disrupt the sequential pipeline flow because the branch decision is not known until the ID or EX stage.",
        keyInvariants: [
          "Branch Penalty: If a branch is taken, the instructions fetched in the shadow of the branch must be flushed (converted to NOPs).",
          "Static Prediction (Always Not Taken): Continue fetching PC + 4. If branch is taken, flush 1-2 stages.",
          "Static Prediction (BTFNT): Backward Taken, Forward Not Taken. Loops jump backward (usually taken); error checks jump forward (usually not taken).",
          "Delayed Branch Slots (MIPS): Always execute the single instruction immediately following the branch, regardless of branch outcome.",
        ],
        detailedContent:
          "The Cost of Flushes:\nIn a simple 5-stage pipeline with branch target calculation in the ID stage, a taken branch costs 1 flushed cycle. In a deep modern pipeline (e.g. 15-20 stages), the branch decision is not verified until cycle 15, meaning a mispredicted branch throws away 15 clock cycles of in-flight work!",
      },
      {
        id: "arch-4-6",
        title: "Dynamic Branch Prediction (2-Bit Counters & TAGE)",
        moduleName: "4. Processor Pipelining & Hazards",
        readTime: "6 min read",
        summary:
          "Dynamic branch predictors track historical branch outcomes at runtime using hardware tables, achieving over 97% prediction accuracy.",
        keyInvariants: [
          "1-bit predictor flips on every misprediction, resulting in 2 mispredictions per loop execution.",
          "2-bit Saturating Counter (Strongly Taken, Weakly Taken, Weakly Not Taken, Strongly Not Taken) requires two consecutive mispredictions to flip.",
          "Branch Target Buffer (BTB): Hardware cache indexed by PC that stores the predicted target address of taken branches.",
          "TAGE Predictor: Tagged Geometric History Length predictor, tracking branch history across hundreds of past instructions for >98% accuracy.",
        ],
        detailedContent:
          "2-Bit Counter State Machine:\n- 11: Strongly Taken (predicts Taken)\n- 10: Weakly Taken (predicts Taken)\n- 01: Weakly Not Taken (predicts Not Taken)\n- 00: Strongly Not Taken (predicts Not Taken)\nFor a loop running 100 times, a 2-bit counter only mispredicts once (on the exit loop condition), providing 99% accuracy.",
      },
    ],
  },

  // ----------------------------------------------------
  // Module 5: Memory Hierarchy, Caches & Modern Parallelism (6 Topics)
  // ----------------------------------------------------
  {
    id: "arch-mod-5",
    name: "5. Memory Hierarchy, Caches & Parallelism",
    topics: [
      {
        id: "arch-5-1",
        title: "Memory Hierarchy & Principles of Locality",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "6 min read",
        summary:
          "The Memory Latency Wall separates fast processors from slow main memory. The hierarchy exploits temporal and spatial locality to give the illusion of massive, fast storage.",
        keyInvariants: [
          "Temporal Locality: If an item is referenced, it will tend to be referenced again soon (e.g. loop counters, local variables).",
          "Spatial Locality: If an item is referenced, items with neighboring addresses will tend to be referenced soon (e.g. sequential array traversal).",
          "Hierarchy Latency: Registers (~0.5ns) -> L1 Cache (~1ns) -> L2 Cache (~4ns) -> L3 Cache (~15ns) -> DRAM (~70ns) -> SSD (~20us).",
        ],
        detailedContent:
          "The Memory Wall:\nCPU clock speeds increased by ~50% per year for decades, but DRAM access times only improved by ~7% per year. Without multi-level caches, high-performance processors would spend 95% of their execution time stalled waiting for main memory.",
      },
      {
        id: "arch-5-2",
        title: "Cache Organization: Direct, Set-Associative & Fully Associative",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "7 min read",
        summary:
          "Caches organize data into lines. Address bits are partitioned into Tag, Set Index, and Block Offset to facilitate fast hardware lookups.",
        keyInvariants: [
          "Address Bit Partition: [ Tag | Set Index | Block Offset ].",
          "Block Offset bits = log2(line size). Standard is 64 bytes (6 bits).",
          "Set Index bits = log2(number of sets). Number of sets = Total Cache Size / (Associativity * Line Size).",
          "Tag bits = Total Address Bits - (Index Bits + Offset Bits).",
          "N-Way Set Associative: N cache lines per set, evaluated in parallel by N tag comparators.",
        ],
        detailedContent:
          "Set-Associative Calculation Example:\nGiven a 64-bit physical address, a 64KB 8-Way Set-Associative Cache with 64-byte lines:\n1. Offset bits = log2(64) = 6 bits.\n2. Line size * Ways = 64 * 8 = 512 bytes per set.\n3. Number of sets = 64KB / 512B = 128 sets = 2^7 sets. Index bits = 7 bits.\n4. Tag bits = 64 - (7 + 6) = 51 bits.",
        diagram: `+-------------------------------------------------------------+
|          Cache Address Partitioning (64-bit Address)        |
+-------------------------------------------------------------+
|    [        Tag (51 bits)       ] [ Index (7b) ] [Offset(6b)]|
|                 |                         |           |     |
|                 |                         v           |     |
|                 |                   Selects Set       |     |
|                 v                  (0 to 127)         v     |
|       Compares 8 Tags in Parallel               Selects Byte|
|       +------------------------------------+    within Line |
|       | Way 0 | Way 1 | ... | Way 7 (8-Way)|    (0 to 63)   |
|       +------------------------------------+                |
|                 | -> HIT / MISS Gate                        |
+-------------------------------------------------------------+`,
      },
      {
        id: "arch-5-3",
        title: "Cache Miss Classification (The 3 Cs) & Replacement Policies",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "6 min read",
        summary:
          "Cache misses are classified into Compulsory, Capacity, and Conflict. Replacement algorithms (LRU, PLRU) select which line to evict on a miss.",
        keyInvariants: [
          "Compulsory Miss (Cold): First access to a block. Cannot be avoided without hardware prefetching.",
          "Capacity Miss: The working set exceeds total cache size. Occurs even in fully associative caches.",
          "Conflict Miss: Multiple active memory blocks map to the exact same set, kicking each other out.",
          "LRU (Least Recently Used): Evicts the line unused for the longest time. Stack-based, immune to Belady's anomaly.",
          "Tree-PLRU (Pseudo-LRU): Uses N-1 binary tree bits to approximate LRU with drastically lower hardware silicon area.",
        ],
        detailedContent:
          "The 4th C in Multiprocessors:\nIn multi-core systems, a fourth miss category exists: **Coherence Misses**. These occur when a cache line is invalidated by another core writing to the same address across the shared interconnect.",
      },
      {
        id: "arch-5-4",
        title: "Cache Write Policies: Write-Through vs Write-Back",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "6 min read",
        summary:
          "Write policies determine when modified data is updated in main memory and how write misses are handled.",
        keyInvariants: [
          "Write-Through: Every write immediately updates both the cache line and main memory. Memory bus bottleneck.",
          "Write-Back: Writes update only the cache line, setting a Dirty Bit. Data is written to memory only upon eviction.",
          "Write-Allocate: On write miss, load the block from memory into cache, then perform write (paired with Write-Back).",
          "No-Write-Allocate: On write miss, bypass cache and write directly to memory (paired with Write-Through).",
        ],
        detailedContent:
          "Why Write-Back Dominates:\nA loop updating a local counter 1,000,000 times in a Write-Through cache would issue 1,000,000 memory bus writes, saturating the bus. In a Write-Back cache, it performs 1,000,000 cache writes in L1 and issues exactly ONE memory write when the dirty block is eventually evicted!",
      },
      {
        id: "arch-5-5",
        title: "Multi-Core Cache Coherence & The MESI Protocol",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "7 min read",
        summary:
          "In multi-core processors, each core has a private L1 cache. The MESI protocol guarantees that cores never read stale, inconsistent memory values.",
        keyInvariants: [
          "The 4 MESI States: Modified (dirty, private), Exclusive (clean, private), Shared (clean, shared), Invalid (stale).",
          "Snooping: Every cache controller monitors ('snoops') the shared bus to detect writes by other cores and invalidate its lines.",
          "False Sharing: Independent variables residing on the same 64-byte cache line cause continuous cross-core invalidation storms.",
          "Padding thread-local variables to 64-byte alignment eliminates False Sharing.",
        ],
        detailedContent:
          "False Sharing Demonstration in C:\n```c\nstruct BadCounter {\n    volatile int count_a; // 4 bytes\n    volatile int count_b; // 4 bytes (same 64-byte line -> severe MESI thrashing!)\n};\n\nstruct GoodCounter {\n    volatile int count_a;\n    char pad1[60]; // Pad to 64 bytes\n    volatile int count_b;\n    char pad2[60]; // Pad to 64 bytes\n};\n```",
        codeSnippet: {
          language: "c",
          code: `// False Sharing Demonstration (Multi-threaded performance pitfall)
#include <pthread.h>

// Poor design: Two threads modify adjacent struct members on the SAME 64-byte cache line!
struct BadCounter {
    volatile int count_a; // 4 bytes
    volatile int count_b; // 4 bytes (resides in same 64-byte line -> severe MESI thrashing!)
};

// Optimized design: Pad each variable to occupy its own dedicated 64-byte cache line
struct GoodCounter {
    volatile int count_a;
    char pad1[60]; // Pad to 64 bytes
    volatile int count_b;
    char pad2[60]; // Pad to 64 bytes
};`,
        },
      },
      {
        id: "arch-5-6",
        title: "Advanced Microarchitecture: Superscalar, Out-of-Order & Amdahl's Law",
        moduleName: "5. Memory Hierarchy, Caches & Parallelism",
        readTime: "7 min read",
        summary:
          "Modern processors execute multiple instructions per cycle out-of-order, using Register Renaming and Reorder Buffers. Amdahl's Law sets the theoretical upper bound on multi-core speedup.",
        keyInvariants: [
          "Superscalar: Multiple execution units inside a single core allowing IPC > 1.0.",
          "Register Renaming (RAT) maps architectural registers to a large physical register pool, eliminating false WAR and WAW hazards.",
          "Reorder Buffer (ROB) ensures Out-of-Order execution commits in strict original program order, preserving precise exceptions.",
          "Amdahl's Law: Speedup = 1 / (S + (1 - S) / N). With a 10% serial fraction (S = 0.10), speedup can NEVER exceed 10x.",
        ],
        detailedContent:
          "The Iron Law of Performance:\nExecution Time = Instruction Count * CPI * Clock Period\n- Instruction Count is determined by the compiler optimization flags and ISA efficiency.\n- CPI is determined by the microarchitecture (pipelining, superscalar issue width, cache miss rates).\n- Clock Period is determined by CMOS transistor technology and critical path circuit delays.\n\nAmdahl's Law:\nIf a program is 90% parallelizable and 10% strictly serial:\nEven with 1,000,000 processors, maximum speedup = 1 / 0.10 = 10x!",
        diagram: `+-------------------------------------------------------------+
|        Out-of-Order (OoO) Execution Pipeline Overview       |
+-------------------------------------------------------------+
|  [ In-Order Fetch & Branch Predictor ]                      |
|                  |                                          |
|  [ In-Order Decode & Register Renaming (RAT) ]              |
|                  |                                          |
|  [ Dispatch into Reservation Stations & Reorder Buffer (ROB)]|
|                  | (Dispatches out-of-order when ready)      |
|  +---------------+---------------+---------------+          |
|  | ALU 0         | ALU 1         | Load / Store  |          |
|  +---------------+---------------+---------------+          |
|                  | (Broadcasts result on Common Data Bus)   |
|  [ Reorder Buffer (ROB) In-Order Commit & Retirement ]      |
+-------------------------------------------------------------+`,
      },
    ],
  },
];

// =========================================================================
// REVISE FLASHCARD SECTIONS (5 HIGH-YIELD MODULE SUMMARIES)
// =========================================================================

export const ARCH_REVISE_SECTIONS: ReviseSection[] = [
  {
    title: "1. Digital Logic Foundations",
    summary: "Logic gates, Boolean algebra, K-maps, and 2's complement arithmetic.",
    bullets: [
      "NAND and NOR are Universal Gates. NAND is preferred in silicon due to nMOS electron mobility.",
      "2's Complement: -X = ~X + 1. Overflow occurs iff operands have identical sign but sum has opposite sign.",
      "Ripple Carry has O(N) delay; Carry Lookahead Adder (CLA) achieves O(log N) delay using Generate (G = A·B) and Propagate (P = A⊕B).",
    ],
  },
  {
    title: "2. Sequential Logic, Clocking & Memory",
    summary: "Latches, Flip-Flops, Setup/Hold timing constraints, and SRAM vs DRAM.",
    bullets: [
      "Latches are level-sensitive; Flip-Flops are edge-triggered (Master-Slave D flip-flop).",
      "Setup violation (data late) is solved by reducing clock speed; Hold violation (data too fast) cannot be fixed by clock frequency.",
      "SRAM uses 6 transistors for fast L1/L2 caches (1ns); DRAM uses 1T-1C cell for dense main memory (60ns) and requires periodic refresh every 64ms.",
    ],
  },
  {
    title: "3. Hack CPU & Instruction Set Architecture",
    summary: "ISA contract, RISC vs CISC, instruction formats, and the Hack CPU datapath.",
    bullets: [
      "ISA is the programmer-visible interface (registers, instructions); microarchitecture is the physical silicon implementation.",
      "CISC (x86-64) has variable-length instructions and memory operands; RISC (ARM64, RISC-V) has fixed 32-bit instructions and strict Load/Store architecture.",
      "Hack CPU combines A-register, D-register, ALU, and PC to execute single-cycle instructions on Harvard memory.",
    ],
  },
  {
    title: "4. Processor Pipelining & Hazards",
    summary: "The 5-stage RISC pipeline, Forwarding, and Branch Prediction.",
    bullets: [
      "5 Stages: IF (Fetch), ID (Decode), EX (Execute), MEM (Memory), WB (Writeback). Ideal CPI = 1.0.",
      "Forwarding routes ALU results directly from EX/MEM or MEM/WB to ALU inputs, eliminating RAW data hazards.",
      "Load-Use hazard requires a mandatory 1-cycle stall bubble because data is not ready until the end of MEM.",
      "2-bit saturating counters provide hysteresis; TAGE predictors achieve >98% accuracy on branch history.",
    ],
  },
  {
    title: "5. Memory Hierarchy, Caches & Parallelism",
    summary: "Cache indexing, 3 Cs of misses, MESI protocol, and Out-of-Order execution.",
    bullets: [
      "64-bit address split: [ Tag | Index | Offset ]. Block offset = log2(line size). Set index = log2(num sets).",
      "3 Cs of misses: Compulsory (cold start), Capacity (cache too small), Conflict (collision in same set).",
      "MESI States: Modified (dirty, private), Exclusive (clean, private), Shared (clean, shared), Invalid (stale).",
      "False Sharing is resolved by padding variables to 64-byte alignment.",
      "Amdahl's Law: Speedup = 1 / (S + (1 - S) / N). With a 10% serial fraction, maximum speedup is strictly capped at 10x.",
    ],
  },
];

// =========================================================================
// STAFF-LEVEL RECALL / INTERVIEW QUESTIONS (TOP 10 FREQUENTLY ASKED)
// =========================================================================

export const ARCH_RECALL_QUESTIONS: RecallQuestion[] = [
  {
    id: "arch-rec-1",
    question: "Explain the difference between a Setup Time violation and a Hold Time violation. Which one can be resolved by reducing the clock frequency?",
    difficulty: "Essential",
    topics: ["Timing", "Flip-Flops", "Clocking"],
    modelAnswer:
      "Setup Time (t_setup) is the minimum time data must remain stable BEFORE the active clock edge. A Setup violation occurs when the combinational delay plus clock-to-q delay is too large: t_cq + t_comb + t_setup > T_clk. This CAN be resolved by increasing the clock period (i.e. reducing the clock frequency).\n\nHold Time (t_hold) is the minimum time data must remain stable AFTER the active clock edge. A Hold violation occurs when the minimum combinational delay is too short: t_cq + t_comb,min < t_hold. This causes new data to overwrite old data before it has been properly latched. Because clock period (T_clk) does not appear in the hold equation, hold violations CANNOT be fixed by changing the clock frequency; they require physically inserting delay buffers into the silicon datapath.",
    keyTakeaway:
      "Setup violations are frequency-dependent (solvable by underclocking); Hold violations are frequency-independent (catastrophic silicon design bugs).",
  },
  {
    id: "arch-rec-2",
    question: "Why do modern x86 microprocessors translate instructions into micro-ops (uops) rather than executing them directly?",
    difficulty: "Very High",
    topics: ["ISA", "CISC vs RISC", "Microarchitecture"],
    modelAnswer:
      "x86 instructions have legacy variable lengths (1 to 15 bytes), multiple addressing modes, and allow direct memory modification in arithmetic operations (e.g. `add [rax], rbx`). Pipelining and out-of-order execution require uniform, predictable instruction shapes.\n\nModern Intel and AMD processors decouple the software-facing ISA from the execution microarchitecture. The hardware frontend decodes complex variable-length x86 instructions into simple, fixed-length, RISC-like micro-operations (uops). Simple instructions translate to a single uop (1:1), while complex instructions invoke an on-chip Microcode ROM to emit multiple uops. These uops then flow into an ultra-fast, superscalar, out-of-order execution engine.",
    keyTakeaway:
      "x86 is an external backwards-compatible software veneer; underneath, the CPU is an aggressive, superscalar RISC micro-op machine.",
  },
  {
    id: "arch-rec-3",
    question: "How does Hardware Operand Forwarding (Bypassing) resolve RAW data hazards, and why can it not eliminate the Load-Use hazard?",
    difficulty: "Essential",
    topics: ["Pipelining", "Hazards", "Forwarding"],
    modelAnswer:
      "In a 5-stage pipeline, an ALU instruction produces its result at the end of the EX stage (cycle 3), but does not write it to the register file until the WB stage (cycle 5). An instruction immediately following needs that value at its EX stage (cycle 3).\n\nForwarding resolves this by adding multiplexers at the ALU inputs connected directly to the EX/MEM and MEM/WB pipeline registers. The Forwarding Unit detects when the destination register of an in-flight instruction matches a source register of the current instruction and routes the fresh result directly into the ALU input, eliminating stalls.\n\nHowever, a Load instruction does not receive its data from the cache until the END of the MEM stage (cycle 4). If the very next instruction requires that loaded data in its EX stage (cycle 3), hardware cannot forward backwards in time. Therefore, the hazard detection unit must insert a mandatory 1-cycle pipeline bubble.",
    keyTakeaway:
      "Forwarding forwards across hardware stages in real time; it cannot forward data before it has physically arrived from memory.",
  },
  {
    id: "arch-rec-4",
    question: "Given a 64-bit physical address, a 64 KB 8-Way Set-Associative Cache with 64-byte lines, calculate the number of Tag, Index, and Offset bits.",
    difficulty: "Essential",
    topics: ["Cache", "Set-Associative", "Address Partitioning"],
    modelAnswer:
      "1. Block Offset Bits:\nLine size = 64 bytes = 2^6 bytes. Therefore, Offset = 6 bits.\n\n2. Number of Sets:\nCache Capacity = 64 KB = 65,536 bytes.\nSize per Set = 8 ways * 64 bytes/line = 512 bytes per set.\nNumber of Sets = 65,536 / 512 = 128 sets = 2^7 sets.\nTherefore, Set Index = 7 bits.\n\n3. Tag Bits:\nTotal address bits = 64 bits.\nTag Bits = 64 - (Index + Offset) = 64 - (7 + 6) = 64 - 13 = 51 bits.\n\nPartition: [ Tag: 51 bits | Index: 7 bits | Offset: 6 bits ].",
    keyTakeaway:
      "Always follow the 3-step formula: Offset = log2(line_size), Sets = Total_Size / (Ways * line_size), Tag = Total_Bits - (Index + Offset).",
  },
  {
    id: "arch-rec-5",
    question: "What is False Sharing in multi-threaded programming, and how does the MESI cache coherence protocol cause severe performance degradation?",
    difficulty: "Very High",
    topics: ["Cache Coherence", "MESI", "Multi-threading"],
    modelAnswer:
      "False Sharing occurs when two threads running on different CPU cores modify independent variables that happen to reside within the SAME 64-byte cache line.\n\nUnder the MESI protocol, cache coherence operates with 64-byte line granularity, not individual variable granularity. When Core 0 writes to variable A, it broadcasts an Invalidate across the inter-core interconnect, forcing Core 1's cache line to the Invalid (I) state. When Core 1 writes to variable B, it must re-fetch the entire cache line from Core 0 and invalidate Core 0's line. The cache line ping-pongs between cores constantly, causing massive memory bus traffic and stall cycles even though the threads never access the same variable.",
    keyTakeaway:
      "False Sharing is resolved by aligning and padding thread-local variables to 64-byte boundaries (e.g. `alignas(64)` in C++11).",
  },
  {
    id: "arch-rec-6",
    question: "Explain the role of the Reorder Buffer (ROB) in an Out-of-Order CPU. Why is in-order retirement mandatory for precise exceptions?",
    difficulty: "High",
    topics: ["Out-of-Order", "ROB", "Exceptions"],
    modelAnswer:
      "In an Out-of-Order (OoO) processor, instructions execute as soon as their inputs are ready, which can be completely out of original program order. However, software expects sequential execution semantics.\n\nThe Reorder Buffer (ROB) is a circular FIFO queue that tracks instructions in strict program order from the decode stage until retirement. While instructions execute and write results to physical registers out of order, they only update the software-visible architectural register file when they reach the HEAD of the ROB (in-order retirement).\n\nThis is mandatory for Precise Exceptions: If instruction N causes an exception (e.g. page fault, division by zero), the CPU must guarantee that all instructions prior to N have completed, and no instruction after N has modified the architectural state. In-order retirement allows the CPU to simply flush the ROB on an exception without corrupting program state.",
    keyTakeaway:
      "Execute out-of-order for speed; commit in-order through the ROB for software correctness and precise exception handling.",
  },
  {
    id: "arch-rec-7",
    question: "What is the difference between Write-Through and Write-Back caches? When would you use Write-Allocate vs No-Write-Allocate?",
    difficulty: "High",
    topics: ["Cache", "Write Policies", "Memory"],
    modelAnswer:
      "Write-Through: Every write to the cache is simultaneously propagated to main memory. Pro: Main memory is always consistent, simpler cache controllers. Con: Consumes high memory bus bandwidth and slows down write-heavy loops.\n\nWrite-Back: Writes only update the cache line in the processor cache. The cache controller sets a 'Dirty Bit'. The data is written back to main memory ONLY when the dirty cache line is evicted. Pro: Saves massive memory bus bandwidth. Con: More complex cache coherence (memory is temporarily stale).\n\nWrite-Allocate vs No-Write-Allocate (on a write miss):\n- Write-Allocate: Fetch the missing line from memory into the cache, then perform the write. Paired with Write-Back caches because subsequent writes will hit in the cache.\n- No-Write-Allocate: Bypass the cache and write directly to memory. Paired with Write-Through caches.",
    keyTakeaway:
      "Write-Back + Write-Allocate is the industry standard for L1/L2 caches; Write-Through is used in graphics framebuffers and specialized embedded systems.",
  },
  {
    id: "arch-rec-8",
    question: "A program has 90% parallel code and 10% strictly serial code. According to Amdahl's Law, what is the maximum theoretical speedup with 8 cores? With infinite cores?",
    difficulty: "Essential",
    topics: ["Amdahl's Law", "Parallelism", "Performance"],
    modelAnswer:
      "Amdahl's Law formula: Speedup = 1 / (S + (1 - S) / N)\nHere, S = 0.10 (serial fraction) and (1 - S) = 0.90 (parallel fraction).\n\n1. For N = 8 cores:\nSpeedup = 1 / (0.10 + 0.90 / 8) = 1 / (0.10 + 0.1125) = 1 / 0.2125 ≈ 4.706x speedup.\n\n2. For N = infinite cores (as N -> infinity, (1 - S)/N -> 0):\nSpeedup = 1 / S = 1 / 0.10 = 10x maximum theoretical speedup.\n\nEven with an infinite number of processors, the maximum achievable speedup is strictly bounded by 10x due to the 10% serial bottleneck.",
    keyTakeaway:
      "Amdahl's Law reveals that parallel speedup is fundamentally limited by the serial portion of the workload, not by core count.",
  },
  {
    id: "arch-rec-9",
    question: "What is the Von Neumann Bottleneck, and how does the Harvard architecture mitigate it inside modern CPU L1 caches?",
    difficulty: "High",
    topics: ["Von Neumann", "Harvard", "L1 Cache"],
    modelAnswer:
      "The Von Neumann architecture uses a shared system bus and unified memory space for both program instructions and program data. The Von Neumann Bottleneck arises because the CPU cannot simultaneously fetch an instruction and read/write data from memory in the same clock cycle, limiting throughput.\n\nModern microprocessors adopt a Modified Harvard Architecture: while external main memory (DRAM) remains unified under the Von Neumann model for programmer convenience, the internal CPU L1 cache is physically split into a dedicated L1 Instruction Cache (L1-I) and a dedicated L1 Data Cache (L1-D). The Instruction Fetch (IF) stage accesses L1-I simultaneously while the Memory (MEM) stage accesses L1-D, eliminating the structural hazard and doubling bandwidth.",
    keyTakeaway:
      "Modern CPUs are Harvard on the inside (split L1-I and L1-D caches) and Von Neumann on the outside (unified DRAM memory address space).",
  },
  {
    id: "arch-rec-10",
    question: "Why did processor clock frequency scaling (Dennard Scaling) stall in the mid-2000s, initiating the multi-core era?",
    difficulty: "Very High",
    topics: ["Dennard Scaling", "Power Wall", "Multi-core"],
    modelAnswer:
      "Dennard Scaling (1974) observed that as transistors shrink in physical dimensions, their power density remains constant because voltage and capacitance scale down proportionally: P = C * V^2 * f.\n\nIn the mid-2000s, transistor gate oxide layers reached single-nanometer atomic thicknesses, causing massive sub-threshold leakage current. Voltage (V) could no longer be reduced without causing switching instability. As a result, increasing clock frequency (f) beyond 3-4 GHz caused power dissipation and heat density to explode exponentially (the 'Power Wall'). Chip dies would melt if pushed to 10 GHz.\n\nTo continue improving performance per watt within the thermal envelope (~100-150W), chipmakers pivoted from pushing single-thread clock frequencies to placing multiple power-efficient cores on a single silicon die (Multi-Core era).",
    keyTakeaway:
      "The breakdown of Dennard Scaling and the Power Wall ended the gigahertz race and gave birth to multi-core, parallel computing.",
  },
];
