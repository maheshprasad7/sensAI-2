import React, { useRef, useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface HighlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  highlightSize?: number;
  highlightColor?: string;
  borderColor?: string;
}

export const HighlightButton = React.forwardRef<HTMLButtonElement, HighlightButtonProps>(
  (
    {
      children,
      className = "",
      highlightSize = 72,
      highlightColor,
      borderColor,
      onClick,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      onPointerDown,
      ...props
    },
    ref
  ) => {
    const defaultRef = useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLButtonElement>) || defaultRef;

    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    // Detect color strategy dynamically based on Tailwind configuration within className
    // SENSEI color mapping:
    // If background is Yellow (#ffcc00 or similar) -> Blue Glow (electric blue)
    // If background is Blue or Navy (anything else) -> Yellow Glow (warm sensei yellow)
    const isYellowBg =
      className.includes("bg-[#ffcc00]") ||
      className.includes("bg-yellow") ||
      className.includes("text-[#092c5c]") ||
      className.includes("from-[#ffcc00]");

    // Fallback default colors matching prompt specs
    const defaultYellowHighlight = "rgba(255, 208, 0, 0.22)"; // soft background highlight
    const defaultYellowBorder = "rgba(255, 208, 0, 0.85)";

    const defaultBlueHighlight = "rgba(59, 130, 246, 0.25)";
    const defaultBlueBorder = "rgba(59, 130, 246, 0.85)";

    const effectiveHighlightColor = highlightColor
      ? highlightColor
      : isYellowBg
      ? defaultBlueHighlight
      : defaultYellowHighlight;

    const effectiveBorderColor = borderColor
      ? borderColor
      : isYellowBg
      ? defaultBlueBorder
      : defaultYellowBorder;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (resolvedRef.current) {
        const rect = resolvedRef.current.getBoundingClientRect();
        setCoords({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      if (onMouseMove) onMouseMove(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      if (onMouseEnter) onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      if (onMouseLeave) onMouseLeave(e);
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (resolvedRef.current) {
        const rect = resolvedRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now() + Math.random();
        setRipples((prev) => [...prev, { id, x, y }]);
      }
      if (onPointerDown) onPointerDown(e);
    };

    // Clean up expired ripples
    useEffect(() => {
      if (ripples.length === 0) return;
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 700);
      return () => clearTimeout(timer);
    }, [ripples]);

    return (
      <button
        ref={resolvedRef}
        className={cn(
          "relative overflow-hidden group select-none transition-all duration-300 flex items-center justify-center",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerDown={handlePointerDown}
        onClick={onClick}
        {...props}
      >
        {/* Glow overlay inside the button */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 mix-blend-screen"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(${highlightSize}px circle at ${coords.x}px ${coords.y}px, ${effectiveHighlightColor}, transparent)`,
            zIndex: 1,
          }}
        />

        {/* Gradient glowing border overlay (precision clipped padding-box trick) */}
        <span
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            zIndex: 2,
            backgroundImage: `linear-gradient(to bottom, transparent, transparent), radial-gradient(${highlightSize}px circle at ${coords.x}px ${coords.y}px, ${effectiveBorderColor}, transparent)`,
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            border: "1px solid transparent",
          }}
        />

        {/* Content wrapper to stay above the absolute overlays */}
        <span className="relative z-10 flex items-center justify-center gap-inherit w-full h-full">
          {children}
        </span>

        {/* Clicking ripple visual effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="pointer-events-none absolute rounded-full bg-white/25 animate-ripple-click"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 12,
              height: 12,
              transform: "translate(-50%, -50%)",
              zIndex: 3,
            }}
          />
        ))}
      </button>
    );
  }
);

HighlightButton.displayName = "HighlightButton";
