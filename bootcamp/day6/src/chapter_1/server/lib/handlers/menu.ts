import { PrismaClient } from "@prisma/client";
import { Handler } from "express";

function getMenu(db: PrismaClient): Handler {
	return async (req, res) => {
		const menu = await db.menuItem.findMany();
		res.status(200).send(menu)
	}
}

export {
	getMenu,
}
