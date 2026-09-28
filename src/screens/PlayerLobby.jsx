import React, { useState, useEffect } from 'react';
import { onPlayerUpdate, onGameStarted, onRoleReveal, onRoomClosed, offPlayerUpdate, offGameStarted, offRoleReveal, offRoomClosed } from '../lib/game';

export default function PlayerLobby({ roomCode, playerName, initialPlayers = [], onRoleReveal: handleRoleReveal }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const handlePlayerUpdate = ({ players: updatedPlayers }) => setPlayers(updatedPlayers || []);
    const handleGameStart = () => {};
    const handleRole = ({ role }) => handleRoleReveal(role);
    const handleRoomClosed = () => setClosed(true);

    onPlayerUpdate(handlePlayerUpdate);
    onGameStarted(handleGameStart);
    onRoleReveal(handleRole);
    onRoomClosed(handleRoomClosed);

    return () => {
      offPlayerUpdate(handlePlayerUpdate);
      offGameStarted(handleGameStart);
      offRoleReveal(handleRole);
      offRoomClosed(handleRoomClosed);
    };
  }, [handleRoleReveal]);

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto relative z-10">
      {/* Top Header */}
      <div className="flex flex-col items-center text-center pt-2 sm:pt-4">
        <span className="text-[11px] font-bold tracking-[0.35em] text-[#8B5CFF] uppercase mb-1">
          Player Infiltration Mode
        </span>
        <h1 
          className="text-2xl sm:text-3xl font-black tracking-wider text-[#F5F5F7] mb-3"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          ROOM {roomCode}
        </h1>

        {/* Identity Chip */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0D0D13] border border-[#FF1744]/40 rounded-full shadow-[0_0_12px_rgba(255,23,68,0.2)] text-xs text-[#8E8E98]">
          <span>Operative Handle:</span>
          <span className="text-[#F5F5F7] font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF1744] shadow-[0_0_6px_#FF1744]" />
            {playerName}
          </span>
        </div>
      </div>

      {/* Players Section */}
      <div className="flex-1 flex flex-col gap-3 my-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold tracking-widest text-[#F5F5F7] uppercase">
              Assembled Operatives
            </h2>
            <span className="w-2 h-2 rounded-full bg-[#FF2D75] shadow-[0_0_8px_#FF2D75] animate-pulse" />
          </div>
          <span className="bg-[#12121A] border border-white/5 px-2.5 py-0.5 rounded-full text-xs text-[#F5F5F7] font-mono font-bold">
            {players.length}
          </span>
        </div>
        
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[42vh] pr-1">
          {players.map((p, i) => {
            const name = p.name || p;
            const isMe = name === playerName;
            return (
              <div 
                key={p.socketId || p.id || i} 
                className={`p-3.5 rounded-xl transition-all animate-neon-slide-up flex items-center justify-between ${
                  isMe 
                    ? 'mafia-neon-card' 
                    : 'smoked-glass-card text-[#F5F5F7]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                    isMe 
                      ? 'bg-[#FF1744]/20 text-white border border-[#FF1744] shadow-[0_0_10px_#FF1744]' 
                      : 'bg-[#181824] text-[#8E8E98] border border-white/5'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-semibold tracking-wide ${isMe ? 'text-white font-bold' : 'text-[#F5F5F7]'}`}>
                    {name}
                  </span>
                </div>

                {isMe ? (
                  <span className="text-[11px] font-black text-white bg-[#FF1744] shadow-[0_0_10px_#FF1744] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    YOU
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#8B5CFF] bg-[#8B5CFF]/10 border border-[#8B5CFF]/30 px-2 py-0.5 rounded-md">
                    READY
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Atmospheric Waiting Footer */}
      <div className="smoked-glass p-5 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#FF1744] shadow-[0_0_8px_#FF1744] animate-ping" />
          <span className="w-2 h-2 rounded-full bg-[#FF2D75] shadow-[0_0_8px_#FF2D75] animate-pulse" />
          <span className="w-2 h-2 rounded-full bg-[#8B5CFF] shadow-[0_0_8px_#8B5CFF] animate-ping" />
        </div>
        <p className="text-sm font-bold text-[#F5F5F7] tracking-wider uppercase">
          WAITING FOR HOST TO START...
        </p>
        <p className="text-xs text-[#8E8E98] mt-1">
          Your secret role assignment will be transmitted shortly.
        </p>
      </div>

      {/* Host Disconnected Modal */}
      {closed && (
        <div className="fixed inset-0 bg-[#050507]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 z-50 animate-neon-slide-up">
          <div className="smoked-glass p-8 rounded-2xl max-w-sm w-full text-center border border-[#FF1744]/50 shadow-[0_0_50px_rgba(255,23,68,0.25)]">
            <div className="w-12 h-12 rounded-full bg-[#B00020]/30 border border-[#FF1744] flex items-center justify-center mx-auto mb-4 text-[#FF1744] shadow-[0_0_15px_#FF1744]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3 
              className="text-xl font-black text-[#F5F5F7] mb-2 uppercase tracking-wider"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              SIGNAL LOST
            </h3>
            <p className="text-xs text-[#8E8E98] mb-6">
              The host closed the room or lost transmission.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full btn-neon-crimson text-white py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest"
            >
              RETURN TO BASE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
