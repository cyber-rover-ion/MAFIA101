import React, { useState, useEffect } from 'react';

export default function Splash({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 250);  // Subtle crimson ambient glow
    const t2 = setTimeout(() => setStage(2), 650);  // MAFIA title fades in
    const t3 = setTimeout(() => setStage(3), 1100); // Thin neon crimson line draws
    const t4 = setTimeout(() => setStage(4), 1600); // Purple ambient glow & loading indicator
    const t5 = setTimeout(() => setStage(5), 2700); // Smooth exit transition
    const t6 = setTimeout(() => onComplete(), 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onComplete]);

  return (
    <div 
      className={`min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050507] transition-all duration-700 ease-out ${
        stage === 5 ? 'opacity-0 scale-[0.98] blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* 2. Subtle crimson glow */}
      <div 
        className={`absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.16)_0%,transparent_70%)] pointer-events-none transition-all duration-1000 ${
          stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      />

      {/* 5. Purple ambient glow */}
      <div 
        className={`absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(139,92,255,0.12)_0%,transparent_70%)] pointer-events-none transition-all duration-1000 ${
          stage >= 4 ? 'opacity-100 scale-105' : 'opacity-0 scale-75'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-sm w-full">
        {/* 3. MAFIA Logo */}
        <h1 
          className={`text-6xl sm:text-7xl md:text-8xl font-black tracking-[0.28em] text-[#F5F5F7] transition-all duration-1000 transform select-none ${
            stage >= 2 
              ? 'opacity-100 translate-y-0 neon-title-glow' 
              : 'opacity-0 translate-y-4'
          }`}
          style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.28em' }}
        >
          MAFIA
        </h1>

        {/* 4. Thin neon crimson line draws beneath the title */}
        <div className="w-48 h-[2px] bg-[#12121A] mt-4 relative overflow-hidden rounded-full">
          <div 
            className={`h-full bg-gradient-to-r from-transparent via-[#FF1744] to-transparent shadow-[0_0_10px_#FF1744] transition-all duration-700 ${
              stage >= 3 ? 'w-full opacity-100' : 'w-0 opacity-0'
            }`} 
          />
        </div>

        {/* Subtitle */}
        <p 
          className={`text-xs sm:text-sm font-medium tracking-[0.35em] text-[#8E8E98] uppercase mt-4 transition-all duration-700 ${
            stage >= 3 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          Trust no one.
        </p>

        {/* 6. Small neon loading indicator */}
        <div 
          className={`mt-10 flex items-center gap-1.5 transition-all duration-500 ${
            stage >= 4 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744] shadow-[0_0_6px_#FF1744] animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF2D75] shadow-[0_0_6px_#FF2D75] animate-pulse [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CFF] shadow-[0_0_6px_#8B5CFF] animate-pulse [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
