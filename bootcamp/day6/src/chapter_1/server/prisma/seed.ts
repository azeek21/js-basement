import { PrismaClient, MenuItem, $Enums } from '@prisma/client'
import { userInfo } from 'os'
const db = new PrismaClient()

async function main() {
	console.log("Seeding the db")

	let users = [
		{
			name: "Waiter Alisa",
			role: $Enums.UserRoles.WAITER,
		},
		{
			name: "Azeek",
			role: $Enums.UserRoles.ADMIN,
		}
	]

	await db.user.createMany({
		data: users,
	});

	let m = [
		{
			title: "Chicken soup",
			cost: 65,
			description: "Yummy yummy chicken soup whoaaah (っˆڡˆς)",
			picture: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k%2Farchive%2F7ad08b34d013c250d1ec5a8293adf91c3a0d16c6",
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
			picture: "https://qph.cf2.quoracdn.net/main-qimg-f07d0a2491b9286f142e92fd7119aabd-lq",
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
