import React, { useState } from 'react';
import { joinRoom } from '../lib/game';

export default function JoinGame({ playerName, onJoined, onBack }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.length !== 4) {
      setError('Enter the complete 4-digit room code');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const players = await joinRoom(code, playerName);
      onJoined(code, players);
    } catch (err) {
      setError(err.message || 'Failed to join room');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) {
      setCode(val);
      if (error) setError('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto relative z-10">
        {/* Back navigation */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#8E8E98] hover:text-[#F5F5F7] transition-colors mb-4 focus:outline-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>
        
        {/* Smoked glass card */}
        <div className="w-full smoked-glass p-7 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CFF]/60 to-transparent" />

          <div className="text-center mb-6">
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#8B5CFF] uppercase mb-1 block">
              Direct Infiltration
            </span>
            <h2 
              className="text-2xl font-black tracking-wider text-[#F5F5F7]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              JOIN GAME
            </h2>
            <p className="text-xs text-[#8E8E98] mt-1.5">
              Enter the 4-digit code provided by your host.
            </p>
          </div>

          <form onSubmit={handleJoin} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={code}
                  onChange={handleChange}
                  placeholder="••••"
                  maxLength={4}
                  className="w-full bg-[#09090D] border border-white/10 rounded-xl p-4 text-3xl font-extrabold tracking-[0.6em] text-center text-[#F5F5F7] font-mono focus:outline-none focus:border-[#8B5CFF] focus:ring-2 focus:ring-[#8B5CFF]/40 shadow-[0_0_15px_rgba(139,92,255,0.15)] transition-all"
                />
              </div>

              {error && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-[#FF1744] mt-1 animate-neon-slide-up">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading || code.length !== 4}
              className="w-full btn-neon-purple rounded-xl py-4 text-sm font-bold tracking-widest uppercase mt-1 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                'JOIN GAME'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
