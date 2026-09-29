import { io } from 'socket.io-client';

let socket = null;

const SOCKET_TIMEOUT = 8000;

function getSocketUrl() {
  const configuredUrl = import.meta.env.VITE_SOCKET_URL?.trim();

  if (configuredUrl) return configuredUrl;

  if (import.meta.env.PROD) {
    throw new Error('Game server URL is not configured');
  }

  return '/';
}

export function getSocket() {
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      reconnection: true,
      timeout: SOCKET_TIMEOUT,
    });
  }

  return socket;
}

function waitForConnection(s) {
  if (s.connected) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      clearTimeout(timer);
      s.off('connect', onConnect);
      s.off('connect_error', onError);
    };

    const onConnect = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve();
    };

    const onError = (error) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(error?.message || 'Unable to connect to game server'));
    };

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error('Game server connection timed out'));
    }, SOCKET_TIMEOUT);

    s.once('connect', onConnect);
    s.once('connect_error', onError);
  });
}

function emitWithTimeout(event, payload) {
  return new Promise(async (resolve, reject) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error('Game server did not respond in time'));
      }
    }, SOCKET_TIMEOUT);

    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      fn(value);
    };

    try {
      const s = getSocket();
      await waitForConnection(s);

      s.emit(event, payload, (response) => {
        if (response?.success) {
          finish(resolve, response);
        } else {
          finish(
            reject,
            new Error(response?.error || ('Failed to ' + event))
          );
        }
      });
    } catch (error) {
      finish(
        reject,
        error instanceof Error
          ? error
          : new Error('Game server connection failed')
      );
    }
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export async function createRoom(mafiaCount) {
  const response = await emitWithTimeout('create-room', { mafiaCount });
  return response.roomCode;
}

export async function joinRoom(roomCode, playerName) {
  const response = await emitWithTimeout('join-room', { roomCode, playerName });
  return response.players;
}

export async function startGame(roomCode) {
  await emitWithTimeout('start-game', { roomCode });
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
