import { useEffect, useState } from 'react'
import { fetchAllMatches, fetchGames } from '../lib/data'
import { matchWinner } from '../lib/scoring'
import type { Game, MatchWithScores, Player } from '../types'
import { PLAYERS } from '../types'
import { SetupNotice } from '../components/SetupNotice'
import { supabaseConfigured } from '../lib/supabase'

interface GameRow {
  game: Game
  wins: Record<Player, number>
  draws: number
  played: number
}

export function Wertung() {
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

  const rows: GameRow[] = games.map((game) => {
    const gameMatches = matches.filter((m) => m.game_id === game.id)
    const wins: Record<Player, number> = { Anja: 0, Valentin: 0 }
    let draws = 0
    for (const match of gameMatches) {
      const winner = matchWinner(match, game)
      if (winner === 'Anja' || winner === 'Valentin') wins[winner] += 1
      else if (winner === 'Unentschieden') draws += 1
    }
    return { game, wins, draws, played: gameMatches.length }
  })

  const totalWins: Record<Player, number> = { Anja: 0, Valentin: 0 }
  let totalDraws = 0
  for (const row of rows) {
    totalWins.Anja += row.wins.Anja
    totalWins.Valentin += row.wins.Valentin
    totalDraws += row.draws
  }

  const leader =
    totalWins.Anja === totalWins.Valentin
      ? 'Gleichstand'
      : totalWins.Anja > totalWins.Valentin
        ? 'Anja'
        : 'Valentin'

  return (
    <div className="page">
      <h1>Gesamtwertung</h1>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{totalWins.Anja}</div>
          <div className="stat-label">Siege Anja</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalWins.Valentin}</div>
          <div className="stat-label">Siege Valentin</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalDraws}</div>
          <div className="stat-label">Unentschieden</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{leader}</div>
          <div className="stat-label">Aktuell in Führung</div>
        </div>
      </div>

      <table className="score-table">
        <thead>
          <tr>
            <th>Spiel</th>
            <th>Partien</th>
            {PLAYERS.map((p) => (
              <th key={p}>{p}</th>
            ))}
            <th>Unentschieden</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.game.id}>
              <td>{row.game.name}</td>
              <td>{row.played}</td>
              {PLAYERS.map((p) => (
                <td key={p}>{row.wins[p]}</td>
              ))}
              <td>{row.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p>Noch keine Spiele angelegt.</p>}
    </div>
  )
}
