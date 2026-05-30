import React from "react";

interface SensaiLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export function SensaiLogo({ className, size = 32, color = "#ffcc00" }: SensaiLogoProps) {
  return (
    <svg
      id="sensai-logo-svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      referrerPolicy="no-referrer"
    >
      <defs>
        {/* Precise mask to create the clean transparent wedge gaps in the conical hat */}
        <mask id="sensai-hat-mask">
          {/* Keep everything inside the white mask */}
          <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
          
          {/* Radial transparent slits going from the peak through the bottom edge */}
          <line x1="50" y1="20" x2="50" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          
          {/* Left Rib Slits */}
          <line x1="50" y1="20" x2="41.25" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="50" y1="20" x2="32.5" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="50" y1="20" x2="23.75" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          
          {/* Right Rib Slits */}
          <line x1="50" y1="20" x2="58.75" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="50" y1="20" x2="67.5" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="50" y1="20" x2="76.25" y2="55" stroke="#000000" strokeWidth="1.6" strokeLinecap="round" />
        </mask>
      </defs>

      {/* The Conical Hat (Top element) */}
      <path
        d="M 50 18 L 13 46 Q 50 54 87 46 Z"
        fill={color}
        mask="url(#sensai-hat-mask)"
      />

      {/* The Master Dojo Torii / "M" Gate (Lower element) */}
      {/* Dynamic connecting arch, left leg, right leg, and central focus triangle */}
      <g fill={color}>
        {/* Main top support bar */}
        <path d="M 40 54 Q 50 56.5 60 54 L 60 58.5 Q 50 61 40 58.5 Z" />
        
        {/* Left pillar / calligraphy blade stroke */}
        <path d="M 40 54.5 L 44 58 L 44 81 L 40 84 Z" />
        
        {/* Right pillar / calligraphy blade stroke */}
        <path d="M 60 54.5 L 56 58 L 56 81 L 60 84 Z" />
        
        {/* Central downward focus triangle */}
        <path d="M 46.5 59.5 L 53.5 59.5 L 50 83 Z" />
      </g>
    </svg>
  );
}
