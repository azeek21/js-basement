function getRow(rowIndex) {
	let currow = [];
	currow.push(1);

	if (rowIndex == 0) {
		return currow;
	}

	let prev = getRow(rowIndex - 1);

	for (let i = 1; i < prev.length; i++) {
		let curr = prev[i - 1] + prev[i];
		currow.push(curr);
	}
	currow.push(1);
	return currow;
}

function pascalTriange(row, col) {
	if (col > row) {
		return 0;
	}
	return getRow(row)[col];
}

console.log(pascalTriange(3, 2))
console.log(pascalTriange(5, 4))
console.log(pascalTriange(1, 1))
