import { GameSession } from "@prisma/client"

export function isGameStartable(game: GameSession): boolean {
	return game.playerBReady && game.playerAReady;
}
