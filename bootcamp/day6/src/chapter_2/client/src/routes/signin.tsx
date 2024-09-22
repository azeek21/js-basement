import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, functionalUpdate, useNavigate } from '@tanstack/react-router'
import { createRef, useState } from 'react';
import Card from '../components/shared/card';
import { SERVER_ENDPOINT } from '../consts/server';
import { AUTH_SLUG } from '../types/auth';

export const Route = createFileRoute('/signin')({
  component: SignInPage,
})

interface SignInCredentials {
  username: string,
  password: string,
}

function SignInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [credentials, setCredentials] = useState<SignInCredentials>({
    username: "",
    password: "",
  });

  const { mutate: signIn, isPending, isError, error } = useMutation({
    mutationFn: async (creds: SignInCredentials) => {
      const signInReq = await fetch(`${SERVER_ENDPOINT}/${AUTH_SLUG}/signin`, {
        method: "POST",
        body: JSON.stringify(creds),
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',
      })

      if (signInReq.status < 400) {
        return await signInReq.json();
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

  return <div className="h-full w-full flex flex-grow">

    <Card className='m-auto w-1/3 min-w-[280px] p-4'>
      <form className="flex flex-col gap-4" aria-disabled={isPending} onSubmit={ev => {
        ev.preventDefault();
        signIn(credentials);
      }} >
        <label className='flex flex-col'>
          Username:
          <input type='text' min={4} max={32} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' required onChange={(ev) => {
            setCredentials({ ...credentials, username: ev.target.value });
          }} />
        </label>

        <label className='flex flex-col'>
          Password:
          <input type='password' min={4} max={32} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' required onChange={(ev) => {
            setCredentials({ ...credentials, password: ev.target.value });
          }} />
        </label>

        <button type='submit' className='border-2 border-green-400 p-4 rounded-lg disabled:border-gray-400'
          disabled={isPending || !credentials.password || !credentials.username}
        >
          Sign In
        </button>
        {isError &&
          <p className="text-red-500">
            {JSON.stringify(error)}
          </p>

        }
      </form>
    </Card>
  </div>
}
