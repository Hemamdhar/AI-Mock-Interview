// Extracted lightweight DSA Roadmap data for fast dashboard compilation

// Types
export type SupportedLanguage = "python" | "cpp" | "c" | "java";

export interface LeetCodeProblem {
  id: number;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  url: string;
}

export interface LevelData {
  id: number;
  levelNumber: number;
  title: string;
  shortTitle: string;
  tag: "CORE" | "EASY" | "MEDIUM" | "HARD";
  description: string;
  x: number; // coordinate percentage 0 to 100
  y: number; // vertical pixel height coordinate
  youtubeVideoId: string;
  videoTitle: string;
  videoChannel: string;
  videoDuration: string;
  keyTakeaways: string[];
  supportedLanguages?: {
    [key in SupportedLanguage]: {
      name: string;
      codeSnippet: string;
      memoryModel: string;
      cheatSheet: string[];
    };
  };
  studyResources: {
    title: string;
    description: string;
    type: "Visualizer" | "Article" | "CheatSheet";
    linkUrl?: string;
    notes: string[];
  };
  problems: LeetCodeProblem[];
}

// 18 Comprehensive DSA Concept Levels
export const ROADMAP_LEVELS: LevelData[] = [
  // Level 1: Language Foundations
  {
    id: 1,
    levelNumber: 1,
    title: "Language Foundations",
    shortTitle: "Language Foundations",
    tag: "CORE",
    description:
      "Select your primary interview language (Python, C++, C, Java). Master memory models, pointers vs references, STL containers, and I/O performance.",
    x: 50,
    y: 80,
    youtubeVideoId: "8hly31xKli0",
    videoTitle: "Algorithms and Data Structures Tutorial - Full Course for Beginners",
    videoChannel: "freeCodeCamp.org",
    videoDuration: "5:22:08",
    keyTakeaways: [
      "Memory Allocation: Stack (local primitives, function frames) vs Heap (dynamically allocated objects).",
      "Pointers & References: Direct memory manipulation in C/C++ vs reference variables in Python/Java.",
      "Time Complexity of Built-in Structures: list.append() is O(1) amortized; list.insert(0) is O(N).",
      "Standard Libraries: Python collections & heapq, C++ STL vector & unordered_map, Java Collections Framework.",
    ],
    supportedLanguages: {
      python: {
        name: "Python 3",
        codeSnippet: `# Fast I/O and Standard Data Structures in Python
import sys
from collections import defaultdict, deque
import heapq

# Fast input reading
input_data = sys.stdin.read

def language_foundations():
    # Dynamic List - Amortized O(1) append
    nums = [1, 2, 3]
    nums.append(4)
    
    # Hash Map (dict) - O(1) average lookup
    freq = defaultdict(int)
    freq["apple"] += 1
    
    # Min Heap (heapq) - O(log N) push/pop
    min_heap = []
    heapq.heappush(min_heap, 10)
    
    # Double-ended Queue - O(1) append & popleft
    queue = deque([1, 2, 3])
    queue.popleft()
    return min_heap[0]`,
        memoryModel:
          "Python uses automatic reference counting and a generational garbage collector. Everything is an object allocated on the private heap. Variables store object references rather than raw byte values.",
        cheatSheet: [
          "list: dynamic array, O(1) amortized append, O(N) insert at index 0.",
          "deque: doubly linked blocks, O(1) push and pop from both ends.",
          "dict / set: hash table with open addressing, O(1) average lookups.",
          "heapq: binary min-heap implementation over standard lists.",
        ],
      },
      cpp: {
        name: "C++ (C++20 / STL)",
        codeSnippet: `// High Performance Competitive Programming Template in C++
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <string>

using namespace std;

int main() {
    // Fast I/O desync with C stdio
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Contiguous Dynamic Array
    vector<int> nums = {1, 2, 3};
    nums.push_back(4); // O(1) amortized

    // Hash Map with O(1) average lookup
    unordered_map<string, int> freq;
    freq["apple"]++;

    // Max Heap priority queue
    priority_queue<int> max_heap;
    max_heap.push(10); // O(log N)

    return 0;
}`,
        memoryModel:
          "C++ provides direct hardware memory control. Stack memory is allocated for local variables with deterministic RAII destruction. Heap memory is manually allocated with new/delete or managed via unique_ptr/shared_ptr.",
        cheatSheet: [
          "std::vector: contiguous memory, cache-friendly, O(1) amortized push_back.",
          "std::unordered_map: hash table with separate chaining, O(1) average lookup.",
          "std::map: self-balancing Red-Black tree, O(log N) guaranteed lookup.",
          "std::priority_queue: max-heap by default, O(log N) push/pop.",
        ],
      },
      c: {
        name: "C (C11)",
        codeSnippet: `// Pure C Foundation: Pointer Arithmetic & Dynamic Memory
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int* data;
    int size;
    int capacity;
} DynamicArray;

DynamicArray* create_array(int initial_cap) {
    DynamicArray* arr = (DynamicArray*)malloc(sizeof(DynamicArray));
    arr->data = (int*)malloc(initial_cap * sizeof(int));
    arr->size = 0;
    arr->capacity = initial_cap;
    return arr;
}

void free_array(DynamicArray* arr) {
    if (arr) {
        free(arr->data);
        free(arr);
    }
}`,
        memoryModel:
          "C has no garbage collector or standard STL classes. All heap memory allocated with malloc()/calloc() must be manually freed with free(). Pointer arithmetic directly indexes raw physical memory offsets.",
        cheatSheet: [
          "Always check malloc() return value for NULL allocation failures.",
          "Prevent memory leaks: Every malloc() must have a corresponding free().",
          "Array indexing arr[i] translates to pointer offset *(arr + i).",
          "Struct padding & memory alignment affects sizeof(struct).",
        ],
      },
      java: {
        name: "Java (JDK 21)",
        codeSnippet: `// Java Collections Framework & Memory Overview
import java.util.*;

public class LanguageFoundations {
    public static void main(String[] args) {
        // Dynamic Array - O(1) amortized add
        List<Integer> list = new ArrayList<>();
        list.add(10);

        // Hash Map - O(1) average get/put
        Map<String, Integer> map = new HashMap<>();
        map.put("apple", 1);

        // Min Heap
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        minHeap.offer(42);

        // ArrayDeque - faster than Stack & LinkedList
        Deque<Integer> deque = new ArrayDeque<>();
        deque.push(100);
    }
}`,
        memoryModel:
          "Java executes on the JVM. Primitives (int, boolean, double) live on the stack; all objects live on the heap and are managed by garbage collectors (G1, ZGC). References are passed by value.",
        cheatSheet: [
          "ArrayList: dynamic array backed by Object[], reallocates at 1.5x capacity.",
          "HashMap: array of buckets with tree-buckets (Red-Black trees) when bucket size > 8.",
          "ArrayDeque: circular array implementation, faster than legacy Stack and LinkedList.",
          "StringBuilder: mutable string buffer to prevent O(N^2) string concatenation in loops.",
        ],
      },
    },
    studyResources: {
      title: "Language Internals & Memory Layout Comparator",
      description:
        "Understand how data structures are physically organized in RAM across different programming languages.",
      type: "Article",
      linkUrl: "https://visualgo.net/en",
      notes: [
        "Memory Locality: Contiguous structures (C++ vector, Python list of ints) have high CPU cache hits.",
        "Pass by Value vs Pass by Reference: In Python and Java, references are passed by value; in C++, you must explicitly use '&'.",
        "String Immutability: In Python and Java, strings are immutable; modifying them creates a new allocation.",
      ],
    },
    problems: [
      {
        id: 1929,
        title: "Concatenation of Array",
        slug: "concatenation-of-array",
        difficulty: "Easy",
        tags: ["Array", "Simulation"],
        url: "https://leetcode.com/problems/concatenation-of-array/",
      },
      {
        id: 1920,
        title: "Build Array from Permutation",
        slug: "build-array-from-permutation",
        difficulty: "Easy",
        tags: ["Array", "Simulation"],
        url: "https://leetcode.com/problems/build-array-from-permutation/",
      },
      {
        id: 2011,
        title: "Final Value of Variable After Performing Operations",
        slug: "final-value-of-variable-after-performing-operations",
        difficulty: "Easy",
        tags: ["Array", "String"],
        url: "https://leetcode.com/problems/final-value-of-variable-after-performing-operations/",
      },
      {
        id: 1108,
        title: "Defanging an IP Address",
        slug: "defanging-an-ip-address",
        difficulty: "Easy",
        tags: ["String"],
        url: "https://leetcode.com/problems/defanging-an-ip-address/",
      },
    ],
  },

  // Level 2: Complexity Analysis
  {
    id: 2,
    levelNumber: 2,
    title: "Complexity Analysis",
    shortTitle: "Complexity Analysis",
    tag: "CORE",
    description:
      "Master asymptotic notation (Big-O, Omega, Theta), time vs space tradeoffs, amortized complexity, and operation budgets under online judges.",
    x: 80,
    y: 250,
    youtubeVideoId: "__vX2sjlpXU",
    videoTitle: "Big-O Notation in 5 Minutes - Time & Space Complexity Explained",
    videoChannel: "Abdul Bari / Computer Science",
    videoDuration: "15:20",
    keyTakeaways: [
      "Big-O (Upper Bound): Represents the maximum operations in the worst-case scenario.",
      "Growth Order: O(1) < O(log N) < O(N) < O(N log N) < O(N^2) < O(2^N) < O(N!).",
      "Operation Budgets: 10^8 operations take ~1.0 second on LeetCode/codeforces platforms.",
      "Auxiliary Space: Count extra data structures and recursive call stack depth.",
    ],
    studyResources: {
      title: "Interactive Big-O Complexity Graph & Growth Visualizer",
      description:
        "Visualize how execution steps scale as input size N grows from 10 to 1,000,000.",
      type: "Visualizer",
      linkUrl: "https://www.bigocheatsheet.com/",
      notes: [
        "If N <= 10^5: O(N) or O(N log N) solutions pass; O(N^2) gets Time Limit Exceeded (TLE).",
        "If N <= 10^3: O(N^2) algorithm comfortably passes within 1 second.",
        "If N <= 20: Exponential O(2^N) backtracking will pass.",
      ],
    },
    problems: [
      {
        id: 1,
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        url: "https://leetcode.com/problems/two-sum/",
      },
      {
        id: 217,
        title: "Contains Duplicate",
        slug: "contains-duplicate",
        difficulty: "Easy",
        tags: ["Array", "Hash Table"],
        url: "https://leetcode.com/problems/contains-duplicate/",
      },
      {
        id: 242,
        title: "Valid Anagram",
        slug: "valid-anagram",
        difficulty: "Easy",
        tags: ["Hash Table", "String", "Sorting"],
        url: "https://leetcode.com/problems/valid-anagram/",
      },
      {
        id: 136,
        title: "Single Number",
        slug: "single-number",
        difficulty: "Easy",
        tags: ["Array", "Bit Manipulation"],
        url: "https://leetcode.com/problems/single-number/",
      },
    ],
  },

  // Level 3: Arrays
  {
    id: 3,
    levelNumber: 3,
    title: "Arrays",
    shortTitle: "Arrays",
    tag: "EASY",
    description:
      "Contiguous memory layout, index-based O(1) random access, in-place rotations, prefix sums, and two-pointer traversals.",
    x: 50,
    y: 420,
    youtubeVideoId: "8wmn7k1TTcI",
    videoTitle: "Array Data Structure - Part 1 | DSA Series",
    videoChannel: "Apna College / Shradha Khapra",
    videoDuration: "35:10",
    keyTakeaways: [
      "Contiguous Memory: Elements reside in adjacent RAM blocks, maximizing CPU cache line hits.",
      "In-place Manipulation: Avoid allocating extra arrays to achieve O(1) auxiliary space.",
      "Prefix Sum Technique: Precompute cumulative sums to answer range sum queries in O(1).",
    ],
    studyResources: {
      title: "VisuAlgo Array & Dynamic Array Visualizer",
      description: "Interactive visual walkthrough of insertions, deletions, and memory resizing.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/array",
      notes: [
        "Insertion at beginning requires shifting all N elements: O(N) time.",
        "Dynamic array resizing doubles capacity to preserve O(1) amortized append.",
      ],
    },
    problems: [
      {
        id: 26,
        title: "Remove Duplicates from Sorted Array",
        slug: "remove-duplicates-from-sorted-array",
        difficulty: "Easy",
        tags: ["Array", "Two Pointers"],
        url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
      },
      {
        id: 53,
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
        url: "https://leetcode.com/problems/maximum-subarray/",
      },
      {
        id: 189,
        title: "Rotate Array",
        slug: "rotate-array",
        difficulty: "Medium",
        tags: ["Array", "Math", "Two Pointers"],
        url: "https://leetcode.com/problems/rotate-array/",
      },
      {
        id: 238,
        title: "Product of Array Except Self",
        slug: "product-of-array-except-self",
        difficulty: "Medium",
        tags: ["Array", "Prefix Sum"],
        url: "https://leetcode.com/problems/product-of-array-except-self/",
      },
    ],
  },

  // Level 4: Strings
  {
    id: 4,
    levelNumber: 4,
    title: "Strings",
    shortTitle: "Strings",
    tag: "EASY",
    description:
      "String immutability, ASCII/Unicode tables, two-pointer palindrome checking, tokenization, and sliding window string matching.",
    x: 18,
    y: 590,
    youtubeVideoId: "V5hZoJ6uK-s",
    videoTitle: "String Matching and Parsing | MIT OpenCourseWare",
    videoChannel: "MIT OpenCourseWare",
    videoDuration: "48:15",
    keyTakeaways: [
      "Immutability in Python & Java: Concatenating in a loop creates O(N^2) memory copies; use list.join() or StringBuilder.",
      "Character Frequency: Use a fixed integer array int[26] or int[128] instead of a heavy hash map.",
      "Two Pointers for Palindromes: Opposite-direction pointers inward check symmetry in O(N) time.",
    ],
    studyResources: {
      title: "String Parsing & Sliding Window Visual Guide",
      description: "Templates for longest substring, anagram grouping, and sliding window boundaries.",
      type: "Article",
      notes: [
        "Skip alphanumeric characters with isalnum() before checking palindromic symmetry.",
        "Rolling hash (Rabin-Karp) enables O(N + M) substring search.",
      ],
    },
    problems: [
      {
        id: 125,
        title: "Valid Palindrome",
        slug: "valid-palindrome",
        difficulty: "Easy",
        tags: ["Two Pointers", "String"],
        url: "https://leetcode.com/problems/valid-palindrome/",
      },
      {
        id: 151,
        title: "Reverse Words in a String",
        slug: "reverse-words-in-a-string",
        difficulty: "Medium",
        tags: ["Two Pointers", "String"],
        url: "https://leetcode.com/problems/reverse-words-in-a-string/",
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating-characters",
        difficulty: "Medium",
        tags: ["Hash Table", "Sliding Window", "String"],
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
      },
      {
        id: 5,
        title: "Longest Palindromic Substring",
        slug: "longest-palindromic-substring",
        difficulty: "Medium",
        tags: ["Two Pointers", "String", "Dynamic Programming"],
        url: "https://leetcode.com/problems/longest-palindromic-substring/",
      },
    ],
  },

  // Level 5: Hashing
  {
    id: 5,
    levelNumber: 5,
    title: "Hashing",
    shortTitle: "Hashing",
    tag: "EASY",
    description:
      "Hash tables, collision resolution (chaining vs open addressing), hash sets, and O(1) average lookup for frequency counting and prefix indexing.",
    x: 50,
    y: 760,
    youtubeVideoId: "shs0KM3wKv8",
    videoTitle: "Data Structures: Hash Tables",
    videoChannel: "HackerRank / Gayle Laakmann McDowell",
    videoDuration: "12:30",
    keyTakeaways: [
      "Hash Function: Converts keys into array indices; must distribute keys uniformly.",
      "Collision Handling: Separate chaining (linked list / Red-Black tree buckets) vs Open Addressing (linear/quadratic probing).",
      "Average vs Worst Case: O(1) average lookup; O(N) worst case when all keys collide into a single bucket.",
    ],
    studyResources: {
      title: "Hash Table Mechanics & Collision Visualizer",
      description: "Interactive bucket mapping and rehashing animations.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/hashtable",
      notes: [
        "Load Factor: Ratio of elements to buckets; rehashing occurs when load factor exceeds 0.75.",
        "Store prefix sum in hash map: prefix_sum[j] - prefix_sum[i] = k finds target subarrays in O(N).",
      ],
    },
    problems: [
      {
        id: 49,
        title: "Group Anagrams",
        slug: "group-anagrams",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "String", "Sorting"],
        url: "https://leetcode.com/problems/group-anagrams/",
      },
      {
        id: 128,
        title: "Longest Consecutive Sequence",
        slug: "longest-consecutive-sequence",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Union Find"],
        url: "https://leetcode.com/problems/longest-consecutive-sequence/",
      },
      {
        id: 387,
        title: "First Unique Character in a String",
        slug: "first-unique-character-in-a-string",
        difficulty: "Easy",
        tags: ["Hash Table", "String", "Queue", "Counting"],
        url: "https://leetcode.com/problems/first-unique-character-in-a-string/",
      },
      {
        id: 560,
        title: "Subarray Sum Equals K",
        slug: "subarray-sum-equals-k",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Prefix Sum"],
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
      },
    ],
  },

  // Level 6: Binary Search
  {
    id: 6,
    levelNumber: 6,
    title: "Binary Search",
    shortTitle: "Binary Search",
    tag: "MEDIUM",
    description:
      "Logarithmic search space reduction O(log N), binary search on answers, rotated sorted arrays, and lower/upper bound templates.",
    x: 80,
    y: 930,
    youtubeVideoId: "C2apEw9pgtw",
    videoTitle: "2.6.1 Binary Search Iterative Method",
    videoChannel: "Abdul Bari",
    videoDuration: "19:40",
    keyTakeaways: [
      "Monotonic Condition: Any domain where condition F(x) transitions strictly from False to True.",
      "Overflow Prevention: mid = left + (right - left) // 2.",
      "Search on Answers: When finding the minimum capacity or speed, binary search over the feasible range.",
    ],
    studyResources: {
      title: "Binary Search Template & Invariant Guide",
      description: "Canonical left <= right vs left < right loop invariants.",
      type: "Article",
      notes: [
        "In rotated sorted array, one half is guaranteed to be strictly sorted; check target against that sorted boundary.",
      ],
    },
    problems: [
      {
        id: 704,
        title: "Binary Search",
        slug: "binary-search",
        difficulty: "Easy",
        tags: ["Array", "Binary Search"],
        url: "https://leetcode.com/problems/binary-search/",
      },
      {
        id: 33,
        title: "Search in Rotated Sorted Array",
        slug: "search-in-rotated-sorted-array",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
      },
      {
        id: 153,
        title: "Find Minimum in Rotated Sorted Array",
        slug: "find-minimum-in-rotated-sorted-array",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
      },
      {
        id: 875,
        title: "Koko Eating Bananas",
        slug: "koko-eating-bananas",
        difficulty: "Medium",
        tags: ["Array", "Binary Search"],
        url: "https://leetcode.com/problems/koko-eating-bananas/",
      },
    ],
  },

  // Level 7: Sorting
  {
    id: 7,
    levelNumber: 7,
    title: "Sorting",
    shortTitle: "Sorting",
    tag: "MEDIUM",
    description:
      "Comparison vs non-comparison sorts, QuickSort partition, MergeSort divide-and-conquer, stability, and Dutch National Flag algorithm.",
    x: 50,
    y: 1100,
    youtubeVideoId: "kPRA0W1kECg",
    videoTitle: "15 Sorting Algorithms in 6 Minutes",
    videoChannel: "Timo Bingmann",
    videoDuration: "06:15",
    keyTakeaways: [
      "Lower Bound: Any comparison-based sort requires Omega(N log N) worst-case time.",
      "Stability: Stable sorts preserve the relative order of equal keys (MergeSort is stable; QuickSort is not).",
      "Dutch National Flag: 3-way partitioning in a single pass O(N) using low, mid, high pointers.",
    ],
    studyResources: {
      title: "VisuAlgo Sorting Comparator & Animation",
      description: "Visual trace of QuickSort, MergeSort, and Counting Sort.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/sorting",
      notes: [
        "TimSort (used in Python and Java): Hybrid of MergeSort and InsertionSort designed for real-world partially sorted arrays.",
      ],
    },
    problems: [
      {
        id: 912,
        title: "Sort an Array",
        slug: "sort-an-array",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Sorting", "Heap", "Merge Sort"],
        url: "https://leetcode.com/problems/sort-an-array/",
      },
      {
        id: 75,
        title: "Sort Colors",
        slug: "sort-colors",
        difficulty: "Medium",
        tags: ["Array", "Two Pointers", "Sorting"],
        url: "https://leetcode.com/problems/sort-colors/",
      },
      {
        id: 56,
        title: "Merge Intervals",
        slug: "merge-intervals",
        difficulty: "Medium",
        tags: ["Array", "Sorting"],
        url: "https://leetcode.com/problems/merge-intervals/",
      },
      {
        id: 179,
        title: "Largest Number",
        slug: "largest-number",
        difficulty: "Medium",
        tags: ["Array", "String", "Greedy", "Sorting"],
        url: "https://leetcode.com/problems/largest-number/",
      },
    ],
  },

  // Level 8: Stack
  {
    id: 8,
    levelNumber: 8,
    title: "Stack",
    shortTitle: "Stack",
    tag: "MEDIUM",
    description:
      "LIFO (Last-In First-Out) operations, parentheses balancing, function call stack emulation, and monotonic stacks for Next Greater Element.",
    x: 18,
    y: 1270,
    youtubeVideoId: "I5lq6sCuABE",
    videoTitle: "Stack Data Structure | Illustrated & Animated",
    videoChannel: "Computer Science Center",
    videoDuration: "14:20",
    keyTakeaways: [
      "LIFO Principle: Elements are added and removed from the top in O(1) time.",
      "Monotonic Stack: Maintain elements in strictly increasing or decreasing order to solve Next Greater Element in O(N).",
      "Call Stack Emulation: Any recursive program can be rewritten iteratively using an explicit stack.",
    ],
    studyResources: {
      title: "Monotonic Stack Pattern & Histogram Analysis",
      description: "Visual trace of index tracking for largest rectangle in histogram.",
      type: "Visualizer",
      notes: [
        "Each element enters the stack once and leaves once: amortized O(1) operations per element.",
      ],
    },
    problems: [
      {
        id: 20,
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        difficulty: "Easy",
        tags: ["String", "Stack"],
        url: "https://leetcode.com/problems/valid-parentheses/",
      },
      {
        id: 155,
        title: "Min Stack",
        slug: "min-stack",
        difficulty: "Medium",
        tags: ["Stack", "Design"],
        url: "https://leetcode.com/problems/min-stack/",
      },
      {
        id: 739,
        title: "Daily Temperatures",
        slug: "daily-temperatures",
        difficulty: "Medium",
        tags: ["Array", "Stack", "Monotonic Stack"],
        url: "https://leetcode.com/problems/daily-temperatures/",
      },
      {
        id: 84,
        title: "Largest Rectangle in Histogram",
        slug: "largest-rectangle-in-histogram",
        difficulty: "Hard",
        tags: ["Array", "Stack", "Monotonic Stack"],
        url: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
      },
    ],
  },

  // Level 9: Queue
  {
    id: 9,
    levelNumber: 9,
    title: "Queue",
    shortTitle: "Queue",
    tag: "MEDIUM",
    description:
      "FIFO (First-In First-Out), circular ring buffer implementation, double-ended queues (deque), and monotonic deques for sliding window maximum.",
    x: 50,
    y: 1440,
    youtubeVideoId: "okr-XE8yTO8",
    videoTitle: "Data structures: Array implementation of Queue",
    videoChannel: "mycodeschool",
    videoDuration: "16:45",
    keyTakeaways: [
      "FIFO Principle: Enqueue at the rear, dequeue from the front in O(1) time.",
      "Circular Array Implementation: Wrap around indices using modulo arithmetic: (rear + 1) % capacity.",
      "Monotonic Deque: Evict smaller elements from the back to maintain maximum element at the front in O(1).",
    ],
    studyResources: {
      title: "Circular Queue & Monotonic Deque Guide",
      description: "Step-by-step array index wrap and sliding window eviction.",
      type: "Article",
      notes: [
        "In Python, always use collections.deque rather than list for queues to avoid O(N) list.pop(0) overhead.",
      ],
    },
    problems: [
      {
        id: 225,
        title: "Implement Stack using Queues",
        slug: "implement-stack-using-queues",
        difficulty: "Easy",
        tags: ["Stack", "Design", "Queue"],
        url: "https://leetcode.com/problems/implement-stack-using-queues/",
      },
      {
        id: 232,
        title: "Implement Queue using Stacks",
        slug: "implement-queue-using-stacks",
        difficulty: "Easy",
        tags: ["Stack", "Design", "Queue"],
        url: "https://leetcode.com/problems/implement-queue-using-stacks/",
      },
      {
        id: 622,
        title: "Design Circular Queue",
        slug: "design-circular-queue",
        difficulty: "Medium",
        tags: ["Array", "Linked List", "Design", "Queue"],
        url: "https://leetcode.com/problems/design-circular-queue/",
      },
      {
        id: 239,
        title: "Sliding Window Maximum",
        slug: "sliding-window-maximum",
        difficulty: "Hard",
        tags: ["Array", "Queue", "Sliding Window", "Monotonic Queue"],
        url: "https://leetcode.com/problems/sliding-window-maximum/",
      },
    ],
  },

  // Level 10: Linked List
  {
    id: 10,
    levelNumber: 10,
    title: "Linked List",
    shortTitle: "Linked List",
    tag: "MEDIUM",
    description:
      "Singly vs doubly linked lists, pointer rewiring, dummy head nodes, Floyd's cycle detection (Tortoise and Hare), and LRU cache design.",
    x: 80,
    y: 1610,
    youtubeVideoId: "R9PTBwOzceo",
    videoTitle: "Introduction to Linked List | C++ & Java",
    videoChannel: "take U forward / Striver",
    videoDuration: "25:30",
    keyTakeaways: [
      "Non-contiguous Allocation: Nodes live arbitrarily in heap memory connected by pointer addresses.",
      "Floyd's Cycle Finding: Slow advances by 1, Fast advances by 2; meeting indicates a cycle.",
      "Dummy Head Technique: Simplifies edge cases where head node itself is deleted or inserted.",
    ],
    studyResources: {
      title: "VisuAlgo Linked List Visualizer",
      description: "Interactive insertion, deletion, and reverse animations.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/list",
      notes: [
        "LRU Cache: Hash map provides O(1) key lookup, while doubly linked list provides O(1) removal and re-insertion at head.",
      ],
    },
    problems: [
      {
        id: 206,
        title: "Reverse Linked List",
        slug: "reverse-linked-list",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        url: "https://leetcode.com/problems/reverse-linked-list/",
      },
      {
        id: 141,
        title: "Linked List Cycle",
        slug: "linked-list-cycle",
        difficulty: "Easy",
        tags: ["Hash Table", "Linked List", "Two Pointers"],
        url: "https://leetcode.com/problems/linked-list-cycle/",
      },
      {
        id: 21,
        title: "Merge Two Sorted Lists",
        slug: "merge-two-sorted-lists",
        difficulty: "Easy",
        tags: ["Linked List", "Recursion"],
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
      },
      {
        id: 146,
        title: "LRU Cache",
        slug: "lru-cache",
        difficulty: "Medium",
        tags: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"],
        url: "https://leetcode.com/problems/lru-cache/",
      },
    ],
  },

  // Level 11: Recursion
  {
    id: 11,
    levelNumber: 11,
    title: "Recursion",
    shortTitle: "Recursion",
    tag: "MEDIUM",
    description:
      "Base cases, induction steps, call stack tree execution, divide-and-conquer principles, and tail-call optimization.",
    x: 50,
    y: 1780,
    youtubeVideoId: "IJDJ0kBx2LM",
    videoTitle: "Recursion in Programming - Full Course",
    videoChannel: "freeCodeCamp.org",
    videoDuration: "1:55:00",
    keyTakeaways: [
      "Base Case: Terminating condition that prevents infinite stack overflow.",
      "Recurrence Relation: Expressing problem solution in terms of subproblems of smaller input size.",
      "Call Stack Memory: Maximum recursion depth equals tree height; N depth consumes O(N) space.",
    ],
    studyResources: {
      title: "Recursion Tree & Call Stack Visualizer",
      description: "Visual trace of recursive activation frames and return values.",
      type: "Visualizer",
      notes: [
        "Divide and Conquer: Split problem into independent subproblems, solve recursively, and merge.",
      ],
    },
    problems: [
      {
        id: 509,
        title: "Fibonacci Number",
        slug: "fibonacci-number",
        difficulty: "Easy",
        tags: ["Math", "Dynamic Programming", "Recursion"],
        url: "https://leetcode.com/problems/fibonacci-number/",
      },
      {
        id: 50,
        title: "Pow(x, n)",
        slug: "powx-n",
        difficulty: "Medium",
        tags: ["Math", "Recursion"],
        url: "https://leetcode.com/problems/powx-n/",
      },
      {
        id: 234,
        title: "Palindrome Linked List",
        slug: "palindrome-linked-list",
        difficulty: "Easy",
        tags: ["Linked List", "Two Pointers", "Stack", "Recursion"],
        url: "https://leetcode.com/problems/palindrome-linked-list/",
      },
      {
        id: 24,
        title: "Swap Nodes in Pairs",
        slug: "swap-nodes-in-pairs",
        difficulty: "Medium",
        tags: ["Linked List", "Recursion"],
        url: "https://leetcode.com/problems/swap-nodes-in-pairs/",
      },
    ],
  },

  // Level 12: Trees
  {
    id: 12,
    levelNumber: 12,
    title: "Trees",
    shortTitle: "Trees",
    tag: "MEDIUM",
    description:
      "Hierarchical data, Preorder/Inorder/Postorder traversals, Level-order BFS using queues, depth calculation, and lowest common ancestor.",
    x: 18,
    y: 1950,
    youtubeVideoId: "oSWTXtMglKE",
    videoTitle: "Data Structures: Trees",
    videoChannel: "HackerRank / Gayle Laakmann McDowell",
    videoDuration: "10:15",
    keyTakeaways: [
      "Depth-First Traversals: Preorder (Root-L-R), Inorder (L-Root-R), Postorder (L-R-Root).",
      "Breadth-First Search (Level Order): Use an explicit queue to traverse node layer by layer.",
      "Tree Diameter: Longest path between any two nodes; computed during postorder height traversal.",
    ],
    studyResources: {
      title: "VisuAlgo Binary Tree Visualizer",
      description: "Interactive traversal animations and subtree property checks.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/bst",
      notes: [
        "For any binary tree with N nodes, there are N + 1 null pointer references.",
      ],
    },
    problems: [
      {
        id: 104,
        title: "Maximum Depth of Binary Tree",
        slug: "maximum-depth-of-binary-tree",
        difficulty: "Easy",
        tags: ["Tree", "DFS", "BFS", "Binary Tree"],
        url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
      },
      {
        id: 226,
        title: "Invert Binary Tree",
        slug: "invert-binary-tree",
        difficulty: "Easy",
        tags: ["Tree", "DFS", "BFS", "Binary Tree"],
        url: "https://leetcode.com/problems/invert-binary-tree/",
      },
      {
        id: 102,
        title: "Binary Tree Level Order Traversal",
        slug: "binary-tree-level-order-traversal",
        difficulty: "Medium",
        tags: ["Tree", "BFS", "Binary Tree"],
        url: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
      },
      {
        id: 236,
        title: "Lowest Common Ancestor of a Binary Tree",
        slug: "lowest-common-ancestor-of-a-binary-tree",
        difficulty: "Medium",
        tags: ["Tree", "DFS", "Binary Tree"],
        url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
      },
    ],
  },

  // Level 13: BST (Binary Search Tree)
  {
    id: 13,
    levelNumber: 13,
    title: "BST",
    shortTitle: "BST",
    tag: "MEDIUM",
    description:
      "BST property (Left < Root < Right), sorted inorder traversal property, O(log N) search/insert, successor/predecessor, and validation.",
    x: 50,
    y: 2120,
    youtubeVideoId: "pYT9F8_LFTM",
    videoTitle: "Data structures: Binary Search Tree",
    videoChannel: "mycodeschool",
    videoDuration: "14:50",
    keyTakeaways: [
      "BST Invariant: Every node in left subtree < root < every node in right subtree.",
      "Inorder Traversal: Traversal of a BST produces strictly ascending sorted order.",
      "Skewed BST: In worst case (inserted sorted), tree degrades to linked list O(N); balanced BST is O(log N).",
    ],
    studyResources: {
      title: "BST Deletion & Rebalancing Invariant Guide",
      description: "Handling node deletion with 0, 1, or 2 children using inorder successor.",
      type: "Article",
      notes: [
        "Validation Pitfall: Checking only immediate children is insufficient; pass (min_val, max_val) bounds recursively.",
      ],
    },
    problems: [
      {
        id: 700,
        title: "Search in a Binary Search Tree",
        slug: "search-in-a-binary-search-tree",
        difficulty: "Easy",
        tags: ["Tree", "Binary Search Tree", "Binary Tree"],
        url: "https://leetcode.com/problems/search-in-a-binary-search-tree/",
      },
      {
        id: 98,
        title: "Validate Binary Search Tree",
        slug: "validate-binary-search-tree",
        difficulty: "Medium",
        tags: ["Tree", "DFS", "Binary Search Tree", "Binary Tree"],
        url: "https://leetcode.com/problems/validate-binary-search-tree/",
      },
      {
        id: 230,
        title: "Kth Smallest Element in a BST",
        slug: "kth-smallest-element-in-a-bst",
        difficulty: "Medium",
        tags: ["Tree", "DFS", "Binary Search Tree", "Binary Tree"],
        url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
      },
      {
        id: 450,
        title: "Delete Node in a BST",
        slug: "delete-node-in-a-bst",
        difficulty: "Medium",
        tags: ["Tree", "Binary Search Tree", "Binary Tree"],
        url: "https://leetcode.com/problems/delete-node-in-a-bst/",
      },
    ],
  },

  // Level 14: Heap
  {
    id: 14,
    levelNumber: 14,
    title: "Heap",
    shortTitle: "Heap",
    tag: "MEDIUM",
    description:
      "Min-heaps, max-heaps, complete binary tree array mapping (2i+1, 2i+2), O(N) heapify construction, and Top-K streaming patterns.",
    x: 80,
    y: 2290,
    youtubeVideoId: "HqPJF2L5h9U",
    videoTitle: "2.6.3 Heap - Heap Sort - Heapify - Priority Queues",
    videoChannel: "Abdul Bari",
    videoDuration: "31:40",
    keyTakeaways: [
      "Heap Invariant: Root is always smallest (min-heap) or largest (max-heap) among all descendants.",
      "Heapify O(N): Building a heap from an array takes linear time, not O(N log N).",
      "Two Heaps Pattern: Maintain max-heap for lower half and min-heap for upper half to find median in O(1).",
    ],
    studyResources: {
      title: "VisuAlgo Binary Heap & Priority Queue Visualizer",
      description: "Interactive visual sift-up, sift-down, and heap sort.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/heap",
      notes: [
        "In Python, heapq is always a min-heap; to simulate max-heap, push negative values (-val).",
      ],
    },
    problems: [
      {
        id: 215,
        title: "Kth Largest Element in an Array",
        slug: "kth-largest-element-in-an-array",
        difficulty: "Medium",
        tags: ["Array", "Divide and Conquer", "Sorting", "Heap"],
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
      },
      {
        id: 347,
        title: "Top K Frequent Elements",
        slug: "top-k-frequent-elements",
        difficulty: "Medium",
        tags: ["Array", "Hash Table", "Sorting", "Heap", "Bucket Sort"],
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
      },
      {
        id: 973,
        title: "K Closest Points to Origin",
        slug: "k-closest-points-to-origin",
        difficulty: "Medium",
        tags: ["Array", "Math", "Geometry", "Sorting", "Heap"],
        url: "https://leetcode.com/problems/k-closest-points-to-origin/",
      },
      {
        id: 295,
        title: "Find Median from Data Stream",
        slug: "find-median-from-data-stream",
        difficulty: "Hard",
        tags: ["Two Pointers", "Design", "Sorting", "Heap", "Data Stream"],
        url: "https://leetcode.com/problems/find-median-from-data-stream/",
      },
    ],
  },

  // Level 15: Backtracking
  {
    id: 15,
    levelNumber: 15,
    title: "Backtracking",
    shortTitle: "Backtracking",
    tag: "HARD",
    description:
      "State space tree exploration, Choose-Explore-Unchoose template, branch pruning, combinations, permutations, and constraint satisfaction.",
    x: 50,
    y: 2460,
    youtubeVideoId: "DKCbsiDBN6c",
    videoTitle: "6 Introduction to Backtracking - Abdul Bari",
    videoChannel: "Abdul Bari",
    videoDuration: "20:15",
    keyTakeaways: [
      "Template: 1. Base case check, 2. Iterate candidates, 3. Choose candidate, 4. Recurse, 5. Unchoose (backtrack state).",
      "Pruning: Check validity constraints before recursing to prune exponential branches.",
      "Subsets vs Permutations: Subsets pass start_index; Permutations use visited boolean array.",
    ],
    studyResources: {
      title: "State Space Tree Pruning & Recursion Visualizer",
      description: "Visual trace of N-Queens and Sudoku candidate validation.",
      type: "Visualizer",
      notes: [
        "Sorting input allows skipping duplicates with condition: if i > start and nums[i] == nums[i-1]: continue.",
      ],
    },
    problems: [
      {
        id: 78,
        title: "Subsets",
        slug: "subsets",
        difficulty: "Medium",
        tags: ["Array", "Backtracking", "Bit Manipulation"],
        url: "https://leetcode.com/problems/subsets/",
      },
      {
        id: 46,
        title: "Permutations",
        slug: "permutations",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/permutations/",
      },
      {
        id: 39,
        title: "Combination Sum",
        slug: "combination-sum",
        difficulty: "Medium",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/combination-sum/",
      },
      {
        id: 51,
        title: "N-Queens",
        slug: "n-queens",
        difficulty: "Hard",
        tags: ["Array", "Backtracking"],
        url: "https://leetcode.com/problems/n-queens/",
      },
    ],
  },

  // Level 16: Graphs
  {
    id: 16,
    levelNumber: 16,
    title: "Graphs",
    shortTitle: "Graphs",
    tag: "HARD",
    description:
      "Adjacency list representations, BFS (shortest path in unweighted graphs), DFS (connected components), Topological Sort (Kahn's), and Dijkstra algorithm.",
    x: 18,
    y: 2630,
    youtubeVideoId: "pcKY4hjDrxk",
    videoTitle: "5.1 Graph Traversals - BFS & DFS",
    videoChannel: "Abdul Bari",
    videoDuration: "24:50",
    keyTakeaways: [
      "Representation: Adjacency list vector<vector<int>> is O(V + E) space; adjacency matrix is O(V^2).",
      "Cycle Detection in Directed Graphs: 3-color states (0=unvisited, 1=in current recursion path, 2=fully processed).",
      "Dijkstra Shortest Path: Min-heap priority queue finds shortest paths in non-negative weighted graphs in O((V + E) log V).",
    ],
    studyResources: {
      title: "VisuAlgo Graph Traversal & Shortest Path Visualizer",
      description: "Interactive BFS, DFS, and Dijkstra step animations.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en/graphds",
      notes: [
        "Grid Graphs: Treat each cell (r, c) as a graph node with 4 orthogonal neighbor edges.",
      ],
    },
    problems: [
      {
        id: 200,
        title: "Number of Islands",
        slug: "number-of-islands",
        difficulty: "Medium",
        tags: ["Array", "DFS", "BFS", "Union Find", "Matrix"],
        url: "https://leetcode.com/problems/number-of-islands/",
      },
      {
        id: 133,
        title: "Clone Graph",
        slug: "clone-graph",
        difficulty: "Medium",
        tags: ["Hash Table", "DFS", "BFS", "Graph"],
        url: "https://leetcode.com/problems/clone-graph/",
      },
      {
        id: 207,
        title: "Course Schedule",
        slug: "course-schedule",
        difficulty: "Medium",
        tags: ["DFS", "BFS", "Graph", "Topological Sort"],
        url: "https://leetcode.com/problems/course-schedule/",
      },
      {
        id: 743,
        title: "Network Delay Time",
        slug: "network-delay-time",
        difficulty: "Medium",
        tags: ["DFS", "BFS", "Graph", "Heap", "Shortest Path"],
        url: "https://leetcode.com/problems/network-delay-time/",
      },
    ],
  },

  // Level 17: Greedy
  {
    id: 17,
    levelNumber: 17,
    title: "Greedy",
    shortTitle: "Greedy",
    tag: "MEDIUM",
    description:
      "Locally optimal choices leading to global optima, interval scheduling, exchange arguments, and proving greedy correctness.",
    x: 50,
    y: 2800,
    youtubeVideoId: "ARvQcqJ_-NY",
    videoTitle: "3. Greedy Method - Introduction",
    videoChannel: "Abdul Bari",
    videoDuration: "17:15",
    keyTakeaways: [
      "Greedy Choice Property: A global optimum can be arrived at by selecting a local optimum.",
      "Optimal Substructure: An optimal solution to the problem contains optimal solutions to subproblems.",
      "Interval Scheduling: Sorting intervals by end time maximizes compatible non-overlapping intervals.",
    ],
    studyResources: {
      title: "Greedy Strategy & Exchange Argument Proofs",
      description: "When greedy works vs when dynamic programming is mandatory.",
      type: "Article",
      notes: [
        "Counterexample Test: If an exchange argument fails, the problem requires dynamic programming.",
      ],
    },
    problems: [
      {
        id: 455,
        title: "Assign Cookies",
        slug: "assign-cookies",
        difficulty: "Easy",
        tags: ["Array", "Two Pointers", "Greedy", "Sorting"],
        url: "https://leetcode.com/problems/assign-cookies/",
      },
      {
        id: 55,
        title: "Jump Game",
        slug: "jump-game",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Greedy"],
        url: "https://leetcode.com/problems/jump-game/",
      },
      {
        id: 134,
        title: "Gas Station",
        slug: "gas-station",
        difficulty: "Medium",
        tags: ["Array", "Greedy"],
        url: "https://leetcode.com/problems/gas-station/",
      },
      {
        id: 435,
        title: "Non-overlapping Intervals",
        slug: "non-overlapping-intervals",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "Greedy", "Sorting"],
        url: "https://leetcode.com/problems/non-overlapping-intervals/",
      },
    ],
  },

  // Level 18: Dynamic Programming
  {
    id: 18,
    levelNumber: 18,
    title: "Dynamic Programming",
    shortTitle: "Dynamic Programming",
    tag: "HARD",
    description:
      "Overlapping subproblems, state transition equations, top-down memoization, bottom-up tabulation, and space optimization techniques.",
    x: 80,
    y: 2970,
    youtubeVideoId: "oBt53YbR9Kk",
    videoTitle: "Dynamic Programming - Learn to Solve Algorithmic Problems",
    videoChannel: "freeCodeCamp.org",
    videoDuration: "5:10:00",
    keyTakeaways: [
      "State Definition: Clearly define what dp[i] or dp[i][j] represents.",
      "Transition Equation: Relate current state to previously solved states (e.g. dp[i] = max(dp[i-1], dp[i-2] + val)).",
      "Space Optimization: If current state depends only on previous 1 or 2 rows, reduce O(N) space to O(1) variables.",
    ],
    studyResources: {
      title: "VisuAlgo Dynamic Programming Matrix Visualizer",
      description: "Interactive visual memoization table and bottom-up grid filling.",
      type: "Visualizer",
      linkUrl: "https://visualgo.net/en",
      notes: [
        "1D vs 2D DP: Knapsack, LCS, and Edit Distance require 2D state matrix tracking.",
      ],
    },
    problems: [
      {
        id: 70,
        title: "Climbing Stairs",
        slug: "climbing-stairs",
        difficulty: "Easy",
        tags: ["Math", "Dynamic Programming", "Memoization"],
        url: "https://leetcode.com/problems/climbing-stairs/",
      },
      {
        id: 198,
        title: "House Robber",
        slug: "house-robber",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming"],
        url: "https://leetcode.com/problems/house-robber/",
      },
      {
        id: 322,
        title: "Coin Change",
        slug: "coin-change",
        difficulty: "Medium",
        tags: ["Array", "Dynamic Programming", "BFS"],
        url: "https://leetcode.com/problems/coin-change/",
      },
      {
        id: 1143,
        title: "Longest Common Subsequence",
        slug: "longest-common-subsequence",
        difficulty: "Medium",
        tags: ["String", "Dynamic Programming"],
        url: "https://leetcode.com/problems/longest-common-subsequence/",
      },
    ],
  },
];

