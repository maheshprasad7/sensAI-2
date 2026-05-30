import React, { useState, useEffect, useRef } from 'react';
import { careerDb, RoadmapNode as DbNode } from './careerData';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Activity, 
  Award, 
  Lock, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Coffee,
  Compass,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  User,
  MapPin,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight
} from 'lucide-react';

interface CareerRoadmap2DProps {
  milestones: any[];
  setMilestones: React.Dispatch<React.SetStateAction<any[]>>;
  activeMilestoneId: number;
  setActiveMilestoneId: (id: number) => void;
  getRoadmapProgress: () => number;
  handleToggleTask: (milestoneId: number, taskIndex: number) => void;
  formData: any;
  githubUser: string;
  userName: string;
  studyField: string;
  userGoal: string;
  setActiveTab: (tab: 'roadmap' | 'decay' | 'matchmaker' | 'scanner') => void;
  onSelectPath?: (goalKey: string, nodeId: string) => void;
}

// Custom Top-Down Vector Yellow Sportscar seen from above
const YellowVehicle = () => (
  <div className="relative w-12 h-12 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(255,204,0,0.6)]">
    <svg viewBox="0 0 40 40" className="w-10 h-10 transform -rotate-90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer vehicle glowing aura */}
      <circle cx="20" cy="20" r="16" fill="rgba(255, 204, 0, 0.15)" stroke="rgba(255, 204, 0, 0.3)" strokeWidth="1" strokeDasharray="3 3" />
      {/* Base shadow */}
      <ellipse cx="20" cy="22" rx="13" ry="7" fill="rgba(0,0,0,0.5)" filter="blur(1.5px)" />
      {/* Left & Right Side Mirrors */}
      <rect x="8" y="14" width="2" height="4" rx="1" fill="#cc9900" />
      <rect x="30" y="14" width="2" height="4" rx="1" fill="#cc9900" />
      {/* Front & Rear Wheels bumper blocks */}
      <rect x="6" y="8" width="4" height="7" rx="1.5" fill="#111827" />
      <rect x="30" y="8" width="4" height="7" rx="1.5" fill="#111827" />
      <rect x="6" y="25" width="4" height="7" rx="1.5" fill="#111827" />
      <rect x="30" y="25" width="4" height="7" rx="1.5" fill="#111827" />
      {/* Main streamline aerodynamic body */}
      <path d="M11,10 C11,6 14,4 19.5,4 C25,4 28,6 28,10 L28,29 C28,33 24.5,35 19.5,35 C14.5,35 11,33 11,29 Z" fill="#ffcc00" />
      {/* Black carbon fibre racing decals */}
      <path d="M15,5 L17,14 L18,14 L17,5 Z" fill="#111827" />
      <path d="M24,5 L22,14 L21,14 L22,5 Z" fill="#111827" />
      {/* Dark tint Windshield window */}
      <path d="M14,14 C14,11.5 16,10.5 19.5,10.5 C23,10.5 25,11.5 25,14 L24,18 C24,19 23,19.5 19.5,19.5 C16,19.5 15,19 15,18 Z" fill="#1e293b" />
      {/* Interior seats layout indicator */}
      <rect x="17" y="16" width="2" height="3" rx="0.5" fill="#334155" />
      <rect x="21" y="16" width="2" height="3" rx="0.5" fill="#334155" />
      {/* Rear shield window */}
      <path d="M15,26 C15,24.5 16,24 19.5,24 C23,24 24,24.5 24,26 L23.5,29 C23.5,29.5 22.5,30 19.5,30 C16.5,30 15.5,29.5 15.5,29 Z" fill="#1e293b" />
      {/* Red brake rear signals */}
      <rect x="12" y="33" width="3" height="1.5" rx="0.5" fill="#ef4444" />
      <rect x="24" y="33" width="3" height="1.5" rx="0.5" fill="#ef4444" />
      {/* Xenon front bright blue headlights */}
      <path d="M12,4.5 C12,3.5 13.5,3 14,3 L15,4 Z" fill="#38bdf8" />
      <path d="M27,4.5 C27,3.5 25.5,3 25,3 L24,4 Z" fill="#38bdf8" />
    </svg>
    {/* Dynamic exhaust sparks emitting */}
    <div className="absolute right-full mr-1 flex items-center justify-center gap-0.5 pointer-events-none">
      <span className="w-1.5 h-1 bg-amber-500/80 rounded-full animate-ping" />
      <span className="w-1 h-1 bg-red-500/80 rounded-full animate-pulse" />
    </div>
  </div>
);

