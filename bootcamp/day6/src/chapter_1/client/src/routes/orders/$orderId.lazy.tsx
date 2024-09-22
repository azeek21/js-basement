import { useQuery } from '@tanstack/react-query';
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { SERVER_ENDPOINT } from '../../consts/server';
import { Order, ORDERS_SLUG } from '../../types/order';
import Card from '../../components/shared/card';
import MenuItemCard from '../../components/menu-item-card';
import { useMemo } from 'react';

export const Route = createLazyFileRoute('/orders/$orderId')({
  component: OrderPage,
})

function OrderPage() {
  const { orderId } = Route.useParams();
  const { data: order, isLoading: isOrderLoading, isError: isOrderError } = useQuery({
    queryKey: [`order-${orderId}`],
    queryFn: async () => {
      const order_req = await fetch(`${SERVER_ENDPOINT}/${ORDERS_SLUG}/${orderId}`);
      return await order_req.json() as unknown as Order;
    }
  })


  const menuItemsInOrder = useMemo(() => order?.items?.map(item => <MenuItemCard key={item.id} item={item} />), [order?.items])
  return <div className='h-full flex gap-4 p-4 justify-center items-start flex-wrap'>
    {menuItemsInOrder}
  </div>
}
