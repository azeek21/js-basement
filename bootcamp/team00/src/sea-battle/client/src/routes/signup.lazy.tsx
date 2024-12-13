import { createLazyFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { SignInProps, signUp } from '../lib/services/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const Route = createLazyFileRoute('/signup')({
  component: SignUpPage,
})

function SignUpPage() {
  const [formState, setFormState] = useState<SignInProps & { passwordRepeat: string }>({
    username: '',
    password: '',
    passwordRepeat: ''
  })

  const qC = useQueryClient();
  const navigate = useNavigate();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: signUp,
    mutationKey: ['sign-up'],
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

  const isFormValid = useMemo(() => formState.password && formState.username && (formState.password === formState.passwordRepeat), [formState])


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

      <label className='flex flex-col'>
        Repeat password
        <input name='passwordRepeat' onChange={handleChange} className='border border-blue-500 px-4 py-2 rounded-xl' type='password' placeholder='****' />
      </label>

      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300"
        disabled={isPending || !isFormValid}
      >Sign Up</button>

      <p>Already have an account? <Link to='/signin' className='text-blue-700'>Sign In &gt;&gt;&gt;</Link></p>
    </form>
  </div>)
}
