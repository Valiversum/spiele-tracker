import type { Game, MatchWithScores, Player } from '../types'
import { PLAYERS } from '../types'

export function matchWinner(match: MatchWithScores, game: Game): Player | 'Unentschieden' | null {
  if (match.scores.length < 2) return null
  const byPlayer = new Map(match.scores.map((s) => [s.player, s.score]))
  const values = PLAYERS.map((p) => byPlayer.get(p))
  if (values.some((v) => v === undefined)) return null

  const [anja, valentin] = values as [number, number]
  if (anja === valentin) return 'Unentschieden'

  const anjaWins = game.win_condition === 'higher' ? anja > valentin : anja < valentin
  return anjaWins ? 'Anja' : 'Valentin'
}

export interface StandingRow {
  player: Player
  wins: number
  totalScore: number
}

export function computeStandings(
  games: Game[],
  matches: MatchWithScores[],
): { wins: Record<Player, number>; draws: number; totalMatches: number } {
  const wins: Record<Player, number> = { Anja: 0, Valentin: 0 }
  let draws = 0
  const gameById = new Map(games.map((g) => [g.id, g]))

  for (const match of matches) {
    const game = gameById.get(match.game_id)
    if (!game) continue
    const winner = matchWinner(match, game)
    if (winner === 'Anja' || winner === 'Valentin') {
      wins[winner] += 1
    } else if (winner === 'Unentschieden') {
      draws += 1
    }
  }

  return { wins, draws, totalMatches: matches.length }
}
