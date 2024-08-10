function counter() {
	if (counter.count != undefined) {
		counter.count += 3;
		return counter.count;
	}
	counter.count = 0;
	return 0;
}

console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
console.log(counter())
