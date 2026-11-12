// Comprehensive Sub-Methods Data for all 18 DSA Roadmap Levels
import { LeetCodeProblem } from "./dsaRoadmap";

export type VisualizerEngineType =
  | "sorting"
  | "tree"
  | "graph"
  | "linear"
  | "stack"
  | "queue"
  | "hashing"
  | "dp";

export interface SubMethodData {
  id: string;
  parentLevelId: number;
  subNumber: number;
  title: string;
  shortTitle: string;
  tag: "CORE" | "EASY" | "MEDIUM" | "HARD";
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  keyInvariants: string[];
  youtubeVideoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDuration: string;
  studyResources: {
    overview: string;
    pseudocode?: string;
    codeSnippet?: {
      language: string;
      code: string;
    };
    pitfalls: string[];
  };
  problems: LeetCodeProblem[];
  visualizerType: VisualizerEngineType;
  visualizerAlgorithm?: string;
}

export const LEVEL_SUB_METHODS: Record<number, SubMethodData[]> = {
  // ==========================================
  // LEVEL 1: LANGUAGE FOUNDATIONS
  // ==========================================
  1: [
    {
      id: "lang-stack-heap",
      parentLevelId: 1,
      subNumber: 1,
      title: "Memory Stack vs Heap Allocation",
      shortTitle: "Stack vs Heap",
      tag: "CORE",
      description: "Understand contiguous stack frames for local primitives vs dynamically allocated heap memory, pointers, and memory fragmentation.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      spaceComplexity: "O(1) stack frame",
      keyInvariants: [
        "Stack allocation is deterministic and managed by the CPU instruction pointer.",
        "Heap allocation requires memory management (malloc/free, garbage collection) and introduces cache indirection.",
      ],
      youtubeVideoId: "_8-ht2AKyH4",
      videoTitle: "Stack vs Heap Memory Allocation",
      videoChannel: "Computerphile",
      videoDuration: "11:20",
      studyResources: {
        overview: "Stack memory holds fast local execution frames. Heap stores variable-length objects. Cache misses in heap memory are a primary factor in real-world algorithm latency.",
        pseudocode: "// C++ Example\nint stackVar = 42; // Fast stack frame\nint* heapVar = new int(42); // Heap allocated with pointer overhead\ndelete heapVar;",
        codeSnippet: {
          language: "cpp",
          code: `#include <iostream>\n\nstruct Node {\n    int val;\n    Node* next;\n};\n\nint main() {\n    // Stack frame allocation\n    int localVal = 100;\n    // Heap dynamic allocation\n    Node* node = new Node{localVal, nullptr};\n    delete node;\n    return 0;\n}`,
        },
        pitfalls: ["Dangling pointers when accessing stack memory after frame pops", "Memory leaks from missing deallocations"],
      },
      problems: [
        { id: 1929, title: "Concatenation of Array", slug: "concatenation-of-array", difficulty: "Easy", tags: ["Array", "Memory"], url: "https://leetcode.com/problems/concatenation-of-array/" },
        { id: 1470, title: "Shuffle the Array", slug: "shuffle-the-array", difficulty: "Easy", tags: ["Array"], url: "https://leetcode.com/problems/shuffle-the-array/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "memory_layout",
    },
    {
      id: "lang-pointers",
      parentLevelId: 1,
      subNumber: 2,
      title: "Pointers & Reference Semantics",
      shortTitle: "Pointers & Refs",
      tag: "CORE",
      description: "Direct memory addresses, pointer arithmetic, pass-by-value vs pass-by-reference across C++, Java, and Python.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "Pointers store numeric hexadecimal addresses pointing to virtual memory.",
        "Pass-by-reference avoids copying large structures, giving O(1) invocation overhead.",
      ],
      youtubeVideoId: "2ybLD6_2gKM",
      videoTitle: "Pointers in C / C++ [Full Course]",
      videoChannel: "freeCodeCamp.org",
      videoDuration: "3:47:00",
      studyResources: {
        overview: "Understanding how references mutate structures under the hood prevents accidental object cloning or unintended side effects.",
        pitfalls: ["Null pointer dereferences", "Modifying shared references without synchronization"],
      },
      problems: [
        { id: 1920, title: "Build Array from Permutation", slug: "build-array-from-permutation", difficulty: "Easy", tags: ["Array"], url: "https://leetcode.com/problems/build-array-from-permutation/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "pointers",
    },
    {
      id: "lang-containers",
      parentLevelId: 1,
      subNumber: 3,
      title: "Standard Library Containers (STL / Collections)",
      shortTitle: "STL Containers",
      tag: "CORE",
      description: "Time and space guarantees for std::vector, ArrayList, std::unordered_map, and Python list / dict.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Dynamic array resizing doubles capacity, amortizing append to O(1).",
        "Hash collections provide average O(1) lookup with worst-case O(N) on hash collisions.",
      ],
      youtubeVideoId: "PocJ5jXRhQ0",
      videoTitle: "C++ STL Full Tutorial",
      videoChannel: "freeCodeCamp.org",
      videoDuration: "1:42:00",
      studyResources: {
        overview: "Interviewers look for precise knowledge of library container overheads, amortized insertions, and iterator invalidation rules.",
        pitfalls: ["Inserting into the front of a vector/list causes an O(N) memory shift", "Iterator invalidation on capacity resize"],
      },
      problems: [
        { id: 217, title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", tags: ["Array", "Hash Table"], url: "https://leetcode.com/problems/contains-duplicate/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "containers",
    },
  ],

  // ==========================================
  // LEVEL 2: COMPLEXITY ANALYSIS
  // ==========================================
  2: [
    {
      id: "comp-big-o",
      parentLevelId: 2,
      subNumber: 1,
      title: "Big-O Asymptotic Upper Bounds",
      shortTitle: "Big-O Notation",
      tag: "CORE",
      description: "Formal definition of Big-O, Big-Omega, Big-Theta, and ranking standard growth rates from O(1) to O(N!).",
      timeComplexity: { best: "O(1)", average: "O(N log N)", worst: "O(2^N)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "Big-O bounds worst-case behavior asymptotically as input N approaches infinity.",
        "Drop non-dominant lower terms and multiplicative constant coefficients.",
      ],
      youtubeVideoId: "__vX2ksORPE",
      videoTitle: "Big O Notation Tutorial - A Guide for Beginners",
      videoChannel: "freeCodeCamp.org",
      videoDuration: "18:24",
      studyResources: {
        overview: "Mastering growth hierarchies: O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N) < O(N!).",
        pitfalls: ["Confusing average case with worst case", "Ignoring recursive call stack auxiliary space"],
      },
      problems: [
        { id: 136, title: "Single Number", slug: "single-number", difficulty: "Easy", tags: ["Bit Manipulation"], url: "https://leetcode.com/problems/single-number/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "complexity",
    },
    {
      id: "comp-amortized",
      parentLevelId: 2,
      subNumber: 2,
      title: "Amortized Analysis & Dynamic Resizing",
      shortTitle: "Amortized Analysis",
      tag: "CORE",
      description: "The accounting and potential methods showing why dynamic array appends cost O(1) on average despite O(N) copies.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "A sequence of K appends on an array that doubles costs <= 3K operations total.",
        "Occasional expensive reallocations are amortized over previous cheap insertions.",
      ],
      youtubeVideoId: "B3SpQZaAZP4",
      videoTitle: "Amortized Analysis Explained",
      videoChannel: "MIT OpenCourseWare",
      videoDuration: "48:15",
      studyResources: {
        overview: "Used whenever an operation is occasionally O(N) but overwhelmingly O(1) in a loop.",
        pitfalls: ["Assuming amortized O(1) guarantees low worst-case latency in hard real-time systems"],
      },
      problems: [
        { id: 232, title: "Implement Queue using Stacks", slug: "implement-queue-using-stacks", difficulty: "Easy", tags: ["Stack", "Design"], url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "amortized",
    },
  ],

  // ==========================================
  // LEVEL 3: ARRAYS
  // ==========================================
  3: [
    {
      id: "array-two-pointers",
      parentLevelId: 3,
      subNumber: 1,
      title: "Two Pointers Technique",
      shortTitle: "Two Pointers",
      tag: "EASY",
      description: "Opposite directional and same directional pointers to reduce nested O(N^2) scans to linear O(N) passes.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "In a sorted array, moving the left pointer increases the sum; moving right pointer decreases it.",
        "Both pointers traverse at most N elements total.",
      ],
      youtubeVideoId: "-gjxg6Pln50",
      videoTitle: "Two Pointers Technique - Solving LeetCode Problems",
      videoChannel: "NeetCode",
      videoDuration: "14:30",
      studyResources: {
        overview: "The quintessential array optimization: replaces nested loops with converging pointers on sorted arrays.",
        pseudocode: "left = 0, right = n - 1\nwhile left < right:\n    curr = nums[left] + nums[right]\n    if curr == target: return [left, right]\n    if curr < target: left += 1\n    else: right -= 1",
        pitfalls: ["Off-by-one pointer bounds", "Applying two pointers on unsorted data without sorting first"],
      },
      problems: [
        { id: 167, title: "Two Sum II - Input Array Is Sorted", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", tags: ["Array", "Two Pointers"], url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { id: 26, title: "Remove Duplicates from Sorted Array", slug: "remove-duplicates-from-sorted-array", difficulty: "Easy", tags: ["Array", "Two Pointers"], url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "two_pointers",
    },
    {
      id: "array-sliding-window",
      parentLevelId: 3,
      subNumber: 2,
      title: "Sliding Window Pattern",
      shortTitle: "Sliding Window",
      tag: "MEDIUM",
      description: "Fixed and dynamic size contiguous windows maintaining state properties with linear expansion and contraction.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1) to O(K)",
      keyInvariants: [
        "Right pointer expands window to satisfy condition; left pointer contracts window to find minimal/maximal valid bound.",
        "Each element enters and leaves the window at most once.",
      ],
      youtubeVideoId: "jM2dhDPYMQM",
      videoTitle: "Sliding Window Algorithm - Computer Science",
      videoChannel: "freeCodeCamp.org",
      videoDuration: "19:40",
      studyResources: {
        overview: "Crucial pattern for continuous subarray and substring problems requiring minimum, maximum, or exact targets.",
        pitfalls: ["Contracting left pointer past right pointer", "Failing to update state incrementally"],
      },
      problems: [
        { id: 209, title: "Minimum Size Subarray Sum", slug: "minimum-size-subarray-sum", difficulty: "Medium", tags: ["Array", "Sliding Window"], url: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "sliding_window",
    },
    {
      id: "array-prefix-sum",
      parentLevelId: 3,
      subNumber: 3,
      title: "Prefix Sum & Difference Arrays",
      shortTitle: "Prefix Sum",
      tag: "EASY",
      description: "Precomputing cumulative sums to answer range query sum queries in O(1) time and range updates in O(1).",
      timeComplexity: { best: "O(N) build, O(1) query", average: "O(1) query", worst: "O(1) query" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Range sum query: sum(L, R) = prefix[R + 1] - prefix[L].",
        "Range add update: diff[L] += val, diff[R + 1] -= val.",
      ],
      youtubeVideoId: "pVS3yhlzrlQ",
      videoTitle: "Prefix Sum Explained with Examples",
      videoChannel: "NeetCode",
      videoDuration: "12:10",
      studyResources: {
        overview: "Precomputes cumulative running metrics to convert repetitive O(N) range evaluations into single subtraction operations.",
        pitfalls: ["Off-by-one 1-indexed prefix array sizing", "Integer overflow on large prefix sums"],
      },
      problems: [
        { id: 303, title: "Range Sum Query - Immutable", slug: "range-sum-query-immutable", difficulty: "Easy", tags: ["Array", "Design"], url: "https://leetcode.com/problems/range-sum-query-immutable/" },
        { id: 560, title: "Subarray Sum Equals K", slug: "subarray-sum-equals-k", difficulty: "Medium", tags: ["Array", "Hash Table", "Prefix Sum"], url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "prefix_sum",
    },
    {
      id: "array-kadane",
      parentLevelId: 3,
      subNumber: 4,
      title: "Kadane's Maximum Subarray Algorithm",
      shortTitle: "Kadane's Algorithm",
      tag: "MEDIUM",
      description: "Linear dynamic programming algorithm to determine the contiguous subarray with the largest sum.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "At step i, maxEndingHere = max(nums[i], maxEndingHere + nums[i]).",
        "If running sum drops below zero, reset current sum to current element.",
      ],
      youtubeVideoId: "5WZl3MMT0Eg",
      videoTitle: "Maximum Subarray - Kadane's Algorithm",
      videoChannel: "NeetCode",
      videoDuration: "08:45",
      studyResources: {
        overview: "Solves the maximum contiguous subarray problem in a single pass O(N) with O(1) memory.",
        pitfalls: ["Initializing max to 0 when all array elements are negative", "Returning empty subarray when at least one element is required"],
      },
      problems: [
        { id: 53, title: "Maximum Subarray", slug: "maximum-subarray", difficulty: "Medium", tags: ["Array", "Divide and Conquer", "Dynamic Programming"], url: "https://leetcode.com/problems/maximum-subarray/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "kadane",
    },
  ],

  // ==========================================
  // LEVEL 4: STRINGS
  // ==========================================
  4: [
    {
      id: "string-palindrome",
      parentLevelId: 4,
      subNumber: 1,
      title: "Palindrome Verification & Center Expansion",
      shortTitle: "Palindromes",
      tag: "EASY",
      description: "Verifying symmetric sequences using converging two pointers and expanding around 2N - 1 center seeds.",
      timeComplexity: { best: "O(N)", average: "O(N^2) expansion", worst: "O(N^2)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "A string is a palindrome if S[i] == S[N - 1 - i] for all 0 <= i < N / 2.",
        "Every palindrome has either an odd single-character center or an even two-character center.",
      ],
      youtubeVideoId: "XYQecbcd6_c",
      videoTitle: "Longest Palindromic Substring",
      videoChannel: "NeetCode",
      videoDuration: "13:22",
      studyResources: {
        overview: "Expanding around centers solves palindrome substring problems cleanly without complex suffix trees.",
        pitfalls: ["Forgetting even-length palindrome centers", "Improper character filtering on non-alphanumeric input"],
      },
      problems: [
        { id: 125, title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", tags: ["Two Pointers", "String"], url: "https://leetcode.com/problems/valid-palindrome/" },
        { id: 5, title: "Longest Palindromic Substring", slug: "longest-palindromic-substring", difficulty: "Medium", tags: ["Two Pointers", "String", "Dynamic Programming"], url: "https://leetcode.com/problems/longest-palindromic-substring/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "palindrome",
    },
    {
      id: "string-kmp",
      parentLevelId: 4,
      subNumber: 2,
      title: "Knuth-Morris-Pratt (KMP) & Prefix Function",
      shortTitle: "KMP Algorithm",
      tag: "HARD",
      description: "String matching in O(N + M) by precomputing the Longest Prefix Suffix (LPS) array to avoid re-examining characters.",
      timeComplexity: { best: "O(N + M)", average: "O(N + M)", worst: "O(N + M)" },
      spaceComplexity: "O(M) for LPS table",
      keyInvariants: [
        "LPS[i] stores the length of the longest proper prefix of pattern[0..i] that is also a suffix of pattern[0..i].",
        "On character mismatch, backtrack pattern index j to LPS[j - 1] rather than resetting text index i.",
      ],
      youtubeVideoId: "JoF0Z7nVSrA",
      videoTitle: "Knuth–Morris–Pratt (KMP) Algorithm",
      videoChannel: "Abdul Bari",
      videoDuration: "35:10",
      studyResources: {
        overview: "KMP guarantees linear string search without backtracking the text index, making it ideal for streaming inputs.",
        pitfalls: ["Incorrectly building the 0-indexed LPS array", "Incrementing both pointers on mismatch"],
      },
      problems: [
        { id: 28, title: "Find the Index of the First Occurrence in a String", slug: "find-the-index-of-the-first-occurrence-in-a-string", difficulty: "Easy", tags: ["Two Pointers", "String", "String Matching"], url: "https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "kmp",
    },
  ],

  // ==========================================
  // LEVEL 5: HASHING
  // ==========================================
  5: [
    {
      id: "hash-maps-sets",
      parentLevelId: 5,
      subNumber: 1,
      title: "Hash Tables, Buckets & Collision Resolution",
      shortTitle: "Collision Chaining",
      tag: "CORE",
      description: "Hash functions, load factor thresholds, separate chaining with linked lists/red-black trees vs open addressing.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Bucket index = hash(key) mod capacity.",
        "When load factor exceeds threshold (typically 0.75), array doubles and all entries are re-hashed.",
      ],
      youtubeVideoId: "shs0KM3wKv8",
      videoTitle: "Hash Tables and Hash Functions",
      videoChannel: "Computerphile",
      videoDuration: "12:45",
      studyResources: {
        overview: "Hash tables power instant O(1) lookups. Modern Java HashMaps convert linked chains to Red-Black trees when bucket length exceeds 8.",
        pitfalls: ["Ignoring mutable objects used as hash keys", "Degrading to O(N) due to poor hash functions with high collisions"],
      },
      problems: [
        { id: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy", tags: ["Array", "Hash Table"], url: "https://leetcode.com/problems/two-sum/" },
      ],
      visualizerType: "hashing",
      visualizerAlgorithm: "chaining",
    },
    {
      id: "hash-frequency",
      parentLevelId: 5,
      subNumber: 2,
      title: "Frequency Counting & Anagram Matching",
      shortTitle: "Frequency Maps",
      tag: "EASY",
      description: "Using frequency histograms to solve anagrams, character frequency checks, and subarray matching in linear time.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1) alphabet size or O(K)",
      keyInvariants: [
        "Two strings are anagrams if and only if their character count vectors are identical.",
      ],
      youtubeVideoId: "9UtInBqnCgA",
      videoTitle: "Valid Anagram - LeetCode 242",
      videoChannel: "NeetCode",
      videoDuration: "07:15",
      studyResources: {
        overview: "Fixed 26-element integer arrays frequently outperform full HashMaps for lowercase ASCII character histograms.",
        pitfalls: ["Creating full hash maps when a fixed 26-int array provides O(1) space and zero allocation overhead"],
      },
      problems: [
        { id: 242, title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy", tags: ["Hash Table", "String", "Sorting"], url: "https://leetcode.com/problems/valid-anagram/" },
        { id: 49, title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium", tags: ["Array", "Hash Table", "String"], url: "https://leetcode.com/problems/group-anagrams/" },
      ],
      visualizerType: "hashing",
      visualizerAlgorithm: "frequency",
    },
  ],

  // ==========================================
  // LEVEL 6: BINARY SEARCH
  // ==========================================
  6: [
    {
      id: "bs-standard",
      parentLevelId: 6,
      subNumber: 1,
      title: "Standard Binary Search & Mid Overflow Prevention",
      shortTitle: "Binary Search",
      tag: "EASY",
      description: "Logarithmic search on monotonic sorted arrays, computing mid = low + (high - low) / 2 to avoid integer overflow.",
      timeComplexity: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "Search space reduces by exactly half at every iteration.",
        "Candidate solution is guaranteed to lie within [low, high].",
      ],
      youtubeVideoId: "s4D9ydZScGk",
      videoTitle: "Binary Search Algorithm - Step-by-Step",
      videoChannel: "NeetCode",
      videoDuration: "09:30",
      studyResources: {
        overview: "The gold standard for O(log N) searches. Invariant bounds (low <= high vs low < high) must match loop termination conditions.",
        pseudocode: "low = 0, high = n - 1\nwhile low <= high:\n    mid = low + (high - low) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1\nreturn -1",
        pitfalls: ["Integer overflow on (low + high) / 2 in C++ and Java", "Infinite loop when low and high do not advance"],
      },
      problems: [
        { id: 704, title: "Binary Search", slug: "binary-search", difficulty: "Easy", tags: ["Array", "Binary Search"], url: "https://leetcode.com/problems/binary-search/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "binary_search",
    },
    {
      id: "bs-rotated",
      parentLevelId: 6,
      subNumber: 2,
      title: "Search in Rotated Sorted Array",
      shortTitle: "Rotated Array",
      tag: "MEDIUM",
      description: "Identifying which half of a circularly shifted array is monotonically sorted, then pruning the search space.",
      timeComplexity: { best: "O(1)", average: "O(log N)", worst: "O(log N)" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "In any rotated sorted array, splitting at mid yields at least one perfectly sorted half.",
        "Check if target falls within the bounds of the sorted half to discard the other half.",
      ],
      youtubeVideoId: "U8XENwh8Oy8",
      videoTitle: "Search in Rotated Sorted Array - LeetCode 33",
      videoChannel: "NeetCode",
      videoDuration: "14:15",
      studyResources: {
        overview: "Fundamental interview test of binary search mastery: determines the monotonically increasing partition before branching.",
        pitfalls: ["Failing to handle arrays containing duplicate elements without falling back to O(N)"],
      },
      problems: [
        { id: 33, title: "Search in Rotated Sorted Array", slug: "search-in-rotated-sorted-array", difficulty: "Medium", tags: ["Array", "Binary Search"], url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { id: 153, title: "Find Minimum in Rotated Sorted Array", slug: "find-minimum-in-rotated-sorted-array", difficulty: "Medium", tags: ["Array", "Binary Search"], url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "rotated_bs",
    },
    {
      id: "bs-answer",
      parentLevelId: 6,
      subNumber: 3,
      title: "Binary Search on Answer / Optimization Spaces",
      shortTitle: "BS on Answer",
      tag: "MEDIUM",
      description: "Searching monotonic predicate feasibility functions f(k) to find minimum valid speeds, capacities, or limits.",
      timeComplexity: { best: "O(N log(Range))", average: "O(N log(Range))", worst: "O(N log(Range))" },
      spaceComplexity: "O(1)",
      keyInvariants: [
        "If speed k is feasible, all speeds > k are also feasible (monotonicity).",
      ],
      youtubeVideoId: "U2SozAs9RzA",
      videoTitle: "Koko Eating Bananas - LeetCode 875",
      videoChannel: "NeetCode",
      videoDuration: "12:40",
      studyResources: {
        overview: "Whenever asked to find the 'minimum capacity' or 'maximum threshold' subject to constraints, verify if the feasibility check is monotonic.",
        pitfalls: ["Setting search space range bounds too narrow", "Non-monotonic feasibility function"],
      },
      problems: [
        { id: 875, title: "Koko Eating Bananas", slug: "koko-eating-bananas", difficulty: "Medium", tags: ["Array", "Binary Search"], url: "https://leetcode.com/problems/koko-eating-bananas/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "bs_answer",
    },
  ],

  // ==========================================
  // LEVEL 7: SORTING (ALL 6 METHODS)
  // ==========================================
  7: [
    {
      id: "sorting-selection",
      parentLevelId: 7,
      subNumber: 1,
      title: "Selection Sort Algorithm",
      shortTitle: "Selection Sort",
      tag: "EASY",
      description: "Repeatedly find the minimum element from the unsorted suffix and swap it into the sorted prefix. Performs minimal memory writes.",
      timeComplexity: { best: "O(N^2)", average: "O(N^2)", worst: "O(N^2)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "Prefix arr[0..i-1] is completely sorted and contains the smallest i elements in the array.",
        "Total swaps is bounded by exactly N - 1 writes.",
      ],
      youtubeVideoId: "g-PGLbMth_g",
      videoTitle: "Selection Sort Algorithm Explained",
      videoChannel: "GeeksforGeeks",
      videoDuration: "08:12",
      studyResources: {
        overview: "Selection Sort scans the remaining unsorted subarray for the minimum element and places it at the current index. Useful when memory write operations are extremely expensive (e.g., EEPROM/Flash memory).",
        pseudocode: "for i = 0 to n - 2:\n    min_idx = i\n    for j = i + 1 to n - 1:\n        if arr[j] < arr[min_idx]:\n            min_idx = j\n    swap(arr[i], arr[min_idx])",
        codeSnippet: {
          language: "cpp",
          code: `void selectionSort(std::vector<int>& arr) {\n    int n = arr.size();\n    for (int i = 0; i < n - 1; ++i) {\n        int minIdx = i;\n        for (int j = i + 1; j < n; ++j) {\n            if (arr[j] < arr[minIdx]) minIdx = j;\n        }\n        std::swap(arr[i], arr[minIdx]);\n    }\n}`,
        },
        pitfalls: ["Selection Sort is inherently UNSTABLE (can jump identical keys)", "Always requires O(N^2) comparisons even if array is already sorted"],
      },
      problems: [
        { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium", tags: ["Array", "Sorting"], url: "https://leetcode.com/problems/sort-an-array/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "selection",
    },
    {
      id: "sorting-bubble",
      parentLevelId: 7,
      subNumber: 2,
      title: "Bubble Sort & Early Exit Optimization",
      shortTitle: "Bubble Sort",
      tag: "EASY",
      description: "Repeatedly step through the list, compare adjacent elements, and swap them if in the wrong order. Optimized with early termination flag.",
      timeComplexity: { best: "O(N)", average: "O(N^2)", worst: "O(N^2)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "After pass k, the largest k elements have 'bubbled' to their final positions at the end of the array.",
        "If a complete pass occurs with zero swaps, the array is already sorted.",
      ],
      youtubeVideoId: "xli_FI7CuzA",
      videoTitle: "Bubble Sort Algorithm Explained",
      videoChannel: "GeeksforGeeks",
      videoDuration: "06:45",
      studyResources: {
        overview: "Bubble Sort is a stable sorting algorithm that pushes the largest remaining element to the end in each pass. With a 'swapped' boolean flag, it achieves O(N) best-case on sorted data.",
        pseudocode: "for i = 0 to n - 1:\n    swapped = false\n    for j = 0 to n - i - 2:\n        if arr[j] > arr[j + 1]:\n            swap(arr[j], arr[j + 1])\n            swapped = true\n    if not swapped: break",
        codeSnippet: {
          language: "python",
          code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr`,
        },
        pitfalls: ["Excessive data swaps compared to Insertion Sort", "Quadratic runtime on reversed inputs"],
      },
      problems: [
        { id: 283, title: "Move Zeroes", slug: "move-zeroes", difficulty: "Easy", tags: ["Array", "Two Pointers"], url: "https://leetcode.com/problems/move-zeroes/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "bubble",
    },
    {
      id: "sorting-insertion",
      parentLevelId: 7,
      subNumber: 3,
      title: "Insertion Sort Algorithm",
      shortTitle: "Insertion Sort",
      tag: "EASY",
      description: "Build the sorted array one item at a time by inserting each element into its proper position in the already sorted prefix.",
      timeComplexity: { best: "O(N)", average: "O(N^2)", worst: "O(N^2)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "Prefix arr[0..i] is sorted at the end of iteration i.",
        "Number of shifts is directly proportional to the number of inversions in the input.",
      ],
      youtubeVideoId: "OGzPmgsI-pQ",
      videoTitle: "Insertion Sort in 2 Minutes",
      videoChannel: "Michael Sambol",
      videoDuration: "02:15",
      studyResources: {
        overview: "Insertion Sort is the fastest algorithm for small arrays (N <= 16 to 32) and nearly sorted inputs. It forms the base case of hybrid algorithms like TimSort and Introsort.",
        pseudocode: "for i = 1 to n - 1:\n    key = arr[i]\n    j = i - 1\n    while j >= 0 and arr[j] > key:\n        arr[j + 1] = arr[j]\n        j -= 1\n    arr[j + 1] = key",
        codeSnippet: {
          language: "java",
          code: `public void insertionSort(int[] arr) {\n    for (int i = 1; i < arr.length; i++) {\n        int key = arr[i];\n        int j = i - 1;\n        while (j >= 0 && arr[j] > key) {\n            arr[j + 1] = arr[j];\n            j--;\n        }\n        arr[j + 1] = key;\n    }\n}`,
        },
        pitfalls: ["O(N^2) shifts on reverse-sorted input", "Forgetting to shift instead of swap repeatedly"],
      },
      problems: [
        { id: 147, title: "Insertion Sort List", slug: "insertion-sort-list", difficulty: "Medium", tags: ["Linked List", "Sorting"], url: "https://leetcode.com/problems/insertion-sort-list/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "insertion",
    },
    {
      id: "sorting-merge",
      parentLevelId: 7,
      subNumber: 4,
      title: "Merge Sort & Divide and Conquer",
      shortTitle: "Merge Sort",
      tag: "MEDIUM",
      description: "Recursively split the array into halves, sort each half, and merge the sorted halves in linear time. Stable with guaranteed O(N log N).",
      timeComplexity: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      spaceComplexity: "O(N) auxiliary for temporary buffer",
      keyInvariants: [
        "Each recursive merge produces a strictly sorted subarray from two already sorted halves.",
        "Guarantees O(N log N) in all worst-case scenarios.",
      ],
      youtubeVideoId: "4VqmGXwpLqc",
      videoTitle: "Merge Sort Algorithm Explained",
      videoChannel: "GeeksforGeeks",
      videoDuration: "09:48",
      studyResources: {
        overview: "Merge Sort is the canonical divide-and-conquer algorithm. It is stable and heavily utilized in external sorting (where data exceeds RAM) and linked list sorting.",
        pseudocode: "mergeSort(arr, l, r):\n    if l < r:\n        m = l + (r - l) / 2\n        mergeSort(arr, l, m)\n        mergeSort(arr, m + 1, r)\n        merge(arr, l, m, r)",
        codeSnippet: {
          language: "python",
          code: `def merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    \n    res = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            res.append(left[i]); i += 1\n        else:\n            res.append(right[j]); j += 1\n    res.extend(left[i:])\n    res.extend(right[j:])\n    return res`,
        },
        pitfalls: ["High O(N) auxiliary memory requirement for contiguous arrays", "Recursion stack depth overhead if not implemented iteratively"],
      },
      problems: [
        { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium", tags: ["Divide and Conquer", "Sorting", "Merge Sort"], url: "https://leetcode.com/problems/sort-an-array/" },
        { id: 88, title: "Merge Sorted Array", slug: "merge-sorted-array", difficulty: "Easy", tags: ["Array", "Two Pointers", "Sorting"], url: "https://leetcode.com/problems/merge-sorted-array/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "merge",
    },
    {
      id: "sorting-quick",
      parentLevelId: 7,
      subNumber: 5,
      title: "Quick Sort & Partitioning Schemes",
      shortTitle: "Quick Sort",
      tag: "MEDIUM",
      description: "Pick a pivot element, partition array so elements < pivot are to the left and > pivot are to the right, then recurse.",
      timeComplexity: { best: "O(N log N)", average: "O(N log N)", worst: "O(N^2) bad pivot" },
      spaceComplexity: "O(log N) recursion stack",
      keyInvariants: [
        "After partition, the pivot element is in its final sorted position.",
        "Elements left of pivot <= pivot; elements right of pivot >= pivot.",
      ],
      youtubeVideoId: "7h1s2SojIRw",
      videoTitle: "Quick Sort Algorithm Tutorial",
      videoChannel: "GeeksforGeeks",
      videoDuration: "10:30",
      studyResources: {
        overview: "In-place sorting with fantastic cache locality. Uses randomized pivot selection or 3-way Dutch National Flag partition to prevent O(N^2) degradation on duplicate elements.",
        pseudocode: "partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j = low to high - 1:\n        if arr[j] <= pivot:\n            i += 1\n            swap(arr[i], arr[j])\n    swap(arr[i + 1], arr[high])\n    return i + 1",
        codeSnippet: {
          language: "cpp",
          code: `int partition(std::vector<int>& arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; ++j) {\n        if (arr[j] <= pivot) {\n            ++i;\n            std::swap(arr[i], arr[j]);\n        }\n    }\n    std::swap(arr[i + 1], arr[high]);\n    return i + 1;\n}`,
        },
        pitfalls: ["Selecting first/last element as pivot degrades to O(N^2) on sorted inputs", "QuickSort is unstable"],
      },
      problems: [
        { id: 75, title: "Sort Colors", slug: "sort-colors", difficulty: "Medium", tags: ["Array", "Two Pointers", "Sorting"], url: "https://leetcode.com/problems/sort-colors/" },
        { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", tags: ["Array", "Divide and Conquer", "Quickselect"], url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "quick",
    },
    {
      id: "sorting-heap",
      parentLevelId: 7,
      subNumber: 6,
      title: "Heap Sort & In-Place Sift-Down",
      shortTitle: "Heap Sort",
      tag: "HARD",
      description: "Build a Max Heap in O(N) time, then repeatedly extract the maximum element to the end of the array, shrinking the heap.",
      timeComplexity: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "Parent at index i has children at 2i + 1 and 2i + 2.",
        "Suffix of array contains extracted maximum values in ascending order.",
      ],
      youtubeVideoId: "2DmK_H7IdTo",
      videoTitle: "Heap Sort Algorithm",
      videoChannel: "GeeksforGeeks",
      videoDuration: "14:20",
      studyResources: {
        overview: "Combines the guaranteed O(N log N) worst-case time of Merge Sort with the O(1) auxiliary space of Quick Sort. Slightly worse cache locality than QuickSort due to non-contiguous heap hops.",
        pseudocode: "heapSort(arr):\n    buildMaxHeap(arr)\n    for i = n - 1 down to 1:\n        swap(arr[0], arr[i])\n        heapify(arr, i, 0)",
        pitfalls: ["Unstable sort", "Cache misses during child index jumps"],
      },
      problems: [
        { id: 912, title: "Sort an Array", slug: "sort-an-array", difficulty: "Medium", tags: ["Array", "Sorting", "Heap"], url: "https://leetcode.com/problems/sort-an-array/" },
      ],
      visualizerType: "sorting",
      visualizerAlgorithm: "heap",
    },
  ],

  // ==========================================
  // LEVEL 8: STACK
  // ==========================================
  8: [
    {
      id: "stack-parentheses",
      parentLevelId: 8,
      subNumber: 1,
      title: "Matching Parentheses & Expression Validation",
      shortTitle: "Valid Parentheses",
      tag: "EASY",
      description: "LIFO state tracking to ensure nested enclosing delimiters match symmetrically in single linear pass.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Most recently opened bracket must be the first bracket closed.",
      ],
      youtubeVideoId: "WTzjTskDF3A",
      videoTitle: "Valid Parentheses - LeetCode 20",
      videoChannel: "NeetCode",
      videoDuration: "08:15",
      studyResources: {
        overview: "Standard application of LIFO stacks. Matches open delimiters onto stack, popping to verify type symmetry upon encountering closing characters.",
        pitfalls: ["Popping from an empty stack on excess closing brackets", "Stack remaining non-empty at end of string"],
      },
      problems: [
        { id: 20, title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", tags: ["String", "Stack"], url: "https://leetcode.com/problems/valid-parentheses/" },
      ],
      visualizerType: "stack",
      visualizerAlgorithm: "parentheses",
    },
    {
      id: "stack-monotonic",
      parentLevelId: 8,
      subNumber: 2,
      title: "Monotonic Stack Pattern (Next Greater Element)",
      shortTitle: "Monotonic Stack",
      tag: "MEDIUM",
      description: "Maintaining a strictly increasing or decreasing stack to find the next greater or smaller element in O(N) total time.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Elements in stack are strictly monotonic.",
        "Each element pushed and popped at most once across the entire traversal.",
      ],
      youtubeVideoId: "Dq_OBptXAUC",
      videoTitle: "Daily Temperatures - Monotonic Stack",
      videoChannel: "NeetCode",
      videoDuration: "11:50",
      studyResources: {
        overview: "Solves histogram areas, daily temperature spans, and next greater element problems in linear time.",
        pitfalls: ["Confusing indices with values inside the stack", "Off-by-one span widths"],
      },
      problems: [
        { id: 739, title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", tags: ["Array", "Stack", "Monotonic Stack"], url: "https://leetcode.com/problems/daily-temperatures/" },
        { id: 84, title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", tags: ["Array", "Stack", "Monotonic Stack"], url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      ],
      visualizerType: "stack",
      visualizerAlgorithm: "monotonic",
    },
    {
      id: "stack-min-stack",
      parentLevelId: 8,
      subNumber: 3,
      title: "Min Stack Design with O(1) Minimum Retrieval",
      shortTitle: "Min Stack",
      tag: "MEDIUM",
      description: "Maintaining a secondary min-tracking stack or delta values to retrieve the minimum element in constant O(1) time.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Top of minStack always mirrors the minimum element present in the primary stack up to that height.",
      ],
      youtubeVideoId: "qkLl7nAwDPo",
      videoTitle: "Min Stack - LeetCode 155",
      videoChannel: "NeetCode",
      videoDuration: "09:30",
      studyResources: {
        overview: "By pairing each pushed element with the running minimum at that instant, getMin() runs in strictly O(1) time.",
        pitfalls: ["Forgetting to pop from minStack when primary stack pops equal minimum value"],
      },
      problems: [
        { id: 155, title: "Min Stack", slug: "min-stack", difficulty: "Medium", tags: ["Stack", "Design"], url: "https://leetcode.com/problems/min-stack/" },
      ],
      visualizerType: "stack",
      visualizerAlgorithm: "min_stack",
    },
  ],

  // ==========================================
  // LEVEL 9: QUEUE
  // ==========================================
  9: [
    {
      id: "queue-circular",
      parentLevelId: 9,
      subNumber: 1,
      title: "FIFO Buffer & Circular Queue Design",
      shortTitle: "Circular Queue",
      tag: "CORE",
      description: "Managing head and tail pointers using modulo indexing over fixed-size continuous memory blocks.",
      timeComplexity: { best: "O(1)", average: "O(1)", worst: "O(1)" },
      spaceComplexity: "O(K) capacity",
      keyInvariants: [
        "Next index = (curr + 1) mod capacity.",
        "Queue is full when (tail + 1) mod capacity == head.",
      ],
      youtubeVideoId: "okr-XE8yTO8",
      videoTitle: "Design Circular Queue - LeetCode 622",
      videoChannel: "NeetCode",
      videoDuration: "12:10",
      studyResources: {
        overview: "Eliminates O(N) shifting of array elements upon dequeue by wrapping pointers around fixed capacity ring buffers.",
        pitfalls: ["Distinguishing between full and empty queue states when head == tail"],
      },
      problems: [
        { id: 622, title: "Design Circular Queue", slug: "design-circular-queue", difficulty: "Medium", tags: ["Array", "Design", "Queue"], url: "https://leetcode.com/problems/design-circular-queue/" },
      ],
      visualizerType: "queue",
      visualizerAlgorithm: "circular",
    },
    {
      id: "queue-deque",
      parentLevelId: 9,
      subNumber: 2,
      title: "Double-Ended Queue (Deque) & Monotonic Queue",
      shortTitle: "Monotonic Queue",
      tag: "HARD",
      description: "Monotonically ordered deque to find sliding window maximums and minimums in strictly O(N) time.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(K) window size",
      keyInvariants: [
        "Head of deque always holds the maximum element of the active window.",
        "Pop smaller elements from tail before appending new item.",
      ],
      youtubeVideoId: "DfljaUwZsOk",
      videoTitle: "Sliding Window Maximum - Deque",
      videoChannel: "NeetCode",
      videoDuration: "15:20",
      studyResources: {
        overview: "Maintains indices in a monotonic deque so maximum of window is queryable in O(1) amortized.",
        pitfalls: ["Failing to pop stale elements whose indices have fallen out of the left window bound"],
      },
      problems: [
        { id: 239, title: "Sliding Window Maximum", slug: "sliding-window-maximum", difficulty: "Hard", tags: ["Array", "Queue", "Sliding Window", "Monotonic Queue"], url: "https://leetcode.com/problems/sliding-window-maximum/" },
      ],
      visualizerType: "queue",
      visualizerAlgorithm: "monotonic_queue",
    },
    {
      id: "queue-priority",
      parentLevelId: 9,
      subNumber: 3,
      title: "Priority Queue & Dynamic Scheduling",
      shortTitle: "Priority Queue",
      tag: "MEDIUM",
      description: "Queue where elements are served based on priority weights rather than strict FIFO arrival order.",
      timeComplexity: { best: "O(log N) insert/pop", average: "O(log N)", worst: "O(log N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Highest priority item is always accessible at the head in O(1) query time.",
      ],
      youtubeVideoId: "wptevk0bshY",
      videoTitle: "Priority Queue Introduction",
      videoChannel: "Abdul Bari",
      videoDuration: "16:40",
      studyResources: {
        overview: "Used in CPU process scheduling, Dijkstra's algorithm, and event-driven simulation engines.",
        pitfalls: ["Confusing FIFO order with prioritized order"],
      },
      problems: [
        { id: 1046, title: "Last Stone Weight", slug: "last-stone-weight", difficulty: "Easy", tags: ["Array", "Heap"], url: "https://leetcode.com/problems/last-stone-weight/" },
      ],
      visualizerType: "queue",
      visualizerAlgorithm: "priority_queue",
    },
  ],

  // ==========================================
  // LEVEL 10: LINKED LIST
  // ==========================================
  10: [
    {
      id: "ll-reversal",
      parentLevelId: 10,
      subNumber: 1,
      title: "Iterative & Recursive Linked List Reversal",
      shortTitle: "Reverse List",
      tag: "EASY",
      description: "Reorient node next pointers using prev, curr, and next_temp pointers in a single in-place pass.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1) iterative",
      keyInvariants: [
        "prev pointer points to reversed prefix; curr points to remaining forward list.",
      ],
      youtubeVideoId: "G0_I-ZF0S38",
      videoTitle: "Reverse a Linked List - Step-by-Step",
      videoChannel: "NeetCode",
      videoDuration: "08:50",
      studyResources: {
        overview: "The core foundational linked list algorithm. Must be mastered iteratively with O(1) space and recursively.",
        pseudocode: "prev = None\ncurr = head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\nreturn prev",
        pitfalls: ["Losing reference to curr.next before reassigning pointer", "Cycle creation by not nulling original head.next"],
      },
      problems: [
        { id: 206, title: "Reverse Linked List", slug: "reverse-linked-list", difficulty: "Easy", tags: ["Linked List"], url: "https://leetcode.com/problems/reverse-linked-list/" },
        { id: 92, title: "Reverse Linked List II", slug: "reverse-linked-list-ii", difficulty: "Medium", tags: ["Linked List"], url: "https://leetcode.com/problems/reverse-linked-list-ii/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "reverse_linked_list",
    },
    {
      id: "ll-fast-slow",
      parentLevelId: 10,
      subNumber: 2,
      title: "Floyd's Cycle Detection (Tortoise and Hare)",
      shortTitle: "Cycle Detection",
      tag: "MEDIUM",
      description: "Using slow (1x speed) and fast (2x speed) pointers to detect loops and find the cycle entry node.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "If a cycle exists, distance between fast and slow decreases by 1 in each step; they must meet inside the loop.",
        "Resetting one pointer to head and stepping both at 1x finds the cycle entry point.",
      ],
      youtubeVideoId: "gBTe7lFR3vc",
      videoTitle: "Linked List Cycle & Cycle II",
      videoChannel: "NeetCode",
      videoDuration: "12:15",
      studyResources: {
        overview: "Finds cycle existence and start nodes without hash set memory overhead using modular arithmetic proofs.",
        pitfalls: ["Null pointer dereference on fast.next.next when list has no cycle"],
      },
      problems: [
        { id: 141, title: "Linked List Cycle", slug: "linked-list-cycle", difficulty: "Easy", tags: ["Hash Table", "Linked List", "Two Pointers"], url: "https://leetcode.com/problems/linked-list-cycle/" },
        { id: 142, title: "Linked List Cycle II", slug: "linked-list-cycle-ii", difficulty: "Medium", tags: ["Linked List", "Two Pointers"], url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "fast_slow",
    },
    {
      id: "ll-merge",
      parentLevelId: 10,
      subNumber: 3,
      title: "Merge Two Sorted Lists (In-Place Pointer Splicing)",
      shortTitle: "Merge Sorted Lists",
      tag: "EASY",
      description: "Splicing existing node pointers using dummy pre-head nodes to weave two monotonic lists into one sorted list.",
      timeComplexity: { best: "O(N + M)", average: "O(N + M)", worst: "O(N + M)" },
      spaceComplexity: "O(1) in-place",
      keyInvariants: [
        "Dummy head pointer simplifies boundary condition handling when selecting initial head node.",
      ],
      youtubeVideoId: "XIdigk956u0",
      videoTitle: "Merge Two Sorted Lists - LeetCode 21",
      videoChannel: "NeetCode",
      videoDuration: "07:45",
      studyResources: {
        overview: "Core step of Linked List Merge Sort. Operates completely in-place without allocating new list nodes.",
        pitfalls: ["Allocating new nodes instead of re-wiring pointers", "Losing remaining tail suffix of longer list"],
      },
      problems: [
        { id: 21, title: "Merge Two Sorted Lists", slug: "merge-two-sorted-lists", difficulty: "Easy", tags: ["Linked List", "Recursion"], url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "merge_linked_list",
    },
  ],

  // ==========================================
  // LEVEL 11: RECURSION
  // ==========================================
  11: [
    {
      id: "rec-callstack",
      parentLevelId: 11,
      subNumber: 1,
      title: "Recursion Trees, Base Cases & Stack Frames",
      shortTitle: "Recursion Trees",
      tag: "CORE",
      description: "Visualizing activation records pushing onto CPU call stacks, winding, base-case triggers, and unwinding returns.",
      timeComplexity: { best: "O(N)", average: "O(2^N)", worst: "O(2^N)" },
      spaceComplexity: "O(Depth) call stack",
      keyInvariants: [
        "Every recursive call must move strictly toward at least one terminating base case.",
        "Stack space consumed equals maximum depth of the call tree.",
      ],
      youtubeVideoId: "IJDJ0kBx2LM",
      videoTitle: "Recursion in 100 Seconds",
      videoChannel: "Fireship",
      videoDuration: "02:20",
      studyResources: {
        overview: "Mastering recursion tree branches is the foundation for Divide-and-Conquer, Backtracking, and Dynamic Programming.",
        pitfalls: ["Missing base case leading to StackOverflowError", "Redundant recalculations without memoization"],
      },
      problems: [
        { id: 509, title: "Fibonacci Number", slug: "fibonacci-number", difficulty: "Easy", tags: ["Math", "Recursion", "Dynamic Programming"], url: "https://leetcode.com/problems/fibonacci-number/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "recursion_tree",
    },
    {
      id: "rec-divide-conquer",
      parentLevelId: 11,
      subNumber: 2,
      title: "Divide and Conquer Paradigm & Binary Exponentiation",
      shortTitle: "Divide & Conquer",
      tag: "MEDIUM",
      description: "Splitting problems into subproblems of size N/2, recursively solving, and combining solutions in logarithmic steps.",
      timeComplexity: { best: "O(log N)", average: "O(log N)", worst: "O(log N)" },
      spaceComplexity: "O(log N)",
      keyInvariants: [
        "x^N = (x^(N/2))^2 if N is even; x * (x^(N/2))^2 if N is odd.",
      ],
      youtubeVideoId: "g9YQyYi4IQQ",
      videoTitle: "Pow(x, n) - Binary Exponentiation",
      videoChannel: "NeetCode",
      videoDuration: "09:15",
      studyResources: {
        overview: "Reduces power computations from linear O(N) multiplications to logarithmic O(log N).",
        pitfalls: ["Integer overflow on INT_MIN exponent (-2147483648)"],
      },
      problems: [
        { id: 50, title: "Pow(x, n)", slug: "powx-n", difficulty: "Medium", tags: ["Math", "Recursion"], url: "https://leetcode.com/problems/powx-n/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "divide_conquer",
    },
    {
      id: "rec-backtracking-intro",
      parentLevelId: 11,
      subNumber: 3,
      title: "State Space Trees & Backtracking Unwind",
      shortTitle: "State Space Tree",
      tag: "MEDIUM",
      description: "Systematic depth exploration of combinatorial search spaces with state restoration upon backtrack.",
      timeComplexity: { best: "O(2^N)", average: "O(2^N)", worst: "O(2^N)" },
      spaceComplexity: "O(N)",
      keyInvariants: [
        "Un-do the state change immediately after child invocation returns to preserve invariance for sibling branches.",
      ],
      youtubeVideoId: "DKCbsiDBN6c",
      videoTitle: "Backtracking Algorithm Explained",
      videoChannel: "Abdul Bari",
      videoDuration: "20:15",
      studyResources: {
        overview: "The theoretical transition between pure recursion and exhaustive branch-and-bound exploration.",
        pitfalls: ["Failing to restore global mutable state after recursion"],
      },
      problems: [
        { id: 77, title: "Combinations", slug: "combinations", difficulty: "Medium", tags: ["Backtracking"], url: "https://leetcode.com/problems/combinations/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "state_space",
    },
  ],

  // ==========================================
  // LEVEL 12: TREES
  // ==========================================
  12: [
    {
      id: "tree-traversal",
      parentLevelId: 12,
      subNumber: 1,
      title: "Tree Traversals (DFS: Inorder, Preorder, Postorder)",
      shortTitle: "DFS Traversals",
      tag: "EASY",
      description: "Depth-first tree explorations visiting root before, between, or after child subtrees.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(Height) call stack",
      keyInvariants: [
        "Inorder traversal of BST yields keys in strictly sorted ascending order.",
        "Preorder is used for cloning/serialization; Postorder for bottom-up deletions/evaluations.",
      ],
      youtubeVideoId: "b_NjndniOqY",
      videoTitle: "Binary Tree Traversals (Inorder, Preorder, Postorder)",
      videoChannel: "Abdul Bari",
      videoDuration: "18:40",
      studyResources: {
        overview: "Fundamental traversal patterns across recursive and iterative stack implementations.",
        pseudocode: "inorder(root):\n    if not root: return\n    inorder(root.left)\n    visit(root.val)\n    inorder(root.right)",
        pitfalls: ["Ignoring skewed tree depth causing O(N) stack frame overhead"],
      },
      problems: [
        { id: 94, title: "Binary Tree Inorder Traversal", slug: "binary-tree-inorder-traversal", difficulty: "Easy", tags: ["Stack", "Tree", "Depth-First Search"], url: "https://leetcode.com/problems/binary-tree-inorder-traversal/" },
        { id: 104, title: "Maximum Depth of Binary Tree", slug: "maximum-depth-of-binary-tree", difficulty: "Easy", tags: ["Tree", "Depth-First Search", "Breadth-First Search"], url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "tree_dfs",
    },
    {
      id: "tree-bfs",
      parentLevelId: 12,
      subNumber: 2,
      title: "Level-Order Traversal (BFS) via Queue",
      shortTitle: "Level-Order BFS",
      tag: "MEDIUM",
      description: "Breadth-first exploration level by level using a FIFO queue to record depth slices.",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(Width) queue space",
      keyInvariants: [
        "Snapshot queue.length at start of while loop to process all nodes of current depth before next level.",
      ],
      youtubeVideoId: "6ZnyEApgFYg",
      videoTitle: "Binary Tree Level Order Traversal",
      videoChannel: "NeetCode",
      videoDuration: "10:15",
      studyResources: {
        overview: "Essential for finding shortest distances in unweighted tree graphs, tree views, and zigzag orders.",
        pitfalls: ["Forgetting to fix queue level size before inner dequeue loop"],
      },
      problems: [
        { id: 102, title: "Binary Tree Level Order Traversal", slug: "binary-tree-level-order-traversal", difficulty: "Medium", tags: ["Tree", "Breadth-First Search"], url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "tree_bfs",
    },
  ],

  // ==========================================
  // LEVEL 13: BST (BINARY SEARCH TREE)
  // ==========================================
  13: [
    {
      id: "bst-operations",
      parentLevelId: 13,
      subNumber: 1,
      title: "BST Insertion, Search & Invariant Validation",
      shortTitle: "BST Search & Insert",
      tag: "MEDIUM",
      description: "All left descendants < root < all right descendants. Logarithmic search and insertion.",
      timeComplexity: { best: "O(log N)", average: "O(log N)", worst: "O(N) unbalanced" },
      spaceComplexity: "O(Height)",
      keyInvariants: [
        "Every single node in left subtree must be strictly less than node value; not merely direct child.",
      ],
      youtubeVideoId: "s6HSenERkh8",
      videoTitle: "Validate Binary Search Tree - LeetCode 98",
      videoChannel: "NeetCode",
      videoDuration: "11:10",
      studyResources: {
        overview: "Validate with range bounds: low < node.val < high, propagated recursively through children.",
        pitfalls: ["Comparing only parent with child rather than entire subtree range bounds"],
      },
      problems: [
        { id: 700, title: "Search in a Binary Search Tree", slug: "search-in-a-binary-search-tree", difficulty: "Easy", tags: ["Tree", "Binary Search Tree"], url: "https://leetcode.com/problems/search-in-a-binary-search-tree/" },
        { id: 98, title: "Validate Binary Search Tree", slug: "validate-binary-search-tree", difficulty: "Medium", tags: ["Tree", "Depth-First Search", "Binary Search Tree"], url: "https://leetcode.com/problems/validate-binary-search-tree/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "bst_search",
    },
    {
      id: "bst-deletion",
      parentLevelId: 13,
      subNumber: 2,
      title: "BST Deletion (3 Cases & Inorder Successor)",
      shortTitle: "BST Deletion",
      tag: "HARD",
      description: "Handling node deletion with 0 children (leaf), 1 child, or 2 children (replace with inorder successor).",
      timeComplexity: { best: "O(log N)", average: "O(log N)", worst: "O(N)" },
      spaceComplexity: "O(Height)",
      keyInvariants: [
        "Inorder successor is the minimum node in right subtree, which has at most 1 child.",
      ],
      youtubeVideoId: "LFzAoJJt92M",
      videoTitle: "Delete Node in a BST - LeetCode 450",
      videoChannel: "NeetCode",
      videoDuration: "14:40",
      studyResources: {
        overview: "Case 1: Leaf node (delete directly). Case 2: One child (bypass). Case 3: Two children (swap value with min of right subtree, then delete min node).",
        pitfalls: ["Losing subtrees when deleting two-child node"],
      },
      problems: [
        { id: 450, title: "Delete Node in a BST", slug: "delete-node-in-a-bst", difficulty: "Medium", tags: ["Tree", "Binary Search Tree"], url: "https://leetcode.com/problems/delete-node-in-a-bst/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "bst_delete",
    },
  ],

  // ==========================================
  // LEVEL 14: HEAP / PRIORITY QUEUE
  // ==========================================
  14: [
    {
      id: "heap-heapify",
      parentLevelId: 14,
      subNumber: 1,
      title: "Complete Binary Tree Array Representation & Heapify",
      shortTitle: "Heapify & Sift-Down",
      tag: "MEDIUM",
      description: "Mapping complete binary trees into arrays: parent(i) = (i - 1)/2; left = 2i + 1; right = 2i + 2. Linear O(N) build heap.",
      timeComplexity: { best: "O(N) build, O(log N) push/pop", average: "O(log N)", worst: "O(log N)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "Heap property: arr[parent] >= arr[child] for Max Heap.",
        "Bottom-up sift-down builds heap in strictly O(N) comparisons.",
      ],
      youtubeVideoId: "HqPJF2L5h9U",
      videoTitle: "Heap Sort & Heap Data Structure",
      videoChannel: "Abdul Bari",
      videoDuration: "25:30",
      studyResources: {
        overview: "Heaps maintain extremum values at index 0. Ideal for dynamic streaming priority queues.",
        pitfalls: ["Thinking buildHeap is O(N log N) instead of mathematical O(N)"],
      },
      problems: [
        { id: 215, title: "Kth Largest Element in an Array", slug: "kth-largest-element-in-an-array", difficulty: "Medium", tags: ["Heap", "Divide and Conquer"], url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "heapify",
    },
    {
      id: "heap-top-k",
      parentLevelId: 14,
      subNumber: 2,
      title: "Top K Elements Pattern (Min-Heap of Size K)",
      shortTitle: "Top-K Pattern",
      tag: "MEDIUM",
      description: "Using a min-heap bounded by size K to find the K largest elements in O(N log K) time.",
      timeComplexity: { best: "O(N log K)", average: "O(N log K)", worst: "O(N log K)" },
      spaceComplexity: "O(K) heap memory",
      keyInvariants: [
        "Root of min-heap of size K is the K-th largest element seen so far.",
        "If incoming element > root, pop root and push new element.",
      ],
      youtubeVideoId: "YPTqKIgVk-k",
      videoTitle: "Top K Frequent Elements - LeetCode 347",
      videoChannel: "NeetCode",
      videoDuration: "14:10",
      studyResources: {
        overview: "Saves massive memory compared to full O(N log N) sorting when N is billions and K is small.",
        pitfalls: ["Using a max-heap of size N when a min-heap of size K is 100x faster"],
      },
      problems: [
        { id: 347, title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium", tags: ["Heap", "Hash Table"], url: "https://leetcode.com/problems/top-k-frequent-elements/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "top_k",
    },
  ],

  // ==========================================
  // LEVEL 15: BACKTRACKING
  // ==========================================
  15: [
    {
      id: "bt-subsets",
      parentLevelId: 15,
      subNumber: 1,
      title: "Subsets, Permutations & State Space Trees",
      shortTitle: "Subsets & Permutations",
      tag: "MEDIUM",
      description: "Exploring state space tree branches with choose, explore, and un-choose backtracking invariants.",
      timeComplexity: { best: "O(2^N)", average: "O(2^N) or O(N!)", worst: "O(2^N) or O(N!)" },
      spaceComplexity: "O(N) recursion stack",
      keyInvariants: [
        "Un-choose (pop) after recursive call to restore pristine state for sibling branches.",
      ],
      youtubeVideoId: "REOH22Xwdkk",
      videoTitle: "Subsets - Backtracking - LeetCode 78",
      videoChannel: "NeetCode",
      videoDuration: "10:25",
      studyResources: {
        overview: "The quintessential backtracking template: choose candidate, recurse, backtrack state.",
        pitfalls: ["Appending mutable list reference rather than cloning a copy to result array"],
      },
      problems: [
        { id: 78, title: "Subsets", slug: "subsets", difficulty: "Medium", tags: ["Array", "Backtracking"], url: "https://leetcode.com/problems/subsets/" },
        { id: 46, title: "Permutations", slug: "permutations", difficulty: "Medium", tags: ["Array", "Backtracking"], url: "https://leetcode.com/problems/permutations/" },
      ],
      visualizerType: "tree",
      visualizerAlgorithm: "backtracking_subsets",
    },
  ],

  // ==========================================
  // LEVEL 16: GRAPHS
  // ==========================================
  16: [
    {
      id: "graph-bfs-dfs",
      parentLevelId: 16,
      subNumber: 1,
      title: "Graph Traversal (BFS & DFS) on Adjacency Lists",
      shortTitle: "BFS & DFS",
      tag: "MEDIUM",
      description: "Visiting graph vertices using visited sets to prevent infinite loops in cyclic topologies.",
      timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      spaceComplexity: "O(V) visited set and queue/stack",
      keyInvariants: [
        "Mark node as visited immediately upon queuing in BFS to avoid duplicate enqueueing.",
        "BFS finds shortest paths in unweighted graphs.",
      ],
      youtubeVideoId: "TIbUeeksXcI",
      videoTitle: "Graph Traversals BFS and DFS",
      videoChannel: "Abdul Bari",
      videoDuration: "28:15",
      studyResources: {
        overview: "BFS expands outward in concentric rings; DFS drills deeply into paths.",
        pitfalls: ["Marking visited upon dequeue rather than enqueue in BFS creates exponential memory bloat"],
      },
      problems: [
        { id: 200, title: "Number of Islands", slug: "number-of-islands", difficulty: "Medium", tags: ["Array", "DFS", "BFS", "Union Find"], url: "https://leetcode.com/problems/number-of-islands/" },
      ],
      visualizerType: "graph",
      visualizerAlgorithm: "bfs_dfs",
    },
    {
      id: "graph-dijkstra",
      parentLevelId: 16,
      subNumber: 2,
      title: "Dijkstra's Single-Source Shortest Path",
      shortTitle: "Dijkstra's Algorithm",
      tag: "HARD",
      description: "Greedy shortest-path algorithm on non-negative weighted graphs using min-priority queues.",
      timeComplexity: { best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)" },
      spaceComplexity: "O(V) distance table and heap",
      keyInvariants: [
        "Once a vertex is popped from the min-heap, its shortest distance from source is finalized.",
        "Relaxation: if dist[u] + weight < dist[v], update dist[v] and push to heap.",
      ],
      youtubeVideoId: "XB4MIexjvY0",
      videoTitle: "Dijkstra's Algorithm Explained",
      videoChannel: "Abdul Bari",
      videoDuration: "35:45",
      studyResources: {
        overview: "Computes minimum edge weights from origin. Fails on negative edge cycles (use Bellman-Ford instead).",
        pitfalls: ["Running Dijkstra with negative edge weights", "Forgetting to discard stale heap entries (dist > distTable[u])"],
      },
      problems: [
        { id: 743, title: "Network Delay Time", slug: "network-delay-time", difficulty: "Medium", tags: ["Graph", "Shortest Path", "Heap"], url: "https://leetcode.com/problems/network-delay-time/" },
      ],
      visualizerType: "graph",
      visualizerAlgorithm: "dijkstra",
    },
    {
      id: "graph-toposort",
      parentLevelId: 16,
      subNumber: 3,
      title: "Topological Sort (Kahn's In-Degree Algorithm)",
      shortTitle: "Topological Sort",
      tag: "MEDIUM",
      description: "Linear ordering of vertices in Directed Acyclic Graphs (DAGs) using queue of 0 in-degree nodes.",
      timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
      spaceComplexity: "O(V)",
      keyInvariants: [
        "A vertex can only be processed once all its prerequisite dependencies have been satisfied (in-degree == 0).",
        "If processed count < V, graph contains a cycle.",
      ],
      youtubeVideoId: "cIBFEhD77-4",
      videoTitle: "Course Schedule - Topological Sort",
      videoChannel: "NeetCode",
      videoDuration: "13:20",
      studyResources: {
        overview: "Fundamental for build systems, course dependencies, and task schedulers.",
        pitfalls: ["Failing to detect cycles in cyclic graphs"],
      },
      problems: [
        { id: 207, title: "Course Schedule", slug: "course-schedule", difficulty: "Medium", tags: ["DFS", "BFS", "Graph", "Topological Sort"], url: "https://leetcode.com/problems/course-schedule/" },
      ],
      visualizerType: "graph",
      visualizerAlgorithm: "toposort",
    },
  ],

  // ==========================================
  // LEVEL 17: GREEDY
  // ==========================================
  17: [
    {
      id: "greedy-interval",
      parentLevelId: 17,
      subNumber: 1,
      title: "Interval Scheduling & Non-Overlapping Intervals",
      shortTitle: "Interval Scheduling",
      tag: "MEDIUM",
      description: "Sorting intervals by end time to greedily select maximum number of non-overlapping events.",
      timeComplexity: { best: "O(N log N)", average: "O(N log N)", worst: "O(N log N)" },
      spaceComplexity: "O(1) auxiliary",
      keyInvariants: [
        "Selecting the interval that ends earliest leaves maximum remaining time for subsequent intervals.",
      ],
      youtubeVideoId: "nONCGxWoUfM",
      videoTitle: "Non-overlapping Intervals - LeetCode 435",
      videoChannel: "NeetCode",
      videoDuration: "12:10",
      studyResources: {
        overview: "Proved optimal by exchange argument: exchanging any alternate choice with earliest end time never reduces total capacity.",
        pitfalls: ["Sorting by start time instead of end time for interval scheduling"],
      },
      problems: [
        { id: 435, title: "Non-overlapping Intervals", slug: "non-overlapping-intervals", difficulty: "Medium", tags: ["Array", "Greedy", "Sorting"], url: "https://leetcode.com/problems/non-overlapping-intervals/" },
        { id: 55, title: "Jump Game", slug: "jump-game", difficulty: "Medium", tags: ["Array", "Dynamic Programming", "Greedy"], url: "https://leetcode.com/problems/jump-game/" },
      ],
      visualizerType: "linear",
      visualizerAlgorithm: "greedy_interval",
    },
  ],

  // ==========================================
  // LEVEL 18: DYNAMIC PROGRAMMING
  // ==========================================
  18: [
    {
      id: "dp-1d",
      parentLevelId: 18,
      subNumber: 1,
      title: "1D State Transitions & Tabulation (Climbing Stairs)",
      shortTitle: "1D DP Tabulation",
      tag: "EASY",
      description: "Breaking overlapping subproblems into subproblem states: dp[i] = dp[i-1] + dp[i-2] with space optimization to O(1).",
      timeComplexity: { best: "O(N)", average: "O(N)", worst: "O(N)" },
      spaceComplexity: "O(1) optimized or O(N)",
      keyInvariants: [
        "Optimal substructure: solution to step i depends strictly on optimal solutions to steps i-1 and i-2.",
      ],
      youtubeVideoId: "Y0lT9Fck7q8",
      videoTitle: "Climbing Stairs - Dynamic Programming",
      videoChannel: "NeetCode",
      videoDuration: "08:15",
      studyResources: {
        overview: "Transforms O(2^N) recursion into linear O(N) by caching subproblem answers.",
        pitfalls: ["Using an entire array when only the last 2 variables are required"],
      },
      problems: [
        { id: 70, title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy", tags: ["Math", "Dynamic Programming", "Memoization"], url: "https://leetcode.com/problems/climbing-stairs/" },
        { id: 198, title: "House Robber", slug: "house-robber", difficulty: "Medium", tags: ["Array", "Dynamic Programming"], url: "https://leetcode.com/problems/house-robber/" },
      ],
      visualizerType: "dp",
      visualizerAlgorithm: "1d_tabulation",
    },
    {
      id: "dp-knapsack",
      parentLevelId: 18,
      subNumber: 2,
      title: "0/1 Knapsack & Subset Sum",
      shortTitle: "0/1 Knapsack",
      tag: "MEDIUM",
      description: "2D state transition table dp[i][w]: deciding whether to include or exclude item i given remaining capacity w.",
      timeComplexity: { best: "O(N * W)", average: "O(N * W)", worst: "O(N * W)" },
      spaceComplexity: "O(W) 1D space optimized",
      keyInvariants: [
        "dp[i][w] = max(dp[i-1][w], val[i] + dp[i-1][w - weight[i]]).",
        "Iterate capacity backwards from W down to weight[i] when compressing to a 1D array to avoid reusing current item.",
      ],
      youtubeVideoId: "nLmhmB6NzcM",
      videoTitle: "0/1 Knapsack Problem - Dynamic Programming",
      videoChannel: "Abdul Bari",
      videoDuration: "25:40",
      studyResources: {
        overview: "The classic pseudo-polynomial dynamic programming problem.",
        pitfalls: ["Iterating forward on 1D space optimization turns 0/1 Knapsack into Unbounded Knapsack"],
      },
      problems: [
        { id: 416, title: "Partition Equal Subset Sum", slug: "partition-equal-subset-sum", difficulty: "Medium", tags: ["Array", "Dynamic Programming"], url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
        { id: 322, title: "Coin Change", slug: "coin-change", difficulty: "Medium", tags: ["Array", "Dynamic Programming", "Breadth-First Search"], url: "https://leetcode.com/problems/coin-change/" },
      ],
      visualizerType: "dp",
      visualizerAlgorithm: "knapsack",
    },
    {
      id: "dp-lcs",
      parentLevelId: 18,
      subNumber: 3,
      title: "Longest Common Subsequence (LCS)",
      shortTitle: "LCS Grid",
      tag: "MEDIUM",
      description: "2D grid state dp[i][j]: matching characters along diagonals or taking maximum of omitting one character.",
      timeComplexity: { best: "O(N * M)", average: "O(N * M)", worst: "O(N * M)" },
      spaceComplexity: "O(N * M)",
      keyInvariants: [
        "If s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1].",
        "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      ],
      youtubeVideoId: "Ua0GhsJCEWM",
      videoTitle: "Longest Common Subsequence - LeetCode 1143",
      videoChannel: "NeetCode",
      videoDuration: "16:20",
      studyResources: {
        overview: "Powers git diff, DNA sequence alignment, and edit distance calculations.",
        pitfalls: ["Off-by-one indices between 1-indexed DP table and 0-indexed strings"],
      },
      problems: [
        { id: 1143, title: "Longest Common Subsequence", slug: "longest-common-subsequence", difficulty: "Medium", tags: ["String", "Dynamic Programming"], url: "https://leetcode.com/problems/longest-common-subsequence/" },
      ],
      visualizerType: "dp",
      visualizerAlgorithm: "lcs",
    },
  ],
};

