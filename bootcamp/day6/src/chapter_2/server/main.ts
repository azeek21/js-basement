import express, { Router } from "express";
import session from 'express-session';
import pg from "pg";
import sessionPgStoreAdapter from 'connect-pg-simple'
import bodyParser from "body-parser";
import { UserRoles } from "@prisma/client";
import { createOrder, deleteOrder, getAllOrders, getAllOrdersOfUser, getOrderById, updateOrder } from "./lib/handlers/order";
import { getMenu } from "./lib/handlers/menu";
import { getAllWaiters, getUserById } from "./lib/handlers/user";
import cors from 'cors';
import { AuthMiddleware } from "./lib/shared/middleware/auth";
import { GetCurrentUserHandler, LoginHandler, LogOutHandler, RegistrationHandler } from "./lib/handlers/auth";
import { NewPasswordEncoder, NewPasswordValidator } from "./lib/shared/encoders/password";
import { db } from "./lib/shared/db";

const PORT = 8080
const API_SLUG = "api"
const API_VERSION = "v1"
export const USER_ID = 1;

export const group = ((callback: (router: Router) => void) => {
	const router = express.Router();
	callback(router);
	return router;
});

async function main() {
	const app = express();
	const corsMiddlware = cors({
		origin: 'http://localhost:5173',
		credentials: true,
	});

	const pgSession = sessionPgStoreAdapter(session);
	const sessionPgPool = new pg.Pool({
		user: "azeek",
		password: "0889",
		host: "localhost",
		port: 5432,
		database: "js_day5",
	})

	app.use(corsMiddlware)
	app.use(bodyParser.json())
	app.use(session({
		store: new pgSession({
			createTableIfMissing: true,
			pool: sessionPgPool,
		}),
		resave: true,
		saveUninitialized: false,
		secret: process.env?.secret || (() => { throw new Error("No secret in env") })(),
	}))

	const passEncoder = NewPasswordEncoder("");
	const passValidator = NewPasswordValidator("");

	// registering api route group
	app.use(`/${API_SLUG}/${API_VERSION}`, group((router) => {
		const onlyWaiterMiddleware = AuthMiddleware({
			roles: [UserRoles.WAITER],
			exactRoles: true,
		})

		const onlyAdminMiddleware = AuthMiddleware({
			roles: [UserRoles.ADMIN],
			exactRoles: true,
		})

		const anyAuthedUser = AuthMiddleware({
			exactRoles: false,
		})

		router.post('/auth/signup', RegistrationHandler(db, passEncoder));
		router.post('/auth/signin', LoginHandler(db, passValidator));
		router.post('/auth/signout', LogOutHandler());
		router.get('/auth/user', anyAuthedUser, GetCurrentUserHandler(db));

		router.get("/menu", getMenu(db));

		router.get("/orders", onlyAdminMiddleware, getAllOrders(db));
		router.get("/orders/my", onlyWaiterMiddleware, getAllOrdersOfUser(db));
		router.post("/orders", onlyWaiterMiddleware, createOrder(db));
		router.get("/orders/:id", anyAuthedUser, getOrderById(db));
		router.put("/orders/:id", onlyWaiterMiddleware, updateOrder(db));
		router.delete("/orders/:id", onlyWaiterMiddleware, deleteOrder(db));

		router.get("/waiters", onlyAdminMiddleware, getAllWaiters(db));
		router.get("/users/:id", onlyAdminMiddleware, getUserById(db));
	}))

	app.get("/", getAllOrders(db))

	app.listen(PORT, () => {
		console.log("APP RUNING AT: ", PORT)
	})
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async () => {
		await db.$disconnect();
	})
