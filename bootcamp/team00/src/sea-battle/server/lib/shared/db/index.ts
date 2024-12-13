import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
	// @ts-ignore
	omit: {
		user: {
			password: true,
		}
	}
});

export type DB = typeof db;
