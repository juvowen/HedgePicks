# HedgePicks

A fullstack web app that helps users identify betting hedge opportunities on MLB games using realtime odds data and AI analysis.

## Features
- User signup and login with secure session based authentication
- Live MLB game data and moneyline odds with SportsGameOdds API
- AI  powered hedge analysis on each game (Google Gemini)
- Search and filter games by team
- Account management:delete account

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas), native MongoDB driver
- **Auth:** express session with connect mongo session store, crypto scrypt password hashing
- **External APIs:** SportsGameOdds (game and odds data), Google Gemini (hedge analysis)

## Database Schema
**users collection:**
- name: String
- email: String (unique)
- password: String (scrypt hash)
- salt: String



