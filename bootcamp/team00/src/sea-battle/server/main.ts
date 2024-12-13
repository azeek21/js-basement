import express, { Router } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import pg from "pg";
import sessionPgStoreAdapter from "connect-pg-simple";
import session from "express-session";
import { NewPasswordEncoder, NewPasswordValidator } from "./lib/shared/encoders/password";
import { GetCurrentUserHandler, LoginHandler, LogOutHandler, RegistrationHandler } from "./lib/handlers/auth";
import { db } from "./lib/shared/db";
import bodyParser from "body-parser";
import { AuthMiddleware } from "./lib/shared/middleware/auth";
import { registerGameHandlers } from "./lib/handlers/game.io";
import { User } from "@prisma/client";
import { BASE_EVENTS, BASE_ROOMS, PC_PLAYER_ID } from "./lib/shared/const/constants";
import { getAvailablePlayers } from "./lib/queries/users";
import { disconnectSocketConnection, newSocketConnection, publishAvailablePlayers } from "./lib/shared/scenarios/user";
import { getWsServer, initializeWsServer } from "./lib/server/io";
import { getTopPlayers, getUserAvailable, setIsUserAvailable } from "./lib/handlers/user";
import { getTop } from "../shared/functions/getters";


// @ts-ignore
export const PC_PLAYER_USER: User = {
	id: PC_PLAYER_ID,
	username: ">> AI <<",
	cWins: 0,
	cGames: 0,
}

export const group = ((callback: (router: Router) => void) => {
	const router = express.Router();
	callback(router);
	return router;
});

const PORT = 8080;
const CORS_ORIGIN = "http://localhost:5173";
const SECRET = "so-secret-word-OMG-123"
const API_SLUG = "api"
let c = 0;

function start() {
	const app = express();
	app.use(bodyParser.json())

	const cors_middleware = cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
	app.use(cors_middleware);

	const pgSession = sessionPgStoreAdapter(session)
	const sessionPgPool = new pg.Pool({
		user: "azeek",
		password: "0889",
		host: "localhost",
		database: "sea_battle",
	});

	const expressSessionMiddleware = session({
		store: new pgSession({
			createTableIfMissing: true,
			pool: sessionPgPool,
		}),
		resave: true,
		saveUninitialized: true,
		secret: SECRET,
		cookie: {
			httpOnly: true,
		}
	});
	app.use(expressSessionMiddleware)

	const server = http.createServer(app);
	initializeWsServer(server, expressSessionMiddleware);


	const passEncoder = NewPasswordEncoder(SECRET);
	const passValidator = NewPasswordValidator(SECRET)
	const authMiddeware = AuthMiddleware({});

	// routes
	app.use(`/${API_SLUG}`, group((router) => {

		// auth
		router.post('/auth/signup', RegistrationHandler(db, passEncoder));
		router.post('/auth/signin', LoginHandler(db, passValidator));
		router.post('/auth/signout', LogOutHandler());
		router.get('/auth/user', authMiddeware, GetCurrentUserHandler(db));

		router.post('/player/available', setIsUserAvailable());
		router.get('/player/available', getUserAvailable());

		router.get('/leaderboard', getTopPlayers());
	}));

	const io = getWsServer();
	if (io) {
		io.on('connection', (s) => {
			// @ts-ignore
			const user = s.request?.session?.user as User;
			if (!user) {
				s.disconnect();
				return;
			}

			newSocketConnection(user, s, () => {
				publishAvailablePlayers(io);
			});
			registerGameHandlers(user, s);

			s.on("disconnect", (reason, description) => {
				disconnectSocketConnection(user, s, () => publishAvailablePlayers(io));
			})

		});

		setInterval(() => {
			publishAvailablePlayers(io);
		}, 5000)


	}
	server.listen(PORT, () => {
		console.log("Server started at: ", PORT);
	})
}

start();
