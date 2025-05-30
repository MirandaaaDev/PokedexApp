import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPokemons, getPokemonDetails } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

const PAGE_SIZE = 30;

export const PokedexScreen = () => {
  const insets = useSafeAreaInsets(); // ← Hook para área segura

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (newOffset = 0, append = false) => {
    try {
      const list = await getPokemons(PAGE_SIZE, newOffset);
      const details = await Promise.all(list.map((p) => getPokemonDetails(p.url)));

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

  const filtered = pokemons.filter((p) =>
    p.name.includes(search.toLowerCase())
  );

  const renderFooter = () =>
    isLoadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#888" />
        <Text>Carregando mais Pokémons...</Text>
      </View>
    ) : null;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={{ marginTop: 10 }}>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        style={styles.input}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            {search ? (
              <Text style={styles.emptyText}>
                Nenhum Pokémon encontrado para '{search}'
              </Text>
            ) : (
              <Text style={styles.emptyText}>
                Nenhum Pokémon para exibir no momento.
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // Removido o paddingTop fixo
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 12 },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
