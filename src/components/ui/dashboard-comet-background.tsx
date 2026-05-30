'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  trailLength: number;
  trailPoints: { x: number; y: number }[];
  curveFrequency: number;
  curveAmplitude: number;
  curveTime: number;
  opacity: number;
  type: 'primary-blue' | 'secondary-blue' | 'accent-yellow';
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  highlightColor: string;
}

export function DashboardCometBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let comets: Comet[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas dimensions
    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      adjustCometCount();
    };

    // Responsive comet count calculator (Desktop: 6-8, Tablet: 4-5, Mobile: 2-3)
    const getTargetCometCount = () => {
      if (width >= 1024) return 7; // Target around middle of 4-8
      if (width >= 768) return 5;
      return 3;
    };

    // Initialize or randomize a comet properties
    const createComet = (onScreen = false): Comet => {
      // Pick random side to spawn from: 0 = Left side, 1 = Top side
      const spawnSide = Math.random() > 0.3 ? 0 : 1;
      
      let startX = 0;
      let startY = 0;
      
      if (onScreen) {
        // Spawn inside screen on initial load so it doesn't look empty
        startX = Math.random() * width;
        startY = Math.random() * height;
      } else {
        if (spawnSide === 0) {
          startX = -150;
          startY = Math.random() * height * 0.8;
        } else {
          startX = Math.random() * width * 0.8;
          startY = -150;
        }
      }

      // Smooth diagonal vectors
      const angle = (Math.random() * 15 + 20) * (Math.PI / 180); // 20 to 35 degrees diagonal trajectory
      const speed = Math.random() * 1.4 + 0.6; // Slow to medium (0.6 - 2.0px)
      
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Classify based on the refined target ratios
      // 75% Blue, 20% Secondary Blue Variations, 5% Yellow Energy Accents
      const r = Math.random();
      let type: 'primary-blue' | 'secondary-blue' | 'accent-yellow';
      let primaryColor = '';
      let secondaryColor = '';
      let glowColor = '';
      let highlightColor = '';

      if (r < 0.75) {
        type = 'primary-blue';
        primaryColor = Math.random() > 0.5 ? '#2E7DFF' : '#3B82F6';
        secondaryColor = '#1049A9';
        glowColor = 'rgba(46, 125, 255, 0.4)';
        highlightColor = '#8AB4F8';
      } else if (r < 0.95) {
        type = 'secondary-blue';
        primaryColor = Math.random() > 0.5 ? '#4A90FF' : '#5BA3FF';
        secondaryColor = '#1B52B3';
        glowColor = 'rgba(74, 144, 255, 0.35)';
        highlightColor = '#C2D7FF';
      } else {
        type = 'accent-yellow';
        primaryColor = Math.random() > 0.5 ? '#FFD22E' : '#FFC72C';
        secondaryColor = '#CC9C1E';
        glowColor = 'rgba(255, 210, 46, 0.6)';
        highlightColor = '#FFF5CC';
      }

      return {
        x: startX,
        y: startY,
        vx,
        vy,
        radius: type === 'accent-yellow' 
          ? Math.random() * 1.1 + 1.3 // Delicate yet slightly more prominent for intelligence insights
          : Math.random() * 0.8 + 0.9, // Ultra-fine data packets
        trailLength: type === 'accent-yellow'
          ? Math.floor(Math.random() * 45 + 50) // Longer trails for yellow intelligence signals
          : Math.floor(Math.random() * 25 + 35), // Shorter elegant trails for general telemetry
        trailPoints: [],
        curveFrequency: Math.random() * 0.008 + 0.004, // Smooth slow wave frequency
        curveAmplitude: Math.random() * 20 + 8, // Curved sway amplitude
        curveTime: Math.random() * 100, // Random starting cycle offset
        opacity: type === 'accent-yellow' ? 0.95 : 0.6, // Accent yellow stands out and emerges elegantly
        type,
        primaryColor,
        secondaryColor,
        glowColor,
        highlightColor
      };
    };

    // Auto balance comet population list to preserve responsiveness state
    const adjustCometCount = () => {
      const targetCount = getTargetCometCount();
      if (comets.length < targetCount) {
        const diff = targetCount - comets.length;
        for (let i = 0; i < diff; i++) {
          comets.push(createComet(comets.length === 0)); // Initial load can fill screen
        }
      } else if (comets.length > targetCount) {
        comets = comets.slice(0, targetCount);
      }
    };

    // Window size observer
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Document visibility change callback (performance requirement)
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Main Canvas Render loop
    const render = () => {
      // If paused or document hidden, delay rendering and wait
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Clear the canvas with composite blending opacity
      ctx.clearRect(0, 0, width, height);

      // Render and update each comet
      for (let index = 0; index < comets.length; index++) {
        const comet = comets[index];

        // 1. Position update & curve trajectory computing
        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.curveTime += 0.015;

        // Visual coordinates adding a slight curved sinusoidal offset
        const visualX = comet.x + Math.sin(comet.curveTime * comet.curveFrequency) * comet.curveAmplitude;
        const visualY = comet.y + Math.cos(comet.curveTime * comet.curveFrequency * 0.5) * (comet.curveAmplitude * 0.2);

        // Track trail path history
        comet.trailPoints.push({ x: visualX, y: visualY });
        if (comet.trailPoints.length > comet.trailLength) {
          comet.trailPoints.shift();
        }

        // 2. Painting the long smooth fading trail
        if (comet.trailPoints.length > 1) {
          const head = comet.trailPoints[comet.trailPoints.length - 1];
          const tail = comet.trailPoints[0];

          // Linear gradient matching perfect SENSAI branding tones
          const grad = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
          
          if (comet.type === 'accent-yellow') {
            grad.addColorStop(0, 'rgba(255, 210, 46, 0)');                    // transparent fade
            grad.addColorStop(0.5, 'rgba(255, 199, 44, 0.3)');                // #FFC72C secondary yellow
            grad.addColorStop(0.9, 'rgba(255, 210, 46, 0.85)');                // #FFD22E primary yellow
            grad.addColorStop(1, 'rgba(255, 245, 204, 1.0)');                  // highlight at head
          } else if (comet.type === 'secondary-blue') {
            grad.addColorStop(0, 'rgba(91, 163, 255, 0)');                      
            grad.addColorStop(0.5, 'rgba(74, 144, 255, 0.2)');                  
            grad.addColorStop(0.9, 'rgba(91, 163, 255, 0.65)');                 
            grad.addColorStop(1, 'rgba(194, 215, 255, 0.9)');                  
          } else {
            grad.addColorStop(0, 'rgba(46, 125, 255, 0)');                      
            grad.addColorStop(0.5, 'rgba(59, 130, 246, 0.18)');                 
            grad.addColorStop(0.9, 'rgba(46, 125, 255, 0.6)');                  
            grad.addColorStop(1, 'rgba(138, 180, 248, 0.85)');                  
          }

          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          for (let i = 1; i < comet.trailPoints.length; i++) {
            ctx.lineTo(comet.trailPoints[i].x, comet.trailPoints[i].y);
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = comet.radius * (comet.type === 'accent-yellow' ? 2.2 : 1.6);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // 3. Painting the bright circular yellow head & bloom layers
        const head = comet.trailPoints[comet.trailPoints.length - 1];
        if (head) {
          ctx.save();
          
          // Outer bloom glow layer
          const glowRadius = comet.type === 'accent-yellow' ? comet.radius * 9.0 : comet.radius * 6.0;
          const glowGrad = ctx.createRadialGradient(
            head.x, head.y, 0,
            head.x, head.y, glowRadius
          );
          
          if (comet.type === 'accent-yellow') {
            glowGrad.addColorStop(0, 'rgba(255, 210, 46, 0.45)'); 
            glowGrad.addColorStop(0.5, 'rgba(255, 199, 44, 0.15)'); 
            glowGrad.addColorStop(1, 'rgba(255, 210, 46, 0)');       
          } else if (comet.type === 'secondary-blue') {
            glowGrad.addColorStop(0, 'rgba(74, 144, 255, 0.3)'); 
            glowGrad.addColorStop(0.5, 'rgba(91, 163, 255, 0.08)'); 
            glowGrad.addColorStop(1, 'rgba(74, 144, 255, 0)');       
          } else {
            glowGrad.addColorStop(0, 'rgba(46, 125, 255, 0.35)'); 
            glowGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)'); 
            glowGrad.addColorStop(1, 'rgba(46, 125, 255, 0)');       
          }
          
          ctx.beginPath();
          ctx.arc(head.x, head.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Inner high contrast bright yellow core
          const coreGrad = ctx.createRadialGradient(
            head.x, head.y, 0,
            head.x, head.y, comet.type === 'accent-yellow' ? comet.radius * 2.2 : comet.radius * 1.5
          );
          
          coreGrad.addColorStop(0, comet.highlightColor);   
          coreGrad.addColorStop(0.5, comet.primaryColor); 
          coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)'); 
          
          ctx.beginPath();
          ctx.arc(head.x, head.y, comet.type === 'accent-yellow' ? comet.radius * 2.2 : comet.radius * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = coreGrad;
          ctx.fill();

          ctx.restore();
        }

        // 4. Recycle off-screen comets back into production safely without teleporting
        // We measure by the tail coordinate because we want the entire trail to exit elegantly
        const tail = comet.trailPoints[0] || comet;
        if (
          comet.x > width + 150 || 
          comet.y > height + 150 || 
          tail.x > width + 150 ||  
          tail.y > height + 150
        ) {
          comets[index] = createComet(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Kickstart loops
    render();

    // Cleanup resources to prevent layout leaks
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none select-none transition-opacity duration-1000"
      style={{
        zIndex: 5, // Above blue dashboard background, but beneath Grid Overlay which is 10 or cards
        opacity: 0.35 // Delicate premium branding presence (10-20% target opacity rule adjusted for color aesthetics)
      }}
    />
  );
}
