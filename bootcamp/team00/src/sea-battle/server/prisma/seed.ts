import { PrismaClient } from "@prisma/client";
import { PC_PLAYER_ID } from "../lib/shared/const/constants";
const prisma = new PrismaClient();
async function main() {
	const PC_USER = await prisma.user.upsert({
		where: { id: PC_PLAYER_ID },
		update: {},
		create: {
			id: 1,
			cWins: 0,
			cGames: 0,
			username: ">> AI <<",
			password: "as;ldfkjas;dlfkjq3oetfif294rt824thlk;asdjh290p4thqp[3rg0984(*9asdf;lk;)]",
		}
	})
	console.log("created ", PC_USER);
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
