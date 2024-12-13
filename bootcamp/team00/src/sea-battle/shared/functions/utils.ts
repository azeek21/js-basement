import { getLinearIndex } from "./getters";

export function applyToCords(map: string, toBe: string, cords: [number, number][]) {
	const _map = map.split('');

	for (const c of cords) {
		_map[getLinearIndex(c)] = toBe;
	}

	return _map.join('');
}
