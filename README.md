# HedgePicks

A fullstack web app that helps users identify betting hedge/arbitrage opportunities on MLB games using real-time odds data and AI analysis.

## Features
- User signup/login with secure session-based authentication
- Live MLB game data and moneyline odds via SportsGameOdds API
- AI-powered hedge/arbitrage analysis on each game (Google Gemini)
- Search/filter games by team
- Account management: view profile, delete account

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas), native MongoDB driver
- **Auth:** express-session with connect-mongo session store, crypto scrypt password hashing
- **External APIs:** SportsGameOdds (game/odds data), Google Gemini (hedge analysis)

## Setup Instructions

### Backend
\`\`\`
cd hedgepicks-backend
npm install
\`\`\`
Create a \`.env\` file in \`hedgepicks-backend\` with:
\`\`\`
SPORTSGAMEODDS_KEY=your_key
PORT=5050
ATLAS_URI=your_mongodb_connection_string
SESSION_SECRET=your_random_secret
GEMINI_API_KEY=your_gemini_key
\`\`\`
Run:
\`\`\`
node server.js
\`\`\`

### Frontend
\`\`\`
cd hedgepicks-frontend
npm install
npm run dev
\`\`\`
Visit \`http://localhost:5173\`

## Test Login
- Email: test@test.com
- Password: password123

## Database Schema
**users collection:**
- name: String
- email: String (unique)
- password: String (scrypt hash)
- salt: String
