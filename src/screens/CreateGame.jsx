import React, { useState } from 'react';
import { createRoom } from '../lib/game';

export default function CreateGame({ onRoomCreated, onBack }) {
  const [mafiaCount, setMafiaCount] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const roomCode = await createRoom(mafiaCount);
      onRoomCreated(roomCode, mafiaCount);
    } catch (err) {
      setError(err.message || 'Failed to create room');
      setLoading(false);
    }
  };

  const increment = () => {
    if (mafiaCount < 5) setMafiaCount((m) => m + 1);
  };

  const decrement = () => {
    if (mafiaCount > 1) setMafiaCount((m) => m - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#8E8E98] hover:text-[#F5F5F7] transition-colors mb-4 focus:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>

        <div className="w-full smoked-glass p-7 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF1744]/60 to-transparent" />

          <div className="text-center mb-6">
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#FF1744] uppercase mb-1 block">
              Syndicate Configuration
            </span>
            <h2 className="text-2xl font-black tracking-wider text-[#F5F5F7]" style={{ fontFamily: "'Outfit', sans-serif" }}>
              CREATE GAME
            </h2>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs text-[#8E8E98] tracking-wider uppercase font-bold">
                  Number of Mafia
                </label>
                <span className="text-[11px] text-[#FF2D75] font-mono font-medium">
                  {mafiaCount} MAFIA
                </span>
              </div>

              <div className="flex items-center justify-between bg-[#09090D] border border-white/10 rounded-xl p-2 shadow-inner">
                <button
                  type="button"
                  onClick={decrement}
                  disabled={mafiaCount <= 1}
                  className="w-11 h-11 flex items-center justify-center text-xl font-bold text-[#F5F5F7] bg-[#12121A] hover:bg-[#1C1C28] hover:border-[#FF1744]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-white/5 transition-all"
                  aria-label="Decrease mafia count"
                >
                  −
                </button>
                <div className="relative flex flex-col items-center justify-center w-16 h-11">
                  <span key={mafiaCount} className="text-3xl font-extrabold text-[#FF1744] animate-neon-slide-up font-mono drop-shadow-[0_0_12px_rgba(255,23,68,0.5)]">
                    {mafiaCount}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={increment}
                  disabled={mafiaCount >= 5}
                  className="w-11 h-11 flex items-center justify-center text-xl font-bold text-[#F5F5F7] bg-[#12121A] hover:bg-[#1C1C28] hover:border-[#FF1744]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-white/5 transition-all"
                  aria-label="Increase mafia count"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-[#8B5CFF]/10 border border-[#8B5CFF]/25">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#F5F5F7] uppercase">Doctor</p>
                <p className="text-[10px] text-[#8E8E98] mt-0.5">One Doctor is assigned automatically.</p>
              </div>
              <span className="text-sm font-black font-mono text-[#8B5CFF]">1</span>
            </div>

            <p className="text-[11px] text-[#8E8E98] text-center leading-relaxed">
              The host is never assigned a role. Mafia and Doctor are selected randomly from the players.
            </p>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF1744] px-1 animate-neon-slide-up">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="w-full btn-neon-crimson rounded-xl py-4 text-sm font-bold tracking-widest uppercase mt-1 neon-shimmer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 5.373 0 0 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>GENERATING FREQUENCY...</span>
                </>
              ) : (
                'CREATE GAME'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
