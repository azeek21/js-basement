import { Handler } from "express";
import { DB } from "../shared/db";
import { queryTopPlayers, queryUserById, setPlayerAvailable } from "../queries/users";
import { UserAvailibiltyValidator } from "../shared/validators/user";

function getUserById(db: DB): Handler {
	return async (req, res) => {
		const userId = Number(req.params['id']);

		if (!userId) {
			res.status(400).send({ message: "Id should be a integer" });
			return;
		}

		try {
			const user = await queryUserById(userId);
			res.status(200).send(user);
		} catch (error) {
			res.status(400).send('user not found');
		}
	}
}

function setIsUserAvailable(): Handler {
	return async (req, res) => {
		const user = req.session.user;

		if (!user) {
			res.status(401).send("unuthenticated");
			return;
		}

		const parsed = UserAvailibiltyValidator.safeParse(req.body);


		if (parsed.error) {
			res.status(400).send(parsed.error);
			return;
		}

		try {
			await setPlayerAvailable(user.id, parsed.data.available);
			res.status(200).send("updated");
		} catch (error) {
			res.status(400).send("Something went wrong while updating player status");
		}
	}
}

function getUserAvailable(): Handler {
	return async (req, res) => {
		const _user = req.session.user;
		if (!_user) {
			res.status(401).send("unuthenticated");
			return;
		}
		try {
			const user = await queryUserById(_user.id);
			res.status(200).send({
				available: user?.available
			});
		} catch (error) {
			res.status(400).send("Something went wrong querying user from DB");
		}
	}
}

function getTopPlayers(): Handler {
	return async (req, res) => {
		try {
			const players = await queryTopPlayers();
			res.status(200).json(players);
		} catch (error) {
			res.status(500).send('SOMETHING WENT WRONG QUERYING TOP PLAYERS');
		}
	}
}

export {
	getUserById,
	setIsUserAvailable,
	getUserAvailable,
	getTopPlayers,
}
