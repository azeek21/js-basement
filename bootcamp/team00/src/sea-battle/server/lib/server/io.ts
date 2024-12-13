import { RequestHandler } from "express";
import { Server } from "http";
import { Server as WsServer } from "socket.io";

const PORT = 8080;
const CORS_ORIGIN = "http://localhost:5173";
const SECRET = "so-secret-word-OMG-123"

// @ts-ignore
let _io: WsServer = null;

export function initializeWsServer(server: Server, sessionMiddleare: RequestHandler) {
	if (_io) {
		return;
	}

	const io = new WsServer(server, {
		cors: {
			origin: CORS_ORIGIN,
			credentials: true,
		}
	});

	io.engine.use(sessionMiddleare)

	io.use((s, n) => {
		// @ts-ignore
		if (!s.request?.session?.user) {
			n(new Error("not authenticated"));
		}
		n();
	})
	_io = io;

}

export function getWsServer() {
	return _io;
}
