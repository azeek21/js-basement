export function orOr<T extends () => ReturnType<T>>(cb1: T, cb2: T): ReturnType<T> {
	if (Math.random() > 0.5) {
		return cb1();
	}
	return cb2();
}

export function whileNotPositive(cb: () => number): number {
	let res = cb();
	while (res < 0) {
		res = cb();
	}
	return res;
}
