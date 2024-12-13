export const RANDOM_GAME_MAPS = [
	'aaasaaaaaasaasaaaaassaasassaassaaaaaaaassasassssaaaaaaaaaaaaaasssaaaasaaaaaaaaasassssassasaaaaaaaaas',
	'aaaaaaaaaaaassssaaaaaaaaaasaasasaaaasaasasasaasaasasaaaasaaaaaaaaaaaaasassssassssaaaaaaaaaassaaassss',
	'assssassssaaaaaaaaaassaaaaaaasaaasssaaasaaaaaaaaasasasssasasasaaaaaaaaaaasssaaaaaaaaaaaaaaaaaaaassss',
	'aaaaasaaaaaaaaaaaaaaaaaaaaaaaassaaassasaaasaaaaasaaasasasasaaasasasaassasasasaassaaaaasaassassssaaas',
	'assaaaaasaaaaaasaasaaasaasasaasasaasasaaaasaasasaaaasaaaaaassaasssaaassaaaaaaaassaaassssasaaaaaaaaaa',
	'assssasssaaaaaaaaaaasaaasaasaasaaaaaasaasaaasaasaaaaaasaaaaasaaasaaaassaaasaaaassassassaassaaaaaaaas'
]

export function getEmptyShipPlacement() {
	return "a".repeat(10 * 10);
}

export function randomChoice<T extends unknown>(choices: ArrayLike<T>): T {
	return choices[Math.floor(Math.random() * choices.length)];
}

export const getRandomMap = () => randomChoice(RANDOM_GAME_MAPS);
