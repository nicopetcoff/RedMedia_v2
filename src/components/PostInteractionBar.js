import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const PostInteractionBar = ({ isLiked, setIsLiked }) => {
  return (
    <View style={styles.interactionBar}>
      <View style={styles.leftIcons}>
        {/* Botón de like */}
        <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={styles.iconButton}>
          <Text style={styles.icon}>{isLiked ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {/* Botón de comentar */}
        <TouchableOpacity onPress={() => console.log('Comentar presionado')} style={styles.iconButton}>
          <Text style={styles.icon}>💬</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de intereses */}
      <TouchableOpacity onPress={() => console.log('Intereses presionado')} style={styles.iconButton}>
        <Text style={styles.icon}>⭐️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center', // Asegura que los íconos estén alineados verticalmente
  },
  iconButton: {
    marginHorizontal: 10, // Agrega un espacio horizontal entre los íconos
  },
  icon: {
    fontSize: 24,
  },
});

export default PostInteractionBar;