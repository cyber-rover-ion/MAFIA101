import React, { useState, useEffect } from 'react';

export default function RoleReveal({ role, onHome }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const isMafia = role === 'MAFIA';
  const isDoctor = role === 'DOCTOR';

  const accentClass = isMafia
    ? 'text-[#FF1744]'
    : isDoctor
      ? 'text-[#8B5CFF]'
      : 'text-[#F5F5F7]';

  const cardClass = isMafia
    ? 'mafia-neon-card'
    : isDoctor
      ? 'doctor-neon-card'
      : 'civilian-neon-card';

  const glowClass = isMafia
    ? 'bg-[radial-gradient(circle,rgba(255,23,68,0.22)_0%,transparent_70%)]'
    : isDoctor
      ? 'bg-[radial-gradient(circle,rgba(139,92,255,0.20)_0%,transparent_70%)]'
      : 'bg-[radial-gradient(circle,rgba(139,92,255,0.14)_0%,transparent_70%)]';

  const borderClass = isMafia ? 'via-[#FF1744]' : 'via-[#8B5CFF]';

  const directive = isMafia
    ? 'Eliminate the civilians under cover of darkness. Coordinate quietly and trust no one.'
    : isDoctor
      ? 'You are the Doctor. Protect the innocent when the night protection phase is introduced.'
      : 'Identify the mafia syndicate hidden among you. Speak carefully and survive the vote.';

  const insignia = isMafia ? '♟' : isDoctor ? '✚' : '🛡';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-[#050507] select-none">
      <div
        className={`absolute w-[600px] h-[600px] rounded-full transition-all duration-1000 pointer-events-none ${stage >= 2 ? glowClass : 'opacity-0 scale-75'}`}
      />

      <div
        className={`flex flex-col items-center text-center transition-all duration-700 absolute ${stage === 1 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-90 blur-sm pointer-events-none'}`}
      >
        <div className="w-10 h-10 rounded-full border-2 border-t-[#FF1744] border-white/10 animate-spin mb-4 shadow-[0_0_12px_#FF1744]" />
        <span className="text-xs font-bold tracking-[0.4em] text-[#FF1744] uppercase">
          Classified Transmission
        </span>
        <h2 className="text-2xl font-black tracking-widest text-[#F5F5F7] mt-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
          DECRYPTING ROLE...
        </h2>
      </div>

      <div
        className={`w-full max-w-sm flex flex-col items-center gap-6 z-10 transition-all duration-1000 transform ${stage >= 2 ? 'opacity-100 scale-100 translate-y-0 filter drop-shadow-[0_20px_60px_rgba(0,0,0,0.9)]' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`}
      >
        <div className={`w-full rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-500 ${cardClass}`}>
          <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${borderClass} to-transparent shadow-[0_0_10px_currentColor]`} />

          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[10px] font-black tracking-[0.25em] uppercase mb-6 backdrop-blur-md ${isMafia ? 'bg-[#FF1744]/15 border-[#FF1744]/40 text-[#FF1744]' : 'bg-[#8B5CFF]/15 border-[#8B5CFF]/40 text-[#8B5CFF]'}`}>
            <span>TOP SECRET • CLASSIFIED DOSSIER</span>
          </div>

          <h1
            className={`text-5xl sm:text-6xl font-black tracking-[0.22em] mb-4 filter drop-shadow-lg select-none ${accentClass}`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {role || 'CIVILIAN'}
          </h1>

          <div className="border-t border-white/10 pt-4 mt-2">
            <span className="text-[11px] font-bold tracking-widest text-[#8E8E98] uppercase block mb-1.5">
              Mission Directive
            </span>
            <p className="text-sm text-[#F5F5F7] font-medium leading-relaxed">
              {directive}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-black ${isMafia ? 'border-[#FF1744]/50 text-[#FF1744] shadow-[0_0_12px_rgba(255,23,68,0.3)]' : 'border-[#8B5CFF]/50 text-[#8B5CFF] shadow-[0_0_12px_rgba(139,92,255,0.3)]'}`}>
              {insignia}
            </div>
          </div>
        </div>

        <button
          onClick={onHome}
          className="btn-neon-purple text-[#F5F5F7] px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase hover:text-white transition-all flex items-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          PLAY AGAIN / EXIT
        </button>
      </div>
    </div>
  );
}
