import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import Card from '../components/shared/card';
import { SERVER_ENDPOINT } from '../consts/server';
import { AUTH_SLUG } from '../types/auth';
import useStore from '../store';

export const Route = createFileRoute('/signup')({
  component: SignUpPage,
})

interface SignUpCredentials {
  username: string,
  password: string,
  name: string,
  role: string,
}

function SignUpPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<SignUpCredentials>({
    username: "",
    password: "",
    name: "",
    role: "",
  });

  const { mutate: signIn, isPending, isError, error } = useMutation({
    mutationFn: async (creds: SignUpCredentials) => {
      const signInReq = await fetch(`${SERVER_ENDPOINT}/${AUTH_SLUG}/signup`, {
        method: "POST",
        body: JSON.stringify(creds),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
      })

      if (signInReq.status < 400) {
        return signInReq.json();
      } else {
        throw await signInReq.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      })
      navigate({
        to: '/',
      })
    }
  });

  const isFormValid = Object.entries(credentials).reduce((acc, [_, v]) => v && acc, true)

  return <div className="h-full w-full flex flex-grow">

    <Card className='m-auto w-1/3 min-w-[280px] p-4'>
      <form className="flex flex-col gap-4" aria-disabled={isPending} >
        <label className='flex flex-col'>
          Name:
          <input type='text' min={4} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' required onChange={(ev) => {
            setCredentials({ ...credentials, name: ev.target.value });
          }} />
        </label>

        <label className='flex flex-col'>
          Username:
          <input type='text' min={4} max={32} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' required onChange={(ev) => {
            setCredentials({ ...credentials, username: ev.target.value });
          }} />
        </label>


        <label className='flex flex-col'>
          Role:
          <select
            className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full'
            value={credentials.role}
            onChange={(ev) => {
              setCredentials({ ...credentials, role: ev.target.value });
            }}
            required
          >
            <option value="">Not selected</option>
            <option value="ADMIN">Admin</option>
            <option value="WAITER">Waiter</option>
          </select>
        </label>

        <label className='flex flex-col'>
          Password:
          <input type='password' min={4} max={32} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' required onChange={(ev) => {
            setCredentials({ ...credentials, password: ev.target.value });
          }} />
        </label>

        <button type='button' className='border-2 border-green-400 p-4 rounded-lg disabled:border-gray-400'
          disabled={!isFormValid || isPending}
          onClick={() => signIn(credentials)}
        >
          Sign Up
        </button>
      </form>
      {isError &&
        <p className="text-red-500">
          {JSON.stringify(error)}
        </p>
      }
    </Card>
  </div>
}