// High-fidelity node structure for Career Route Trees
interface RoadmapNode {
  id: string;
  title: string;
  track: string;
  stageNum: number;
  maxStages: number;
  difficulty: "Easy" | "Medium" | "Hard";
  growth: "Medium" | "High" | "Very High";
  stress: "Low" | "Medium" | "High";
  growthPotential: number;
  timeline: {
    firstRole: string;
    midLevel: string;
    senior: string;
  };
  description: string;
  careerProgression: {
    role: string;
    duration: string;
    isCurrent?: boolean;
  }[];
  milestones: {
    period: string;
    subtitle: string;
    tasks: string[];
  }[];
  x: number;
  y: number;
  parent?: string;
  isVisited?: boolean;
  isCurrent?: boolean;
}

export function CareerRoadmap2D({
  milestones,
  setMilestones,
  activeMilestoneId,
  setActiveMilestoneId,
  getRoadmapProgress,
  handleToggleTask,
  formData,
  githubUser,
  userName,
  studyField,
  userGoal,
  setActiveTab,
  onSelectPath
}: CareerRoadmap2DProps) {

  // 1. Defined 6 Interactive Goal Trees specified by user
  // 1. Defined 3 dynamic Interactive Career Goal tracks mapping to unified career database
  const goalTrees = {
    backend: { name: "Backend Engineer" },
    frontend: { name: "Frontend Engineer" },
    aiengineer: { name: "AI Engineer" }
  };

  // 2. State & Settings
  // Auto-detect corresponding default goal based on user metadata
  const initialGoalType = React.useMemo(() => {
    const goalText = (formData.goal || userGoal || "backend").toLowerCase();
    if (goalText.includes("frontend")) return "frontend";
    if (goalText.includes("ai") || goalText.includes("artificial intelligence") || goalText.includes("ml") || goalText.includes("machine learning") || goalText.includes("data science") || goalText.includes("datascientist")) {
      return "aiengineer";
    }
    return "backend";
  }, [formData.goal, userGoal]);

  const [activeGoalKey, setActiveGoalKey] = useState<string>(initialGoalType);

  // Active Selected Nodes
  const [selectedNodeId, setSelectedNodeId] = useState<string>("back-stage-1");
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Exploration decision path
  const [explorePath, setExplorePath] = useState<string[]>([]);
  const [lastGoalKey, setLastGoalKey] = useState<string>(initialGoalType);

  // Reset decision path and selections when goal key changes
  useEffect(() => {
    let startNodeId = "back-stage-1";
    if (activeGoalKey === "frontend") {
      startNodeId = "front-stage-1";
    } else if (activeGoalKey === "aiengineer") {
      startNodeId = "ai-stage-1";
    }
    setExplorePath([startNodeId]);
    setSelectedNodeId(startNodeId);
  }, [activeGoalKey]);

  // Infinite Roadmap Canvas pan & zoom state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sidebar interactive tab index
  const [activeSidebarTab, setActiveSidebarTab] = useState<'info' | 'progression' | 'milestones'>('info');

  // Interactive Task List completed checklist states:
  const [checkedTasksMap, setCheckedTasksMap] = useState<Record<string, Record<string, boolean>>>({});

  // Yellow Vehicle Driving variables
  const [vehiclePos, setVehiclePos] = useState({ x: 150, y: 350, rotation: 12 });
  const [isDriving, setIsDriving] = useState(false);
  const prevNodeIdRef = useRef<string>("back-stage-1");

  // Dynamic Position Calculator
  const getNodePosition = React.useCallback((nodeId: string) => {
    const coords: Record<string, { x: number; y: number; parent?: string }> = {};

    const visit = (id: string, py: number, stage: number, forkYGap: number, parentId?: string) => {
      if (coords[id]) return;
      const x = 150 + (stage - 1) * 320;
      const y = py;
      coords[id] = { x, y, parent: parentId };

      const node = careerDb[id];
      if (node && node.children && node.children.length > 0) {
        const num = node.children.length;
        node.children.forEach((childId, j) => {
          let childY = py;
          if (num === 2) {
            childY = py + (j === 0 ? -forkYGap : forkYGap);
          } else if (num >= 3) {
            childY = py + (j === 0 ? -forkYGap : j === 1 ? 0 : forkYGap);
          }
          const nextGap = stage === 1 ? 140 : stage === 2 ? 65 : stage === 3 ? 32 : stage === 4 ? 16 : 8;
          visit(childId, childY, stage + 1, nextGap, id);
        });
      }
    };

    let startNodeId = "back-stage-1";
    if (activeGoalKey === "frontend") {
      startNodeId = "front-stage-1";
    } else if (activeGoalKey === "aiengineer") {
      startNodeId = "ai-stage-1";
    }

    visit(startNodeId, 350, 1, 150);
    return coords[nodeId] || { x: 150, y: 350 };
  }, [activeGoalKey]);

  // Dynamic compilation of active nodes tree based on current exploration decisions
  const activeNodes = React.useMemo(() => {
    const result: (RoadmapNode & { x: number; y: number; parent?: string; isVisited: boolean; isCurrent: boolean })[] = [];

    // Render visited chain
    explorePath.forEach((id, i) => {
      const node = careerDb[id];
      if (node) {
        const pos = getNodePosition(id);
        result.push({
          ...node,
          x: pos.x,
          y: pos.y,
          parent: pos.parent,
          isVisited: true,
          isCurrent: i === explorePath.length - 1,
        });
      }
    });

    // Render next possibilities of current active node
    const activeId = explorePath[explorePath.length - 1];
    const activeNode = careerDb[activeId];
    if (activeNode && activeNode.children) {
      activeNode.children.forEach(childId => {
        const node = careerDb[childId];
        if (node) {
          const pos = getNodePosition(childId);
          result.push({
            ...node,
            x: pos.x,
            y: pos.y,
            parent: pos.parent,
            isVisited: false,
            isCurrent: false,
          });
        }
      });
    }

    return result;
  }, [explorePath, getNodePosition]);

  const activeNodeObj = React.useMemo(() => {
    return careerDb[selectedNodeId] || careerDb["back-stage-1"];
  }, [selectedNodeId]);

  // Helper function to interpolate Bezier coordinate points at parameter 't' (0 to 1)
  const getBezierPoint = (p1: {x: number, y: number}, p2: {x: number, y: number}, t: number) => {
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    const c1x = p1.x + (p2.x > p1.x ? dx : -dx);
    const c1y = p1.y;
    const c2x = p2.x - (p2.x > p1.x ? dx : -dx);
    const c2y = p2.y;

    const x = Math.pow(1 - t, 3) * p1.x +
              3 * Math.pow(1 - t, 2) * t * c1x +
              3 * (1 - t) * Math.pow(t, 2) * c2x +
              Math.pow(t, 3) * p2.x;

    const y = Math.pow(1 - t, 3) * p1.y +
              3 * Math.pow(1 - t, 2) * t * c1y +
              3 * (1 - t) * Math.pow(t, 2) * c2y +
              Math.pow(t, 3) * p2.y;

    // Calculate real-time mathematical derivatives to tilt/rotate front bumper
    const dx_dt = 3 * Math.pow(1 - t, 2) * (c1x - p1.x) +
                   6 * (1 - t) * t * (c2x - c1x) +
                   3 * Math.pow(t, 2) * (p2.x - c2x);

    const dy_dt = 3 * Math.pow(1 - t, 2) * (c1y - p1.y) +
                   6 * (1 - t) * t * (c2y - c1y) +
                   3 * Math.pow(t, 2) * (p2.y - c2y);

    const angle = Math.atan2(dy_dt, dx_dt) * 180 / Math.PI + 95; // Point direction adjustment

    return { x, y, rotation: angle };
  };

  // Auto-center camera focus on chosen active node
  const centerCameraOnNode = React.useCallback((nodeId: string) => {
    const nodeCoords = getNodePosition(nodeId);
    if (nodeCoords) {
      const canvasEl = document.querySelector(".cursor-grab");
      const viewportWidth = canvasEl ? canvasEl.clientWidth : 700;
      const viewportHeight = canvasEl ? canvasEl.clientHeight : 650;
      
      const targetX = viewportWidth * 0.35 - nodeCoords.x * zoomLevel;
      const targetY = viewportHeight * 0.5 - nodeCoords.y * zoomLevel;
      
      setPanOffset({ x: targetX, y: targetY });
    }
  }, [getNodePosition, zoomLevel]);

  // Perform smooth vehicle path driving on node selections instead of instant teleporting
  useEffect(() => {
    const prevPos = getNodePosition(prevNodeIdRef.current);
    const nextPos = getNodePosition(selectedNodeId);

    // Goal switcher changes trigger instant jump, snap camera and snap driver positions
    if (lastGoalKey !== activeGoalKey) {
      setLastGoalKey(activeGoalKey);
      setVehiclePos({ x: nextPos.x, y: nextPos.y, rotation: 12 });
      prevNodeIdRef.current = selectedNodeId;
      setTimeout(() => {
        centerCameraOnNode(selectedNodeId);
      }, 50);
      return;
    }
    
    if (prevNodeIdRef.current !== selectedNodeId && prevPos && nextPos) {
      setIsDriving(true);
      let start: number | null = null;
      const duration = 1200; // Beautiful 1.2 second smooth drive

      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);

        // Cubic ease in-out
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const pos = getBezierPoint(prevPos, nextPos, eased);
        setVehiclePos({ x: pos.x, y: pos.y, rotation: pos.rotation });

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setIsDriving(false);
          setVehiclePos({ x: nextPos.x, y: nextPos.y, rotation: 12 }); // settle with dynamic tilt
          prevNodeIdRef.current = selectedNodeId;
          centerCameraOnNode(selectedNodeId);
        }
      };
      
      requestAnimationFrame(step);
    } else if (nextPos) {
      // Just set position if it's the initial render
      setVehiclePos({ x: nextPos.x, y: nextPos.y, rotation: 12 });
      prevNodeIdRef.current = selectedNodeId;
      setTimeout(() => {
        centerCameraOnNode(selectedNodeId);
      }, 50);
    }
  }, [selectedNodeId, activeGoalKey, getNodePosition, centerCameraOnNode]);

  // Mouse Drag Panning support
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Panning for devices
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPanOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Zoom manipulation
  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 2.0));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.4));
  const resetPan = () => {
    centerCameraOnNode(selectedNodeId);
    setZoomLevel(1.0);
  };

  // On Screen Directional Arrows click panning adjustments
  const handleDirectionPan = (dir: 'up' | 'down' | 'left' | 'right') => {
    const step = 80;
    setPanOffset(prev => {
      switch(dir) {
        case 'up': return { ...prev, y: prev.y + step };
        case 'down': return { ...prev, y: prev.y - step };
        case 'left': return { ...prev, x: prev.x + step };
        case 'right': return { ...prev, x: prev.x - step };
      }
    });
  };

  // Helper path string generator
  const getCurvePath = (p1: { x: number, y: number }, p2: { x: number, y: number }) => {
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x + (p2.x > p1.x ? dx : -dx)} ${p1.y}, ${p2.x - (p2.x > p1.x ? dx : -dx)} ${p2.y}, ${p2.x} ${p2.y}`;
  };

  // Helper to determine if a connection path is currently active in the highlighting route
  const isPathActive = (nodeAId: string, nodeBId: string) => {
    const idxA = explorePath.indexOf(nodeAId);
    const idxB = explorePath.indexOf(nodeBId);
    return idxA !== -1 && idxB !== -1 && Math.abs(idxA - idxB) === 1;
  };

  // Triggered when Select Path button is pressed
  const handleSelectPathConfirm = () => {
    localStorage.setItem('career_gps_chosen_goal', activeGoalKey);
    localStorage.setItem('career_gps_chosen_node_id', selectedNodeId);
    localStorage.setItem('career_gps_chosen_node_title', activeNodeObj.title);
    localStorage.setItem('career_gps_chosen_node_track', activeNodeObj.track);
    
    alert(`🎉 Route Selected!\n\nYou have successfully locked onto the ${activeNodeObj.title} path in the ${activeGoalKey.toUpperCase()} system! Custom checklists are stored and calibrated on your local device.`);
    
    if (onSelectPath) {
      onSelectPath(activeGoalKey, selectedNodeId);
    }
  };

  // Toggle tasks list state
  const handleToggleLocalTaskCheck = (nodeId: string, taskText: string) => {
    setCheckedTasksMap(prev => {
      const nodeTasks = prev[nodeId] || {};
      return {
        ...prev,
        [nodeId]: {
          ...nodeTasks,
          [taskText]: !nodeTasks[taskText]
        }
      };
    });
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#030816] rounded-3xl border border-white/10 text-white min-h-[750px] overflow-hidden select-none relative" id="career-select-wrapper">
      
      {/* 2D CANVAS CONTAINER VIEW - Left 70% width */}
      <div className="flex-1 flex flex-col relative h-[650px] lg:h-[750px] bg-[#050A1C] border-r border-white/5 overflow-hidden">
        
        {/* UPPER NAVIGATION BAR HEADER */}
        <div className="p-4 sm:p-6 flex flex-wrap items-center justify-between border-b border-white/5 bg-[#030816]/75 backdrop-blur-md z-30 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase font-black tracking-widest text-[#1e61b3]">Navigation System</div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                Career Route Selection
                <span className="text-xs font-mono font-bold bg-blue-500/10 text-[#38bdf8] px-2 py-0.5 rounded border border-[#38bdf8]/20">LIVE DRIVER</span>
              </h2>
            </div>
          </div>

          {/* Core Goal Selection Switcher */}
          <div className="flex flex-wrap gap-1.5 justify-start">
            {Object.entries(goalTrees).map(([key, tree]) => {
              const isActive = activeGoalKey === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActiveGoalKey(key);
                    resetPan();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                    isActive 
                      ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.3)]' 
                      : 'bg-white/5 text-white/50 border-white/5 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tree.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ACTIVE TELEMETRY BAR */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#030816]/90 border border-white/15 px-6 py-2.5 rounded-full z-30 flex items-center gap-2 text-xs text-white/80 font-mono shadow-[0_10px_35px_rgba(0,0,0,0.8)] whitespace-nowrap">
          <Globe className="w-4 h-4 text-blue-400 shrink-0" />
          <span>CLICK ANY NODE</span>
          <span className="text-white/30">•</span>
          <span className="text-[#ffcc00] font-black">↑↓←→ NAVIGATE CANVAS</span>
          <span className="text-white/30">•</span>
          <span>SCROLL ZOOM</span>
        </div>

        {/* TOP RIGHT CANVAS OPTIONS (Zoom Controls) */}
        <div className="absolute top-24 right-4 z-30 flex flex-col gap-2">
          <button 
            type="button" 
            onClick={zoomIn} 
            title="Zoom In"
            className="w-10 h-10 rounded-xl bg-[#030816]/80 text-white/80 hover:text-white border border-white/10 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            onClick={zoomOut} 
            title="Zoom Out"
            className="w-10 h-10 rounded-xl bg-[#030816]/80 text-white/80 hover:text-white border border-white/10 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button 
            type="button" 
            onClick={resetPan} 
            title="Reset Grid Pan / Viewport"
            className="w-10 h-10 rounded-xl bg-[#030816]/80 text-white/80 hover:text-white border border-white/10 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 transition-all cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* BOTTOM LEFT D-PAD CAMERA NAV PANEL */}
        <div className="absolute bottom-4 left-4 z-30 bg-[#030816]/90 border border-white/10 p-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center gap-1.5 w-32">
          <div className="text-[8px] font-mono font-black text-white/40 tracking-wider">CAMERA PAN</div>
          <button 
            onClick={() => handleDirectionPan('up')} 
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 active:scale-95 flex items-center justify-center text-white/80 border border-white/15"
          >
            ▲
          </button>
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleDirectionPan('left')} 
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 active:scale-95 flex items-center justify-center text-white/80 border border-white/15"
            >
              ◀
            </button>
            <button 
              onClick={() => handleDirectionPan('down')} 
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 active:scale-95 flex items-center justify-center text-white/80 border border-white/15"
            >
              ▼
            </button>
            <button 
              onClick={() => handleDirectionPan('right')} 
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-blue-500/20 active:scale-95 flex items-center justify-center text-white/80 border border-white/15"
            >
              ▶
            </button>
          </div>
        </div>

        {/* INTERACTIVE INFINITE DRAGGABLE SVG ARTBOARD CANVAS */}
        <div 
          className={`flex-1 relative cursor-grab select-none overflow-hidden ${isDragging ? 'cursor-grabbing' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          {/* Inner transformable grid network */}
          <div 
            className="absolute inset-0 transition-transform duration-75 ease-out"
            style={{ 
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center'
            }}
          >
            
            {/* Majestic Dark Cybergrid matrix background */}
            <div 
              className="absolute -inset-[3000px] pointer-events-none" 
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at center, rgba(30, 64, 175, 0.08) 0%, transparent 70%),
                  radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                  linear-gradient(rgba(255,255,255,0.007) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.007) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 24px 24px, 120px 120px, 120px 120px'
              }}
            />

            {/* Glowing cosmic stars/nebula background details */}
            <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-blue-500/5 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[60%] w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Interactive Highways SVG Layer */}
            <svg className="absolute inset-0 w-full h-[1500px]" style={{ overflow: 'visible' }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="activeLaneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>

                <linearGradient id="inactiveLane" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b1329" />
                  <stop offset="100%" stopColor="#090e1a" />
                </linearGradient>

                <filter id="highwayGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Render Highway Road segments connecting parent-child nodes */}
              {activeNodes.map(node => {
                if (!node.parent) return null;
                const parentNode = activeNodes.find(n => n.id === node.parent);
                if (!parentNode) return null;

                const isActive = isPathActive(parentNode.id, node.id);
                const roadPathStr = getCurvePath(parentNode, node);

                return (
                  <g key={`road-${node.id}`} className="transition-opacity duration-300">
                    {/* Road Base Underlay Cushion */}
                    <path
                      d={roadPathStr}
                      fill="none"
                      stroke="#020617"
                      strokeWidth="28"
                      strokeLinecap="round"
                    />

                    {/* Road Outer Lane Border shoulder */}
                    <path
                      d={roadPathStr}
                      fill="none"
                      stroke={isActive ? '#1e40af' : '#111827'}
                      strokeWidth="18"
                      strokeLinecap="round"
                      className="transition-colors duration-500"
                    />

                    {/* Road Core Asphalt lane and glow */}
                    <path
                      d={roadPathStr}
                      fill="none"
                      stroke={isActive ? 'url(#activeLaneGlow)' : '#1e293b'}
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="transition-colors duration-500"
                      style={{
                        filter: isActive ? 'url(#highwayGlowFilter)' : 'none',
                        opacity: isActive ? 1 : 0.65
                      }}
                    />

                    {/* Animated dashboard center road divider lines */}
                    <path
                      d={roadPathStr}
                      fill="none"
                      stroke={isActive ? '#ffffff' : '#334155'}
                      strokeWidth="1.5"
                      strokeDasharray="6 8"
                      strokeLinecap="round"
                      className={`transition-all ${isActive ? 'animate-[dash_12s_linear_infinite]' : ''}`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Checkpoint nodes rendering */}
            {activeNodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              
              // Check if Stage 1 is the starting node
              const isStartNode = node.stageNum === 1;
              const isLocked = false;

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    onClick={() => {
                      if (!isDriving) {
                        const idx = explorePath.indexOf(node.id);
                        if (idx !== -1) {
                          // Go back
                          setExplorePath(explorePath.slice(0, idx + 1));
                          setSelectedNodeId(node.id);
                        } else {
                          // Move forward
                          setExplorePath(prev => [...prev, node.id]);
                          setSelectedNodeId(node.id);
                        }
                      }
                    }}
                    className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-[3px] select-none ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 scale-110 shadow-[0_0_25px_rgba(56,189,248,0.7)] text-white font-black'
                        : isLocked
                        ? 'bg-[#0b0f19] border-slate-900 opacity-40 hover:opacity-60 cursor-not-allowed text-slate-500'
                        : isHovered
                        ? 'bg-[#1e293b] border-blue-400/80 text-white scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-[#0f172a]/95 border-[#1e293b] hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    {/* Innermost visual marker count/number */}
                    <div className="text-xs font-mono font-extrabold">
                      {isStartNode ? "●" : node.stageNum}
                    </div>

                    {/* YOU / ID Badge Indicator directly above vehicle current node */}
                    {isSelected && (
                      <div className="absolute bottom-[115%] left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                        <span className="text-[8px] font-mono uppercase bg-[#38bdf8] text-[#030816] px-1.5 py-0.5 rounded font-black tracking-widest whitespace-nowrap">
                          YOU
                        </span>
                      </div>
                    )}

                    {/* Sub-label role name beneath node */}
                    <div className="absolute top-[115%] left-1/2 transform -translate-x-1/2 flex flex-col items-center min-w-[120px] text-center">
                      <span className="text-[10px] font-mono text-white/50 mb-0.5 tracking-tight uppercase leading-none scale-90">
                        {node.track && node.track.length > 20 ? `${node.track.slice(0,18)}..` : node.track}
                      </span>
                      <span className={`text-[11px] font-extrabold tracking-tight whitespace-nowrap leading-none truncate max-w-[140px] ${
                        isSelected ? 'text-[#38bdf8]' : 'text-white/80'
                      }`}>
                        {node.title}
                      </span>
                    </div>

                    {/* Floating Hover Details Card Overlay */}
                    <AnimatePresence>
                      {isHovered && !isDriving && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -15 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -15 }}
                          className="absolute bottom-[145%] left-1/2 transform -translate-x-1/2 z-50 bg-[#070e1e]/95 border border-white/10 p-5 rounded-2xl shadow-3xl text-left min-w-[280px] sm:min-w-[340px] max-w-[360px] pointer-events-none backdrop-blur-xl space-y-3"
                        >
                          <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <div>
                              <span className="text-[9px] font-black tracking-widest text-[#38bdf8] uppercase font-mono block">
                                Explorer Target Track
                              </span>
                              <h4 className="text-sm font-black text-white">{node.title}</h4>
                            </div>
                            <span className="text-[9px] font-mono font-bold text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5 whitespace-nowrap">
                              {node.track}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-400/20">
                              Stage {node.stageNum}/{node.maxStages}
                            </span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                              node.difficulty === 'Hard' 
                                ? 'bg-red-500/10 text-red-400 border-red-400/20' 
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20'
                            }`}>
                              {node.difficulty} Difficulty
                            </span>
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                              {node.stress} Stress
                            </span>
                          </div>

                          <p className="text-[11px] leading-relaxed text-white/70 font-sans font-medium line-clamp-3">
                            {node.description}
                          </p>

                          <div className="text-[9px] text-[#ffcc00] font-mono flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Click checkpoint to engage vehicle autopilot</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}

            {/* Glowing yellow vehicle driving across pathways */}
            <motion.div
              style={{
                left: `${vehiclePos.x}px`,
                top: `${vehiclePos.y}px`,
                transform: `translate(-50%, -50%) rotate(${vehiclePos.rotation}deg)`,
                zIndex: 35
              }}
              className="absolute pointer-events-none transition-transform duration-75"
              animate={{
                scale: isDriving ? [1.1, 1.2, 1.1] : 1,
                y: isDriving ? 0 : [0, -2, 0]
              }}
              transition={isDriving ? { repeat: 1, duration: 0.3 } : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            >
              <YellowVehicle />
            </motion.div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR INTERFACE - Width 30% */}
      <div className="w-full lg:w-[350px] bg-[#030816] flex flex-col justify-between border-t lg:border-t-0 border-white/10 z-20 text-left min-h-[550px] lg:min-h-0">
        
        {/* UPPER INFO PANEL WITH TABS */}
        <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[580px] select-text">
          
          <div className="space-y-1">
            <div className="text-[9px] font-mono uppercase bg-blue-500/10 text-[#38bdf8] px-2 py-0.5 rounded-full inline-block font-extrabold border border-blue-500/20">
              CAREER STAGE
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">{activeNodeObj.title}</h3>
            <p className="text-xs text-white/50 font-mono">
              {activeNodeObj.track} • Stage {activeNodeObj.stageNum} of {activeNodeObj.maxStages}
            </p>
          </div>

          {/* Interactive side tabs */}
          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveSidebarTab('info')}
              className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all ${
                activeSidebarTab === 'info' ? 'bg-blue-600 text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              Insights
            </button>
            <button
              onClick={() => setActiveSidebarTab('progression')}
              className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all ${
                activeSidebarTab === 'progression' ? 'bg-blue-600 text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              Progression
            </button>
            <button
              onClick={() => setActiveSidebarTab('milestones')}
              className={`py-1.5 rounded-lg text-[10px] font-black uppercase text-center transition-all ${
                activeSidebarTab === 'milestones' ? 'bg-blue-600 text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              Milestones
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeSidebarTab === 'info' && (
              <motion.div
                key="info-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* 3 Metric cards block */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
                    <span className="text-[8px] font-mono text-white/40 uppercase block mb-1">DIFFICULTY</span>
                    <span className="text-xs font-black text-red-400 uppercase bg-red-400/10 px-2 py-0.5 rounded-md border border-red-400/20 block font-sans">
                      {activeNodeObj.difficulty}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
                    <span className="text-[8px] font-mono text-white/40 uppercase block mb-1">GROWTH</span>
                    <span className="text-xs font-black text-purple-400 uppercase bg-purple-400/10 px-2 py-0.5 rounded-md border border-purple-400/20 block font-sans">
                      {activeNodeObj.growth}
                    </span>
                  </div>
                  <div className="bg-white/5 rounded-xl p-2.5 text-center border border-white/5">
                    <span className="text-[8px] font-mono text-white/40 uppercase block mb-1">STRESS</span>
                    <span className="text-xs font-black text-cyan-400 uppercase bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/20 block font-sans">
                      {activeNodeObj.stress}
                    </span>
                  </div>
                </div>

                {/* Slider bar 1: Growth Potential */}
                <div className="space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-white/40 uppercase font-black">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-[#38bdf8]" /> Growth Potential</span>
                    <span className="text-[#38bdf8] font-mono">{activeNodeObj.growthPotential}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${activeNodeObj.growthPotential}%` }}
                    />
                  </div>
                </div>

                {/* Slider bar 2: Stress levels bars */}
                <div className="space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-xs text-white/40 uppercase font-black">
                    <span>Stress Level</span>
                    <span>{activeNodeObj.stress}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <div className="h-1.5 rounded-full bg-blue-500" />
                    <div className={`h-1.5 rounded-full ${activeNodeObj.stress !== 'Low' ? 'bg-blue-500' : 'bg-slate-900 border border-white/10'}`} />
                    <div className={`h-1.5 rounded-full ${activeNodeObj.stress === 'High' ? 'bg-blue-400' : 'bg-slate-900 border border-white/10'}`} />
                    <div className="h-1.5 rounded-full bg-slate-900 border border-white/10" />
                  </div>
                </div>

                {/* Timeline info block */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/15 space-y-4 font-mono">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                    <span className="text-[10px] font-black uppercase text-[#38bdf8] tracking-wider">PROJECTED TIMELINE</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[8px] text-white/30 lowercase font-bold">First role</div>
                      <div className="text-xs font-black text-white font-sans">{activeNodeObj.timeline.firstRole}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/30 lowercase font-bold">Mid level</div>
                      <div className="text-xs font-black text-white font-sans">{activeNodeObj.timeline.midLevel}</div>
                    </div>
                    <div>
                      <div className="text-[8px] text-white/30 lowercase font-bold">Senior</div>
                      <div className="text-xs font-black text-white font-sans">{activeNodeObj.timeline.senior}</div>
                    </div>
                  </div>
                </div>

                {/* Technical tailored profile analysis */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[9px] font-mono text-white/30 uppercase font-black">TARGET PROFILE ADAPTATION</span>
                  <p className="text-xs leading-relaxed text-white/80 font-medium">
                    {activeNodeObj.description}
                  </p>
                </div>
              </motion.div>
            )}

            {activeSidebarTab === 'progression' && (
              <motion.div
                key="progression-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase font-black text-[#38bdf8]">Career Progression Timeline</span>
                </div>

                {/* Vertical progression timeline steps */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                  {activeNodeObj.careerProgression.map((cp, idx) => (
                    <div key={idx} className="relative text-left">
                      {/* Circle bullet representation */}
                      <span className={`absolute -left-6 top-1.5 w-2 h-2 rounded-full border-2 ${
                        cp.isCurrent 
                          ? 'bg-[#38bdf8] border-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.8)] scale-110' 
                          : 'bg-[#030816] border-white/20'
                      }`} />
                      <div className="flex flex-col">
                        <span className="text-xs font-extrabold text-white flex items-center gap-1.5 min-h-[16px]">
                          {cp.role}
                          {cp.isCurrent && (
                            <span className="text-[8px] font-mono uppercase bg-[#38bdf8]/10 text-[#38bdf8] px-1.5 py-0.5 rounded border border-[#38bdf8]/20 font-black">
                              YOU ARE HERE
                            </span>
                          )}
                        </span>
                        <span className="text-[9px] font-mono text-white/45 mt-0.5">{cp.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSidebarTab === 'milestones' && (
              <motion.div
                key="milestones-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase font-black text-[#38bdf8]">Roadmap Action Checklist</span>
                </div>

                {/* Dynamic checkbox items representing screenshots */}
                <div className="space-y-4">
                  {activeNodeObj.milestones.map((ms, msIdx) => (
                    <div key={msIdx} className="bg-white/5 rounded-2xl p-4 border border-white/5 text-left space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                        <span className="text-[9px] font-mono font-black uppercase text-[#ffcc00] tracking-widest">{ms.period}</span>
                        <span className="text-[8px] font-mono font-bold text-white/40 uppercase">{ms.subtitle}</span>
                      </div>
                      <div className="space-y-2">
                        {ms.tasks.map((task, taskIdx) => {
                          const isDone = !!checkedTasksMap[activeNodeObj.id]?.[task];
                          return (
                            <div
                              key={taskIdx}
                              onClick={() => handleToggleLocalTaskCheck(activeNodeObj.id, task)}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isDone 
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                                  : 'bg-black/30 border-white/5 hover:border-white/15 text-white/80'
                              }`}
                            >
                              <span className="text-[11px] leading-snug font-medium pr-1.5">{task}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isDone ? 'bg-emerald-500 border-emerald-400' : 'border-white/20'
                              }`}>
                                {isDone && <Check className="w-3 h-3 text-white font-extrabold" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* BOTTOM CONFIRMATION TRIGGER BUTTON */}
        <div className="p-6 border-t border-white/10 bg-[#030816]/90 backdrop-blur-md">
          <button
            type="button"
            onClick={handleSelectPathConfirm}
            className="w-full bg-white hover:bg-neutral-100 font-extrabold text-[#030816] py-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(255,255,255,0.15)] pointer-events-auto cursor-pointer"
          >
            <span>Select This Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
