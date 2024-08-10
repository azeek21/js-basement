/** @param {Array<number>} arr  */
function removeReps(arr) {
	let hmap = {};
	for (const i of arr) {
		if (hmap[i] != true) {
			hmap[i] = true;
		}
	}

	return Object.entries(hmap).map(([k]) => Number(k));
}

console.log(removeReps([1, 69, 69, 2, 3, 3, 23, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 9]))

