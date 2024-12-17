import { GameCell, GameState, type GameSession } from '../types/game'
import { collect } from '../utils'
import { axiosInstance, randomUUIDLike, sleep } from './base'
import { getMockUser } from './user'

export const GAME_SERVICE_SLUG = '/game'

export function isMyTurn(me: User, game: GameSession) {
  if (game.state === GameState.INIT) return false
  return game.turnOfUser.id === me.id
}

export function isTargetable(map: string, target: [number, number]) {
  return map[getLinearIndex(target)] === GameCell.EMPTY
}

export function getLinearIndex(pos: [number, number]): number {
  return pos[1] * 10 + pos[0]
}

export async function fetchMyGame() {
  const res = await axiosInstance.get<GameSession | undefined>(`${GAME_SERVICE_SLUG}/my-game`)
  return res.data
}

export async function putChoiceToGame(target: [number, number]) {
  const res = await axiosInstance.patch(`${GAME_SERVICE_SLUG}/my-game`, { target })
  return res.data
}

export function mockGameSession(): GameSession {
  return {
    creator: getMockUser(),
    id: randomUUIDLike(),
    state: GameState.IN_PROGRESS,
    map: 'x o  x ox',
    playerO: getMockUser(),
    players: [],
    playerX: getMockUser(),
    turnOfUser: getMockUser(),
  }
}

export async function fetchMockGameSession() {
  await sleep(3000)
  return mockGameSession()
}

export async function fetchMockActiveGames() {
  await sleep(2000)
  return collect(10, () => mockGameSession())
}

export async function createGame() {
  await sleep(3000)
  return true
}
