import axiosInstance from "../shared/axios";

const PLAYER_ROUTE = "/player";
const PLAYER_AVAILABLE_ROUTE = `${PLAYER_ROUTE}/available`;
const LEADERBOARD_ROUTE = '/leaderboard';

export async function setPlayerAvailable(isAvailable: boolean) {
	return axiosInstance.post(PLAYER_AVAILABLE_ROUTE, {
		available: isAvailable,
	});
}

export async function getIsPlayerAvailable() {
	const available = await axiosInstance.get<{
		available: boolean
	}>(PLAYER_AVAILABLE_ROUTE);
	return available.data.available;
}

export async function getLeaderboardPlayerrs() {
	const players = await axiosInstance.get<User[]>(LEADERBOARD_ROUTE);
	return players.data;
}
