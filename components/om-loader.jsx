"use client";

import { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

const LOADER_SEEN_KEY = "anjali-om-loader-seen";

export function OmLoader({ onLoadComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useLayoutEffect(() => {
    if (sessionStorage.getItem(LOADER_SEEN_KEY)) {
      setIsVisible(false);
      onLoadComplete?.();
      return;
    }

    const minDisplayTime = 2500;

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDisplayTime);

    const hideTimer = setTimeout(() => {
      sessionStorage.setItem(LOADER_SEEN_KEY, "1");
      setIsVisible(false);
      onLoadComplete?.();
    }, minDisplayTime + 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onLoadComplete]);

  if (!isVisible) return null;

  if (typeof document === "undefined") return null;

  // Generate 10 revolving rings with varying sizes and speeds
  // Base size is smaller, will be scaled via CSS for responsiveness
  const rings = [...Array(10)].map((_, i) => ({
    id: i,
    sizeMultiplier: 1 + i * 0.22, // Will be multiplied by base size in CSS
    duration: 5 + i * 1.2,
    reverse: i % 2 === 0,
    opacity: 0.2 + (0.3 * (1 - i / 10)),
    borderWidth: i < 3 ? 2 : 1,
  }));

  // Portal to document.body so the overlay sits above the fixed navbar.
  // Inside <main z-10>, a local z-[100] cannot escape that stacking context.
  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950 transition-opacity duration-800 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background smoke effects - isolated into their own compositing layer */}
      <div className="smoke-stage absolute inset-0">
        {/* Large unified smoke layer - bottom */}
        <div className="smoke-layer-bottom absolute inset-0" />
        
        {/* Large unified smoke layer - ambient */}
        <div className="smoke-layer-ambient absolute inset-0" />
        
        {/* Large unified smoke layer - rising */}
        <div className="smoke-layer-rising absolute inset-0" />
        
        {/* Dense golden smoke gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-amber-900/40 via-amber-800/20 to-transparent" />
        
        {/* Golden fog overlay - full screen */}
        <div className="absolute inset-0 fog-overlay" />
      </div>

      {/* Om Symbol - isolated into its own compositing layer */}
      <div className="om-stage relative z-10 flex flex-col items-center px-4">
        <div className="relative flex items-center justify-center">
          {/* 10 Animated rings - responsive. Spin (outer) and pulse (inner) on
              separate elements so they don't fight over `transform`. */}
          {rings.map((ring) => (
            <div
              key={`ring-${ring.id}`}
              className="ring-enter absolute"
              style={{
                '--ring-multiplier': ring.sizeMultiplier,
                '--enter-delay': `${ring.id * 0.1}s`,
                animation: `ring-enter-anim 0.65s cubic-bezier(0.22, 1, 0.36, 1) var(--enter-delay) both`,
              }}
            >
              <div
                className="ring-spinner"
                style={{
                  '--spin-duration': `${ring.duration}s`,
                  '--spin-direction': ring.reverse ? 'reverse' : 'normal',
                  animation: `ring-spin var(--spin-duration) linear infinite var(--spin-direction)`,
                }}
              >
                <div
                  className="ring-element rounded-full"
                  style={{
                    '--ring-opacity': ring.opacity,
                    '--pulse-duration': `${2.5 + ring.id * 0.3}s`,
                    '--pulse-delay': `${0.65 + ring.id * 0.1}s`,
                    border: `${ring.borderWidth}px solid rgba(251, 191, 36, ${ring.opacity})`,
                    animation: `ring-pulse var(--pulse-duration) ease-in-out infinite var(--pulse-delay)`,
                  }}
                />
              </div>
            </div>
          ))}
          
          {/* Om character - responsive */}
          <span 
            className="om-symbol inline-block leading-none text-[72px] xs:text-[90px] sm:text-[150px] md:text-[210px] lg:text-[260px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 select-none relative z-10"
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Arial Unicode MS', sans-serif",
            }}
          >
            ॐ
          </span>
        </div>

        {/* Tagline - responsive */}
        <p 
          className="mt-6 sm:mt-10 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-amber-400 animate-fade-in-up-fast text-center"
        >
          Jai Shree Shyam
        </p>
        
        {/* Loading indicator - responsive */}
        <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-2.5">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-amber-400/80 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        /* Large unified smoke layer - bottom rising */
        .smoke-layer-bottom {
          background: 
            radial-gradient(ellipse 120% 60% at 50% 100%, rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.2) 30%, transparent 60%),
            radial-gradient(ellipse 80% 40% at 30% 100%, rgba(217, 119, 6, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 80% 40% at 70% 100%, rgba(251, 191, 36, 0.25) 0%, transparent 50%);
          animation: smoke-bottom-rise 4s ease-in-out infinite;
          filter: blur(40px);
        }

        /* Large ambient smoke - floating across screen */
        .smoke-layer-ambient {
          background: 
            radial-gradient(ellipse 60% 50% at 20% 30%, rgba(251, 191, 36, 0.2) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 60%, rgba(245, 158, 11, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 70% 40% at 50% 80%, rgba(217, 119, 6, 0.22) 0%, transparent 50%),
            radial-gradient(ellipse 40% 50% at 10% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 45% 55% at 90% 40%, rgba(245, 158, 11, 0.15) 0%, transparent 50%);
          animation: smoke-ambient-drift 8s ease-in-out infinite alternate;
          filter: blur(60px);
        }

        /* Large rising smoke wisps */
        .smoke-layer-rising {
          background: 
            radial-gradient(ellipse 30% 80% at 25% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse 25% 70% at 75% 60%, rgba(245, 158, 11, 0.25) 0%, transparent 65%),
            radial-gradient(ellipse 35% 90% at 50% 40%, rgba(217, 119, 6, 0.2) 0%, transparent 60%);
          animation: smoke-wisps-rise 6s ease-out infinite;
          filter: blur(50px);
        }

        .fog-overlay {
          background: 
            radial-gradient(ellipse 100% 80% at 50% 100%, rgba(251, 191, 36, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(251, 191, 36, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(217, 119, 6, 0.1) 0%, transparent 60%);
          animation: fog-pulse 5s ease-in-out infinite alternate;
        }

        /* Opacity-only animations — blurred layers must NOT animate transform,
           or the browser re-rasterizes the blur every frame (heavy jank). */
        @keyframes smoke-bottom-rise {
          0%, 100% { opacity: 0.75; }
          50%      { opacity: 1; }
        }

        @keyframes smoke-ambient-drift {
          0%   { opacity: 0.6; }
          100% { opacity: 0.95; }
        }

        @keyframes smoke-wisps-rise {
          0%   { opacity: 0.2; }
          50%  { opacity: 0.7; }
          100% { opacity: 0.2; }
        }

        @keyframes fog-pulse {
          0% { opacity: 0.7; }
          100% { opacity: 1; }
        }

        .om-symbol {
          animation: om-glow 3s ease-in-out infinite alternate;
        }

        @keyframes om-glow {
          0% {
            filter: brightness(1) drop-shadow(0 0 40px rgba(251, 191, 36, 0.5));
          }
          100% {
            filter: brightness(1.3) drop-shadow(0 0 70px rgba(251, 191, 36, 0.7));
          }
        }

        /* Isolate background smoke + Om stage into separate GPU layers so
           their repaints never affect each other. translateZ(0) promotes
           each to its own composited layer up-front (from the first frame),
           so the rings' animation never triggers a re-composite of the
           background. */
        .smoke-stage {
          contain: layout paint;
          backface-visibility: hidden;
          will-change: transform, opacity;
          /* Hidden at start, then rises/translates in together with the rings.
             Translating the parent layer is cheap (blurred children are
             rasterized once and the whole layer is just moved by the GPU). */
          opacity: 0;
          transform: translate3d(0, 80px, 0);
          animation: smoke-stage-in 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.8s both;
        }

        @keyframes smoke-stage-in {
          from { opacity: 0; transform: translate3d(0, 80px, 0); }
          to   { opacity: 1; transform: translate3d(0, 0, 0); }
        }

        .om-stage {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Entrance wrapper: reveals rings from innermost -> outermost.
           Scale + opacity only, runs ONCE (separate element so it never
           fights the spin/pulse transforms). */
        @keyframes ring-enter-anim {
          from { opacity: 0; transform: scale(0.05); }
          to   { opacity: 1; transform: scale(1); }
        }

        .ring-enter {
          --base-size: 100px;
          width: calc(var(--base-size) * var(--ring-multiplier));
          height: calc(var(--base-size) * var(--ring-multiplier));
          opacity: 0;
          will-change: transform, opacity;
          transform-origin: center center;
        }

        /* Spinner wrapper: handles ONLY rotation (GPU-composited) */
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .ring-spinner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          will-change: transform;
          transform-origin: center center;
        }

        /* Inner ring: handles ONLY opacity + scale (compositable) */
        @keyframes ring-pulse {
          0%, 100% {
            opacity: var(--ring-opacity);
            transform: scale(1);
          }
          50% {
            opacity: calc(var(--ring-opacity) * 1.6);
            transform: scale(1.05);
          }
        }

        .ring-element {
          width: 100%;
          height: 100%;
          will-change: opacity, transform;
          transform-origin: center center;
        }

        @media (min-width: 400px) {
          .ring-enter { --base-size: 120px; }
        }

        @media (min-width: 640px) {
          .ring-enter { --base-size: 160px; }
        }

        @media (min-width: 768px) {
          .ring-enter { --base-size: 200px; }
        }

        @media (min-width: 1024px) {
          .ring-enter { --base-size: 220px; }
        }

        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }

        .animate-pulse-slower {
          animation: pulse 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-pulse-slowest {
          animation: pulse 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-fade-in-up-fast {
          animation: fade-in-up-fast 0.4s ease-out forwards;
          animation-delay: 0.02s;
          opacity: 0;
        }

        @keyframes fade-in-up-fast {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Glow orbs are heavily blurred — animate opacity only (no scale) */
        @keyframes pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.9; }
        }

        .duration-800 {
          transition-duration: 800ms;
        }
      `}</style>
    </div>,
    document.body
  );
}
