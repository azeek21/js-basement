import { UserRoles } from "@prisma/client";
import { z } from "zod";

const userRolesArray = Object.keys(UserRoles) as readonly string[];

export const UserValidator = z.object({
	name: z.string().min(3),
	role: z.enum([UserRoles.GUEST, ...userRolesArray]).optional(),
})

export type TUser = z.infer<typeof UserValidator>;
