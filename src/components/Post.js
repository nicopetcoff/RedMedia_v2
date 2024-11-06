import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Post = ({ item }) => {
  const navigation = useNavigation();
  const imageUri = Array.isArray(item.image) ? item.image[0] : item.image;

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PostDetail', { item })}>
      <Image source={{ uri: imageUri }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.user}>@{item.user}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    width: Dimensions.get('window').width / 2 - 15, // Fijar ancho para alineación uniforme
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  infoContainer: {
    paddingHorizontal: 8, // Agregar padding para separación
    paddingVertical: 5,
    alignItems: 'flex-start', // Mantener el texto alineado a la izquierda
    width: '100%', // Asegura que ocupe el ancho completo del contenedor
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  user: {
    fontSize: 12,
    color: '#555',
  },
});

export default Post;