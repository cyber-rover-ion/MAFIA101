import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const rooms = new Map();

function generateRoomCode() {
  let code;
  do {
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (rooms.has(code));
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('create-room', ({ mafiaCount }, callback) => {
    const roomCode = generateRoomCode();
    rooms.set(roomCode, {
      code: roomCode,
      hostSocketId: socket.id,
      mafiaCount: mafiaCount || 1,
      players: new Map(),
      started: false,
      roles: new Map()
    });
    socket.join(roomCode);
    console.log(`Room created: ${roomCode} by host ${socket.id}`);
    if (callback) callback({ success: true, roomCode });
  });

  socket.on('join-room', ({ roomCode, playerName }, callback) => {
    if (!roomCode || roomCode.length !== 4) {
      return callback?.({ success: false, error: 'Invalid room code' });
    }
    const room = rooms.get(roomCode);
    if (!room) {
      return callback?.({ success: false, error: 'Room not found' });
    }
    if (room.started) {
      return callback?.({ success: false, error: 'Game already started' });
    }
    if (!playerName || playerName.trim() === '') {
      return callback?.({ success: false, error: 'Player name is required' });
    }

    if (room.players.has(socket.id)) {
      return callback?.({ success: false, error: 'Already in room' });
    }

    room.players.set(socket.id, { name: playerName, socketId: socket.id });
    socket.join(roomCode);

    const playersArray = Array.from(room.players.values());
    io.to(roomCode).emit('player-update', {
      players: playersArray,
      count: playersArray.length
    });

    console.log(`Player ${playerName} joined room ${roomCode}`);
    if (callback) callback({ success: true, players: playersArray, roomCode });
  });

  socket.on('start-game', ({ roomCode }, callback) => {
    const room = rooms.get(roomCode);
    if (!room) return callback?.({ success: false, error: 'Room not found' });
    if (room.hostSocketId !== socket.id) return callback?.({ success: false, error: 'Only host can start game' });
    if (room.players.size < 3) return callback?.({ success: false, error: 'Need at least 3 players' });
    if (room.players.size <= room.mafiaCount) return callback?.({ success: false, error: 'More players than mafia needed' });

    room.started = true;
    const playerSocketIds = Array.from(room.players.keys());
    const shuffledIds = shuffle(playerSocketIds);

    for (let i = 0; i < shuffledIds.length; i++) {
      const pId = shuffledIds[i];
      const role = i < room.mafiaCount ? 'MAFIA' : 'CIVILIAN';
      room.roles.set(pId, role);
      io.to(pId).emit('role-reveal', { role });
    }

    io.to(roomCode).emit('game-started');

    console.log(`Game started in room ${roomCode}`);
    if (callback) callback({ success: true });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);

    for (const [roomCode, room] of rooms.entries()) {
      if (room.hostSocketId === socket.id) {
        io.to(roomCode).emit('room-closed', { reason: 'Host disconnected' });
        rooms.delete(roomCode);
        console.log(`Room ${roomCode} closed due to host disconnect`);
      } else if (room.players.has(socket.id)) {
        room.players.delete(socket.id);
        const playersArray = Array.from(room.players.values());
        io.to(roomCode).emit('player-update', {
          players: playersArray,
          count: playersArray.length
        });
        console.log(`Player removed from room ${roomCode}`);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
