import axiosInstance from "../shared/axios";

export async function getCurrentUser() {
	const res = await axiosInstance.get<User>("/auth/user");
	return res.data;
}

export interface SignInProps {
	username: string,
	password: string,
}

export async function signIn(body: SignInProps) {
	await axiosInstance.post("/auth/signin", body);
	return true
}

export async function signUp(body: SignInProps) {
	await axiosInstance.post("/auth/signup", body);
	return true
}

export async function signOut() {
	await axiosInstance.post("/auth/signout");
	return true
}

