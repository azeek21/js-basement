import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function collect<T extends (index: number) => ReturnType<T>>(
  n: number,
  cb: T,
): ReturnType<T>[] {
  return Array(n)
    .fill(0)
    .map((_, i) => cb(i))
}

export function monkeyThrow<T extends (...args: Parameters<T>) => ReturnType<T>>(
  cb: T,
  err?: unknown,
  throwRate = 0.5,
) {
  return (...args: Parameters<T>) => {
    if (Math.random() < throwRate) {
      throw err
    }
    return cb(...args)
  }
}

export function getRateOf(from: number, of: number) {
  const res = Math.round((of / from) * 100)
  return isFinite(res) ? res : 100
}
