import React, { useState, useEffect, useCallback } from 'react';
import PixelCanvas from './components/PixelCanvas';
import Splash from './screens/Splash';
import NameEntry from './screens/NameEntry';
import Home from './screens/Home';
import CreateGame from './screens/CreateGame';
import JoinGame from './screens/JoinGame';
import HostLobby from './screens/HostLobby';
import PlayerLobby from './screens/PlayerLobby';
import RoleReveal from './screens/RoleReveal';
import { disconnectSocket } from './lib/game';

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('mafia-player-name') || '');
  const [roomCode, setRoomCode] = useState(null);
  const [mafiaCount, setMafiaCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const [role, setRole] = useState(null);

  const handleSplashComplete = useCallback(() => {
    setScreen(playerName ? 'home' : 'name');
  }, [playerName]);

  const handleSaveName = useCallback((name) => {
    localStorage.setItem('mafia-player-name', name);
    setPlayerName(name);
    setScreen('home');
  }, []);

  const handleChangeName = useCallback(() => {
    localStorage.removeItem('mafia-player-name');
    setPlayerName('');
    setScreen('name');
  }, []);

  const handleRoomCreated = useCallback((code, count) => {
    setRoomCode(code);
    setMafiaCount(count);
    setScreen('hostLobby');
  }, []);

  const handleJoined = useCallback((code, playerList) => {
    setRoomCode(code);
    setPlayers(playerList);
    setScreen('playerLobby');
  }, []);

  const handleRoleReveal = useCallback((assignedRole) => {
    setRole(assignedRole);
    setScreen('roleReveal');
  }, []);

  const handleHome = useCallback(() => {
    disconnectSocket();
    setRoomCode(null);
    setPlayers([]);
    setRole(null);
    setScreen('home');
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'splash':
        return <Splash onComplete={handleSplashComplete} />;
      case 'name':
        return <NameEntry onSubmit={handleSaveName} />;
      case 'home':
        return (
          <Home
            playerName={playerName}
            onCreateGame={() => setScreen('create')}
            onJoinGame={() => setScreen('join')}
            onChangeName={handleChangeName}
          />
        );
      case 'create':
        return (
          <CreateGame
            onRoomCreated={handleRoomCreated}
            onBack={() => setScreen('home')}
          />
        );
      case 'join':
        return (
          <JoinGame
            playerName={playerName}
            onJoined={handleJoined}
            onBack={() => setScreen('home')}
          />
        );
      case 'hostLobby':
        return (
          <HostLobby
            roomCode={roomCode}
            mafiaCount={mafiaCount}
            onGameStarted={() => {}}
          />
        );
      case 'playerLobby':
        return (
          <PlayerLobby
            roomCode={roomCode}
            playerName={playerName}
            initialPlayers={players}
            onRoleReveal={handleRoleReveal}
          />
        );
      case 'roleReveal':
        return <RoleReveal role={role} onHome={handleHome} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full neon-bg-atmosphere overflow-x-hidden">
      {/* Neon Pixel Particle Canvas */}
      <PixelCanvas />

      {/* Main Screen Content */}
      <main className="relative z-10 w-full min-h-screen">
        {renderScreen()}
      </main>
    </div>
  );
}
