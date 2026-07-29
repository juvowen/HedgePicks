require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')
const cors = require('cors')
const session = require('express-session')
const { connectToDB } = require('./models/db')
const usersRouter = require('./routes/user')
const hedgeRouter = require('./routes/hedge')
const MongoStore = require('connect-mongo').default

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.ATLAS_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // up 2 7 days
}))

;(async () => {
  try {
    await connectToDB()
    console.log('Database initialized')
  } catch (error) {
    console.error('Failed to start database:', error)
  }
})()

app.use('/api/users', usersRouter)
app.use('/api/hedge', hedgeRouter)

const API_KEY = process.env.SPORTSGAMEODDS_KEY
const API_BASE = 'https://api.sportsgameodds.com/v2'

app.get('/api/mlb/games', async (req, res) => {
  try {
    const response = await fetch(
      `${API_BASE}/events?leagueID=MLB&oddsAvailable=true&limit=10`,
      { headers: { 'x-api-key': API_KEY } }
    )
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch MLB data' })
  }
})

const PORT = process.env.PORT || 5050
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))