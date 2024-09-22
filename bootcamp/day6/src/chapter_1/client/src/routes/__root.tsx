import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div id="router-root" className="w-full min-h-screen min-w-[280px] flex flex-col flex-grow">
      <header className="w-full border-b border-gray-600 px-4 py-2">
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/menu" className="[&.active]:font-bold text-orange-400 [&.active]:text-orange-500" >
                Menu
              </Link>
            </li>

            <li>
              <Link to="/orders" className="[&.active]:font-bold text-orange-400 [&.active]:text-orange-500" >
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <div className="h-full flex-grow border flex flex-col">
        <Outlet />
      </div>
      <footer className="border-t border-gray-600 text-center text-sm py-2">
        Copyright (c) 2024 malton. All Rights Reserved.
      </footer>
    </div>
  )
})
