import { UserRoles } from "@prisma/client";
import { Handler } from "express";
import { LoginValidator, RegisterValidator } from "../shared/validators/user";
import { Encoder, Validator } from "../shared/encoders/password";
import { DB } from "../shared/db";

const AuthError = "Username or password didn't match or not found. Try registering first if you hanve't yet"

const SELECT_USER_WITH_PW = {
	username: true,
	name: true,
	password: true,
	role: true,
	id: true,
}

function LoginHandler(db: DB, passwordvalidator: Validator): Handler {
	return async (req, res) => {
		const parsed_credentials = LoginValidator.safeParse(req.body);
		if (parsed_credentials.error) {
			res.status(400).send(parsed_credentials.error.flatten());
			return
		}

		const credentials = parsed_credentials.data;

		const user = await db.user.findFirst({
			select: SELECT_USER_WITH_PW,
			where: {
				username: credentials.username,
			}
		})

		if (!user) {
			res.status(403).send({ message: AuthError });
			return;
		}

		const valid = await passwordvalidator(credentials.password, user.password);

		if (!valid) {
			res.status(403).send({ message: AuthError });
			return;
		}

		req.session.regenerate((err) => {
			if (err) {
				res.status(403).send({ message: err });
				return;
			}

			req.session.user = user;
			req.session.save((err) => {
				if (err) {
					res.status(403).send({ message: err });
					return;
				}
				res.status(200).send({ message: "OK" })
				return;
			})
		})
	}
}

function RegistrationHandler(db: DB, passwordEncoder: Encoder): Handler {
	return async function(req, res) {

		const parsed_user = RegisterValidator.safeParse(req.body);

		if (parsed_user.error) {
			res.status(400).send(parsed_user.error.flatten());
			return
		}

		const new_user = parsed_user.data;

		try {
			new_user.password = await passwordEncoder(new_user.password);
			const created_user = await db.user.create({
				data: {
					...new_user,
					role: new_user.role as UserRoles,
				},
			})

			// @ts-ignore
			delete created_user.password;

			req.session.regenerate((err) => {

				if (err) {
					res.status(403).send({ message: err });
					return;
				}

				req.session.user = created_user;
				req.session.save((err) => {
					if (err) {
						res.status(403).send({ message: err });
						return;
					}

					res.status(200).send(created_user)
					return;
				})
			})

			return;
		} catch (err) {
			res.status(400).send(err);
			return;
		}
	}
}


function LogOutHandler(): Handler {
	return async (req, res) => {

		req.session.regenerate((err) => {
			if (err) {
				res.status(403).send({ message: err });
				return;
			}

			// @ts-ignore
			req.session.user = null;
			req.session.save((err) => {
				if (err) {
					res.status(403).send({ message: err });
					return;
				}
				res.status(200).send({ message: "OK" })
				return;
			})
		})

	}
}

function GetCurrentUserHandler(db: DB): Handler {
	return async (req, res) => {
		const session_user = req.session.user;
		if (!session_user) {
			res.status(403).send("Unauthenticated");
			return;
		}

		const user = await db.user.findFirst({
			where: {
				id: session_user.id,
			}
		})

		// @ts-ignore
		delete user?.password;
		res.status(200).send(user);
	}
}

export {
	LoginHandler,
	LogOutHandler,
	RegistrationHandler,
	GetCurrentUserHandler,
}
