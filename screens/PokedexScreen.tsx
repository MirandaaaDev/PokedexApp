import React from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonCard } from '../components/PokemonCard';
import { usePokedexViewModel } from './usePokedexViewModel';

export const PokedexScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    pokemons,
    searchQuery,
    setSearchQuery,
    isLoading,
    isLoadingMore,
    error,
    loadMorePokemons,
  } = usePokedexViewModel();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        placeholder="Buscar pokémon..."
        placeholderTextColor="#888"
        style={styles.input}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color="#AAA" />
              <Text style={styles.footerText}>Carregando mais Pokémons...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View style={styles.center}>
            {searchQuery ? (
              <Text style={styles.emptyText}>
                Nenhum Pokémon encontrado para '{searchQuery}'
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

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#FFF',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFF',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: '#333',
    borderWidth: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#AAA',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#AAA',
    textAlign: 'center',
    marginTop: 20,
  },
});
