
export function getLinearIndex(pos: [number, number]): number {
	return (pos[1] * 10) + pos[0];
}

export function getTop([x, y]: [number, number]): [number, number] {
	return [x, y - 1]
}

export function getBottom([x, y]: [number, number]): [number, number] {
	return [x, y + 1]
}

export function getLeft([x, y]: [number, number]): [number, number] {
	return [x - 1, y]
}

export function getRight([x, y]: [number, number]): [number, number] {
	return [x + 1, y]
}

export function getEmptyShipPlacement() {
	return "a".repeat(10 * 10);
}


export function getRateOf(portion: number, outOf: number): number {
	return (portion / outOf) * 100 | 0
}
