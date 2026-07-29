const express = require('express')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const router = express.Router()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

router.post('/analyze', async (req, res) => {
  try {
    const { teamA, oddsA, teamB, oddsB, stake } = req.body

    if (!oddsA || !oddsB) {
      return res.status(400).json({ error: 'Missing odds data' })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' })

    const prompt = `You are a sports betting arbitrage and hedge calculator.

Given odds from one or more sportsbooks, determine whether a guaranteed hedge (arbitrage) opportunity exists.

Follow these steps:

Group odds by team.
For each team, select the best available odds: For positive American odds (+), choose the largest positive number. For negative American odds (-), choose the least negative number (closest to zero).

Convert the selected American odds to decimal odds using:
Positive odds: Decimal = 1 + American/100
Negative odds: Decimal = 1 + 100/|American|

Compute the arbitrage percentage:
Arb = 1/Decimal1 + 1/Decimal2

Determine:
If Arb < 1.0000 -> Guaranteed arbitrage exists.
If Arb = 1.0000 -> Break-even.
If Arb > 1.0000 -> No arbitrage.

If arbitrage exists:
Assume a default bankroll of $${stake || 100} on the first selected team (or use a user-provided stake).
Calculate the first payout: Payout = Stake x Decimal1
Calculate the hedge stake: HedgeStake = Payout / Decimal2
Compute: Total amount wagered, Guaranteed payout, Guaranteed profit, ROI (%)

If no arbitrage exists:
Report the arbitrage percentage.
Report how far above 1.0000 it is.
Explain that a guaranteed hedge is mathematically impossible at the current odds.

If there exists an arbitrage then tell user how much money to bet on who.

Here is the data:
Team 1: ${teamA}, odds: ${oddsA}
Team 2: ${teamB}, odds: ${oddsB}

Respond ONLY with valid JSON, no markdown formatting, no code fences, no preamble. Use this exact schema:
{
  "hasArbitrage": boolean,
  "arbPercentage": string,
  "team1": string,
  "team2": string,
  "decimal1": string,
  "decimal2": string,
  "stakeTeam1": string,
  "stakeTeam2": string,
  "totalWagered": string,
  "guaranteedPayout": string,
  "guaranteedProfit": string,
  "roiPercent": string,
  "explanation": string
}
If there is no arbitrage, still fill the schema but set the stake/payout/profit fields to "N/A" and put the explanation in "explanation".`

    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const analysis = JSON.parse(cleaned)

    res.json(analysis)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Analysis failed' })
  }
})

module.exports = router