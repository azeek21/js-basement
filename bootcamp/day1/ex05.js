function fib(n) {
	if (n == 1) {
		return 1;
	}
	if (n == 0) {
		return 1;
	}

	return fib(n - 1) + fib(n - 2)
}

console.log(fib(5))
console.log(fib(1))
console.log(fib(8))
console.log(fib(21))
