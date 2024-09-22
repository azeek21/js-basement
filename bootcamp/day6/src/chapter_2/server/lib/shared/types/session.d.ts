import { User } from "@prisma/client";
import { Omit } from "@prisma/client/runtime/library";
declare module 'express-session' {
	interface SessionData {
		user: Omit<User, 'password'>,
	}
}

export { };
