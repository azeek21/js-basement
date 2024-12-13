import { createLazyFileRoute } from '@tanstack/react-router'
import { User } from 'lucide-react'
import { useStore } from '../store/store'
import { getRateOf } from '../lib/shared/utils/getters';

export const Route = createLazyFileRoute('/stats')({
  component: StatsPage,
})

function StatsPage() {
  const user = useStore(s => s.user);


  return <div className='p-8 flex items-center justify-center w-full'>
    {user && (
      <div className='flex flex-col text-5xl'>
        <User size={100} className='mx-auto' />
        <h1>Username: {user?.username}</h1>
        <h1>Total Games: {user?.cGames}</h1>
        <h1>Total Wins: {user?.cWins}</h1>
        <h1>Win Rate: {getRateOf(user.cWins, user.cGames)}</h1>
      </div>
    )}
  </div>
}
