import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addMatch, deleteMatch, fetchGames, fetchMatchesForGame } from '../lib/data'
import { matchWinner } from '../lib/scoring'
import type { Game, MatchWithScores, Player } from '../types'
import { PLAYERS } from '../types'
import { SetupNotice } from '../components/SetupNotice'
import { supabaseConfigured } from '../lib/supabase'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function GameDetail() {
  const { id } = useParams<{ id: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [matches, setMatches] = useState<MatchWithScores[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [playedAt, setPlayedAt] = useState(today())
  const [note, setNote] = useState('')
  const [scores, setScores] = useState<Record<Player, string>>({ Anja: '', Valentin: '' })
  const [saving, setSaving] = useState(false)

  function load() {
    if (!id) return
    setLoading(true)
    Promise.all([fetchGames(), fetchMatchesForGame(id)])
      .then(([games, m]) => {
        setGame(games.find((g) => g.id === id) ?? null)
        setMatches(m)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (supabaseConfigured) load()
    else setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    const anja = Number(scores.Anja)
    const valentin = Number(scores.Valentin)
    if (Number.isNaN(anja) || Number.isNaN(valentin)) {
      setError('Bitte gültige Punktzahlen für beide Spieler eingeben.')
      return
    }
    setSaving(true)
    try {
      await addMatch(id, playedAt, note, { Anja: anja, Valentin: valentin })
      setNote('')
      setScores({ Anja: '', Valentin: '' })
      setPlayedAt(today())
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(matchId: string) {
    if (!confirm('Diese Partie wirklich löschen?')) return
    await deleteMatch(matchId)
    load()
  }

  if (!supabaseConfigured) return <SetupNotice />
  if (loading) return <p>Lade...</p>
  if (!game) return <p>Spiel nicht gefunden. <Link to="/spiele">Zurück</Link></p>

  return (
    <div className="page">
      <p>
        <Link to="/spiele">← Alle Spiele</Link>
      </p>
      <h1>{game.name}</h1>
      <p className="game-rule">
        Regel: {game.win_condition === 'higher' ? 'höhere Punktzahl gewinnt' : 'niedrigere Punktzahl gewinnt'}
      </p>
      {error && <p className="error">Fehler: {error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <h2>Ergebnis eintragen</h2>
        <label>
          Datum
          <input type="date" value={playedAt} onChange={(e) => setPlayedAt(e.target.value)} />
        </label>
        {PLAYERS.map((player) => (
          <label key={player}>
            Punkte {player}
            <input
              type="number"
              value={scores[player]}
              onChange={(e) => setScores((s) => ({ ...s, [player]: e.target.value }))}
            />
          </label>
        ))}
        <label>
          Notiz (optional)
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="z.B. Revanche" />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Speichere...' : 'Ergebnis speichern'}
        </button>
      </form>

      <section>
        <h2>Partien ({matches.length})</h2>
        {matches.length === 0 && <p>Noch keine Partien für dieses Spiel.</p>}
        <ul className="match-list">
          {matches.map((match) => {
            const winner = matchWinner(match, game)
            return (
              <li key={match.id} className="match-row">
                <span className="match-date">{match.played_at}</span>
                <span className="match-scores">
                  {match.scores.map((s) => `${s.player}: ${s.score}`).join(' · ')}
                </span>
                {winner && <span className="match-winner">🏆 {winner}</span>}
                {match.note && <span className="match-note">{match.note}</span>}
                <button className="link-btn" onClick={() => handleDelete(match.id)}>
                  löschen
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
