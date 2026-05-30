'use client'

import React, { Suspense, useState, useEffect, Component, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Terminal, Sparkles, AlertCircle } from 'lucide-react'
import Spline from '@splinetool/react-spline'

// Custom React Error Boundary specifically to catch WebGL or canvas initialization crashes gracefully
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class WebGLErrorBoundary extends React.Component<any, any> {
  state = { hasError: false }
  props!: { children: React.ReactNode; fallback: React.ReactNode }

  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn("Spline elements failed to render due to WebGL limitations or context creation errors:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

// Proactive client-side helper to check if WebGL capability is supported and active
function detectWebGLContext(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const hasWebGL = !!(
      window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
    return hasWebGL
  } catch (err) {
    return false
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null)

  useEffect(() => {
    // Perform checking safely on the client mount
    setIsSupported(detectWebGLContext())
  }, [])

  // A highly-crafted alternate design when WebGL is restricted, showing a premium responsive animated cyber-robot model vector
  const fallbackCyberRobot = (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent overflow-hidden">
      {/* Absolute aura and grid coordinates backend */}
      <div className="absolute inset-0 bg-[#020202]/10 pointer-events-none rounded-full blur-[100px] bg-gradient-to-tr from-blue-500/10 via-transparent to-transparent" />
      
      {/* Cyber-metric dashboard rings around the robot */}
      <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-white/[0.02] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute inset-4 border border-dashed border-blue-500/10 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
          className="absolute inset-10 border border-dotted border-purple-500/10 rounded-full"
        />
      </div>

      {/* Cybernetic Floating Platform Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center max-w-md p-6"
      >
        {/* Animated Holographic Robot Drawing */}
        <motion.div
          animate={{ 
            y: [0, -12, 0],
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center filter drop-shadow-[0_0_25px_rgba(59,130,246,0.25)]"
        >
          {/* Futuristic Robot Vector matching the exact custom aesthetics */}
          <svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 500 500" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Ambient Backlight Glow ellipse */}
            <ellipse cx="250" cy="250" rx="140" ry="140" fill="url(#backGlow)" opacity="0.15" />

            {/* Platform shadow underneath robot */}
            <ellipse cx="250" cy="420" rx="80" ry="12" fill="black" opacity="0.6" />
            <ellipse cx="250" cy="420" rx="70" ry="8" fill="url(#cyberBlue)" opacity="0.2" />

            {/* Neck / Body Connectors */}
            <rect x="235" y="240" width="30" height="40" rx="8" fill="#1f1f1f" stroke="#333333" strokeWidth="2" />
            <line x1="235" y1="260" x2="265" y2="260" stroke="#555555" strokeWidth="2" />

            {/* Robot Core Torso */}
            <path 
              d="M170 270 C170 270, 250 250, 330 270 C345 310, 310 400, 250 410 C190 400, 155 310, 170 270 Z" 
              fill="url(#bodyGradient)" 
              stroke="#2e2e3a" 
              strokeWidth="3" 
            />
            {/* Inner carbon fibers texture panel on chest */}
            <path 
              d="M195 285 C195 285, 250 272, 305 285 C315 315, 295 375, 250 385 C205 375, 185 315, 195 285 Z" 
              fill="#0d0d11" 
              stroke="url(#cyberBlue)" 
              strokeWidth="1.5" 
              opacity="0.8"
            />

            {/* Futuristic Shoulder Joints & Arms */}
            {/* Left Arm/Shoulder */}
            <circle cx="150" cy="285" r="22" fill="#15151a" stroke="#2a2a35" strokeWidth="2" />
            <path d="M135 295 C110 320, 105 380, 140 395 C150 400, 160 380, 150 370 C125 355, 125 320, 145 305" fill="#1a1a24" stroke="#3a3a4c" strokeWidth="2" />
            
            {/* Right Arm/Shoulder */}
            <circle cx="350" cy="285" r="22" fill="#15151a" stroke="#2a2a35" strokeWidth="2" />
            <path d="M365 295 C390 320, 395 380, 360 395 C350 400, 340 380, 350 370 C375 355, 375 320, 355 305" fill="#1a1a24" stroke="#3a3a4c" strokeWidth="2" />

            {/* Robot Head / Helmet */}
            <ellipse cx="250" cy="180" rx="65" ry="60" fill="url(#headGradient)" stroke="#222" strokeWidth="2" />
            
            {/* Elegant dark obsidian curved face shield visor matching our robot image exactly */}
            <ellipse cx="250" cy="175" rx="55" ry="48" fill="url(#visorGradient)" stroke="#111" strokeWidth="1" />
            <path d="M195 175 Q250 145 305 175 Q250 160 195 175" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />

            {/* Glowing Digital Mind dot matrices eyes - premium cyberpunk style */}
            <g opacity="0.95">
              {/* Left Digital Eye matrix */}
              <circle cx="218" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="224" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="230" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="218" cy="174" r="1.5" fill="#4fa3ff" />
              <circle cx="224" cy="174" r="1.5" fill="#4fa3ff" />
              <circle cx="230" cy="174" r="1.5" fill="#4fa3ff" />

              {/* Right Digital Eye matrix */}
              <circle cx="270" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="276" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="282" cy="168" r="1.5" fill="#4fa3ff" />
              <circle cx="270" cy="174" r="1.5" fill="#4fa3ff" />
              <circle cx="276" cy="174" r="1.5" fill="#4fa3ff" />
              <circle cx="282" cy="174" r="1.5" fill="#4fa3ff" />
              
              {/* Extra matrix dot flares matching the visor reflections */}
              <circle cx="224" cy="180" r="1.5" fill="#4fa3ff" opacity="0.6" />
              <circle cx="276" cy="180" r="1.5" fill="#4fa3ff" opacity="0.6" />
            </g>

            {/* Defs/Gradients */}
            <defs>
              <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cyberBlue" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="bodyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e1e24" />
                <stop offset="60%" stopColor="#0f0f12" />
                <stop offset="100%" stopColor="#050506" />
              </linearGradient>
              <linearGradient id="headGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2c2c35" />
                <stop offset="100%" stopColor="#131318" />
              </linearGradient>
              <linearGradient id="visorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0a0d" />
                <stop offset="40%" stopColor="#020202" />
                <stop offset="100%" stopColor="#1e1e2c" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Dynamic AI Status Label */}
        <div className="flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-full border border-blue-500/10 bg-blue-500/5 text-xs text-blue-400 font-mono tracking-wider animate-pulse">
          <Cpu className="w-3.5 h-3.5 text-blue-400" />
          SENSAI OPERATING SYSTEMS: CORE ONLINE
        </div>
      </motion.div>
    </div>
  )

  const fallbackLoader = (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-t-2 border-blue-500 animate-spin" />
          <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
        </div>
        <span className="font-mono text-xs text-neutral-500 tracking-wider">INITIALIZING INTEL CO-PILOT SYSTEM...</span>
      </div>
    </div>
  )

  // Direct state-based WebGL availability bypass
  if (isSupported === false) {
    return fallbackCyberRobot
  }

  // If loading status hasn't resolved yet
  if (isSupported === null) {
    return fallbackLoader
  }

  return (
    <WebGLErrorBoundary fallback={fallbackCyberRobot}>
      <Suspense fallback={fallbackLoader}>
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </WebGLErrorBoundary>
  )
}

