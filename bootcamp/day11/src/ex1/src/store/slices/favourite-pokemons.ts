import { addPokemonToFovourites, getFavouritePokemons, removePokemonFromFovourites } from "@/lib/services/pokemon";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavouritePokemonsState {
  value: Pokemon[],
}

const initialState = {
  value: getFavouritePokemons(),
};
type PokemonIdentifier = Pokemon | number;

export const favouritePokemonsSlice = createSlice({
  name: 'favourite-pokemons',
  initialState,
  selectors: {
    selectFavouritePokemons: (state) => state.value,
    selectIsFavouritePokemon: (state, id: number) => Boolean(state.value.find(p => p.id === id)),
  },
  reducers: {
    bookmarkPokemon: (state, { payload }: PayloadAction<Pokemon>) => {
      state.value.push(payload);
      addPokemonToFovourites(payload);
    },
    unBookmarkPokemon: (state, { payload }: PayloadAction<PokemonIdentifier>) => {
      let _id = payload instanceof Object ? payload.id : payload;
      state.value = state.value.filter(p => p.id !== _id);
      removePokemonFromFovourites(_id);
    },
  },
});

export const { bookmarkPokemon, unBookmarkPokemon } = favouritePokemonsSlice.actions;
export const { selectFavouritePokemons, selectIsFavouritePokemon } = favouritePokemonsSlice.selectors;
export default favouritePokemonsSlice.reducer;
