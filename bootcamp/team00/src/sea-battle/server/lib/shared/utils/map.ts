import { strict } from "assert";
import { getLinearIndex, getShipCordsAtPoint } from "../../../../shared/functions/getters";
import { applyToCords } from "../../../../shared/functions/utils";

export function applyAttack(map: string, target: [number, number]): string {

	if (map[getLinearIndex(target)] === 'a') {
		return applyToCords(map, '0', [target]);
	}

	if (map[getLinearIndex(target)] === 'x' || map[getLinearIndex(target)] === '0') {
		return map;
	}

	const shipCords = getShipCordsAtPoint(target, (tar) => !isPointOutOfBounds([10, 10], tar) && map[getLinearIndex(tar)] === 's');
	return applyToCords(map, 'x', shipCords);
}

export function isPointOutOfBounds([width, height]: [number, number], [x, y]: [number, number]): boolean {
	const res = (x < 0 || x > width - 1 || y < 0 || y > height - 1)
	return res;
}
