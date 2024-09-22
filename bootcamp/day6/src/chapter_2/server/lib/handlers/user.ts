import { UserRoles } from "@prisma/client";
import { Handler } from "express";
import { DB } from "../shared/db";

function getAllWaiters(db: DB): Handler {
	return async (req, res) => {
		const waiters_res = await db.user.findMany({
			where: {
				role: UserRoles.WAITER,
			}
		})
		res.status(200).send(waiters_res)
	}
}

function getUserById(db: DB): Handler {
	return async (req, res) => {
		const userId = Number(req.params['id']);

		if (!userId) {
			res.status(400).send({ message: "Id should be a integer" });
			return;
		}

		const user = await db.user.findFirst({
			where: {
				id: userId,
			},
			include: {
				orders: {

					include: {
						items: true
					}
				},
			}
		})

		res.status(200).send(user);
	}
}

export {
	getAllWaiters,
	getUserById,
}
