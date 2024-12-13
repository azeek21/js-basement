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
	DESTROYED_SHIP: 'x', NEUTRAL: '0',
}

export enum GAME_MODES {
	AGAINST_PC = 'AGAINST_PC',
	AGAINST_PLAYER = 'AGAINST_PLAYER'
};



export enum GAME_PROGRESS_STATE {
	STARTED = 'STARTED',
	ENDED = 'ENDED',
	IN_PROGRESS = 'IN_PROGRESS',
	INITIALIZING = 'INITIALIZING',
	SETUP = 'SETUP'
};

export type GameSession = {
	id: number;
	mode: GAME_MODES;
	state: GAME_PROGRESS_STATE;
	winnerId: number | null;
	shipPlacementPlayerA: string;
	shipPlacementPlayerB: string;
	turnOfUserId: number | null;
	inviterId: number | null;
	playerAReady: boolean;
	playerBReady: boolean;
}
