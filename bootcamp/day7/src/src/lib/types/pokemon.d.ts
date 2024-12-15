interface PokemonNameAndUrl {
  name: string,
  url: string,
}

interface PokemonForm { name: string, url: string }

interface Pokemon {
  id: number,
  name: string,
  base_experience: number,
  height: number,
  order: number,
  weight: number,
  sprites: [{
    front_default?: string,
  }],
  forms: PokemonForm[],
}

interface PokemonSearchResult {
  count: number,
  next?: string,
  previous?: string,
  results: PokemonNameAndUrl[],
}
