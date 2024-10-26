import React, { useState } from 'react';
import { View, Text, Button, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImagePickerScreen = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso para acceder a la galería es necesario.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true, // Solo funciona en Android para Expo Go; para iOS, necesitarías un build personalizado con EAS
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(image => image.uri !== uri));
  };

  return (
    <View style={styles.container}>
      <Button title="Seleccionar Imágenes" onPress={openGallery} />

      <FlatList
        data={selectedImages}
        keyExtractor={item => item.uri}
        horizontal
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(item.uri)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button
        title="Siguiente"
        onPress={() => navigation.navigate('CreatePostScreen', { selectedImages })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 50,
    padding: 5,
  },
  removeButtonText: {
    color: '#fff',
  },
});

export default ImagePickerScreen;