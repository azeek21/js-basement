import { PC_PLAYER_ID } from "../shared/const/constants";
import { db } from "../shared/db";

export async function getAvailablePlayers() {
	return db.user.findMany({
		where: {
			available: true
		}
	});
}

export async function setPlayerAvailable(userId: number, isAvailable: boolean) {
	return db.user.update({
		where: {
			id: userId
		},
		data: {
			available: isAvailable,
		}
	});
}


export async function queryUserById(id: number) {
	return await db.user.findFirst({
		where: {
			id: id,
		},
	}
	);
}

export async function queryTopPlayers() {
	return await db.user.findMany({
		where: {
			id: {
				not: PC_PLAYER_ID,
			}
		},
		orderBy: {
			cWins: 'desc',
		},
		take: 10,
	});
}
