import { Outlet, createRootRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useStore } from '../store/store'
import { useCallback, useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { getCurrentUser, signOut } from '../lib/services/auth'
import { ChartNoAxesCombined, Swords, UserRound } from 'lucide-react'
import { selectIo } from '../store/selectors'
import { BASE_EVENTS } from '../../../shared/const/constants';
import { NotificationBase, NotificationsProvider } from '../components/Notifications'
import { getIsPlayerAvailable, setPlayerAvailable } from '../lib/services/user'

export const Route = createRootRoute({
    component: RootPage,
})

const PLAYER_AVAILABLE_KEY = 'player-available';

function RootPage() {
    const setUser = useStore(s => s.setUser);
    const addNot = useStore(s => s.addNotification);
    const removeNot = useStore(s => s.removeNotification);
    const [c, setC] = useState(0);
    const io = useStore(selectIo);
    const qC = useQueryClient();
    const navigate = useNavigate();
    const { data: user, isLoading, error } = useQuery({
        queryKey: ['current-user'],
        queryFn: getCurrentUser,
        refetchInterval: 1000 * 10,
    })

    const { data: isUserAvailable, isLoading: isUserAvailableLoading } = useQuery({
        queryKey: [PLAYER_AVAILABLE_KEY],
        queryFn: getIsPlayerAvailable,
        refetchInterval: 1000,
    })

    const { mutate: doSignOut } = useMutation({
        mutationFn: signOut,
        mutationKey: [PLAYER_AVAILABLE_KEY],
        onSuccess: () => {
            setUser(undefined);
            qC.removeQueries()
            navigate({
                to: "/signin",
            })
        }
    })

    const { mutate: mutateUserAvailable, isPending: isPlayerAvailableMutating } = useMutation({
        mutationFn: setPlayerAvailable,
        mutationKey: [PLAYER_AVAILABLE_KEY],
        onSuccess: () => {
            qC.invalidateQueries({
                queryKey: [PLAYER_AVAILABLE_KEY]
            })
        }
    })

    useEffect(() => {
        if (user) {
            setUser(user);
            io.connect();
        }
    }, [user])

    useEffect(() => {
        if (isAxiosError(error) && error?.status === 403) {
            io.disconnect();
            navigate({
                to: '/signin'
            })
        }
    }, [error])

    const acceptInvite = useCallback((fromUser: User) => {
        io.emit(BASE_EVENTS.GAME_INVITE_ACCEPT, fromUser);
        navigate({
            to: '/game',
        })
    }, [io])

    useEffect(() => {
        io.on('test', (c) => {
            setC(c);
        });
        io.on(BASE_EVENTS.GAME_INVITE, (invitingUser: User) => {
            addNot({
                id: invitingUser.username,
                render: () => <NotificationBase id={invitingUser.username} key={invitingUser.username}>
                    <h1>{invitingUser?.username} is inviting you for a match</h1>
                    <button
                        className='flex flex-col items-center text-blue-300 [&.active]:text-blue-500 hover:text-blue-500'
                        onClick={() => {
                            removeNot(invitingUser.username)
                            acceptInvite(invitingUser);
                        }}
                    >accept</button>
                </NotificationBase>,
            })
        })

        return () => {
            io.off('test');
            io.off(BASE_EVENTS.GAME_INVITE);
            io.disconnect();
        };
    }, [acceptInvite]);

    return (
        <div className="flex flex-row h-full w-full p-4 gap-4">
            <NotificationsProvider />
            <div className='fixed top-2 right-2'>{c}</div>
            <header className="p-4 flex items-center flex-col backdrop-blur-lg border-b border-gray border-2 border-blue-400 rounded-xl gap-8">
                <nav className='flex h-full'>
                    <ul className="flex flex-col gap-8 items-center flex-grow h-full">
                        {user && (
                            <>
                                <li>
                                    <Link to="/game" className="flex flex-col items-center [&.active]:text-blue-500 hover:text-blue-500">
                                        <Swords />
                                        Game
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/stats" className="flex flex-col items-center [&.active]:text-blue-500 hover:text-blue-500">
                                        <UserRound />
                                        Stats
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/leaderboard" className="flex flex-col items-center [&.active]:text-blue-500 hover:text-blue-500">
                                        <ChartNoAxesCombined />
                                        Leaderboard
                                    </Link>
                                </li>
                            </>
                        )}



                        <div className='mt-auto flex flex-col gap-2'>
                            {
                                user ?
                                    (
                                        <>
                                            <li>
                                                Player: {user.username}
                                            </li>
                                            <li>
                                                Online: {isUserAvailableLoading || isPlayerAvailableMutating ?
                                                    "Loading..." :
                                                    <input type='checkbox' checked={isUserAvailable} onChange={(ev) => mutateUserAvailable(ev.target.checked)} />
                                                }
                                            </li>
                                            <li>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white [&.active]:bg-blue-700 font-bold py-2 px-4 rounded"
                                                    onClick={() => doSignOut()}
                                                >
                                                    Sign Out
                                                </button>
                                            </li>
                                        </>
                                    )
                                    :
                                    (<li>
                                        <Link to='/signin' className="bg-blue-500 hover:bg-blue-700 text-white [&.active]:bg-blue-700 font-bold py-2 px-4 rounded">
                                            Sign In
                                        </Link>
                                    </li>)
                            }
                        </div>
                        {isLoading && (<div>Loading...</div>)}
                    </ul>
                </nav>
            </header>
            <main className="flex flex-grow border-2 border-blue-300 rounded-xl">
                <Outlet />
            </main>
        </div>
    )
}
