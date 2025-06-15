// components/PokemonCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Pokemon } from '../types/Pokemon';
import { capitalize } from '../utils/format';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = {
  pokemon: Pokemon;
};

export const PokemonCard = ({ pokemon }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PokemonDetail', { pokemon })}
      style={styles.card}
    >
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      <View style={styles.typesContainer}>
        {pokemon.types.map((type) => (
          <Text key={type} style={styles.type}>
            {capitalize(type)}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 12,
    backgroundColor: '#1C1C1E', // preto levemente acinzentado
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#333', // borda discreta
  },
  image: { width: 80, height: 80, marginBottom: 8 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#FFF', textTransform: 'capitalize' },
  typesContainer: { flexDirection: 'row', marginTop: 6 },
  type: { 
    fontSize: 12, 
    color: '#FFF', 
    backgroundColor: '#333', 
    paddingHorizontal: 6, 
    paddingVertical: 2, 
    borderRadius: 8, 
    marginHorizontal: 4 
  },
});