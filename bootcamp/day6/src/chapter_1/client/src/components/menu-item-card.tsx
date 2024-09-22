import { HTMLAttributes } from "react";
import { MenuItem } from "../types/menu";
import Card from "./shared/card";
import emptyImage from "../../public/empty.webp"

interface MenuItemCardProps extends HTMLAttributes<HTMLDivElement> {
  item: MenuItem,
}


export default function MenuItemCard({ item, ...rest }: MenuItemCardProps) {

  return <Card {...rest} className="flex flex-col overflow-hidden w-[280px] gap-4 h-[350px]">
    <img src={item.picture || emptyImage} className="w-full object-cover h-[200px]" />
    <div className="p-2 flex flex-col h-full">
      <h1 className="text-xl text-orange-600">{item.title}</h1>
      <p className="text-orange-400">{item.description}</p>
      <p className="text-green-400 mt-auto text-lg">${item.cost}</p>
    </div>
  </Card>
}
