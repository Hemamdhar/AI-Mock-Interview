"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Eye,
  Maximize2,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  VisualizerEngineType,
  SubMethodData,
} from "@/data/dsaSubMethods";
import {
  getSortingAlgorithmSteps,
  SortingStep,
} from "@/lib/dsaVisualizerEngines";

interface DSA3DLabProps {
  subMethod: SubMethodData;
}

const DEFAULT_ARRAY = [42, 17, 68, 23, 85, 12, 59, 34];

export const DSA3DLab: React.FC<DSA3DLabProps> = ({ subMethod }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Array / Data state for sorting & linear
  const [arrayData, setArrayData] = useState<number[]>(DEFAULT_ARRAY);
  const [customInputText, setCustomInputText] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Dynamic 3D Objects map for fast procedural updates
  const columnsGroupRef = useRef<THREE.Group | null>(null);
  const pointersGroupRef = useRef<THREE.Group | null>(null);

  // Camera Orbit State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 18, theta: 0, phi: Math.PI / 3.4 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 2, 0));

  // Compute sorting algorithm steps
  const steps: SortingStep[] = useMemo(() => {
    const algo = subMethod.visualizerAlgorithm || "selection";
    return getSortingAlgorithmSteps(algo, arrayData);
  }, [subMethod.visualizerAlgorithm, arrayData]);

  const activeStep = steps[currentStepIndex] || steps[0];

  // Reset step when sub-method changes or array changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [subMethod.id, arrayData]);

  // Handle Play/Pause timer loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(300, 1000 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, steps.length, playbackSpeed]);

  // Update Camera position from spherical coordinates
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z).add(cameraTargetRef.current);
    cameraRef.current.lookAt(cameraTargetRef.current);
  }, []);

  // Helper to create text sprite for number value
  const createTextSprite = useCallback((text: string, color: string = "#ffffff"): THREE.Sprite => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 128, 64);
      ctx.fillStyle = color;
      ctx.font = "bold 32px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 64, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(1.4, 0.7, 1);
    return sprite;
  }, []);

  // Initialize WebGL Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09090b);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. Studio Lighting (Zero purple slop, matte neutral dark craft)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xf4f4f5, 1.8);
    dirLight.position.set(10, 18, 12);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x71717a, 0.7);
    fillLight.position.set(-10, 10, -10);
    scene.add(fillLight);

    // 5. Floor Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0x27272a, 0x18181b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 6. Interactive Groups
    const colsGroup = new THREE.Group();
    scene.add(colsGroup);
    columnsGroupRef.current = colsGroup;

    const ptrsGroup = new THREE.Group();
    scene.add(ptrsGroup);
    pointersGroupRef.current = ptrsGroup;

    // 7. Render Loop
    let isSubscribed = true;
    const animate = () => {
      if (!isSubscribed) return;
      animFrameRef.current = requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // 8. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [updateCameraPosition]);

  // Synchronize 3D Meshes with Current Algorithmic Step
  useEffect(() => {
    if (!columnsGroupRef.current || !pointersGroupRef.current || !activeStep) return;

    const colsGroup = columnsGroupRef.current;
    const ptrsGroup = pointersGroupRef.current;

    // Clear previous meshes
    while (colsGroup.children.length > 0) {
      const child = colsGroup.children[0];
      colsGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    while (ptrsGroup.children.length > 0) {
      const child = ptrsGroup.children[0];
      ptrsGroup.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    }

    const arr = activeStep.array;
    const n = arr.length;
    const maxVal = Math.max(...arr, 1);
    const spacing = 1.35;
    const totalWidth = (n - 1) * spacing;
    const startX = -totalWidth / 2;

    // Render 3D Columns
    arr.forEach((val, idx) => {
      const height = Math.max(0.6, (val / maxVal) * 5.0);
      const x = startX + idx * spacing;

      // Color mapping
      let color = 0x27272a; // default neutral dark
      if (activeStep.sorted.includes(idx)) {
        color = 0x10b981; // emerald (sorted)
      } else if (activeStep.swapped.includes(idx)) {
        color = 0xf43f5e; // rose (swapped)
      } else if (activeStep.comparing.includes(idx)) {
        color = 0xf59e0b; // amber (comparing)
      }

      // Column Geometry
      const colGeo = new THREE.BoxGeometry(0.85, height, 0.85);
      const colMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.3,
      });
      const colMesh = new THREE.Mesh(colGeo, colMat);
      colMesh.position.set(x, height / 2, 0);
      colMesh.name = `col-${idx}`;
      colsGroup.add(colMesh);

      // Base Pedestal
      const pedGeo = new THREE.BoxGeometry(1.05, 0.1, 1.05);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.8,
        metalness: 0.1,
      });
      const pedMesh = new THREE.Mesh(pedGeo, pedMat);
      pedMesh.position.set(x, 0.05, 0);
      colsGroup.add(pedMesh);

      // Floating Value Sprite
      const valSprite = createTextSprite(String(val), "#ffffff");
      valSprite.position.set(x, height + 0.6, 0);
      colsGroup.add(valSprite);

      // Index Label underneath
      const idxSprite = createTextSprite(`[${idx}]`, "#71717a");
      idxSprite.scale.set(1.0, 0.5, 1);
      idxSprite.position.set(x, -0.4, 0);
      colsGroup.add(idxSprite);
    });

    // Render 3D Pointer Cones above columns
    (activeStep.pointers || []).forEach((ptr) => {
      const x = startX + ptr.index * spacing;
      const height = Math.max(0.6, (arr[ptr.index] / maxVal) * 5.0);

      const coneGeo = new THREE.ConeGeometry(0.25, 0.55, 16);
      coneGeo.rotateX(Math.PI); // point downwards
      const coneMat = new THREE.MeshStandardMaterial({
        color: ptr.color || 0x38bdf8,
        roughness: 0.2,
        metalness: 0.4,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(x, height + 1.3, 0);
      ptrsGroup.add(cone);

      // Label sprite
      const ptrLabel = createTextSprite(ptr.label, ptr.color || "#38bdf8");
      ptrLabel.scale.set(1.6, 0.8, 1);
      ptrLabel.position.set(x, height + 2.0, 0);
      ptrsGroup.add(ptrLabel);
    });
  }, [activeStep, createTextSprite]);

  // Orbit Drag Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    const spherical = cameraSphericalRef.current;
    spherical.theta -= deltaX * 0.008;
    spherical.phi = Math.max(0.15, Math.min(Math.PI / 2.05, spherical.phi - deltaY * 0.008));
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    const spherical = cameraSphericalRef.current;
    spherical.radius = Math.max(8, Math.min(32, spherical.radius + e.deltaY * 0.015));
    updateCameraPosition();
  };

  const handleResetCamera = () => {
    cameraSphericalRef.current = { radius: 18, theta: 0, phi: Math.PI / 3.4 };
    cameraTargetRef.current.set(0, 2, 0);
    updateCameraPosition();
  };

  // Shuffle Data
  const handleShuffle = () => {
    setIsPlaying(false);
    const newArr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 10);
    setArrayData(newArr);
  };

  // Custom Array Apply
  const handleApplyCustomArray = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    const parsed = customInputText
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !isNaN(n) && n > 0 && n <= 100);

    if (parsed.length < 3) {
      setInputError("Provide at least 3 numbers (e.g. 45, 12, 89, 34)");
      return;
    }
    if (parsed.length > 14) {
      setInputError("Maximum 14 numbers recommended for 3D stage clarity.");
      return;
    }

    setInputError(null);
    setArrayData(parsed);
    setCustomInputText("");
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-900/60 text-[10px] font-mono font-bold text-blue-300 uppercase">
            3D WebGL Lab
          </span>
          <h3 className="text-sm font-bold text-white tracking-tight">
            {subMethod.title}
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-zinc-700" />
            <span className="text-zinc-400">Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-amber-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
            <span className="text-rose-300">Swapped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-emerald-300">Sorted</span>
          </div>
        </div>
      </div>

      {/* 2. Three.js 3D Viewport Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="relative w-full h-[380px] sm:h-[440px] rounded-lg bg-[#09090b] border border-zinc-800 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Orbit Instructions overlay */}
        <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 border border-zinc-800/80 backdrop-blur-xs text-[10px] font-mono text-zinc-400 pointer-events-none">
          Drag to Orbit • Scroll to Zoom
        </div>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleResetCamera}
          className="absolute top-3 right-3 p-1.5 rounded-md bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Step Counter Indicator */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-800 font-mono text-xs font-semibold text-zinc-200">
          Step {currentStepIndex + 1} / {steps.length}
        </div>
      </div>

      {/* 3. Algorithmic Step Description Card */}
      <div className="p-3.5 rounded-lg bg-[#111115] border border-zinc-800 flex items-start gap-3">
        <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-700/80 text-zinc-300 shrink-0 mt-0.5">
          <Activity className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
              ALGORITHMIC INVARIANT TRACE
            </span>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-200 font-medium leading-relaxed">
            {activeStep.description}
          </p>
        </div>
      </div>

      {/* 4. Playback Controls & Speed Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-zinc-900/70 border border-zinc-800">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentStepIndex(0)}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
            title="Jump to Start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
            title="Step Backward"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 font-bold text-xs transition-colors shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStepIndex >= steps.length - 1}
            className="p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls & Shuffle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md bg-zinc-800 p-0.5 border border-zinc-700">
            {([0.5, 1, 2] as const).map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2.5 py-1 rounded-sm text-[11px] font-mono font-semibold transition-colors ${
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
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
            title="Generate Random Input"
          >
            <Shuffle className="w-3.5 h-3.5 text-zinc-400" />
            <span>Shuffle Data</span>
          </button>
        </div>
      </div>

      {/* 5. Custom Data Input */}
      <form onSubmit={handleApplyCustomArray} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Custom array (e.g. 52, 19, 74, 31, 88, 14)..."
          value={customInputText}
          onChange={(e) => setCustomInputText(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold text-zinc-200 transition-colors shrink-0"
        >
          Load Array
        </button>
      </form>
      {inputError && (
        <p className="text-[11px] text-rose-400 font-mono -mt-2">{inputError}</p>
      )}
    </div>
  );
};

