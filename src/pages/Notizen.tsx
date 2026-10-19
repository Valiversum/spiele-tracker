import { useEffect, useState } from 'react'
import { addNote, deleteNote, fetchNotes } from '../lib/data'
import type { Note } from '../types'
import { SetupNotice } from '../components/SetupNotice'
import { supabaseConfigured } from '../lib/supabase'

export function Notizen() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  function load() {
    setLoading(true)
    fetchNotes()
      .then(setNotes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (supabaseConfigured) load()
    else setLoading(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    try {
      await addNote(content.trim())
      setContent('')
      load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Notiz löschen?')) return
    await deleteNote(id)
    load()
  }

  if (!supabaseConfigured) return <SetupNotice />
  if (loading) return <p>Lade...</p>

  return (
    <div className="page">
      <h1>Notizen</h1>
      {error && <p className="error">Fehler: {error}</p>}

      <form className="card form" onSubmit={handleSubmit}>
        <label>
          Neue Notiz
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="z.B. Hausregeln, Ideen für neue Spiele, lustige Momente..."
            rows={3}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Speichere...' : 'Notiz hinzufügen'}
        </button>
      </form>

      <ul className="note-list">
        {notes.map((note) => (
          <li key={note.id} className="note-row">
            <p className="note-content">{note.content}</p>
            <div className="note-meta">
              <span>{new Date(note.created_at).toLocaleString('de-AT')}</span>
              <button className="link-btn" onClick={() => handleDelete(note.id)}>
                löschen
              </button>
            </div>
          </li>
        ))}
      </ul>
      {notes.length === 0 && <p>Noch keine Notizen.</p>}
    </div>
  )
}
