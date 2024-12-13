
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

export function getShipCordsAtPoint(target: [number, number], isShip: (target: [number, number]) => boolean): Array<[number, number]> {
	const res: Array<[number, number]> = [];
	let top = getTop(target);
	let bottom = getBottom(target);
	let left = getLeft(target);
	let right = getRight(target);
	let align = '';

	if (isShip(left) || isShip(right)) {
		align = 'horizontal';
	} else if (isShip(top) || isShip(bottom)) {
		align = 'vertical';
	} else {
		return [target];
	}

	res.push(target)
	if (align === 'horizontal') {
		while (isShip(left)) {
			res.push(left);
			left = getLeft(left);
		}
		while (isShip(right)) {
			res.push(right);
			right = getRight(right);
		}
	} else {
		while (isShip(top)) {
			res.push(top);
			top = getTop(top);
		}
		while (isShip(bottom)) {
			res.push(bottom);
			bottom = getBottom(bottom);
		}
	}

	return res;
}

export function getRandomCordinate(): [number, number] {
	return [
		Math.floor(Math.random() * 10),
		Math.floor(Math.random() * 10),
	]
}

