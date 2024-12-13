import { Record } from "@prisma/client/runtime/library";

export function recordWithout<T extends Record<string, unknown>, K extends string>(obj: T, ...exclude: K[]): Omit<T, K> {
	const copy = { ...obj };
	for (let key of exclude) {
		// @ts-ignore
		copy[key] = undefined;
	}
	return copy;
}
