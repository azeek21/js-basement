import { Handler } from "express";
import { DB } from "../shared/db";

function getMenu(db: DB): Handler {
	return async (req, res) => {
		const menu = await db.menuItem.findMany();
		res.status(200).send(menu)
	}
}

export {
	getMenu,
}
