import { useState } from 'react'

function Header({ searchTerm, onSearchChange, user, onLogout, onAccountDeleted }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleDelete = async () => {
    const res = await fetch('http://localhost:5050/api/users/me', {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      onAccountDeleted()
    }
  }

  return (
    <header className="header">
      <h1 className="logo">HEDGE<br/>PICKS</h1>
      <input
        type="text"
        className="search-input"
        placeholder="SEARCH_"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="header-stats">
        <div className="stat-row"><span>GAMES_TRACKED</span><span>05</span></div>
        <div className="stat-row"><span>AVG_EDGE</span><span>3.2%</span></div>
      </div>

      <div className="header-account">
        <span className="account-email">{user.email}</span>
        <button className="logout-link" onClick={onLogout}>LOGOUT</button>

        {!confirmDelete ? (
          <button className="delete-account-btn" onClick={() => setConfirmDelete(true)}>
            DELETE ACCOUNT
          </button>
        ) : (
          <>
            <button className="delete-account-btn confirm" onClick={handleDelete}>
              CONFIRM DELETE
            </button>
            <button className="logout-link" onClick={() => setConfirmDelete(false)}>
              CANCEL
            </button>
          </>
        )}
      </div>

      <div className="header-footer">
        <span className="status-dot"></span> LIVE FEED
      </div>
    </header>
  )
}

export default Header