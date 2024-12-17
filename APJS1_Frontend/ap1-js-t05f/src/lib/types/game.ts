type GameMap = string

export enum GameCell {
  X = 'x',
  O = 'x',
  EMPTY = ' ',
}

export enum GameState {
  INIT = 'init',
  IN_PROGRESS = 'progress',
  ENDED = 'ended',
}

export interface GameSession {
  id: string
  state: GameState
  creator: User
  winner?: User
  players: User[]
  playerX: User
  playerO: User
  turnOfUser: User
  map: GameMap
}
