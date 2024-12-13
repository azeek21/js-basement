import { CONFIG } from "../../../config";
import { getBottom, getLeft, getLinearIndex, getRight, getTop } from "./getters"

export function isDefined(target: unknown): boolean {
	return target !== undefined && target !== null
}

export function isPointAvailable(map: string, cords: [number, number], availabile = 'a'): boolean {
	return map[getLinearIndex(cords)] === availabile;
}

// horizontal: -
// vertical: |
// all: + (top, bottom, left, right, and point itself)
export function isPointAvailableInAxis(map: string, cords: [number, number], axis: 'all' | 'horizontal' | 'vertical', available = 'a', whenSiblingsOutOfBounds = true): boolean {
	const top = getTop(cords);
	const bottom = getBottom(cords);
	const left = getLeft(cords);
	const right = getRight(cords);

	if (axis === 'all') {
		return isPointAvailable(map, cords, available)
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, top) ? whenSiblingsOutOfBounds : isPointAvailable(map, top, available))
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, bottom) ? whenSiblingsOutOfBounds : isPointAvailable(map, bottom, available))
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, left) ? whenSiblingsOutOfBounds : isPointAvailable(map, left, available))
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, right) ? whenSiblingsOutOfBounds : isPointAvailable(map, right, available));
	}

	if (axis == 'horizontal') {
		return isPointAvailable(map, cords, available)
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, top) ? whenSiblingsOutOfBounds : isPointAvailable(map, top, available))
			&& (isPointOutOfBounds(CONFIG.MAP_SIZE, bottom) ? whenSiblingsOutOfBounds : isPointAvailable(map, bottom, available));
	}

	return isPointAvailable(map, cords, available)
		&& (isPointOutOfBounds(CONFIG.MAP_SIZE, left) ? whenSiblingsOutOfBounds : isPointAvailable(map, left, available))
		&& (isPointOutOfBounds(CONFIG.MAP_SIZE, right) ? whenSiblingsOutOfBounds : isPointAvailable(map, right, available));
}

export function isPointOutOfBounds([width, height]: [number, number], [x, y]: [number, number]): boolean {
	const res = (x < 0 || x > width - 1 || y < 0 || y > height - 1)
	return res;
}
