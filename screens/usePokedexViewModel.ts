import { useEffect, useState } from 'react';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';

const PAGE_SIZE = 30;

export function usePokedexViewModel() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (newOffset = 0, append = false) => {
    try {
      const list = await getPokemons(PAGE_SIZE, newOffset);
      const details = await Promise.all(list.map(p => getPokemonDetails(p.url)));

      if (append) {
        setPokemons(prev => [...prev, ...details]);
      } else {
        setPokemons(details);
      }

      if (list.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      setError('Falha ao carregar Pokémons. Verifique sua conexão.');
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setIsLoading(true);
      setError(null);
      await fetchPokemons(0, false);
      setIsLoading(false);
    };
    loadInitial();
  }, []);

  const loadMorePokemons = async () => {
    if (isLoadingMore || isLoading || !hasMore) return;

    setIsLoadingMore(true);
    const newOffset = offset + PAGE_SIZE;
    await fetchPokemons(newOffset, true);
    setOffset(newOffset);
    setIsLoadingMore(false);
  };

  // Retorna a lista filtrada conforme a busca
  const filteredPokemons = pokemons.filter(p =>
    p.name.includes(searchQuery.toLowerCase())
  );

  return {
    pokemons: filteredPokemons,
    searchQuery,
    setSearchQuery,
    isLoading,
    isLoadingMore,
    error,
    loadMorePokemons,
  };
}
