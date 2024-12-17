import axios from 'axios'
import z from 'zod'
import { axiosInstance, sleep } from './base'
const cantBeEmptyMessage = "Field can't be empty"

export const signInValidator = z.object({
  login: z.string().min(4, cantBeEmptyMessage),
  password: z.string().min(4, cantBeEmptyMessage),
})

export type SingInOptions = z.infer<typeof signInValidator>

export async function signIn(params: SingInOptions) {
  const res = await axiosInstance.post('/auth/sign-in')
  return res.data
}

export async function mockSignIn(params: SingInOptions): Promise<SignInSuccess> {
  await sleep(3000)
  return {
    token: 'adsfadfad',
    refreshToken: 'asdfasdfa',
    expires: new Date(Date.now() + 60000).toISOString(),
  }
}
