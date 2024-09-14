import { Prisma, PrismaClient, UserRoles } from "@prisma/client";
import { Handler } from "express";
import { UserValidator } from "../shared/validators/user";

function createUser(db: PrismaClient): Handler {
	return async (req, res) => {
		const parsed_user = UserValidator.safeParse(req.body);

		if (!parsed_user.success) {
			res.status(400).send(parsed_user.error.flatten());
			return
		}

		const safe_user = parsed_user.data;
		console.log("DADASAA: ", safe_user);

		const created_user = await db.user.create({
			data: {
				...safe_user,
				role: safe_user.role as UserRoles,
			}
		})

		res.status(200).send(created_user);
	}
}

export {
	createUser,
}
