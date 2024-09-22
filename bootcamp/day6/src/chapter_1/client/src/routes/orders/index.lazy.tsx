import { useMutation, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { MENU_SLUG, MenuItem } from '../../types/menu'
import { SERVER_ENDPOINT } from '../../consts/server'
import { useMemo, useState } from 'react'
import { User, WAITERS_SLUG } from '../../types/user'
import { Order, ORDERS_SLUG } from '../../types/order'

export const Route = createLazyFileRoute('/orders/')({
  component: Orders,
})

interface NewOrder {
  isActive: boolean,
  userId?: number,
  items: number[],
}

const initialOrderState: NewOrder = {
  isActive: true,
  items: [],
  userId: undefined,
}

function Orders() {
  const [orderState, setOrderState] = useState<NewOrder>({
    ...initialOrderState,
  })
  const navigate = useNavigate();

  const { data: menuItems, isLoading, isError } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const orders = await fetch(`${SERVER_ENDPOINT}/${MENU_SLUG}`)
      return orders.json() as unknown as MenuItem[];
    }
  })

  const { data: waiters, isLoading: isWaitersLoading, isError: isWaitersError } = useQuery({
    queryKey: ['waiters'],
    queryFn: async () => {
      const orders = await fetch(`${SERVER_ENDPOINT}/${WAITERS_SLUG}`)
      return orders.json() as unknown as User[];
    }
  })

  const { mutateAsync: createOrder } = useMutation({
    async mutationFn() {
      console.log("HERE");
      const create_req = await fetch(`${SERVER_ENDPOINT}/${ORDERS_SLUG}`, {
        method: "post",
        headers: {
          'Aceept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderState),
      })
      return await create_req.json() as unknown as Order;
    },
    onSuccess(order: Order) {
      console.log("redirecting")
      navigate({
        to: `/orders/${order.id}`
      })
    },
  })


  const menuOptions = useMemo(() => menuItems?.
    map(item => <option key={item.id} value={item.id}>{item.title}: {item.cost}</option>),
    [menuItems]);

  const waiterOptions = useMemo(() => waiters?.
    map(item => <option key={item.id} value={item.id}>{item.name}</option>),
    [waiters]);

  if (isError || isWaitersError) {
    return <div>Something went wrong</div>
  }

  return <div className='flex p-8 h-full'>
    <form className='flex flex-col p-4 border rounded-lg border-orange-400 m-auto w-full max-w-screen-sm gap-8'>
      {isLoading && isWaitersLoading && <div>Loading ...</div>}
      <label className='flex flex-col'>
        Select Waiter:
        <select className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' defaultValue="" disabled={isWaitersLoading}
          onChange={ev => setOrderState({ ...orderState, userId: Number(ev.target.value) })
          }
        >
          <option value="">Empty</option>
          {waiterOptions}
        </select>
      </label>

      <label className='flex flex-col'>
        Select menu items:
        <select className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' multiple disabled={isLoading}
          onChange={ev => setOrderState({ ...orderState, items: [...orderState.items, Number(ev.target.value)] })}
          value={orderState.items}
        >
          {menuOptions}
        </select>
      </label>

      <div className='flex gap-8 justify-end'>

        <button type='button' className='border-2 border-red-400 p-4 rounded-lg disabled:border-gray-400'
          onClick={() => setOrderState(initialOrderState)}
        >
          Cancel
        </button>

        <button type='button' className='border-2 border-green-400 p-4 rounded-lg disabled:border-gray-400'
          disabled={isLoading || isWaitersLoading}
          onClick={() => createOrder()}
        >
          Submit
        </button>
      </div>

    </form>
  </div >
}
