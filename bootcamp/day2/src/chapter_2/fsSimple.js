import fs from "fs";
import fp from "node:fs/promises"

const readAndWriteCallbackHell = () => {
	fs.readFile("./file1.txt", (err, data) => {
		if (err != null) {
			console.log("err when opening file: ", err)
		}

		fs.writeFile("./file2.txt", data, () => {
			console.log('done')
		})
	})
};

const readAndWritePromises = () => {
	fp.readFile("./file1.txt").then((data) => {
		fp.writeFile("./file2-promises.txt", data).then(() => console.log("RW promises done")).catch(() => console.log("RW promises failed"))
	}).catch((err) => {
		console.log("err in promised read file: ", err)
	})
};

const readAndWriteAsyncAwait = async () => {
	try {
		const data = await fp.readFile("./file1.txt")
		fp.writeFile("./file2-async-await.txt", data)
		console.log("async await rw promise done")
	} catch (e) {
		console.log("error while reading or writing file in asnyc await fs: ", e)
	}
};

readAndWriteCallbackHell();
readAndWritePromises();
readAndWriteAsyncAwait();
