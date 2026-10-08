# MAFIA101

A browser-based multiplayer social-deduction game built around room-based play, hidden roles, and real-time communication.

## Overview

MAFIA101 is a multiplayer game where players join a room, receive hidden roles, and use discussion and deduction to identify the Mafia. The project combines a simple lobby flow with real-time multiplayer state and a neon-styled browser interface.

## Core Gameplay

- Create a game room
- Join using a room code
- Enter a player name
- Configure the Mafia count through the host
- Assign hidden roles
- Support Mafia and civilian-side gameplay
- Include a Doctor role
- Synchronize multiplayer activity in real time

The host is responsible for room setup and does not participate as a normal player.

## Multiplayer Architecture

The production setup uses a separated frontend and backend:

- Browser frontend
- Multiplayer backend
- Socket.IO for real-time communication
- Vercel for frontend deployment
- Render for backend deployment

This separation allows the browser client and multiplayer server to evolve independently while Socket.IO handles the real-time communication layer.

## Playing

Open the deployed game, enter a player name, and create or join a room using the available room controls.

For local development, use the scripts and configuration included in the repository.

## Project Focus

MAFIA101 is also a practical experiment in:

- Real-time web applications
- Multiplayer state synchronization
- Room-based server architecture
- Browser game UI/UX
- Social-deduction mechanics
- Handling connected player state

## Future Ideas

- Additional roles
- More game modes
- Expanded lobby customization
- Improved reconnect handling
- Spectator support
- More polished mobile gameplay
- Additional game-state feedback

## Creator

Made by **JebinTech**.

---
A multiplayer social-deduction experiment built by **JebinTech**.
