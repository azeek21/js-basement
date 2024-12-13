import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { signIn, SignInProps } from '../lib/services/auth'
import { ChangeEvent, useCallback, useState } from 'react'

export const Route = createLazyFileRoute('/signin')({

  component: SignInPage,
})


function SignInPage() {
  const [formState, setFormState] = useState<SignInProps>({
    username: '',
    password: '',
  })
  const qC = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: signIn,
    mutationKey: ['sign-in'],
    onSuccess: () => {
      qC.invalidateQueries({
        queryKey: ['current-user'],
      })
      navigate({
        to: "/",
      })
    }
  })

  const handleChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
    const name = ev.target.name as keyof SignInProps;
    setFormState(s => ({ ...s, [name]: ev.target.value }))
  }, [])

  return (<div className="flex w-full">
    <form className='flex border border-blue-500 rounded-xl m-auto min-w-[280px] max-w-screen-sm flex-col p-4 gap-8'
      onSubmit={ev => {
        ev.preventDefault();
        mutate(formState)
      }}
    >
      <label className='flex flex-col'>
        Username
        <input name='username' onChange={handleChange} className='border border-blue-500 px-4 py-2 rounded-xl' type='text' placeholder='malton' />
      </label >
      <label className='flex flex-col'>
        Password
        <input name='password' onChange={handleChange} className='border border-blue-500 px-4 py-2 rounded-xl' type='password' placeholder='****' />
      </label>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isPending}
      >Sign In</button>

      <p>Don't have an account? <Link to='/signup' className='text-blue-700'>Sign Up &gt;&gt;&gt;</Link></p>
    </form>
  </div>)
}
