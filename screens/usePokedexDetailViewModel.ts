import { useEffect, useState } from 'react';
import { Pokemon } from '../types/Pokemon';
import { getPokemonDetails } from '../services/api';

export function usePokedexDetailViewModel(initialPokemon: Pokemon) {
  const [pokemon, setPokemon] = useState<Pokemon>(initialPokemon);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se quiser carregar mais detalhes (ex: descrição) a partir do id ou url,
    // pode fazer aqui, por enquanto já tem a descrição?
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // Se o initialPokemon não tem descrição completa, pode buscar aqui
        if (!pokemon.description) {
          const details = await getPokemonDetails(`pokemon/${pokemon.id}`);
          setPokemon(details);
        }
      } catch (e) {
        setError('Falha ao carregar detalhes do Pokémon.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  return { pokemon, loading, error };
}
