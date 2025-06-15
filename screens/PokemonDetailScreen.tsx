import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { capitalize } from '../utils/format';
import { usePokedexDetailViewModel } from './usePokedexDetailViewModel';

type Props = {
  route: RouteProp<RootStackParamList, 'PokemonDetail'>;
};

export const PokemonDetailScreen = ({ route }: Props) => {
  const { pokemon: initialPokemon } = route.params;
  const { pokemon, loading, error } = usePokedexDetailViewModel(initialPokemon);

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      psychic: '#F85888',
      ice: '#98D8D8',
      dragon: '#7038F8',
      dark: '#705848',
      fairy: '#EE99AC',
      normal: '#A8A878',
      fighting: '#C03028',
      flying: '#A890F0',
      poison: '#A040A0',
      ground: '#E0C068',
      rock: '#B8A038',
      bug: '#A8B820',
      ghost: '#705898',
      steel: '#B8B8D0',
    };
    return colors[type.toLowerCase()] || '#999';
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF0000" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <Text key={type} style={[styles.type, { backgroundColor: getTypeColor(type) }]}>
            {capitalize(type)}
          </Text>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Altura: {pokemon.height / 10} m</Text>
        <Text style={styles.infoText}>Peso: {pokemon.weight / 10} kg</Text>
        <Text style={styles.description}>
          {pokemon.description ?? 'Sem descrição disponível'}
        </Text>
      </View>
    </ScrollView>
  );
};

// seus styles aqui (copie os mesmos que já tem)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
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
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#333',
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 16,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  type: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    margin: 6,
    color: '#FFF',
    fontWeight: '600',
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#DDD',
  },
  description: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#AAA',
    marginTop: 12,
  },
});
