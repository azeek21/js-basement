import { HTMLAttributes, useMemo } from "react";
import { Order } from "../types/order";
import { MenuItem } from "../types/menu";
import Card from "./shared/card";
import emptyPicture from "../assets/empty.webp"

interface OrderCardProps extends HTMLAttributes<HTMLDivElement> {
  order: Order,
}

function OrderCard({ order, ...rest }: OrderCardProps) {

  const hasItems = order.items && order.items.length > 0;
  const items = useMemo(() => order.items?.map(item => <MenuItemInOrder key={item.id} item={item} />), [order.items])
  const totalCost = useMemo(() => order.items?.reduce((acc, b) => acc + b.cost, 0), [order.items]);


  return <Card
    className="flex flex-col border border-r-orange-400 rounded-lg gap-4 p-4 w-[400px] h-auto"
    {...rest}
  >
    {order.user && (
      <h3>Order for: {order.user.name}</h3>
    )}
    <div>
      In order:
    </div>

    <div className="gap-2 flex flex-col">
      {hasItems ? items : <h4>Order is empty :(</h4>}
    </div>
    <p>Total: ${totalCost}</p>
  </Card>
}


interface ItemInOrderProps extends HTMLAttributes<HTMLDivElement> {
  item: MenuItem
}

function MenuItemInOrder({ item, ...rest }: ItemInOrderProps) {

  return <div
    className="flex gap-4"
    {...rest}
  >
    <img className="row-span-2 w-24 object-cover aspect-square" src={item.picture || emptyPicture} />

    <div className="flex flex-col gap-2">
      <h3 className="text-lg text-ellipsis">{item.title}</h3>
      <p>${item.cost}</p>
    </div>
  </div>
}

export {
  OrderCard,
}
