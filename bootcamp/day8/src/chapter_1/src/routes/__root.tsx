import { ThemeToggle } from '@/components/core/ThemeChanger'
import { ThemeProvider } from '@/components/core/ThemeProvider'
import { NavigationMenuList, NavigationMenuItem, NavigationMenu } from '@/components/ui/navigation-menu'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Origami } from 'lucide-react'


const linkStyles = '[&.active]:text-teal-500 hover:text-teal-300 [&.active]:font-extrabold flex gap-2 items-center';
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' storageKey='pokelect-theme'>
        <header className='px-8 py-4 border-b flex items-center justify-between'>
          <NavigationMenu>
            <NavigationMenuList className='items-end gap-4'>
              <NavigationMenuItem>
                <Link to="/" className={linkStyles}>
                  <Origami size={50} />
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </header>
        <Outlet />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </QueryClientProvider>

  ),
})

