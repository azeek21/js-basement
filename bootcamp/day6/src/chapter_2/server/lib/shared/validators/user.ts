import { UserRoles } from "@prisma/client";
import { z } from "zod";

const userRolesArray = Object.keys(UserRoles) as readonly string[];
const usernameRegex = /^(?=.{5,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;


const userSchema = {
	name: z.string().min(3),
	role: z.enum([UserRoles.GUEST, ...userRolesArray]).optional(),
};

export const UserValidator = z.object(userSchema);

const loginSchema = {
	username: z.string().min(5).max(32).regex(usernameRegex),
	password: z.string().min(2).max(32).regex(passwordRegex),
};

export const LoginValidator = z.object(loginSchema)

export const RegisterValidator = z.object({
	...loginSchema,
	...userSchema,
})

export type TUser = z.infer<typeof UserValidator>;
