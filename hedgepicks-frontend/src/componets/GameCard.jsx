function GameCard({ game, onClick }) {
  return (
    <div className="game-card" onClick={() => onClick(game)}>
      <p className="game-title">{game.teamA} @ {game.teamB}</p>
      <p className="game-time">{game.time}</p>
      <div className="game-data">
        <div className="data-point">
          <span className="data-label">AWAY ML</span>
          <span className="data-value">{game.oddsAway}</span>
        </div>
        <div className="data-point">
          <span className="data-label">HOME ML</span>
          <span className="data-value">{game.oddsHome}</span>
        </div>
      </div>
    </div>
  )
}

export default GameCard