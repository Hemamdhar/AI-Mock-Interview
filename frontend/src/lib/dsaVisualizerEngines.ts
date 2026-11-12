// Algorithmic step generator for 3D DSA Visualizations

export interface SortingStep {
  array: number[];
  comparing: number[]; // indices of elements currently being compared
  swapped: number[]; // indices of elements being swapped
  sorted: number[]; // indices of elements finalized in sorted order
  pointers: { label: string; index: number; color?: string }[];
  description: string;
}

export interface TreeVisualizerNode {
  id: string;
  value: number;
  x: number;
  y: number;
  z: number;
  leftId?: string;
  rightId?: string;
}

export interface TreeStep {
  nodes: TreeVisualizerNode[];
  activeNodeId?: string;
  visitedNodeIds: string[];
  activeEdge?: [string, string];
  description: string;
}

export interface GraphVisualizerNode {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
}

export interface GraphVisualizerEdge {
  from: string;
  to: string;
  weight?: number;
}

export interface GraphStep {
  nodes: GraphVisualizerNode[];
  edges: GraphVisualizerEdge[];
  activeNodeId?: string;
  visitedNodeIds: string[];
  activeEdge?: [string, string];
  description: string;
}

export interface LinearStep {
  array: (number | string)[];
  activeIndices: number[];
  pointers: { label: string; index: number; color?: string }[];
  description: string;
}

// ==========================================
// SORTING ALGORITHM STEP GENERATORS
// ==========================================

export function generateSelectionSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    pointers: [],
    description: "Initial unsorted array. Selection Sort will find the smallest element in each pass.",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      comparing: [i],
      swapped: [],
      sorted: [...sortedIndices],
      pointers: [
        { label: "i (target)", index: i, color: "#38bdf8" },
        { label: "min", index: minIdx, color: "#f59e0b" },
      ],
      description: `Starting pass ${i + 1}. Current assumed minimum is index ${i} (value ${arr[i]}).`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapped: [],
        sorted: [...sortedIndices],
        pointers: [
          { label: "i", index: i, color: "#38bdf8" },
          { label: "j", index: j, color: "#a855f7" },
          { label: "min", index: minIdx, color: "#f59e0b" },
        ],
        description: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}).`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapped: [],
          sorted: [...sortedIndices],
          pointers: [
            { label: "i", index: i, color: "#38bdf8" },
            { label: "new min", index: minIdx, color: "#f59e0b" },
          ],
          description: `Found smaller element ${arr[minIdx]} at index ${minIdx}. Updated minimum pointer.`,
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [i, minIdx],
        sorted: [...sortedIndices],
        pointers: [
          { label: "swap", index: i, color: "#f43f5e" },
          { label: "swap", index: minIdx, color: "#f43f5e" },
        ],
        description: `Swapping arr[${i}] (${arr[i]}) with minimum arr[${minIdx}] (${arr[minIdx]}).`,
      });
      const temp = arr[i];
      arr[i] = arr[minIdx];
      arr[minIdx] = temp;
    }

    sortedIndices.push(i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sortedIndices],
      pointers: [{ label: "sorted", index: i, color: "#10b981" }],
      description: `Element ${arr[i]} is now locked at index ${i} in its final sorted position.`,
    });
  }

  sortedIndices.push(n - 1);
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [...sortedIndices],
    pointers: [],
    description: "Array is completely sorted with O(N^2) comparisons and minimal O(N) swaps.",
  });

  return steps;
}

export function generateBubbleSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    pointers: [],
    description: "Initial unsorted array. Bubble Sort compares adjacent pairs and bubbles the largest element to the end.",
  });

  for (let i = 0; i < n; i++) {
    let swappedAny = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: [],
        sorted: [...sortedIndices],
        pointers: [
          { label: "left", index: j, color: "#38bdf8" },
          { label: "right", index: j + 1, color: "#f59e0b" },
        ],
        description: `Comparing adjacent elements arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapped: [j, j + 1],
          sorted: [...sortedIndices],
          pointers: [
            { label: "swap", index: j, color: "#f43f5e" },
            { label: "swap", index: j + 1, color: "#f43f5e" },
          ],
          description: `arr[${j}] (${arr[j]}) > arr[${j + 1}] (${arr[j + 1]}). Swapping them.`,
        });
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swappedAny = true;
      }
    }

    const lockedIdx = n - i - 1;
    sortedIndices.push(lockedIdx);
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: [...sortedIndices],
      pointers: [{ label: "bubbled", index: lockedIdx, color: "#10b981" }],
      description: `Pass ${i + 1} complete. Value ${arr[lockedIdx]} bubbled to index ${lockedIdx}.`,
    });

    if (!swappedAny) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [],
        sorted: Array.from({ length: n }, (_, k) => k),
        pointers: [],
        description: "Early exit optimization triggered: zero swaps occurred during pass. Array is fully sorted.",
      });
      break;
    }
  }

  return steps;
}

