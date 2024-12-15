import { axiosInstance } from "../axios";
const API_SLUG = '/pokemon';
const COLLECTION_STORAGE_KEY = 'my-pokemons';
const POKEMON_SPRITE_URL_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"

export function getPokemonSpriteUrlPokemonId(id: number): string {
  return `${POKEMON_SPRITE_URL_BASE}/${id}.png`;
}

export async function getPokemonById(id: number) {
  const res = await axiosInstance.get<Pokemon>(`${API_SLUG}/${id}`);
  return res.data;
}

export async function getPokemonByName(name: string) {
  const res = await axiosInstance.get<Pokemon>(`${API_SLUG}/${name}`);
  return res.data;
}

export async function searchPokemon(query: string) {
  const res = await axiosInstance.get<PokemonSearchResult>(`${API_SLUG}/?q=${query}`);
  return res.data;
}

export async function getPokemonFromUrl(url: string) {
  const res = await axiosInstance.get<Pokemon>(url);
  return res.data;
}

export function getFavouritePokemons(): Pokemon[] {
  try {
    const localCollection = localStorage.getItem(COLLECTION_STORAGE_KEY);
    if (!localCollection) return [];
    return JSON.parse(localCollection);
  } catch (error) {
    return [];
  }
}

export function addPokemonToFovourites(pokemon: Pokemon) {
  const collection = getFavouritePokemons();
  collection.push(pokemon);
  localStorage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify(collection));
}

export function removePokemonFromFovourites(pokemon: number | Pokemon) {
  let _id = 0;
  if (pokemon instanceof Object) {
    _id = pokemon.id;
  } else {
    _id = pokemon;
  }

  const updatedCollection = JSON.stringify(getFavouritePokemons().filter(p => p.id != _id));
  localStorage.setItem(COLLECTION_STORAGE_KEY, updatedCollection);
}

export function isPokemonInFavourites(pokemon: number | Pokemon) {
  let _id = 0;
  if (pokemon instanceof Object) {
    _id = pokemon.id;
  } else {
    _id = pokemon;
  }

  return Boolean(getFavouritePokemons().find(p => p.id === _id));
}
