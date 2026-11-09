"use client";

import React, { useRef, useState, useCallback } from "react";

interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees (default 8)
  perspective?: number; // perspective in px (default 1000)
  glareOpacity?: number; // max glare opacity (default 0.12)
  scale?: number; // scale on hover (default 1.02)
}

export function Card3DTilt({
  children,
  className = "",
  maxTilt = 7,
  perspective = 1000,
  glareOpacity = 0.12,
  scale = 1.015,
}: Card3DTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
    transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1)",
  });
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles based on mouse offset from center
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Calculate glare coordinates in percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTransformStyle({
        transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
        transition: "transform 80ms ease-out",
        transformStyle: "preserve-3d",
      });

      setGlarePosition({
        x: glareX,
        y: glareY,
        opacity: glareOpacity,
      });
    },
    [maxTilt, perspective, scale, glareOpacity]
  );

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)",
      transformStyle: "preserve-3d",
    });
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative will-change-transform ${className}`}
    >
      {/* Glare Lighting Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300 overflow-hidden"
        style={{
          opacity: glarePosition.opacity,
          background: `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15), transparent 80%)`,
        }}
      />
      {children}
    </div>
  );
}

