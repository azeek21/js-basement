import express, { Router } from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import { createOrder, deleteOrder, getAllOrders, getOrderById, updateOrder } from "./lib/handlers/order";
import { getMenu } from "./lib/handlers/menu";
import { createUser, getAllWaiters, getUserById } from "./lib/handlers/user";
import cors from 'cors';

const PORT = 8080
const API_SLUG = "api"
const API_VERSION = "v1"
export const USER_ID = 1;

export const group = ((callback: (router: Router) => void) => {
	const router = express.Router();
	callback(router);
	return router;
});


const db = new PrismaClient();

async function main() {
	const app = express();
	const corsMiddlware = cors({
		origin: '*',
	});
	app.use(corsMiddlware)
	app.use(bodyParser.json())

	// registering api route group
	app.use(`/${API_SLUG}/${API_VERSION}`, group((router) => {

		router.get("/menu", getMenu(db));

		router.get("/orders", getAllOrders(db));
		router.post("/orders", createOrder(db));
		router.get("/orders/:id", getOrderById(db));
		router.put("/orders/:id", updateOrder(db));
		router.delete("/orders/:id", deleteOrder(db));

		router.post("/waiters", createUser(db));
		router.get("/waiters", getAllWaiters(db));

		router.get("/users/:id", getUserById(db));
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
