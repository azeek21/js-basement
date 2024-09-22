import { createLazyFileRoute, functionalUpdate, Navigate, useNavigate } from '@tanstack/react-router'
import useStore from '../store'
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SERVER_ENDPOINT } from '../consts/server';
import { OrderCard } from '../components/order';
import { Order, ORDERS_SLUG } from '../types/order';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  const user = useStore(s => s.user);
  const navitate = useNavigate();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      if (user) {
        const ordersReq = await fetch(`${SERVER_ENDPOINT}/${ORDERS_SLUG}/${user.role === 'ADMIN' ? '' : 'my'}`, {
          credentials: 'include',
        });
        return await ordersReq.json() as unknown as Order[];
      }
    },
  })

  const hasOrders = useMemo(() => orders && orders.length > 0, [orders])
  const orderItems = useMemo(() => orders?.map(o => <OrderCard order={o} />), [orders])

  if (!user) {
    navitate({
      to: "/signin"
    })
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

