import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllMatches, fetchGames } from '../lib/data'
import { computeStandings, matchWinner } from '../lib/scoring'
import type { Game, MatchWithScores } from '../types'
import { SetupNotice } from '../components/SetupNotice'
import { supabaseConfigured } from '../lib/supabase'

export function Dashboard() {
  const [games, setGames] = useState<Game[]>([])
  const [matches, setMatches] = useState<MatchWithScores[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false)
      return
    }
    Promise.all([fetchGames(), fetchAllMatches()])
      .then(([g, m]) => {
        setGames(g)
        setMatches(m)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (!supabaseConfigured) return <SetupNotice />
  if (loading) return <p>Lade...</p>
  if (error) return <p className="error">Fehler: {error}</p>

  const { wins, draws, totalMatches } = computeStandings(games, matches)
  const gameById = new Map(games.map((g) => [g.id, g]))
  const recent = matches.slice(0, 5)

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{games.length}</div>
          <div className="stat-label">Spiele</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalMatches}</div>
          <div className="stat-label">Partien gespielt</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{wins.Anja}</div>
          <div className="stat-label">Siege Anja</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{wins.Valentin}</div>
          <div className="stat-label">Siege Valentin</div>
        </div>
      </div>

      <section>
        <h2>Letzte Partien</h2>
        {recent.length === 0 && <p>Noch keine Partien eingetragen.</p>}
        <ul className="match-list">
          {recent.map((match) => {
            const game = gameById.get(match.game_id)
            const winner = game ? matchWinner(match, game) : null
            return (
              <li key={match.id} className="match-row">
                <span className="match-game">{game?.name ?? 'Unbekanntes Spiel'}</span>
                <span className="match-date">{match.played_at}</span>
                <span className="match-scores">
                  {match.scores.map((s) => `${s.player}: ${s.score}`).join(' · ')}
                </span>
                {winner && <span className="match-winner">🏆 {winner}</span>}
              </li>
            )
          })}
        </ul>
      </section>

      <p>
        <Link to="/spiele">Alle Spiele ansehen →</Link>
      </p>
    </div>
  )
}
