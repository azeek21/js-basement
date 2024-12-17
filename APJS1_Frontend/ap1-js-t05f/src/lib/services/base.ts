import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
})

export async function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

export function randomUUIDLike() {
  return `${Math.random()}-${Math.random()}-${Math.random()}-${Math.random()}`
}

export function randomChoice<T>(collection: ArrayLike<T>): T {
  return collection[Math.floor(Math.random() * collection.length)]
}
