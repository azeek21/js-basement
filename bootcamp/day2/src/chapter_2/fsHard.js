import fs from "node:fs/promises";
import path from "node:path";

function getProgressbarString(precent) {
	let unit = '*';
	return `\rLoading: [${unit.repeat(precent)}${' '.repeat(100 - precent)}]\t| ${precent}%`
}

const doSmthWithFile = async (pathToFile) => {
	const stat = await fs.stat(pathToFile);
	await new Promise(res => setTimeout(res, stat.size));
}

const progressbar = async () => {
	let progress = 0;
	process.stdout.write(getProgressbarString(1));
	const files = (await fs.readdir("./")).map(file => path.join("./", file));
	const pendingStats = files.map(async file => {
		let info = await fs.stat(file)
		info['path'] = file;
		return info;
	});
	const stats = await Promise.all(pendingStats)
	const totalSize = stats.reduce((c, item) => c + item.size, 0)
	for (let file of stats) {
		await doSmthWithFile(file.path)
		progress += Math.floor(100 * (file.size / totalSize));
		process.stdout.write(getProgressbarString(progress));
	}
	process.stdout.write("\nDone\n");
}

progressbar();
