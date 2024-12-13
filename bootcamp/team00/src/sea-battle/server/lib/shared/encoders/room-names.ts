export function getRoomForGameSession(sessionId: number) {
	return `game-sesison-${sessionId}`;
}

export function getRoomForUser(userId: number) {
	return `user-${userId}`;
}
