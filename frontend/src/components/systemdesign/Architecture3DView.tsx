"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Maximize2, Shield, Activity, Layers, Cpu } from "lucide-react";
import { ArchitectureNode, ArchitectureEdge, ComponentType } from "./ArchitectureCanvas";

interface Architecture3DViewProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  isSimulatingTraffic?: boolean;
  onToggleTraffic?: () => void;
}

export const Architecture3DView: React.FC<Architecture3DViewProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  isSimulatingTraffic = false,
  onToggleTraffic,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulation speed and stats
  const [activePacketCount, setActivePacketCount] = useState(0);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<ArchitectureNode | null>(null);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Mesh registries for interaction and updates
  const nodeMeshGroupMap = useRef<Map<string, THREE.Group>>(new Map());
  const edgeCurvesMap = useRef<Map<string, { curve: THREE.CatmullRomCurve3; tube: THREE.Mesh; packets: THREE.Mesh[] }>>(new Map());

  // Camera Orbit State
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraSphericalRef = useRef({ radius: 14, theta: Math.PI / 4, phi: Math.PI / 3.2 });
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0));

  // Raycasting for interactive node selection
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2(-1000, -1000));

  // Helper to map 2D coordinates to 3D world space
  const map2Dto3D = useCallback((x: number, y: number): THREE.Vector3 => {
    // Canvas dimensions are typically 800 x 450
    const x3d = (x - 420) * 0.018;
    const z3d = (y - 200) * 0.018;
    return new THREE.Vector3(x3d, 0, z3d);
  }, []);

  // Construct individual 3D architectural component mesh
  const createComponent3DMesh = useCallback((node: ArchitectureNode, isSelected: boolean): THREE.Group => {
    const group = new THREE.Group();
    group.name = node.id;

    // Base pedestal for grounding
    const pedestalGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.08, 24);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: isSelected ? 0x27272a : 0x18181b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = 0.04;
    group.add(pedestal);

    // Subtle contact shadow underneath pedestal
    const shadowGeo = new THREE.CircleGeometry(0.75, 24);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = 0.005;
    group.add(shadowMesh);

    // Component-specific specialized geometry
    switch (node.type) {
      case "sqldb":
      case "nosqldb": {
        // Multi-tier Database Cylinder with metallic grooves
        const cylinderMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x2563eb : 0x1e293b,
          roughness: 0.4,
          metalness: 0.6,
        });
        const diskCount = 3;
        for (let i = 0; i < diskCount; i++) {
          const diskGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.16, 24);
          const disk = new THREE.Mesh(diskGeo, cylinderMat);
          disk.position.y = 0.2 + i * 0.22;
          group.add(disk);

          // LED data groove
          const ringGeo = new THREE.TorusGeometry(0.39, 0.012, 8, 24);
          ringGeo.rotateX(Math.PI / 2);
          const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.position.y = 0.2 + i * 0.22;
          group.add(ring);
        }
        break;
      }

      case "cache": {
        // High-speed multi-layer Memory Grid
        const cacheMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xe11d48 : 0x334155,
          roughness: 0.2,
          metalness: 0.5,
        });
        for (let row = 0; row < 2; row++) {
          for (let col = 0; col < 2; col++) {
            const blockGeo = new THREE.BoxGeometry(0.24, 0.42, 0.24);
            const block = new THREE.Mesh(blockGeo, cacheMat);
            block.position.set(-0.16 + col * 0.32, 0.3, -0.16 + row * 0.32);
            group.add(block);
          }
        }
        break;
      }

      case "service": {
        // Server Blade Rack with LED Status Indicators
        const serverGeo = new THREE.BoxGeometry(0.55, 0.75, 0.42);
        const serverMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x10b981 : 0x18181b,
          roughness: 0.5,
          metalness: 0.4,
        });
        const server = new THREE.Mesh(serverGeo, serverMat);
        server.position.y = 0.46;
        group.add(server);

        // Green Activity LEDs
        const ledGeo = new THREE.SphereGeometry(0.025, 8, 8);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
        for (let i = 0; i < 3; i++) {
          const led = new THREE.Mesh(ledGeo, ledMat);
          led.position.set(-0.16 + i * 0.16, 0.75, 0.22);
          group.add(led);
        }
        break;
      }

      case "queue": {
        // Message Broker Ring / Pipeline
        const pipeGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.7, 18);
        const pipeMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xf59e0b : 0x27272a,
          roughness: 0.4,
          metalness: 0.5,
        });
        const pipe = new THREE.Mesh(pipeGeo, pipeMat);
        pipe.position.y = 0.44;
        group.add(pipe);

        // Helical wrapping coil
        const coilGeo = new THREE.TorusGeometry(0.33, 0.025, 8, 24);
        coilGeo.rotateX(Math.PI / 2);
        const coilMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        for (let k = 0; k < 3; k++) {
          const coil = new THREE.Mesh(coilGeo, coilMat);
          coil.position.y = 0.25 + k * 0.2;
          group.add(coil);
        }
        break;
      }

      case "loadbalancer":
      case "gateway": {
        // Dual-pyramid / Hexagonal Routing Prism
        const prismGeo = new THREE.OctahedronGeometry(0.38, 0);
        const prismMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x8b5cf6 : 0x3f3f46,
          roughness: 0.3,
          metalness: 0.7,
        });
        const prism = new THREE.Mesh(prismGeo, prismMat);
        prism.position.y = 0.52;
        group.add(prism);
        break;
      }

      case "cdn": {
        // Edge CDN Satellite Disc
        const discGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.06, 24);
        const discMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x0284c7 : 0x1e293b,
          roughness: 0.4,
          metalness: 0.5,
        });
        const disc = new THREE.Mesh(discGeo, discMat);
        disc.position.y = 0.5;
        disc.rotation.x = 0.35;
        group.add(disc);

        const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 12);
        const mastMat = new THREE.MeshStandardMaterial({ color: 0x71717a });
        const mast = new THREE.Mesh(mastGeo, mastMat);
        mast.position.y = 0.25;
        group.add(mast);
        break;
      }

      default: {
        // Client Terminal / Generic Node
        const terminalGeo = new THREE.BoxGeometry(0.5, 0.42, 0.12);
        const terminalMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0xd4d4d8 : 0x27272a,
          roughness: 0.5,
          metalness: 0.3,
        });
        const terminal = new THREE.Mesh(terminalGeo, terminalMat);
        terminal.position.y = 0.4;
        terminal.rotation.x = -0.3;
        group.add(terminal);
        break;
      }
    }

    return group;
  }, []);

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

  // Initial WebGL Scene Setup
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Scene
    const scene = new THREE.Scene();
    const isLightInitial = typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light";
    scene.background = new THREE.Color(isLightInitial ? 0xf8fafc : 0x09090b);
    sceneRef.current = scene;

    // Listen for theme toggles to adapt 3D WebGL background
    let themeObserver: MutationObserver | null = null;
    if (typeof MutationObserver !== "undefined") {
      themeObserver = new MutationObserver(() => {
        if (sceneRef.current) {
          const isL = document.documentElement.getAttribute("data-theme") === "light";
          sceneRef.current.background = new THREE.Color(isL ? 0xf8fafc : 0x09090b);
        }
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
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

    // 4. Studio Lighting (Zero purple/neon slop)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xf8fafc, 2.0);
    dirLight1.position.set(8, 12, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe2e8f0, 1.0);
    dirLight2.position.set(-8, 6, -6);
    scene.add(dirLight2);

    // 5. Ground Isometric Precision Grid
    const grid = new THREE.GridHelper(18, 24, 0x27272a, 0x18181b);
    grid.position.y = 0;
    scene.add(grid);

    // Subtle dark circular platform
    const platformGeo = new THREE.CylinderGeometry(8.5, 8.5, 0.05, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e12,
      roughness: 0.9,
      metalness: 0.1,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.03;
    scene.add(platform);

    // 6. Window Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (themeObserver) themeObserver.disconnect();
      renderer.dispose();
    };
  }, [updateCameraPosition]);

  // Synchronize Nodes and Edges into 3D Mesh Graph
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean previous node meshes
    nodeMeshGroupMap.current.forEach((mesh) => scene.remove(mesh));
    nodeMeshGroupMap.current.clear();

    // Clean previous edge meshes and packets
    edgeCurvesMap.current.forEach((edgeData) => {
      scene.remove(edgeData.tube);
      edgeData.packets.forEach((p) => scene.remove(p));
    });
    edgeCurvesMap.current.clear();

    // 1. Build Node Meshes
    nodes.forEach((node) => {
      const isSelected = selectedNodeId === node.id;
      const meshGroup = createComponent3DMesh(node, isSelected);
      const pos3d = map2Dto3D(node.x, node.y);
      meshGroup.position.copy(pos3d);
      scene.add(meshGroup);
      nodeMeshGroupMap.current.set(node.id, meshGroup);
    });

    // 2. Build Edge Conduits & Moving Packets
    const packetGeo = new THREE.SphereGeometry(0.06, 12, 12);
    let totalPackets = 0;

    edges.forEach((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.from);
      const targetNode = nodes.find((n) => n.id === edge.to);
      if (!sourceNode || !targetNode) return;

      const p1 = map2Dto3D(sourceNode.x, sourceNode.y);
      const p2 = map2Dto3D(targetNode.x, targetNode.y);

      // Height of connection point
      p1.y = 0.45;
      p2.y = 0.45;

      // Arc curve midpoint in 3D space
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.y += Math.min(1.2, 0.25 + dist * 0.12);

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 28, 0.022, 8, false);

      // Protocol-based conduit color
      let tubeColor = 0x52525b;
      let packetColor = 0x38bdf8;
      if (edge.protocol === "gRPC") {
        tubeColor = 0x27272a;
        packetColor = 0x34d399;
      } else if (edge.protocol === "Kafka Event") {
        tubeColor = 0x3f3f46;
        packetColor = 0xfbbf24;
      } else if (edge.protocol === "TCP/SQL") {
        tubeColor = 0x27272a;
        packetColor = 0x60a5fa;
      }

      const tubeMat = new THREE.MeshStandardMaterial({
        color: tubeColor,
        roughness: 0.5,
        metalness: 0.4,
        transparent: true,
        opacity: 0.65,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tube);

      // 2 data packets per edge
      const packets: THREE.Mesh[] = [];
      const packetMat = new THREE.MeshBasicMaterial({ color: packetColor });
      for (let i = 0; i < 2; i++) {
        const packetMesh = new THREE.Mesh(packetGeo, packetMat);
        scene.add(packetMesh);
        packets.push(packetMesh);
        totalPackets++;
      }

      edgeCurvesMap.current.set(edge.id, { curve, tube, packets });
    });

    setActivePacketCount(totalPackets);
  }, [nodes, edges, selectedNodeId, createComponent3DMesh, map2Dto3D]);

  // Main 60fps Animation Loop
  useEffect(() => {
    let animId: number;

    const animate = (time: number) => {
      const t = time * 0.001;

      // Animate 3D Data Packets along Conduits
      const speedMultiplier = isSimulatingTraffic ? 1.6 : 0.6;

      edgeCurvesMap.current.forEach((edgeData, edgeId) => {
        const { curve, packets } = edgeData;
        packets.forEach((packet, idx) => {
          // Offsets for continuous flow
          const offset = idx * 0.5;
          const u = ((t * speedMultiplier + offset) % 1.0);
          const point = curve.getPointAt(u);
          packet.position.copy(point);

          // Subtle pulse scale
          const pulse = 1.0 + Math.sin(t * 8 + idx) * 0.2;
          packet.scale.set(pulse, pulse, pulse);
        });
      });

      // Subtle Idle Floating of Nodes
      nodeMeshGroupMap.current.forEach((group, nodeId) => {
        const isSelected = selectedNodeId === nodeId;
        const hoverOffset = Math.sin(t * 2 + group.position.x) * 0.02;
        group.position.y = (isSelected ? 0.08 : 0) + hoverOffset;

        // Slow rotation if selected
        if (isSelected) {
          group.rotation.y = t * 0.6;
        } else {
          group.rotation.y = 0;
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    animFrameRef.current = animId;

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isSimulatingTraffic, selectedNodeId]);

  // Orbit Mouse Event Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    // Update Raycaster for Hover detection
    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    if (cameraRef.current && sceneRef.current) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const meshesToTest: THREE.Object3D[] = [];
      nodeMeshGroupMap.current.forEach((grp) => meshesToTest.push(...grp.children));
      const intersects = raycasterRef.current.intersectObjects(meshesToTest, true);

      if (intersects.length > 0) {
        // Find ancestor group with node ID
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && !nodeMeshGroupMap.current.has(curr.name)) {
          curr = curr.parent;
        }
        if (curr && curr.name) {
          const hovered = nodes.find((n) => n.id === curr.name);
          setHoveredNodeInfo(hovered || null);
        }
      } else {
        setHoveredNodeInfo(null);
      }
    }

    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    cameraSphericalRef.current.theta -= deltaX * 0.007;
    cameraSphericalRef.current.phi = Math.max(
      0.15,
      Math.min(Math.PI / 2.05, cameraSphericalRef.current.phi - deltaY * 0.007)
    );

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    updateCameraPosition();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    cameraSphericalRef.current.radius = Math.max(
      6,
      Math.min(24, cameraSphericalRef.current.radius + e.deltaY * 0.015)
    );
    updateCameraPosition();
  };

  const handleClick = () => {
    if (hoveredNodeInfo) {
      onSelectNode(hoveredNodeInfo.id);
    } else {
      onSelectNode(null);
    }
  };

  // Reset Camera View
  const handleResetCamera = () => {
    cameraSphericalRef.current = { radius: 14, theta: Math.PI / 4, phi: Math.PI / 3.2 };
    cameraTargetRef.current.set(0, 0, 0);
    updateCameraPosition();
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
      className="relative w-full h-[580px] rounded-lg bg-[#09090b] border border-zinc-800 overflow-hidden select-none cursor-grab active:cursor-grabbing group shadow-inner"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 3D Control Bar */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md bg-[#111115]/90 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>3D SPATIAL TOPOLOGY</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleTraffic?.();
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors shadow-xs cursor-pointer ${
            isSimulatingTraffic
              ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
              : "bg-zinc-900/90 hover:bg-zinc-800 border-zinc-800 text-zinc-200"
          }`}
        >
          {isSimulatingTraffic ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3 text-zinc-400" />}
          <span>{isSimulatingTraffic ? "Pause Traffic" : "Simulate Traffic"}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleResetCamera();
          }}
          className="p-1.5 rounded-md bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live 3D Node Telemetry Overlay (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        {hoveredNodeInfo ? (
          <div className="p-3 rounded-md bg-[#111115]/95 backdrop-blur-md border border-zinc-800 text-left space-y-1 shadow-lg max-w-xs">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-white tracking-tight">{hoveredNodeInfo.label}</span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                {hoveredNodeInfo.type}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400">Tech: {hoveredNodeInfo.techName}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Click to inspect connections in 3D</div>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-md bg-[#111115]/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-500">
            Click &amp; drag to orbit &bull; Scroll to zoom &bull; Click node to inspect
          </div>
        )}
      </div>

      {/* Topology Stats Overlay (Top Right) */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none flex items-center gap-2">
        <div className="px-2.5 py-1 rounded-md bg-[#111115]/90 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-400 flex items-center gap-2 shadow-sm">
          <span>{nodes.length} Nodes</span>
          <span className="text-zinc-600">&bull;</span>
          <span>{edges.length} Conduits</span>
          <span className="text-zinc-600">&bull;</span>
          <span className="text-emerald-400">{activePacketCount} Live Packets</span>
        </div>
      </div>
    </div>
  );
};

