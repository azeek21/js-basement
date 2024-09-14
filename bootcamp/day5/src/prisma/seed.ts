import { PrismaClient, MenuItem, $Enums } from '@prisma/client'
const db = new PrismaClient()

async function main() {
	console.log("Seeding the db")
	await db.user.create({
		data: {
			name: "Azeek",
			role: $Enums.UserRoles.ADMIN,
		},
	})

	let m = [
		{
			title: "Chicken soup",
			cost: 65,
			description: "Yummy yummy chicken soup whoaaah (っˆڡˆς)",
			picture: "",
			CallQuantity: 0,
		},
		{
			title: "Plov",
			cost: 250,
			description: "Delecious Uzbek plow",
			picture: "https://www.alyonascooking.com/wp-content/uploads/2021/09/How-to-make-Uzbek-plov-in-kazan-14.jpg",
			CallQuantity: 0,
		},
		{
			title: "Fried pinky from left foot of grizzly bear",
			cost: 600,
			description: "Our chef caught the bear himslef",
			picture: "",
			CallQuantity: 0,
		}
	]

	await db.menuItem.createMany({
		data: m,
	});

	console.log("Seeding done")
}

main()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})
