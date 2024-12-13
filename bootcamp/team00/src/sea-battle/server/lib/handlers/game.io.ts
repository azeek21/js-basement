import { GAME_MODES, GAME_PROGRESS_STATE, User } from "@prisma/client";
import { Socket } from "socket.io";
import { db } from "../shared/db";
import { BASE_EVENTS, BASE_ROOMS, EMPTY_GAME, PC_PLAYER_ID } from "../shared/const/constants";
import { queryUserById } from "../queries/users";
import { sendGameInvite } from "../shared/scenarios/user";
import { getWsServer } from "../server/io";
import { getRoomForUser } from "../shared/encoders/room-names";
import { recordWithout } from "../shared/utils/object";
import { obfuscateMaps } from "../shared/utils/obfuscators";
import { isGameStartable } from "../shared/validators/game";
import { getLinearIndex, getRandomCordinate } from "../../../shared/functions/getters";
import { getRandomMap } from "../../../shared/functions/map";
import { applyAttack } from "../shared/utils/map";

GAME_PROGRESS_STATE
function emptyShipPlacement() {
	return "a".repeat(10 * 10);
}


export function registerGameHandlers(player: User, playerSocket: Socket) {
	const io = getWsServer();

	playerSocket.on(BASE_EVENTS.GAME_INVITE_ACCEPT, async (opponent: User) => {

		if (opponent) {
			const game = await db.gameSession.create({
				data: {
					players: {
						connect: [
							{
								id: player.id
							},
							{
								id: opponent.id,
							}
						]
					},
					shipPlacementPlayerA: emptyShipPlacement(),
					shipPlacementPlayerB: emptyShipPlacement(),
					mode: GAME_MODES.AGAINST_PLAYER,
					state: GAME_PROGRESS_STATE.SETUP,
					inviterId: opponent.id,
				},
			})

			await db.user.updateMany({
				where: {
					id: {
						in: [player.id, opponent.id],
					}
				},
				data: {
					cGames: {
						increment: 1,
					},
					available: false,
				}
			});


			io.to([getRoomForUser(player.id), getRoomForUser(opponent.id)]).emit(BASE_EVENTS.MY_GAME, game);
		}
	})

	playerSocket.on(BASE_EVENTS.NEW_GAME, async (withPlayerId: number) => {
		const opponent = await queryUserById(withPlayerId);
		if (!opponent) return;

		if (opponent?.id === PC_PLAYER_ID) {

			const game = await db.gameSession.create({
				data: {
					players: {
						connect: [
							{
								id: player.id
							},
							{
								id: opponent.id,
							}
						]
					},
					shipPlacementPlayerA: emptyShipPlacement(),
					shipPlacementPlayerB: getRandomMap(),
					playerBReady: true,
					mode: GAME_MODES.AGAINST_PC,
					state: GAME_PROGRESS_STATE.SETUP,
					inviterId: player.id,
				},
			})

			await db.user.update({
				where: {
					id: player.id,
				},
				data: {
					cGames: {
						increment: 1,
					},
					available: false,
				}
			});

			io.to(getRoomForUser(player.id)).emit(BASE_EVENTS.MY_GAME, obfuscateMaps(player.id, game));
			return;
		}


		sendGameInvite(player, opponent);
	})

	playerSocket.on(BASE_EVENTS.PLAYER_READY, async (gameSessionId: number, map: string) => {
		// player is done placing boats

		const curGame = await db.gameSession.findFirst({
			where: { id: gameSessionId },
			include: {
				players: true,
			}
		});

		if (!curGame) return;


		const isPlayingAgainstPc = curGame.players.some(p => p.id === PC_PLAYER_ID);

		if ((curGame.state != GAME_PROGRESS_STATE.SETUP)) {
			io.to(getRoomForUser(player.id)).emit(BASE_EVENTS.MY_GAME, EMPTY_GAME);
			return;
		}

		const isInitiator = player.id === curGame?.inviterId;


		const state = isGameStartable({
			...curGame,
			[isInitiator ? 'playerAReady' : 'playerBReady']: true,
		}) ? GAME_PROGRESS_STATE.IN_PROGRESS : GAME_PROGRESS_STATE.SETUP;

		if (isPlayingAgainstPc) {
			const updatedGame = await db.gameSession.update({
				where: {
					id: curGame.id
				},
				data: {
					shipPlacementPlayerA: map,
					playerAReady: true,
					state: GAME_PROGRESS_STATE.IN_PROGRESS,
					turnOfUserId: player.id,
				},
				include: {
					players: true
				}
			});

			if (!updatedGame) return;

			const toBeSend = recordWithout(updatedGame, 'players');
			io.to(getRoomForUser(player.id)).emit(BASE_EVENTS.MY_GAME, obfuscateMaps(player.id, toBeSend));
		} else {
			const updatedGame = await db.gameSession.update({
				where: {
					id: curGame.id
				},
				data: {
					[isInitiator ? 'shipPlacementPlayerA' : 'shipPlacementPlayerB']: map,
					[isInitiator ? 'playerAReady' : 'playerBReady']: true,
					state,
					turnOfUserId: state === GAME_PROGRESS_STATE.IN_PROGRESS ? player.id : undefined,
				},
				include: {
					players: true
				}
			});

			if (!updatedGame) return;



			const toBeSend = recordWithout(updatedGame, 'players');
			updatedGame.players.forEach((p) => {
				io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, obfuscateMaps(p.id, toBeSend));
			})
		}


	})

	playerSocket.on(BASE_EVENTS.PLAYER_ATTACK, async (gameSessionId: number, cords: [number, number]) => {
		const curGame = await db.gameSession.findFirst({
			where: { id: gameSessionId },
			include: {
				players: true,
			}
		});

		if (!curGame) return;
		if (player.id !== curGame.turnOfUserId) return;

		const isInitiator = player.id === curGame?.inviterId;
		const mapIdentifier = isInitiator ? 'shipPlacementPlayerB' : 'shipPlacementPlayerA';
		const map = curGame[mapIdentifier];
		const itWasAHit = map[getLinearIndex(cords)] === 's';
		const updatedMap = applyAttack(map, cords)
		const won = updatedMap.indexOf('s') === -1;
		const opponent = curGame.players.find((p) => p.id != player.id);
		const isOpponentPc = curGame.players.some(p => p.id === PC_PLAYER_ID);

		if (isOpponentPc && !itWasAHit) {
			let pcTargetCords = getRandomCordinate();
			let _map = curGame.shipPlacementPlayerA;
			let pcHit = _map[getLinearIndex(pcTargetCords)] === 's';
			while (pcHit) {
				_map = applyAttack(_map, pcTargetCords);
				pcTargetCords = getRandomCordinate();
				pcHit = _map[getLinearIndex(pcTargetCords)] === 's';
			}
			_map = applyAttack(_map, pcTargetCords);

			const pcWon = _map.indexOf('s') === -1;

			const updatedGame = await db.gameSession.update({
				where: {
					id: gameSessionId,
				},
				data: {
					shipPlacementPlayerA: _map,
					shipPlacementPlayerB: updatedMap,
					turnOfUserId: player.id,
					winnerId: pcWon ? PC_PLAYER_ID : undefined,
					state: pcWon ? GAME_PROGRESS_STATE.ENDED : GAME_PROGRESS_STATE.IN_PROGRESS,
				},
				include: { winner: pcWon }
			})

			if (pcWon) {
				curGame.players.forEach((p) => {
					io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, updatedGame);
				});
				db.user.update({
					where: { id: player.id },
					data: {
						available: true,
					}
				});
			}
			curGame.players.forEach((p) => {
				io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, obfuscateMaps(p.id, updatedGame));
			});
			return;
		}

		if (!opponent) return;

		const updatedGame = await db.gameSession.update({
			where: {
				id: gameSessionId,
			},
			data: {
				[mapIdentifier]: updatedMap,
				turnOfUserId: !itWasAHit ? opponent?.id : undefined,
				winnerId: won ? player.id : undefined,
				state: won ? GAME_PROGRESS_STATE.ENDED : GAME_PROGRESS_STATE.IN_PROGRESS,
			},
			include: { winner: won }
		})

		if (!updatedGame) return;

		if (won) {
			curGame.players.forEach((p) => {
				io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, updatedGame);
			});
			await db.$transaction([
				db.user.update({
					where: { id: player.id },
					data: {
						cWins: {
							increment: 1,
						},
						available: true,
					}
				}),
				db.user.update({
					where: { id: opponent.id },
					data: {
						available: true,
					}
				})
			]);
		} else {
			curGame.players.forEach((p) => {
				io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, obfuscateMaps(p.id, updatedGame));
			});
		}
	})

	playerSocket.on(BASE_EVENTS.PLAYER_GIVE_UP, async (gameSessionId: number) => {
		const curGame = await db.gameSession.findFirst({
			where: { id: gameSessionId },
			include: {
				players: true,
			}
		});

		if (!curGame) return;
		const opponent = curGame.players.find(p => p.id != player.id);
		if (!opponent) return;

		const [_, _2, updatedGame] = await db.$transaction([
			db.user.update({
				where: { id: opponent.id },
				data: {
					cWins: {
						increment: 1,
					},
					available: true,
				}
			}),
			db.user.update({
				where: { id: player.id },
				data: {
					available: true,
				}
			}),
			db.gameSession.update({
				where: { id: gameSessionId },
				data: {
					winnerId: opponent.id,
					turnOfUserId: null,
					state: GAME_PROGRESS_STATE.ENDED,
				},
				include: { winner: true },
			})
		]);


		curGame.players.forEach((p) => {
			io.to(getRoomForUser(p.id)).emit(BASE_EVENTS.MY_GAME, updatedGame);
		})

	})
}
