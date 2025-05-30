import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { capitalize } from '../utils/format';

type Props = {
  route: RouteProp<RootStackParamList, 'PokemonDetail'>;
};

export const PokemonDetailScreen = ({ route }: Props) => {
  const { pokemon } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>

      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <Text key={type} style={styles.type}>
            {capitalize(type)}
          </Text>
        ))}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Altura: {pokemon.height / 10} m</Text>
        <Text style={styles.infoText}>Peso: {pokemon.weight / 10} kg</Text>
        {pokemon.description ? (
          <Text style={styles.description}>{pokemon.description}</Text>
        ) : (
          <Text style={styles.description}>Sem descrição disponível</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  type: {
    fontSize: 16,
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginHorizontal: 6,
    marginVertical: 4,
    color: '#444',
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#555',
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 12,
  },
});