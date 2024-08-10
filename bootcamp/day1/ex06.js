function atm(sum) {
	const res = {};
	const banknots = [5000, 2000, 1000, 500, 200, 100, 50];
	let usedNotesCount = 0;
	if (sum % 50 != 0) {
		return "Incorrect value";
	}

	while (sum > 0) {
		for (let bN of banknots) {
			if (bN <= sum) {
				let n = Math.floor(sum / bN);
				sum %= bN;
				usedNotesCount += n;
				res[bN] = n;
				if (usedNotesCount > 20) {
					return "Limit exeeded";
				}
				break
			}
		}
	}
	return res
}

console.log(8350, atm(8350))
console.log(2570, atm(2570))
console.log(100050, atm(100050))
