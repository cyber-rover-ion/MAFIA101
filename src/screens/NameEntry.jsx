import React, { useState, useEffect } from 'react';

export default function NameEntry({ onSubmit }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a name to continue');
      return;
    }
    if (trimmed.length > 16) {
      setError('Name must be 16 characters or less');
      return;
    }
    onSubmit(trimmed);
  };

  return (
    <div 
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ease-out ${
        mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
      }`}
    >
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* Smoked glass terminal container */}
        <div className="w-full smoked-glass p-8 rounded-2xl relative overflow-hidden">
          {/* Top subtle neon line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF1744]/60 to-transparent" />
          
          <div className="flex flex-col items-center text-center mb-6">
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#FF1744] uppercase mb-1">
              Terminal Authorization
            </span>
            <h2 
              className="text-2xl font-extrabold tracking-wider text-[#F5F5F7]"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              ENTER YOUR NAME
            </h2>
            <p className="text-xs text-[#8E8E98] mt-1.5">
              Choose your operative handle for the lobby.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Operative Codename"
                maxLength={16}
                className="w-full neon-input rounded-xl px-4 py-3.5 text-base text-[#F5F5F7] placeholder-[#545464] font-medium"
              />
              <div className="absolute right-3.5 top-3.5 text-xs text-[#545464] font-mono pointer-events-none">
                {name.length}/16
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-[#FF1744] px-1 animate-neon-slide-up">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full btn-neon-crimson font-bold rounded-xl py-3.5 text-sm tracking-widest uppercase mt-2 neon-shimmer"
            >
              ENTER THE GAME
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
