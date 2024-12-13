import { isDefined } from "../shared/utils/checks";

export function isAllShipsPlaced(ships: Boat[]): boolean {
	if (ships.length != 10) return false;

	for (let ship of ships) {
		if (!isDefined(ship.start) || !isDefined(ship.end)) return false;
	}
	return true;
}
