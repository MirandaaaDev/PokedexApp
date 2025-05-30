import axios from 'axios';
import { Pokemon, PokemonListItem } from '../types/Pokemon';

const API_BASE = 'https://pokeapi.co/api/v2';

export async function getPokemons(limit: number, offset = 0): Promise<PokemonListItem[]> {
  try {
    const res = await axios.get(`${API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
    return res.data.results;
  } catch (error) {
    throw new Error('Falha ao buscar a lista de pokémons.');
  }
}

export async function getPokemonDetails(url: string): Promise<Pokemon> {
  try {
    // Busca detalhes básicos
    const res = await axios.get(url);

    // Busca a espécie para obter descrição
    const speciesRes = await axios.get(res.data.species.url);

    // Pega o flavor_text em português (pt-br), ou outro fallback
    const flavorEntry = speciesRes.data.flavor_text_entries.find(
      (entry: any) => entry.language.name === 'pt' || entry.language.name === 'en'
    );

    return {
      id: res.data.id,
      name: res.data.name,
      image: res.data.sprites.front_default,
      types: res.data.types.map((t: any) => t.type.name),
      height: res.data.height,
      weight: res.data.weight,
      description: flavorEntry ? flavorEntry.flavor_text.replace(/\n|\f/g, ' ') : 'Sem descrição disponível',
    };
  } catch (error) {
    throw new Error('Falha ao buscar detalhes do pokémon.');
  }
}

