import { supabase } from './supabase'
import type { Game, Match, MatchWithScores, Note, Player, WinCondition } from '../types'

function requireClient() {
  if (!supabase) {
    throw new Error(
      'Supabase ist nicht konfiguriert. Bitte VITE_SUPABASE_URL und VITE_SUPABASE_ANON_KEY setzen.',
    )
  }
  return supabase
}

export async function fetchGames(): Promise<Game[]> {
  const { data, error } = await requireClient()
    .from('games')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Game[]
}

export async function createGame(name: string, winCondition: WinCondition): Promise<Game> {
  const { data, error } = await requireClient()
    .from('games')
    .insert({ name, win_condition: winCondition })
    .select()
    .single()
  if (error) throw error
  return data as Game
}

export async function deleteGame(id: string): Promise<void> {
  const { error } = await requireClient().from('games').delete().eq('id', id)
  if (error) throw error
}

export async function fetchMatchesForGame(gameId: string): Promise<MatchWithScores[]> {
  const client = requireClient()
  const { data: matches, error: matchError } = await client
    .from('matches')
    .select('*')
    .eq('game_id', gameId)
    .order('played_at', { ascending: false })
  if (matchError) throw matchError

  const { data: scores, error: scoreError } = await client
    .from('scores')
    .select('*')
    .in('match_id', (matches ?? []).map((m) => m.id))
  if (scoreError) throw scoreError

  return (matches ?? []).map((match: Match) => ({
    ...match,
    scores: (scores ?? []).filter((s) => s.match_id === match.id),
  }))
}

export async function fetchAllMatches(): Promise<MatchWithScores[]> {
  const client = requireClient()
  const { data: matches, error: matchError } = await client
    .from('matches')
    .select('*')
    .order('played_at', { ascending: false })
  if (matchError) throw matchError

  const { data: scores, error: scoreError } = await client.from('scores').select('*')
  if (scoreError) throw scoreError

  return (matches ?? []).map((match: Match) => ({
    ...match,
    scores: (scores ?? []).filter((s) => s.match_id === match.id),
  }))
}

export async function addMatch(
  gameId: string,
  playedAt: string,
  note: string,
  playerScores: Record<Player, number>,
): Promise<void> {
  const client = requireClient()
  const { data: match, error: matchError } = await client
    .from('matches')
    .insert({ game_id: gameId, played_at: playedAt, note: note || null })
    .select()
    .single()
  if (matchError) throw matchError

  const rows = Object.entries(playerScores).map(([player, score]) => ({
    match_id: match.id,
    player,
    score,
  }))
  const { error: scoreError } = await client.from('scores').insert(rows)
  if (scoreError) throw scoreError
}

export async function deleteMatch(id: string): Promise<void> {
  const { error } = await requireClient().from('matches').delete().eq('id', id)
  if (error) throw error
}

export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await requireClient()
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Note[]
}

export async function addNote(content: string): Promise<void> {
  const { error } = await requireClient().from('notes').insert({ content })
  if (error) throw error
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await requireClient().from('notes').delete().eq('id', id)
  if (error) throw error
}
