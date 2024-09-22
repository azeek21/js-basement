import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { MENU_SLUG, MenuItem } from '../types/menu'
import { SERVER_ENDPOINT } from '../consts/server'
import MenuItemCard from '../components/menu-item-card'
import Card from '../components/shared/card'

export const Route = createLazyFileRoute('/menu')({
  component: MenuPage,
})

function MenuPage() {

  const { data: menuItems, isLoading, isError } = useQuery({
    queryKey: ['menu'],
    queryFn: async () => {
      const menuReq = await fetch(`${SERVER_ENDPOINT}/${MENU_SLUG}`, {
        credentials: 'include'
      });
      return menuReq.json() as unknown as MenuItem[];
    }
  })

  const renderedMenuItems = useMemo(() => menuItems?.map(item => <MenuItemCard item={item} />), [menuItems])

  if (isError) {
    return <Card className='text-red-500 text-2xl'>
      Something went terribly wrong. We will fix it soon ...
    </Card>
  }

  return <div className="flex flex-wrap gap-8 p-4">
    {isLoading ? "Loading..." : renderedMenuItems}
  </div>
}
