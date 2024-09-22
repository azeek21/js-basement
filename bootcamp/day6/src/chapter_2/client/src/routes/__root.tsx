import { useQuery } from "@tanstack/react-query";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { SERVER_ENDPOINT } from "../consts/server";
import { AUTH_REFRESH_ITNERVAL, AUTH_SLUG } from "../types/auth";
import { User } from "../types/user";
import useStore from "../store";

export const Route = createRootRoute({
  component: IndexPage,
})


function IndexPage() {
  const setUser = useStore(s => s.setUser);
  useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const userReq = await fetch(`${SERVER_ENDPOINT}/${AUTH_SLUG}/user`, {
        credentials: 'include',
      });

      if (userReq.status < 400) {
        const user = await userReq.json() as unknown as User;
        setUser(user);
      }
    },
    refetchInterval: AUTH_REFRESH_ITNERVAL,
  })

  return (
    <div id="router-root" className="w-full min-h-screen min-w-[280px] flex flex-col flex-grow">
      <header className="w-full border-b border-gray-600 px-4 py-2">
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="[&.active]:font-bold text-orange-400 [&.active]:text-orange-500" >
                Home
              </Link>
            </li>


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

            <li>
              <Link to="/signin" className="[&.active]:font-bold text-orange-400 [&.active]:text-orange-500" >
                Sign In
              </Link>
            </li>

            <li>
              <Link to="/signup" className="[&.active]:font-bold text-orange-400 [&.active]:text-orange-500" >
                Sign Up
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
}
