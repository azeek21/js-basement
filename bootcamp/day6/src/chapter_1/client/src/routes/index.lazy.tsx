import { createLazyFileRoute, functionalUpdate } from '@tanstack/react-router'
import useStore from '../store'
import { useCallback, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SERVER_ENDPOINT } from '../consts/server';
import { OrderCard } from '../components/order';
import { User, USERS_SLUG } from '../types/user';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const user = useStore(s => s.user);
  const [userId, setUserid] = useState<number>();
  const setUser = useStore(s => s.setUser);
  const { data: orders, isLoading, isError, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const user = await fetch(`${SERVER_ENDPOINT}/${USERS_SLUG}/${userId}`);
      return (await user.json() as unknown as User).orders;
    },
    enabled: false,
  })

  const hasOrders = useMemo(() => orders && orders.length > 0, [orders])
  const orderItems = useMemo(() => orders?.map(o => <OrderCard order={o} />), [orders])

  const logUserIn = useCallback(() => {
    setUser(userId as number);
    refetch();
  }, [userId, refetch])

  if (user === 0) {
    return (<form className='m-auto border border-orange-300 rounded-lg w-[clamp(260px,33%,700px)] flex flex-col p-4 gap-4'>
      <label className='flex flex-col'>
        User id:
        <input type='text' min={1} max={9999} className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' pattern='[0-9]*' inputMode='numeric' onChange={(ev) => {
          setUserid(Number(ev.target.value))
        }} />
      </label>
      <button type='button' className='border-2 border-orange-400 p-4 rounded-lg disabled:border-gray-400'
        disabled={!userId || userId === 0}
        onClick={logUserIn}>Next &gt;&gt;&gt;</button>

    </form>)
  }

  if (isError) {
    return <div>Something went wrong...</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='flex gap-8 flex-wrap h-full w-full p-4 overflow-scroll'>
      {hasOrders ?
        orderItems : "No orders yet..."}
    </div>
  )
}

