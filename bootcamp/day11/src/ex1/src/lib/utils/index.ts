export function repeatAndCollect<T extends (i: number) => ReturnType<T>>(times: number, cb: T): Array<ReturnType<T>> {
  return Array(times).fill(0).map((_, i) => cb(i));
}

export async function sleepFor(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
