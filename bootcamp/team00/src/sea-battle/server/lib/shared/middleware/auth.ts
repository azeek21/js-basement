import { Handler } from "express";

interface AuthMiddlewareArgs {

}

function AuthMiddleware({ }: AuthMiddlewareArgs): Handler {
	return async (req, res, next) => {
		if (!req.session?.user) {
			res.status(403).send("Unauthenticated");
			return;
		}
		next();
	}
}


export {
	AuthMiddleware,
}
