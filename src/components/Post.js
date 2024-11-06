import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const Post = ({ item, isOwnPost, onPress }) => {
  const imageUri = Array.isArray(item.image) ? item.image[0] : item.image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
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
    marginHorizontal: 4,
    width: Dimensions.get('window').width / 2 - 18,
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
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'flex-start',
    width: '100%',
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