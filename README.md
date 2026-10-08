# MAFIA101

A browser-based multiplayer social-deduction game with room-based play, hidden roles, and real-time communication.

## Overview

MAFIA101 lets players create or join game rooms, enter player names, receive hidden roles, and play through a Mafia-style deduction game. The host configures the room and does not participate as a normal player.

## Gameplay

- Create a game room
- Join with a room code
- Enter a player name
- Configure the Mafia count
- Assign hidden roles
- Support Mafia and civilian gameplay
- Include a Doctor role
- Synchronize connected players in real time

## Architecture

The project uses a browser frontend and a separate multiplayer server.

- Frontend: HTML, CSS, JavaScript and the project's client-side framework
- Backend: Node.js server
- Real-time communication: Socket.IO
- Frontend deployment: Vercel
- Backend deployment: Render

## Running the Project

For local development, use the scripts and configuration provided in the repository.

The deployed architecture separates the web client from the multiplayer server so real-time game state can be managed independently.

## Project Focus

MAFIA101 is also a practical project for working with real-time state synchronization, room management, multiplayer browser interfaces, and social-deduction game logic.

## Creator

Made by **JebinTech**.
