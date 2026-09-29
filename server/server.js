import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'mafia101' });
});

const httpServer = createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://mafia101.vercel.app',
  'https://mafia101-awmdev.vercel.app',
  'https://mafia101-git-main-awmdev.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin not allowed by CORS'));
    },
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
    [a[j], a[i]] = [a[i], a[j]];
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
      doctorCount: 1,
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

    const requiredPlayers = room.mafiaCount + room.doctorCount;
    if (room.players.size < 3) return callback?.({ success: false, error: 'Need at least 3 players' });
    if (room.players.size <= requiredPlayers) {
      return callback?.({ success: false, error: 'Need more players than the configured special roles' });
    }

    room.started = true;
    const playerSocketIds = Array.from(room.players.keys());
    const shuffledIds = shuffle(playerSocketIds);

    let index = 0;

    for (let i = 0; i < room.mafiaCount; i++) {
      const pId = shuffledIds[index++];
      room.roles.set(pId, 'MAFIA');
      io.to(pId).emit('role-reveal', { role: 'MAFIA' });
    }

    for (let i = 0; i < room.doctorCount; i++) {
      const pId = shuffledIds[index++];
      room.roles.set(pId, 'DOCTOR');
      io.to(pId).emit('role-reveal', { role: 'DOCTOR' });
    }

    for (; index < shuffledIds.length; index++) {
      const pId = shuffledIds[index];
      room.roles.set(pId, 'CIVILIAN');
      io.to(pId).emit('role-reveal', { role: 'CIVILIAN' });
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
