import GameCard from './GameCard.jsx'

function CategorySection({ category, games, onGameClick }) {
  if (games.length === 0) return null

  return (
    <section className="category-section">
      <h2 className="category-title">{category}</h2>
      <div className="game-grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onClick={onGameClick} />
        ))}
      </div>
    </section>
  )
}

export default CategorySection