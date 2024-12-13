import { GameSession } from "@prisma/client";

export function obfuscateMaps(userId: number, gameObj: GameSession): GameSession {
	const isInitiator = userId === gameObj.inviterId;
	const copy = { ...gameObj };
	if (isInitiator) {
		copy.shipPlacementPlayerB = copy.shipPlacementPlayerB.replace(/s/g, 'a');
		return copy;
	}
	copy.shipPlacementPlayerA = copy.shipPlacementPlayerA.replace(/s/g, 'a');
	return copy;
}



