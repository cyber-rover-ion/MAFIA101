import React, { useState, useEffect } from 'react';
import { startGame, onPlayerUpdate, onRoomClosed, offPlayerUpdate, offRoomClosed } from '../lib/game';

export default function HostLobby({ roomCode, mafiaCount, onGameStarted }) {
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handlePlayerUpdate = ({ players: updatedPlayers }) => setPlayers(updatedPlayers || []);
    const handleRoomClosed = () => setError('Room was closed.');

    onPlayerUpdate(handlePlayerUpdate);
    onRoomClosed(handleRoomClosed);

    return () => {
      offPlayerUpdate(handlePlayerUpdate);
      offRoomClosed(handleRoomClosed);
    };
  }, []);

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard?.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      await startGame(roomCode);
      onGameStarted();
    } catch (err) {
      setError(err.message || 'Failed to start game');
      setLoading(false);
    }
  };

  const minPlayers = Math.max(3, mafiaCount + 2);
  const canStart = players.length >= minPlayers;

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto relative z-10">
      <div className="flex flex-col items-center text-center pt-2 sm:pt-4">
        <span className="text-[11px] font-bold tracking-[0.35em] text-[#FF1744] uppercase mb-1">
          Command Deck • Host Mode
        </span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-wider text-[#F5F5F7] mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
          HOST LOBBY
        </h1>

        <div onClick={handleCopyCode} className="w-full smoked-glass p-5 rounded-2xl border border-white/10 hover:border-[#FF1744]/60 cursor-pointer group transition-all relative overflow-hidden text-center shadow-[0_0_25px_rgba(0,0,0,0.6)]" title="Click to copy room code">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF1744]/80 to-transparent" />
          <div className="text-[10px] tracking-[0.3em] text-[#8E8E98] uppercase font-bold mb-1">ROOM FREQUENCY</div>
          <div className="text-4xl sm:text-5xl font-black tracking-[0.3em] text-[#F5F5F7] font-mono select-all text-shadow drop-shadow-[0_0_15px_rgba(255,23,68,0.4)]">{roomCode}</div>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[#8E8E98] group-hover:text-[#F5F5F7] transition-colors">
            {copied ? (
              <span className="text-[#FF2D75] font-bold flex items-center gap-1 drop-shadow-[0_0_8px_#FF2D75]">COPIED TO CLIPBOARD!</span>
            ) : (
              <span>Click to copy & broadcast code</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 mt-3.5">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#12121A] border border-white/5 rounded-full text-xs text-[#8E8E98]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF1744] shadow-[0_0_6px_#FF1744]" />
            <span>Mafia: <strong className="text-[#F5F5F7] font-mono">{mafiaCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#12121A] border border-white/5 rounded-full text-xs text-[#8E8E98]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CFF] shadow-[0_0_6px_#8B5CFF]" />
            <span>Doctor: <strong className="text-[#F5F5F7] font-mono">1</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#12121A] border border-white/5 rounded-full text-xs text-[#8E8E98]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CFF] shadow-[0_0_6px_#8B5CFF]" />
            <span>Min Players: <strong className="text-[#F5F5F7] font-mono">{minPlayers}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 my-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-widest text-[#F5F5F7] uppercase">Connected Operatives</h2>
            <span className="w-2 h-2 rounded-full bg-[#FF1744] shadow-[0_0_8px_#FF1744] animate-pulse" />
          </div>
          <span className="bg-[#12121A] border border-white/5 px-2.5 py-0.5 rounded-full text-xs text-[#F5F5F7] font-mono font-bold">{players.length} / {minPlayers}+</span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[36vh] pr-1">
          {players.length === 0 ? (
            <div className="smoked-glass p-8 rounded-xl text-center flex flex-col items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-t-[#FF1744] border-white/10 animate-spin mb-3" />
              <p className="text-xs font-semibold tracking-wider text-[#8E8E98] uppercase">Waiting for players to join...</p>
              <p className="text-[11px] text-[#545464] mt-1">Host observes and oversees the session.</p>
            </div>
          ) : (
            players.map((p, i) => (
              <div key={p.socketId || p.id || i} className="smoked-glass-card p-3.5 rounded-xl text-[#F5F5F7] flex items-center justify-between animate-neon-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#181824] border border-white/10 flex items-center justify-center text-xs font-bold text-[#FF1744] font-mono">{i + 1}</div>
                  <span className="font-semibold text-sm tracking-wide">{p.name || p}</span>
                </div>
                <span className="text-[11px] font-bold text-[#FF2D75] bg-[#FF2D75]/10 border border-[#FF2D75]/30 px-2 py-0.5 rounded-md">READY</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 pb-2">
        {error && <p className="text-xs text-[#FF1744] text-center bg-[#B00020]/20 border border-[#FF1744]/30 p-2.5 rounded-lg">{error}</p>}

        {!canStart && (
          <div className="text-center">
            <p className="text-xs text-[#8E8E98]">
              Need <strong className="text-[#F5F5F7] font-mono">{minPlayers - players.length}</strong> more operative{minPlayers - players.length > 1 ? 's' : ''} to initiate role assignment.
            </p>
          </div>
        )}

        <button onClick={handleStart} disabled={!canStart || loading} className={`w-full rounded-xl py-4 text-sm font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${canStart ? 'btn-neon-crimson neon-glow-strong neon-shimmer' : 'bg-[#12121A] text-[#545464] border border-white/5 cursor-not-allowed'}`}>
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 5.373 0 0 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>DEALING CLASSIFIED ROLES...</span>
            </>
          ) : 'START GAME'}
        </button>
      </div>
    </div>
  );
}