export function generateInsertionSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [0],
    pointers: [{ label: "sorted", index: 0, color: "#10b981" }],
    description: "Initial array. Single element arr[0] is trivially sorted.",
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparing: [i],
      swapped: [],
      sorted: Array.from({ length: i }, (_, k) => k),
      pointers: [{ label: "key", index: i, color: "#f59e0b" }],
      description: `Picking key arr[${i}] = ${key} to insert into sorted prefix arr[0..${i - 1}].`,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        comparing: [j],
        swapped: [],
        sorted: [],
        pointers: [
          { label: "comparing", index: j, color: "#38bdf8" },
          { label: "key: " + key, index: j + 1, color: "#f59e0b" },
        ],
        description: `arr[${j}] (${arr[j]}) > key (${key}). Shifting arr[${j}] right to index ${j + 1}.`,
      });

      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [j + 1],
        sorted: [],
        pointers: [{ label: "shifted", index: j + 1, color: "#f43f5e" }],
        description: `Shifted ${arr[j + 1]} to index ${j + 1}.`,
      });
      j--;
    }

    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      pointers: [{ label: "inserted", index: j + 1, color: "#10b981" }],
      description: `Inserted key ${key} into position ${j + 1}. Prefix arr[0..${i}] is now sorted.`,
    });
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    description: "Insertion Sort complete.",
  });

  return steps;
}

export function generateQuickSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const sortedIndices = new Set<number>();

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    pointers: [],
    description: "QuickSort: Divide-and-conquer using Lomuto partitioning around a pivot element.",
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    steps.push({
      array: [...arr],
      comparing: [high],
      swapped: [],
      sorted: Array.from(sortedIndices),
      pointers: [{ label: "pivot", index: high, color: "#f59e0b" }],
      description: `Partitioning subarray [${low}..${high}]. Selected pivot arr[${high}] = ${pivot}.`,
    });

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, high],
        swapped: [],
        sorted: Array.from(sortedIndices),
        pointers: [
          { label: "j", index: j, color: "#38bdf8" },
          { label: "pivot", index: high, color: "#f59e0b" },
          ...(i >= low ? [{ label: "i (<= pivot)", index: i, color: "#a855f7" }] : []),
        ],
        description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          steps.push({
            array: [...arr],
            comparing: [],
            swapped: [i, j],
            sorted: Array.from(sortedIndices),
            pointers: [
              { label: "swapped", index: i, color: "#f43f5e" },
              { label: "swapped", index: j, color: "#f43f5e" },
            ],
            description: `arr[${j}] <= pivot. Swapped arr[${i}] and arr[${j}].`,
          });
        }
      }
    }

    const pIdx = i + 1;
    if (pIdx !== high) {
      const temp = arr[pIdx];
      arr[pIdx] = arr[high];
      arr[high] = temp;
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [pIdx, high],
        sorted: Array.from(sortedIndices),
        pointers: [{ label: "pivot placed", index: pIdx, color: "#10b981" }],
        description: `Placed pivot ${pivot} into its sorted final index ${pIdx}.`,
      });
    }

    sortedIndices.add(pIdx);
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: Array.from(sortedIndices),
      pointers: [{ label: "fixed", index: pIdx, color: "#10b981" }],
      description: `Pivot ${arr[pIdx]} at index ${pIdx} is now permanently sorted. Left half <= ${arr[pIdx]}, right half >= ${arr[pIdx]}.`,
    });

    return pIdx;
  }

  function quickSort(low: number, high: number) {
    if (low < high) {
      const p = partition(low, high);
      quickSort(low, p - 1);
      quickSort(p + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  quickSort(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: arr.length }, (_, k) => k),
    pointers: [],
    description: "QuickSort complete. Entire array is sorted.",
  });

  return steps;
}

