import { GAME_PROGRESS_STATE, GameSession } from "@prisma/client";

export const PC_PLAYER_ID = 1;

export const BASE_ROOMS = {
	ALL: "all",
};

export const BASE_EVENTS = {
	ONLINE_PLAYERS: 'online_players',
	ACTIVE_GAMES_COUNT: 'active_games_count',
	GAME_INVITE: 'invite',
	NEW_GAME: 'new_game',
	GAME_INVITE_ACCEPT: 'invite_accept',
	GAME_INVITE_DECLINE: 'invite_decline',
	MY_GAME: 'my_game',
	PLAYER_READY: 'player_ready',
	PLAYER_ATTACK: 'player_attack',
	PLAYER_GIVE_UP: 'player_give_up',
}

export const MAP_POINTS = {
	AVAILABLE: 'a',
	SHIP: 's',
	DESTROYED_SHIP: 'x',
	NEUTRAL: '0',
}

export const EMPTY_GAME: Partial<GameSession> = {
	state: GAME_PROGRESS_STATE.INITIALIZING,
}
