import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { getLeaderboardPlayerrs } from '../lib/services/user'
import { useStore } from '../store/store';
import { getRateOf } from '../lib/shared/utils/getters';

export const Route = createLazyFileRoute('/leaderboard')({
  component: LeaderboarPage,
})

function LeaderboarPage() {
  const { data: players, isLoading: isLoadingPlayers, error: error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderboardPlayerrs,
    refetchInterval: 5000,
  })

  const user = useStore(s => s.user);

  return <div className='p-8'>
    {isLoadingPlayers && 'loading...'}
    {
      !isLoadingPlayers
      && !error
      && (
        <ol className='flex flex-col list-decimal'>
          {players?.map(p =>
            <li
              className={`text-xl ${p.id === user?.id ? 'text-green-700' : ''}`}
              key={p.username}
            >
              {p.username}: Wins: {p.cWins} out of {p.cGames} games. Win rate: {getRateOf(p.cWins, p.cGames)}%
            </li>
          )
          }
        </ol>
      )
    }
    {error && String(error)}
  </div>
}
