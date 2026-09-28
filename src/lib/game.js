import { io } from 'socket.io-client';

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io('/', { transports: ['websocket', 'polling'] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function createRoom(mafiaCount) {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    s.emit('create-room', { mafiaCount }, (response) => {
      if (response.success) {
        resolve(response.roomCode);
      } else {
        reject(new Error(response.error || 'Failed to create room'));
      }
    });
  });
}

export function joinRoom(roomCode, playerName) {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    s.emit('join-room', { roomCode, playerName }, (response) => {
      if (response.success) {
        resolve(response.players);
      } else {
        reject(new Error(response.error || 'Failed to join room'));
      }
    });
  });
}

export function startGame(roomCode) {
  return new Promise((resolve, reject) => {
    const s = getSocket();
    s.emit('start-game', { roomCode }, (response) => {
      if (response.success) {
        resolve();
      } else {
        reject(new Error(response.error || 'Failed to start game'));
      }
    });
  });
}

export function onPlayerUpdate(callback) {
  getSocket().on('player-update', callback);
}

export function onGameStarted(callback) {
  getSocket().on('game-started', callback);
}

export function onRoleReveal(callback) {
  getSocket().on('role-reveal', callback);
}

export function onRoomClosed(callback) {
  getSocket().on('room-closed', callback);
}

export function offPlayerUpdate() {
  if (socket) socket.off('player-update');
}

export function offGameStarted() {
  if (socket) socket.off('game-started');
}

export function offRoleReveal() {
  if (socket) socket.off('role-reveal');
}

export function offRoomClosed() {
  if (socket) socket.off('room-closed');
}
