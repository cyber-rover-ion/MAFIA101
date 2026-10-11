# MAFIA101

A real-time multiplayer Mafia social-deduction game with private rooms, hidden roles, and synchronized lobbies.

## Overview

Players choose a name, create or join a four-digit room, and receive a secret role when the host starts the game. The current role set includes Mafia, Doctor, and Civilian.

## Features

- Create and join private game rooms
- Configure one to five Mafia roles
- Live player-list updates through Socket.IO
- Host-controlled game start
- Private role assignment
- Automatic room closure when the host disconnects
- Input validation for room settings, room codes, and player names
- Browser-based React interface with a Vite development server

## Technology

- React and Vite
- Tailwind CSS
- Node.js and Express
- Socket.IO for real-time communication

## Requirements

- Node.js 18 or newer
- npm

## Local Development

Install dependencies:

```bash
npm install
```

Start both the multiplayer server and frontend development server:

```bash
npm run start
```

The frontend is served by Vite at `http://localhost:5173`. The Socket.IO server listens on port `3001` by default, and the Vite development server proxies Socket.IO traffic to it.

To run the processes separately, use two terminals:

```bash
npm run server
```

```bash
npm run dev
```

Build the frontend for production:

```bash
npm run build
```

## Configuration

- `PORT` sets the backend listening port; the default is `3001`.
- `FRONTEND_URL` adds your deployed frontend origin to the backend's Socket.IO CORS allowlist.
- The development client uses the Vite proxy by default. Set `VITE_SOCKET_URL` when the local client needs to connect to a different server URL.

For production, configure the frontend and backend URLs to match your deployment and keep the CORS allowlist limited to trusted origins.

## Project Structure

- `src/App.jsx` — application screens and navigation state
- `src/lib/game.js` — Socket.IO client and game actions
- `src/screens/` — name entry, room setup, lobbies, and role reveal
- `server/server.js` — room management and role assignment
- `vite.config.js` — frontend build configuration and development proxy

## Gameplay Notes

The current implementation assigns roles and synchronizes lobby state. It is a foundation for a social-deduction game; additional round phases such as day/night voting and win-condition resolution can be added as separate game systems.

## Maintainer

**JebinTech**
