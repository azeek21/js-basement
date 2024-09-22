import bcrypt from "bcrypt";
const saltRounds = 10;

export type Encoder = (pwd: string) => Promise<string>
export type Validator = (pwd: string, hash: string) => Promise<boolean>

function NewPasswordEncoder(secret: string): Encoder {
	return async function encodePassword(pwd) {
		return bcrypt.hash(pwd, saltRounds)
	}
}

function NewPasswordValidator(secret: string): Validator {
	return async function isPasswordValid(pwd, hash) {
		return bcrypt.compare(pwd, hash);
	}
}

export {
	NewPasswordEncoder,
	NewPasswordValidator,
}
