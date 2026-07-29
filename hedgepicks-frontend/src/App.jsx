import { useState, useEffect } from "react";
import Header from "./componets/Header.jsx";
import CategorySection from "./componets/CategorySection.jsx";
import AuthPage from "./componets/AuthPage.jsx";
import HedgeModal from "./componets/HedgeModel.jsx";

function findOdd(odds, betTypeID, sideID) {
  return Object.values(odds || {}).find(
    (o) => o.betTypeID === betTypeID && o.sideID === sideID,
  );
}

function transformEvent(event) {
  const home = event.teams.home.names.medium;
  const away = event.teams.away.names.medium;
  const homeML = findOdd(event.odds, "ml", "home");
  const awayML = findOdd(event.odds, "ml", "away");

  return {
    id: event.eventID,
    teamA: away,
    teamB: home,
    time: new Date(event.status.startsAt).toLocaleString("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }),
    oddsHome: homeML ? homeML.bookOdds || homeML.fairOdds : "—",
    oddsAway: awayML ? awayML.bookOdds || awayML.fairOdds : "—",
  };
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  // Check if a session already exists (e.g. after a page refresh)
  useEffect(() => {
    fetch("http://localhost:5050/api/users/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("http://localhost:5050/api/mlb/games")
      .then((res) => res.json())
      .then((data) => {
        const transformed = (data.data || []).map(transformEvent);
        setGames(transformed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  const filtered = games.filter((g) =>
    `${g.teamA} ${g.teamB}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleLogout = async () => {
    await fetch("http://localhost:5050/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setGames([]);
  };

  if (checkingSession) {
    return <div className="app-loading">LOADING...</div>;
  }

  if (!user) {
    return <AuthPage onAuth={(u) => setUser(u)} />;
  }

  return (
    <div className="app">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        user={user}
        onLogout={handleLogout}
        onAccountDeleted={() => setUser(null)}
      />
      <main className="main">
        {loading && <p style={{ color: "#f0f0f0" }}>Loading MLB games...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}
        {!loading && !error && (
          <CategorySection
            category="MLB"
            games={filtered}
            onGameClick={setSelectedGame}
          />
        )}
      </main>

      {selectedGame && (
        <HedgeModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  );
}

export default App;
