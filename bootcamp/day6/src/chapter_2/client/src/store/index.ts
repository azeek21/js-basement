import { create } from 'zustand'
import { User } from '../types/user';

interface GlobalStore {
  user?: User,
  setUser: (id: User) => void
}


const useStore = create<GlobalStore>()((set) => ({
  setUser: (id) => set(() => ({ user: id })),
}))

export default useStore;
