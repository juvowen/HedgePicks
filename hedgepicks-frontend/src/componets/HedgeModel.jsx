import { useState, useEffect } from 'react'

function HedgeModal({ game, onClose }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5050/api/hedge/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        teamA: game.teamA,
        oddsA: game.oddsAway,
        teamB: game.teamB,
        oddsB: game.oddsHome,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setResult(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [game])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title">{game.teamA} @ {game.teamB}</h2>

        {loading && <p className="modal-loading">ANALYZING ODDS...</p>}
        {error && <p className="auth-error">{error}</p>}

        {result && (
          <div className="modal-result">
            <div className={`arb-badge ${result.hasArbitrage ? 'arb-yes' : 'arb-no'}`}>
              {result.hasArbitrage ? 'HEDGE OPPORTUNITY FOUND' : 'NO HEDGE OPPORTUNITY'}
            </div>

            <div className="modal-data-row">
              <span>Arbitrage %</span>
              <span>{result.arbPercentage}</span>
            </div>

            {result.hasArbitrage && (
              <>
                <div className="modal-data-row">
                  <span>Bet on {result.team1}</span>
                  <span>${result.stakeTeam1}</span>
                </div>
                <div className="modal-data-row">
                  <span>Bet on {result.team2}</span>
                  <span>${result.stakeTeam2}</span>
                </div>
                <div className="modal-data-row">
                  <span>Total wagered</span>
                  <span>${result.totalWagered}</span>
                </div>
                <div className="modal-data-row">
                  <span>Guaranteed payout</span>
                  <span>${result.guaranteedPayout}</span>
                </div>
                <div className="modal-data-row">
                  <span>Guaranteed profit</span>
                  <span>${result.guaranteedProfit}</span>
                </div>
                <div className="modal-data-row">
                  <span>ROI</span>
                  <span>{result.roiPercent}%</span>
                </div>
              </>
            )}

            <p className="modal-explanation">{result.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HedgeModal