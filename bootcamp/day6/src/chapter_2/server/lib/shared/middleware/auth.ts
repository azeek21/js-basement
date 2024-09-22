import { Handler } from "express";

interface AuthMiddlewareArgs {
	exactRoles?: boolean, // false by default meaning it will accept any user as long as there's a user
	roles?: string[],
}

function AuthMiddleware({ exactRoles, roles }: AuthMiddlewareArgs): Handler {
	return async (req, res, next) => {
		console.log("USER: ", req.session.user);
		if (!req.session?.user) {
			console.log("1")
			res.status(403).send("Unauthenticated");
			return;
		}

		if (!exactRoles) {
			console.log("2")
			next();
			return;
		}

		// @ts-ignore
		if (roles?.includes(req.session.user.role)) {
			console.log("3")
			next();
			return;
		}

		console.log("4")
		res.status(403).send("Unauthenticated");
	}
}


export {
	AuthMiddleware,
}
