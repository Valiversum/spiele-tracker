export type Player = 'Anja' | 'Valentin'

export const PLAYERS: Player[] = ['Anja', 'Valentin']

export type WinCondition = 'higher' | 'lower'

export interface Game {
  id: string
  name: string
  win_condition: WinCondition
  created_at: string
}

export interface Match {
  id: string
  game_id: string
  played_at: string
  note: string | null
  created_at: string
}

export interface Score {
  id: string
  match_id: string
  player: Player
  score: number
}

export interface Note {
  id: string
  content: string
  created_at: string
}

export interface MatchWithScores extends Match {
  scores: Score[]
}
