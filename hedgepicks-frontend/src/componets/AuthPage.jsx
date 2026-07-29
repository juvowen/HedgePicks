import { useState } from 'react'

function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('EMAIL AND PASSWORD REQUIRED')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('PASSWORDS DO NOT MATCH')
      return
    }

    setLoading(true)

    try {
      const endpoint = mode === 'login' ? 'login' : 'signup'
      const body = mode === 'login'
        ? { email, password }
        : { name, email, password }

      const res = fetch(`${import.meta.env.VITE_API_URL}/api/users/${endpoint}`,  {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError((data.error || 'Something went wrong').toUpperCase())
        setLoading(false)
        return
      }

      onAuth(data.user)
    } catch (err) {
      setError('COULD NOT REACH SERVER')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h1 className="logo auth-logo">HEDGE<br/>PICKS</h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setError('') }}
            type="button"
          >
            LOGIN
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setError('') }}
            type="button"
          >
            SIGN UP
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label className="auth-label">NAME</label>
              <input
                type="text"
                className="search-input auth-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label className="auth-label">EMAIL</label>
          <input
            type="email"
            className="search-input auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-label">PASSWORD</label>
          <input
            type="password"
            className="search-input auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {mode === 'signup' && (
            <>
              <label className="auth-label">CONFIRM PASSWORD</label>
              <input
                type="password"
                className="search-input auth-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'PLEASE WAIT...' : mode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage