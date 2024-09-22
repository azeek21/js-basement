import { useMutation, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { MENU_SLUG, MenuItem } from '../../types/menu'
import { SERVER_ENDPOINT } from '../../consts/server'
import { useMemo, useState } from 'react'
import { User, WAITERS_SLUG } from '../../types/user'
import { Order, ORDERS_SLUG } from '../../types/order'
import useStore from '../../store'

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
  const user = useStore(s => s.user);
  const [orderState, setOrderState] = useState<NewOrder>({
    ...initialOrderState,
    userId: user?.id,
  })

  const navigate = useNavigate();

  const { data: menuItems, isLoading, isError } = useQuery({
    queryKey: ['menu-items'],
    queryFn: async () => {
      const orders = await fetch(`${SERVER_ENDPOINT}/${MENU_SLUG}`, {
        credentials: 'include'
      })
      return orders.json() as unknown as MenuItem[];
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
        credentials: 'include',
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

  if (isError) {
    return <div>Something went wrong</div>
  }

  return <div className='flex p-8 h-full'>
    <form className='flex flex-col p-4 border rounded-lg border-orange-400 m-auto w-full max-w-screen-sm gap-8'>
      {isLoading && <div>Loading ...</div>}
      <label className='flex flex-col'>
        Select Waiter:
        <select className='border border-orange-400 p-4 text-orange-500 rounded-lg text-lg w-full' defaultValue=""
          onChange={ev => setOrderState({ ...orderState, userId: Number(ev.target.value) })
          }
          disabled
        >
          <option value={user?.id}>{user?.name}</option>
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
          disabled={isLoading}
          onClick={() => createOrder()}
        >
          Submit
        </button>
      </div>

    </form>
  </div >
}
