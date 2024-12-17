import { collect } from '../utils'
import { axiosInstance, randomChoice, randomUUIDLike, sleep } from './base'

export const USERS_SERVICE_SLUG = '/users'

export function getMockUser(): User {
  return {
    id: randomUUIDLike(),
    name: randomChoice(['Azeek', 'Abdulaziz', 'Malton', 'Qishloqi', 'azeek21']),
    email: 'example@gmail.com',
    profilePicture:
      'https://imagenes.20minutos.es/files/image_990_556/uploads/imagenes/2012/06/21/66236.jpg',
    cGames: Math.round(Math.random() * 20),
    cWins: Math.round(Math.random() * 10),
  }
}

export async function fetchMockOnlineUsers() {
  await sleep(2000)
  return collect(10, getMockUser)
}

export async function fetchOnlineUsers() {
  const res = await axiosInstance.get<User[]>(`${USERS_SERVICE_SLUG}/online`)
  return res.data
}

export async function mockFetchLeaderabord() {
  await sleep(3000)
  return collect(20, getMockUser)
}
