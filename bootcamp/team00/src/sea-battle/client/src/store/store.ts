import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { CONFIG } from "../config";
import { ReactNode } from "@tanstack/react-router";


export interface Notification {
  id: string,
  render: () => ReactNode
}

export interface Store {
  io: Socket
  user?: User,
  setUser: (user: User | undefined) => void,
  notifications: Notification[],
  removeNotification: (id: string) => void,
  addNotification: (notification: Notification) => void
};

const useStore = create<Store>()((set) => ({
  io: io(CONFIG.URL, {
    withCredentials: true,
    autoConnect: false,
  }) as Socket,
  user: undefined,
  setUser: (user) => set({ user }),
  notifications: [],
  removeNotification: (id) => set((store) => ({ notifications: store.notifications.filter((n) => n.id != id) })),
  addNotification: (n) => set((store) => ({ notifications: [...store.notifications, n] })),
}));

export {
  useStore
};
