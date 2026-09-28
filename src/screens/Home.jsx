import React, { useState, useEffect } from 'react';
import MagneticDock from '../components/MagneticDock';

export default function Home({ playerName, onCreateGame, onJoinGame, onChangeName }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dockItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      ),
      label: 'Create Room',
      onClick: onCreateGame,
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      label: 'Join Room',
      onClick: onJoinGame,
    },
  ];

  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ease-out relative ${
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      }`}
    >
      {/* Central background spotlight */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,23,68,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-sm mx-auto flex flex-col items-center text-center z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <span className="text-[11px] font-bold tracking-[0.35em] text-[#FF1744] uppercase mb-1">
            Underground Syndicate
          </span>
          
          <h1 
            className="text-6xl sm:text-7xl font-black tracking-[0.25em] text-[#F5F5F7] neon-title-glow select-none"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            MAFIA
          </h1>

          <div className="flex items-center gap-2 mt-3 px-3.5 py-1.5 bg-[#0D0D13]/80 border border-white/10 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-[#FF1744] shadow-[0_0_8px_#FF1744] animate-pulse" />
            <p className="text-xs tracking-wider text-[#8E8E98]">
              Operative: <span className="text-[#F5F5F7] font-semibold">{playerName}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3.5 mb-6">
          <button
            onClick={onCreateGame}
            className="w-full btn-neon-crimson rounded-xl py-4 text-sm font-bold tracking-widest uppercase neon-shimmer flex items-center justify-center gap-2.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            CREATE GAME
          </button>

          <button
            onClick={onJoinGame}
            className="w-full btn-neon-purple rounded-xl py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            JOIN GAME
          </button>
        </div>

        {/* Change Handle */}
        <button 
          onClick={onChangeName} 
          className="text-xs text-[#545464] hover:text-[#8E8E98] transition-colors py-1 px-2 rounded"
        >
          Not {playerName}? <span className="underline underline-offset-4 decoration-[#545464]">Switch Handle</span>
        </button>
      </div>

      {/* Auxiliary Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
        <MagneticDock items={dockItems} />
      </div>
    </div>
  );
}
