import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createGame, deleteGame, fetchGames } from '../lib/data'
import type { Game, WinCondition } from '../types'
import { SetupNotice } from '../components/SetupNotice'
import { supabaseConfigured } from '../lib/supabase'

export function Spiele() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [winCondition, setWinCondition] = useState<WinCondition>('higher')
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    fetchGames()
      .then(setGames)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (supabaseConfigured) load()
    else setLoading(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await createGame(name.trim(), winCondition)
      setName('')
      setWinCondition('higher')
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Spiel wirklich löschen? Alle Partien dazu werden auch gelöscht.')) return
    await deleteGame(id)
    load()
  }

  if (!supabaseConfigured) return <SetupNotice />
  if (loading) return <p>Lade...</p>

  return (
    <div className="page">
      <h1>Spiele</h1>
      {error && <p className="error">Fehler: {error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <h2>Neues Spiel anlegen</h2>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. UNO" />
        </label>
        <label>
          Wer gewinnt?
          <select
            value={winCondition}
            onChange={(e) => setWinCondition(e.target.value as WinCondition)}
          >
            <option value="higher">Höhere Punktzahl gewinnt</option>
            <option value="lower">Niedrigere Punktzahl gewinnt</option>
          </select>
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Speichere...' : 'Spiel hinzufügen'}
        </button>
      </form>

      <section>
        <h2>Alle Spiele</h2>
        {games.length === 0 && <p>Noch keine Spiele angelegt.</p>}
        <ul className="game-list">
          {games.map((game) => (
            <li key={game.id} className="game-row">
              <Link to={`/spiele/${game.id}`} className="game-name">
                {game.name}
              </Link>
              <span className="game-rule">
                {game.win_condition === 'higher' ? 'höher gewinnt' : 'niedriger gewinnt'}
              </span>
              <button className="link-btn" onClick={() => handleDelete(game.id)}>
                löschen
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
