
/**
 * @param {String} str 
 * @param {Array<Array<String>>} strMap 
 */
function searchSubstring(strMap, str) {
	return findInRows(strMap, str) || findInCols(strMap, str)
}


function searchInDigonals(strMap, str) {
	let digStr = "";
	for (let i = 0; i < strMap[0].length; i++) {
		let ci = i;
		digStr = "";
		for (let ri = 0; ri < strMap.length; ri++) {
			digStr += strMap[ri][ci];
			ci--;
			if (ci == -1) {
				break
			}
		}
		console.log(digStr);
	}

}


function findInRows(arr, str) {
	for (let row of arr) {
		if (findWordInArray(row, str)) {
			return true;
		}
	}
	return false;
}

function findInCols(arrMap, str) {
	let colAsStr = "";
	for (let ci = 0; ci < arrMap[0].length; ci++) {
		colAsStr = "";
		for (let i = 0; i < arrMap.length; i++) {
			colAsStr += arrMap[i][ci];
		}
		if (strIncludesInAnyWay(colAsStr, str)) {
			return true;
		}
	}
	return false
}

function strIncludesInAnyWay(src, tar) {
	return src.includes(tar) || src.includes(memoizedReverseStr(tar));
}

/**
 * @param {String} str 
 * @param {Array<string>} arr 
 * @returns {Boolean}
 */
function findWordInArray(arr, str) {
	let wd = arr.join('');
	return strIncludesInAnyWay(wd, str)
}

function memoizedReverseStr(str) {
	let hmap = {};
	if (hmap[str]) {
		return hmap[str]
	}
	let res = reverseStr(str);
	hmap[str] = res;
	return res;
}

function reverseStr(str) {
	let res = "";
	let len = str.length;
	for (let i = len - 1; i >= 0; i--) {
		res += str[i];
	}
	return res
}

let input = [
	['h', 'e', 'l', 'l', 'o'],
	['w', 'o', 'r', 'l', 'd'],
	['s', 't', 'r', 'i', 'n']
]

console.log(m(input, 'eot'))
