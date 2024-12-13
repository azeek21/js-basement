import { MouseEventHandler, PropsWithChildren, useCallback, useMemo } from "react";
import { selectNotifications } from "../store/selectors"
import { useStore } from "../store/store"

export function NotificationsProvider() {
    const notifications = useStore(selectNotifications);
    const removeNotification = useStore(s => s.removeNotification);


    const handleRemoveNotification: MouseEventHandler = useCallback((ev) => {
        if (!(ev.target instanceof HTMLButtonElement)) return;
        const notificationid = ev.target.getAttribute('data-notification-id')
        if (!notificationid) return;
        removeNotification(notificationid);
    }, [removeNotification]);


    const renderedNotifications = useMemo(() => notifications.map((n) => n.render()), [notifications])

    return <div
        className="absolute max-w-screen-sm top-0 right-0 border flex flex-col gap-2"
        onClick={handleRemoveNotification}
    >
        {renderedNotifications}
    </div >
}

export function NotificationBase({ children, id }: PropsWithChildren<{
    id: string
}>) {
    return <div
        className="border border-green-400 p-2 rounded-lg backdrop-blur backdrop-blur-sm"
    >
        <button data-notification-id={id}>x</button>
        {
            children
        }</div>
}
