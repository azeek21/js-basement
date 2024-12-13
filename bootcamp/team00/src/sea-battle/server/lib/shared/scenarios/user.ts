import { User } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { BASE_EVENTS, BASE_ROOMS } from "../const/constants";
import { getAvailablePlayers, setPlayerAvailable } from "../../queries/users";
import { getWsServer } from "../../server/io";
import { getRoomForUser } from "../encoders/room-names";

export async function newSocketConnection(user: User, socket: Socket, onSuccess?: () => unknown) {
	socket.join(BASE_ROOMS.ALL);
	socket.join(getRoomForUser(user.id));
	await setPlayerAvailable(user.id, true);
	onSuccess && onSuccess();
}

export async function disconnectSocketConnection(user: User, socket: Socket, onSuccess?: () => unknown) {
	socket.leave(BASE_ROOMS.ALL);
	socket.leave(getRoomForUser(user.id));
	await setPlayerAvailable(user.id, false);
	onSuccess && onSuccess();
}

export function publishAvailablePlayers(io: Server) {
	getAvailablePlayers().then((players) => {
		io.to(BASE_ROOMS.ALL).emit(BASE_EVENTS.ONLINE_PLAYERS, players);
	}).catch((err) => {
	})
}

export async function sendGameInvite(fromUser: User, toUser: User) {
	const io = getWsServer()
	const isSent = io.to(getRoomForUser(toUser.id)).emit(BASE_EVENTS.GAME_INVITE, fromUser);
}
