"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Activity,
  ArrowRight,
  Check,
  Layers,
  Clock,
  HardDrive,
  ChevronDown,
} from "lucide-react";
import { LevelData } from "@/data/dsaRoadmap";
import { LEVEL_SUB_METHODS, SubMethodData } from "@/data/dsaSubMethods";
import {
  getSortingAlgorithmSteps,
  SortingStep,
} from "@/lib/dsaVisualizerEngines";

interface DSA2DLabProps {
  level?: LevelData;
  subMethod?: SubMethodData;
}

const DEFAULT_SORT_ARRAY = [44, 18, 72, 29, 86, 12, 53, 37];

export const DSA2DLab: React.FC<DSA2DLabProps> = ({ level, subMethod }) => {
  const effectiveLevelId = subMethod ? subMethod.parentLevelId : (level?.id || 1);
  const effectiveLevelNumber = subMethod ? subMethod.parentLevelId : (level?.levelNumber || effectiveLevelId);

  // Available sub-methods for this level
  const subMethods = useMemo(() => {
    return LEVEL_SUB_METHODS[effectiveLevelId] || [];
  }, [effectiveLevelId]);

  // Selected sub-method
  const [selectedSubMethodId, setSelectedSubMethodId] = useState<string>(() => {
    return subMethod?.id || subMethods[0]?.id || "";
  });

  // Keep selected sub-method in sync if props change
  useEffect(() => {
    if (subMethod) {
      setSelectedSubMethodId(subMethod.id);
    } else if (subMethods.length > 0) {
      setSelectedSubMethodId(subMethods[0].id);
    }
  }, [subMethod?.id, level?.id, subMethods]);

  const activeSubMethod: SubMethodData | undefined = useMemo(() => {
    if (subMethod) return subMethod;
    return subMethods.find((sm) => sm.id === selectedSubMethodId) || subMethods[0];
  }, [subMethods, selectedSubMethodId, subMethod]);

  // ----------------------------------------------------
  // SORTING 2D VISUALIZER STATE (Used for Sorting Level 7)
  // ----------------------------------------------------
  const [sortArray, setSortArray] = useState<number[]>(DEFAULT_SORT_ARRAY);
  const [customInputText, setCustomInputText] = useState("");
  const [sortStepIndex, setSortStepIndex] = useState(0);
  const [isSortPlaying, setIsSortPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x

  // Generate steps based on active sorting algorithm
  const sortingSteps: SortingStep[] = useMemo(() => {
    const algo = activeSubMethod?.visualizerAlgorithm || "selection";
    return getSortingAlgorithmSteps(algo, sortArray);
  }, [activeSubMethod?.visualizerAlgorithm, sortArray]);

  const currentSortStep = sortingSteps[sortStepIndex] || sortingSteps[0];

  // Reset step whenever algorithm or array changes
  useEffect(() => {
    setSortStepIndex(0);
    setIsSortPlaying(false);
  }, [selectedSubMethodId, sortArray]);

  // Playback timer
  useEffect(() => {
    if (!isSortPlaying) return;

    const intervalTime = Math.max(250, 900 / playbackSpeed);
    const timer = setInterval(() => {
      setSortStepIndex((prev) => {
        if (prev < sortingSteps.length - 1) {
          return prev + 1;
        } else {
          setIsSortPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSortPlaying, sortingSteps.length, playbackSpeed]);

  const handleShuffleSort = () => {
    setIsSortPlaying(false);
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 12);
    setSortArray(newArr);
  };

  const handleApplyCustomSort = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;
    const parsed = customInputText
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0 && n <= 100);

    if (parsed.length >= 3 && parsed.length <= 12) {
      setSortArray(parsed);
      setCustomInputText("");
    }
  };

  // ----------------------------------------------------
  // BINARY SEARCH 2D VISUALIZER STATE (Used for Level 6)
  // ----------------------------------------------------
  const BS_ARRAY = useMemo(() => [8, 14, 21, 29, 36, 45, 52, 63, 71, 84, 95], []);
  const [bsTarget, setBsTarget] = useState<number>(45);
  const [bsStepIndex, setBsStepIndex] = useState(0);

  const bsSteps = useMemo(() => {
    const steps: {
      low: number;
      mid: number;
      high: number;
      found: boolean;
      desc: string;
    }[] = [];

    let low = 0;
    let high = BS_ARRAY.length - 1;
    let found = false;

    steps.push({
      low,
      mid: Math.floor((low + high) / 2),
      high,
      found: false,
      desc: `Searching for target ${bsTarget} in sorted array of length ${BS_ARRAY.length}. Initial search range: [0..${high}].`,
    });

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (BS_ARRAY[mid] === bsTarget) {
        steps.push({
          low,
          mid,
          high,
          found: true,
          desc: `Target ${bsTarget} found at index ${mid} (arr[${mid}] == ${bsTarget}). Search completed successfully.`,
        });
        found = true;
        break;
      } else if (BS_ARRAY[mid] < bsTarget) {
        steps.push({
          low,
          mid,
          high,
          found: false,
          desc: `arr[${mid}] (${BS_ARRAY[mid]}) < target (${bsTarget}). Target must lie in the right half. Updating low = ${mid + 1}.`,
        });
        low = mid + 1;
      } else {
        steps.push({
          low,
          mid,
          high,
          found: false,
          desc: `arr[${mid}] (${BS_ARRAY[mid]}) > target (${bsTarget}). Target must lie in the left half. Updating high = ${mid - 1}.`,
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        low,
        mid: -1,
        high,
        found: false,
        desc: `Search space exhausted (low > high). Target ${bsTarget} does not exist in array.`,
      });
    }

    return steps;
  }, [BS_ARRAY, bsTarget]);

  // ----------------------------------------------------
  // TWO POINTERS / ARRAYS 2D VISUALIZER (Used for Level 3)
  // ----------------------------------------------------
  const TP_ARRAY = useMemo(() => [2, 7, 11, 15, 19, 23], []);
  const TP_TARGET = 26;
  const [tpStepIndex, setTpStepIndex] = useState(0);

  const tpSteps = useMemo(() => {
    const steps: { left: number; right: number; sum: number; found: boolean; desc: string }[] = [];
    let l = 0;
    let r = TP_ARRAY.length - 1;

    while (l < r) {
      const sum = TP_ARRAY[l] + TP_ARRAY[r];
      if (sum === TP_TARGET) {
        steps.push({
          left: l,
          right: r,
          sum,
          found: true,
          desc: `Found pair! arr[${l}] (${TP_ARRAY[l]}) + arr[${r}] (${TP_ARRAY[r]}) = ${sum} == target (${TP_TARGET}).`,
        });
        break;
      } else if (sum < TP_TARGET) {
        steps.push({
          left: l,
          right: r,
          sum,
          found: false,
          desc: `Sum arr[${l}] (${TP_ARRAY[l]}) + arr[${r}] (${TP_ARRAY[r]}) = ${sum} < ${TP_TARGET}. Advance left pointer to increase sum.`,
        });
        l++;
      } else {
        steps.push({
          left: l,
          right: r,
          sum,
          found: false,
          desc: `Sum arr[${l}] (${TP_ARRAY[l]}) + arr[${r}] (${TP_ARRAY[r]}) = ${sum} > ${TP_TARGET}. Decrement right pointer to decrease sum.`,
        });
        r--;
      }
    }
    return steps;
  }, [TP_ARRAY]);

  // ----------------------------------------------------
  // STACK 2D VISUALIZER (Used for Level 8)
  // ----------------------------------------------------
  const [stackItems, setStackItems] = useState<string[]>(["(", "{", "["]);
  const [stackInput, setStackInput] = useState("");

  const handlePushStack = () => {
    if (stackInput.trim() && stackItems.length < 6) {
      setStackItems((prev) => [...prev, stackInput.trim()]);
      setStackInput("");
    }
  };

  const handlePopStack = () => {
    setStackItems((prev) => prev.slice(0, -1));
  };

  // ----------------------------------------------------
  // TREE / BST 2D VISUALIZER (Used for Levels 12 & 13)
  // ----------------------------------------------------
  const [treeTraverseStep, setTreeTraverseStep] = useState(0);
  const treeNodes = useMemo(
    () => [
      { id: "root", val: 50, x: 250, y: 35, left: "n1", right: "n2" },
      { id: "n1", val: 30, x: 130, y: 105, left: "n3", right: "n4" },
      { id: "n2", val: 70, x: 370, y: 105, left: "n5", right: "n6" },
      { id: "n3", val: 20, x: 75, y: 175 },
      { id: "n4", val: 40, x: 185, y: 175 },
      { id: "n5", val: 60, x: 315, y: 175 },
      { id: "n6", val: 80, x: 425, y: 175 },
    ],
    []
  );

  const inorderSequence = useMemo(() => [20, 30, 40, 50, 60, 70, 80], []);

  // ----------------------------------------------------
  // RENDER VISUALIZER CONTENT BASED ON LEVEL TYPE
  // ----------------------------------------------------
  return (
    <div className="space-y-4">
      {/* 1. Sub-Method Selector Pills (only displayed when browsing level overview without a pre-selected sub-method) */}
      {!subMethod && subMethods.length > 1 && (
        <div className="p-3 rounded-lg bg-zinc-900/70 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              SELECT METHOD / ALGORITHM ({subMethods.length} Methods Available)
            </span>
            {activeSubMethod && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>Avg: {activeSubMethod.timeComplexity.average}</span>
                <span>•</span>
                <span>Space: {activeSubMethod.spaceComplexity}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
            {subMethods.map((sm) => {
              const isSelected = sm.id === selectedSubMethodId;
              return (
                <button
                  key={sm.id}
                  type="button"
                  onClick={() => setSelectedSubMethodId(sm.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-zinc-100 text-zinc-950 shadow-xs"
                      : "bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60"
                  }`}
                >
                  <span className="text-[10px] font-mono opacity-70">
                    {effectiveLevelNumber}.{sm.subNumber}
                  </span>
                  <span>{sm.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Visualizer Stage Container */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#09090b] border border-zinc-800/90 shadow-xl space-y-4">
        {/* CASE A: SORTING LEVEL (Level 7) */}
        {effectiveLevelId === 7 && (
          <div className="space-y-4">
            {/* Header / Algorithm Title & Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>2D Bar Visualizer: {activeSubMethod?.title || "Sorting"}</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Visualizing comparisons, swaps, and invariant bounds in step-by-step 2D bars.
                </p>
              </div>

              {/* Color legend */}
              <div className="flex items-center gap-2.5 text-[10px] font-mono shrink-0">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-zinc-700" />
                  <span className="text-zinc-400">Normal</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span className="text-amber-400">Compare</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  <span className="text-rose-400">Swap/Shift</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span className="text-emerald-400">Sorted</span>
                </span>
              </div>
            </div>

            {/* 2D Bar Canvas */}
            <div className="relative w-full h-56 sm:h-64 bg-zinc-950/90 rounded-md border border-zinc-800/80 p-4 flex items-end justify-center gap-2 sm:gap-3 overflow-hidden select-none">
              {currentSortStep.array.map((val, idx) => {
                const maxVal = Math.max(...currentSortStep.array, 1);
                const heightPct = Math.max(14, (val / maxVal) * 82);

                const isComparing = currentSortStep.comparing.includes(idx);
                const isSwapped = currentSortStep.swapped.includes(idx);
                const isSorted = currentSortStep.sorted.includes(idx);

                // Find active pointer on this index
                const ptr = (currentSortStep.pointers || []).find((p) => p.index === idx);

                return (
                  <div
                    key={idx}
                    className="flex-1 max-w-[48px] flex flex-col items-center justify-end h-full relative group"
                  >
                    {/* Active pointer badge hovering above */}
                    {ptr && (
                      <div className="absolute top-1 flex flex-col items-center animate-pulse">
                        <span
                          className="px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold whitespace-nowrap shadow-xs"
                          style={{
                            backgroundColor: ptr.color || "#38bdf8",
                            color: "#09090b",
                          }}
                        >
                          {ptr.label}
                        </span>
                        <ChevronDown
                          className="w-3 h-3 -mt-0.5"
                          style={{ color: ptr.color || "#38bdf8" }}
                        />
                      </div>
                    )}

                    {/* Bar Column */}
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-sm border transition-all duration-200 flex flex-col items-center justify-between py-1 ${
                        isSorted
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                          : isSwapped
                          ? "bg-rose-500/25 border-rose-500 text-rose-300"
                          : isComparing
                          ? "bg-amber-500/25 border-amber-500 text-amber-300"
                          : "bg-zinc-800/80 border-zinc-700/80 text-zinc-300"
                      }`}
                    >
                      <span className="text-[11px] font-mono font-bold">{val}</span>
                    </div>

                    {/* Index label underneath */}
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Invariant Description Box */}
            <div className="p-3.5 rounded-md bg-[#111115] border border-zinc-800 flex items-start gap-3">
              <div className="p-1 rounded-sm bg-zinc-900 border border-zinc-800 text-cyan-400 mt-0.5 shrink-0">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                    STEP {sortStepIndex + 1} OF {sortingSteps.length}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                    {Math.round(((sortStepIndex + 1) / sortingSteps.length) * 100)}% Complete
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
                  {currentSortStep.description}
                </p>
              </div>
            </div>

            {/* Playback Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSortStepIndex(0)}
                  disabled={sortStepIndex === 0}
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
                  title="Jump to Start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSortStepIndex((prev) => Math.max(0, prev - 1))}
                  disabled={sortStepIndex === 0}
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
                  title="Step Backward"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsSortPlaying(!isSortPlaying)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors"
                >
                  {isSortPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSortStepIndex((prev) => Math.min(sortingSteps.length - 1, prev + 1))
                  }
                  disabled={sortStepIndex >= sortingSteps.length - 1}
                  className="p-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
                  title="Step Forward"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Speed & Shuffle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-md bg-zinc-800 p-0.5 border border-zinc-700">
                  {([0.5, 1, 2] as const).map((spd) => (
                    <button
                      key={spd}
                      type="button"
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded-sm text-[10px] font-mono font-semibold transition-colors ${
                        playbackSpeed === spd
                          ? "bg-zinc-950 text-white shadow-xs"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleShuffleSort}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors border border-zinc-700"
                >
                  <Shuffle className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Shuffle</span>
                </button>
              </div>
            </div>

            {/* Custom Array Input */}
            <form onSubmit={handleApplyCustomSort} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Custom array (e.g. 50, 15, 80, 25, 90, 10)..."
                value={customInputText}
                onChange={(e) => setCustomInputText(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
              >
                Load Array
              </button>
            </form>
          </div>
        )}

        {/* CASE B: BINARY SEARCH LEVEL (Level 6) */}
        {effectiveLevelId === 6 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>2D Binary Search Step Engine</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Logarithmic halving: low, mid, and high pointers on sorted monotonic space.
                </p>
              </div>

              {/* Target Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-mono">Target:</span>
                <select
                  value={bsTarget}
                  onChange={(e) => {
                    setBsTarget(Number(e.target.value));
                    setBsStepIndex(0);
                  }}
                  className="px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-xs text-white font-mono focus:outline-none"
                >
                  {BS_ARRAY.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                  <option value={999}>999 (Not in Array)</option>
                </select>
              </div>
            </div>

            {/* Array Cells */}
            <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800/80 space-y-4">
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                {BS_ARRAY.map((num, idx) => {
                  const step = bsSteps[bsStepIndex] || bsSteps[0];
                  const isOutOfRange = idx < step.low || idx > step.high;
                  const isMid = idx === step.mid;
                  const isLow = idx === step.low;
                  const isHigh = idx === step.high;
                  const isFound = isMid && step.found;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="h-5 flex items-center">
                        {isMid && (
                          <span
                            className={`text-[9px] font-mono font-bold px-1 rounded-xs ${
                              isFound ? "bg-emerald-500 text-black" : "bg-cyan-400 text-black"
                            }`}
                          >
                            MID
                          </span>
                        )}
                        {isLow && !isMid && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded-xs bg-blue-500 text-white">
                            LOW
                          </span>
                        )}
                        {isHigh && !isMid && (
                          <span className="text-[9px] font-mono font-bold px-1 rounded-xs bg-amber-500 text-black">
                            HIGH
                          </span>
                        )}
                      </div>

                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-md border flex items-center justify-center font-mono font-bold text-xs sm:text-sm transition-all ${
                          isFound
                            ? "bg-emerald-500/25 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500"
                            : isMid
                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                            : isOutOfRange
                            ? "opacity-25 bg-zinc-900 border-zinc-800 text-zinc-600 line-through"
                            : "bg-zinc-900 border-zinc-700 text-white"
                        }`}
                      >
                        {num}
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 mt-1">[{idx}]</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description Card */}
            <div className="p-3.5 rounded-md bg-[#111115] border border-zinc-800 flex items-start gap-2.5">
              <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">
                  STEP {bsStepIndex + 1} OF {bsSteps.length}
                </span>
                <p className="text-xs sm:text-sm text-zinc-200 mt-0.5 leading-relaxed">
                  {bsSteps[bsStepIndex]?.desc}
                </p>
              </div>
            </div>

            {/* Stepper buttons */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setBsStepIndex(0)}
                disabled={bsStepIndex === 0}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-200"
              >
                Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBsStepIndex((p) => Math.max(0, p - 1))}
                  disabled={bsStepIndex === 0}
                  className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-xs font-semibold text-zinc-200"
                >
                  Previous Step
                </button>
                <button
                  type="button"
                  onClick={() => setBsStepIndex((p) => Math.min(bsSteps.length - 1, p + 1))}
                  disabled={bsStepIndex >= bsSteps.length - 1}
                  className="px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CASE C: ARRAYS & TWO POINTERS (Level 3) */}
        {effectiveLevelId === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Two Pointers Pair Sum Visualizer</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Target sum = {TP_TARGET}. Converging pointers from both ends in linear O(N).
                </p>
              </div>
            </div>

            <div className="p-4 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              {TP_ARRAY.map((v, i) => {
                const step = tpSteps[tpStepIndex] || tpSteps[0];
                const isLeft = i === step.left;
                const isRight = i === step.right;
                const isPairFound = (isLeft || isRight) && step.found;

                return (
                  <div key={i} className="flex flex-col items-center">
                    <div className="h-5">
                      {isLeft && (
                        <span className="text-[9px] font-mono font-bold px-1 rounded-xs bg-cyan-400 text-black">
                          LEFT
                        </span>
                      )}
                      {isRight && (
                        <span className="text-[9px] font-mono font-bold px-1 rounded-xs bg-amber-400 text-black">
                          RIGHT
                        </span>
                      )}
                    </div>

                    <div
                      className={`w-12 h-12 rounded-md border flex items-center justify-center font-mono font-bold text-sm ${
                        isPairFound
                          ? "bg-emerald-500/25 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500"
                          : isLeft || isRight
                          ? "bg-zinc-800 border-zinc-500 text-white ring-1 ring-zinc-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {v}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 mt-1">[{i}]</span>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-md bg-[#111115] border border-zinc-800 text-xs text-zinc-200">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block mb-1">
                STEP {tpStepIndex + 1} OF {tpSteps.length}
              </span>
              {tpSteps[tpStepIndex]?.desc}
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setTpStepIndex(0)}
                disabled={tpStepIndex === 0}
                className="px-3 py-1.5 rounded-md bg-zinc-800 text-xs font-semibold text-zinc-200 disabled:opacity-40"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setTpStepIndex((p) => Math.min(tpSteps.length - 1, p + 1))}
                disabled={tpStepIndex >= tpSteps.length - 1}
                className="px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-bold disabled:opacity-40"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* CASE D: STACK (Level 8) */}
        {effectiveLevelId === 8 && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>2D LIFO Stack Container</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                Last-In, First-Out (LIFO) contiguous stack push and pop mechanics.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 sm:w-56 border-x-2 border-b-2 border-zinc-600 rounded-b-md p-3 min-h-[160px] flex flex-col-reverse gap-2 bg-zinc-950/60 shadow-inner">
                {stackItems.length === 0 ? (
                  <span className="text-xs text-zinc-600 font-mono text-center my-auto">
                    Stack is Empty
                  </span>
                ) : (
                  stackItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-md border flex items-center justify-between font-mono text-xs font-bold ${
                        idx === stackItems.length - 1
                          ? "bg-cyan-500/20 border-cyan-400 text-cyan-200"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <span>{item}</span>
                      {idx === stackItems.length - 1 && (
                        <span className="text-[9px] px-1 rounded-xs bg-cyan-400 text-black">TOP</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                placeholder="Push value (e.g. 'A', '10')..."
                value={stackInput}
                onChange={(e) => setStackInput(e.target.value)}
                className="px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handlePushStack}
                className="px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-bold"
              >
                Push
              </button>
              <button
                type="button"
                onClick={handlePopStack}
                disabled={stackItems.length === 0}
                className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 disabled:opacity-40"
              >
                Pop
              </button>
            </div>
          </div>
        )}

        {/* CASE E: TREES & BST (Levels 12 & 13) */}
        {(effectiveLevelId === 12 || effectiveLevelId === 13) && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>2D Binary Search Tree (BST) Canvas</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Left child &lt; Parent &lt; Right child. Inorder traversal yields sorted sequence.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTreeTraverseStep((prev) => (prev + 1) % (inorderSequence.length + 1))
                }
                className="px-3 py-1.5 rounded-md bg-zinc-100 text-zinc-950 text-xs font-bold"
              >
                Step Inorder Traversal
              </button>
            </div>

            {/* SVG Tree Canvas */}
            <div className="relative w-full h-56 bg-zinc-950 rounded-md border border-zinc-800/80 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 500 230">
                {/* Branches */}
                <line x1="250" y1="35" x2="130" y2="105" stroke="#3f3f46" strokeWidth="2" />
                <line x1="250" y1="35" x2="370" y2="105" stroke="#3f3f46" strokeWidth="2" />
                <line x1="130" y1="105" x2="75" y2="175" stroke="#3f3f46" strokeWidth="2" />
                <line x1="130" y1="105" x2="185" y2="175" stroke="#3f3f46" strokeWidth="2" />
                <line x1="370" y1="105" x2="315" y2="175" stroke="#3f3f46" strokeWidth="2" />
                <line x1="370" y1="105" x2="425" y2="175" stroke="#3f3f46" strokeWidth="2" />

                {/* Nodes */}
                {treeNodes.map((node) => {
                  const visitedValues = inorderSequence.slice(0, treeTraverseStep);
                  const isVisited = visitedValues.includes(node.val);
                  const isCurrent =
                    treeTraverseStep > 0 && inorderSequence[treeTraverseStep - 1] === node.val;

                  return (
                    <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                      <circle
                        r="18"
                        fill={isCurrent ? "#06b6d4" : isVisited ? "#10b981" : "#18181b"}
                        stroke={isCurrent ? "#ffffff" : isVisited ? "#34d399" : "#52525b"}
                        strokeWidth="2"
                      />
                      <text
                        textAnchor="middle"
                        dy="5"
                        fill={isCurrent ? "#000000" : "#ffffff"}
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {node.val}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Traversal output */}
            <div className="p-3 rounded-md bg-[#111115] border border-zinc-800 text-xs font-mono flex items-center gap-2">
              <span className="text-zinc-500">Inorder Output:</span>
              <span className="text-emerald-400 font-bold">
                [ {inorderSequence.slice(0, treeTraverseStep).join(", ")} ]
              </span>
            </div>
          </div>
        )}

        {/* DEFAULT FALLBACK FOR OTHER LEVELS (General 2D Interactive Concept Simulator) */}
        {![7, 6, 3, 8, 12, 13].includes(effectiveLevelId) && (
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Interactive Concept Laboratory: {activeSubMethod?.title || level?.title || "Concept Laboratory"}</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {activeSubMethod?.description || level?.description}
              </p>
            </div>

            {/* Runtime & Space Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono block">Best Case</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {activeSubMethod?.timeComplexity.best || "O(1)"}
                </span>
              </div>
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono block">Average Case</span>
                <span className="text-sm font-mono font-bold text-amber-400">
                  {activeSubMethod?.timeComplexity.average || "O(N)"}
                </span>
              </div>
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono block">Worst Case</span>
                <span className="text-sm font-mono font-bold text-rose-400">
                  {activeSubMethod?.timeComplexity.worst || "O(N)"}
                </span>
              </div>
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono block">Auxiliary Space</span>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {activeSubMethod?.spaceComplexity || "O(1)"}
                </span>
              </div>
            </div>

            {/* Invariants & Pseudocode preview */}
            {activeSubMethod?.studyResources.pseudocode && (
              <div className="p-3.5 rounded-md bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Core Algorithm Structure
                </span>
                <pre className="font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
                  {activeSubMethod.studyResources.pseudocode}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