export function generateMergeSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    pointers: [],
    description: "MergeSort: Divide and conquer. Splits array recursively in halves, then merges sorted runs.",
  });

  function merge(low: number, mid: number, high: number) {
    steps.push({
      array: [...arr],
      comparing: [mid],
      swapped: [],
      sorted: [],
      pointers: [
        { label: "left run", index: low, color: "#38bdf8" },
        { label: "right run", index: mid + 1, color: "#f59e0b" },
      ],
      description: `Merging sorted run [${low}..${mid}] with sorted run [${mid + 1}..${high}].`,
    });

    const left = arr.slice(low, mid + 1);
    const right = arr.slice(mid + 1, high + 1);
    let i = 0, j = 0, k = low;

    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        comparing: [k],
        swapped: [],
        sorted: [],
        pointers: [
          { label: `L[${i}]: ${left[i]}`, index: low + i, color: "#38bdf8" },
          { label: `R[${j}]: ${right[j]}`, index: mid + 1 + j, color: "#f59e0b" },
        ],
        description: `Comparing left value ${left[i]} with right value ${right[j]}.`,
      });

      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }

      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sorted: [],
        pointers: [{ label: "merged", index: k, color: "#10b981" }],
        description: `Wrote ${arr[k]} to merged index ${k}.`,
      });
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i];
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sorted: [],
        pointers: [{ label: "flushed", index: k, color: "#10b981" }],
        description: `Flushed remaining left element ${arr[k]} to index ${k}.`,
      });
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j];
      steps.push({
        array: [...arr],
        comparing: [],
        swapped: [k],
        sorted: [],
        pointers: [{ label: "flushed", index: k, color: "#10b981" }],
        description: `Flushed remaining right element ${arr[k]} to index ${k}.`,
      });
      j++;
      k++;
    }
  }

  function mergeSort(low: number, high: number) {
    if (low < high) {
      const mid = Math.floor((low + high) / 2);
      mergeSort(low, mid);
      mergeSort(mid + 1, high);
      merge(low, mid, high);
    }
  }

  mergeSort(0, n - 1);

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    description: "MergeSort complete. O(N log N) runtime with guaranteed stability.",
  });

  return steps;
}

export function generateHeapSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sortedIndices = new Set<number>();

  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: [],
    pointers: [],
    description: "HeapSort: 1. Build a Max-Heap in O(N). 2. Repeatedly extract max to end of array.",
  });

  function heapify(heapSize: number, rootIdx: number) {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < heapSize && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < heapSize && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== rootIdx) {
      steps.push({
        array: [...arr],
        comparing: [rootIdx, largest],
        swapped: [rootIdx, largest],
        sorted: Array.from(sortedIndices),
        pointers: [
          { label: "parent", index: rootIdx, color: "#38bdf8" },
          { label: "larger child", index: largest, color: "#f59e0b" },
        ],
        description: `Heap violation: child arr[${largest}] (${arr[largest]}) > parent arr[${rootIdx}] (${arr[rootIdx]}). Sifting down.`,
      });

      const temp = arr[rootIdx];
      arr[rootIdx] = arr[largest];
      arr[largest] = temp;

      heapify(heapSize, largest);
    }
  }

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    array: [...arr],
    comparing: [0],
    swapped: [],
    sorted: [],
    pointers: [{ label: "max root", index: 0, color: "#10b981" }],
    description: `Max-Heap constructed. Maximum value ${arr[0]} is at root index 0.`,
  });

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [0, i],
      sorted: Array.from(sortedIndices),
      pointers: [
        { label: "max", index: 0, color: "#f43f5e" },
        { label: "heap end", index: i, color: "#38bdf8" },
      ],
      description: `Extracting max ${arr[0]} to position ${i}.`,
    });

    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    sortedIndices.add(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapped: [],
      sorted: Array.from(sortedIndices),
      pointers: [{ label: "sorted", index: i, color: "#10b981" }],
      description: `Value ${arr[i]} locked at index ${i}. Sifting down new root ${arr[0]} to restore heap property.`,
    });

    heapify(i, 0);
  }

  sortedIndices.add(0);
  steps.push({
    array: [...arr],
    comparing: [],
    swapped: [],
    sorted: Array.from({ length: n }, (_, k) => k),
    pointers: [],
    description: "HeapSort complete. Array is sorted in O(N log N) time with O(1) auxiliary space.",
  });

  return steps;
}

// Master dispatcher for sorting algorithms
export function getSortingAlgorithmSteps(algorithm: string, data: number[]): SortingStep[] {
  switch (algorithm) {
    case "selection":
      return generateSelectionSortSteps(data);
    case "bubble":
      return generateBubbleSortSteps(data);
    case "insertion":
      return generateInsertionSortSteps(data);
    case "quick":
      return generateQuickSortSteps(data);
    case "merge":
      return generateMergeSortSteps(data);
    case "heap":
      return generateHeapSortSteps(data);
    default:
      return generateSelectionSortSteps(data);
  }
}

