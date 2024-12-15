import { configureStore } from '@reduxjs/toolkit'
import { favouritePokemonsSlice } from './slices/favourite-pokemons'

export const store = configureStore({
  reducer: {
    [favouritePokemonsSlice.name]: favouritePokemonsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
