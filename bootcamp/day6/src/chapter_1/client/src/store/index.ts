import { create } from 'zustand'

interface GlobalStore {
  user: number,
  setUser: (id: number) => void
}


const useStore = create<GlobalStore>()((set) => ({
  user: 0,
  setUser: (id) => set(state => ({ user: id })),
}))

export default useStore;
