"use client";

import { useState, useEffect } from "react";

export function OmLoader({ onLoadComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const minDisplayTime = 2500;
    
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDisplayTime);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onLoadComplete?.();
    }, minDisplayTime + 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onLoadComplete]);

  if (!isVisible) return null;

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

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 transition-opacity duration-800 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
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

      {/* Glow effect behind Om - responsive sizes */}
      <div className="absolute w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-amber-500/25 blur-3xl animate-pulse-slow" />
      <div className="absolute w-[200px] h-[200px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] rounded-full bg-orange-500/20 blur-2xl animate-pulse-slower" />
      <div className="absolute w-[300px] h-[300px] sm:w-[480px] sm:h-[480px] md:w-[600px] md:h-[600px] rounded-full bg-amber-600/15 blur-3xl animate-pulse-slowest" />
      
      {/* Om Symbol */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="relative flex items-center justify-center">
          {/* 10 Animated rings - responsive */}
          {rings.map((ring) => (
            <div 
              key={`ring-${ring.id}`}
              className="ring-element absolute rounded-full"
              style={{
                '--ring-multiplier': ring.sizeMultiplier,
                border: `${ring.borderWidth}px solid rgba(251, 191, 36, ${ring.opacity})`,
                animation: `spin ${ring.duration}s linear infinite ${ring.reverse ? 'reverse' : ''}`,
                boxShadow: ring.id < 3 ? '0 0 15px rgba(251, 191, 36, 0.2)' : 'none',
              }}
            />
          ))}
          
          {/* Om character - responsive */}
          <span 
            className="om-symbol text-[100px] xs:text-[120px] sm:text-[180px] md:text-[240px] lg:text-[280px] font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 drop-shadow-2xl select-none relative z-10"
            style={{
              fontFamily: "'Noto Sans Devanagari', 'Arial Unicode MS', sans-serif",
              textShadow: "0 0 40px rgba(251, 191, 36, 0.6), 0 0 80px rgba(251, 191, 36, 0.4), 0 0 120px rgba(251, 191, 36, 0.3)",
            }}
          >
            ॐ
          </span>
        </div>

        {/* Tagline - responsive */}
        <p 
          className="mt-6 sm:mt-10 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.15em] text-amber-400 animate-fade-in-up-fast text-center"
          style={{
            fontFamily: "'Noto Sans Devanagari', sans-serif",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)",
          }}
        >
          ॥ जय श्री श्याम ॥
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

        @keyframes smoke-bottom-rise {
          0%, 100% {
            transform: translateY(0) scaleY(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50px) scaleY(1.2);
            opacity: 1;
          }
        }

        @keyframes smoke-ambient-drift {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          100% {
            transform: translate(30px, -20px) scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes smoke-wisps-rise {
          0% {
            transform: translateY(50px) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) scale(1.3);
            opacity: 0;
          }
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

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive rings */
        .ring-element {
          --base-size: 100px;
          width: calc(var(--base-size) * var(--ring-multiplier));
          height: calc(var(--base-size) * var(--ring-multiplier));
        }

        @media (min-width: 400px) {
          .ring-element {
            --base-size: 120px;
          }
        }

        @media (min-width: 640px) {
          .ring-element {
            --base-size: 160px;
          }
        }

        @media (min-width: 768px) {
          .ring-element {
            --base-size: 200px;
          }
        }

        @media (min-width: 1024px) {
          .ring-element {
            --base-size: 220px;
          }
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

        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }

        .duration-800 {
          transition-duration: 800ms;
        }
      `}</style>
    </div>
  );
}
