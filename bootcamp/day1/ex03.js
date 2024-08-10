/** @param {number} n */
function digitFactory(n) {
	return function(cb) {
		if (cb) {
			return cb(n);
		}
		return n;
	}
}

/** @param {Function} cb  */
function curry(cb) {
	let l = cb.length
	let argsCollection = [];
	return function m(...args) {
		if (args.length + argsCollection.length >= l) {
			let callArgs = [...argsCollection, ...args]
			argsCollection = [];
			l = cb.length
			return cb(...callArgs)
		}
		argsCollection = argsCollection.concat(args);
		l -= args.length
		return m;
	}
}

function sumNums(a, b) {
	return a + b;
}

function subNums(a, b) {
	return a - b;
}

function mulNums(a, b) {
	return a * b;
}

function divNums(a, b) {
	return a / b;
}

let plus = curry(sumNums);
let mult = curry(mulNums)
let div = curry(divNums)
let minus = curry(subNums)

const zero = digitFactory(0)
const one = digitFactory(1)
const two = digitFactory(2)
const three = digitFactory(3)
const four = digitFactory(4)
const five = digitFactory(5)
const six = digitFactory(6)
const seven = digitFactory(7)
const eight = digitFactory(8)
const nine = digitFactory(9)


console.log(two(mult(three())))
console.log(two(div(three())))
console.log(two(div(three(mult(nine())))))
console.log(nine(mult(seven(div(eight(plus(zero())))))))


