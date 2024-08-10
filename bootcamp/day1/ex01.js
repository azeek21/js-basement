
/** @param {String} */
function removeString(str, tar) {
	return [].filter.call(str, (l) => l != tar).join('');
}

console.log(removeString("hiiii", 'i'));

