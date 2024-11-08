import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, FlatList, ScrollView, PermissionsAndroid, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Asegúrate de usar la librería correcta
import * as Location from 'expo-location'; // Usar para obtener la ubicación
import Geocoder from 'react-native-geocoding';
import { publishPost } from '../controller/miApp.controller';
import { getUserData } from "../controller/miApp.controller";
import { useUserContext } from "../context/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";

Geocoder.init('AIzaSyAWjptknqVfMwmLDOiN5sBOoP5Rx2sxiSc');

const ImagePickerScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Loading current location...');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [userData, setUserData] = useState(null);

  const { token } = useUserContext();

  const fetchUserData = async () => {
    try {
      const data = await getUserData(token);
      setUserData(data.data);
    } catch (error) {
      // Manejo silencioso de errores
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchUserData();
      }
    }, [token])
  );

  useEffect(() => {
    const getCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission denied');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      Geocoder.from(latitude, longitude)
        .then(json => {
          const addressComponents = json.results[0].address_components;
          let city = '';
          let state = '';
          let country = '';

          addressComponents.forEach(component => {
            if (component.types.includes("locality")) {
              city = component.long_name;
            }
            if (component.types.includes("administrative_area_level_1")) {
              state = component.short_name;
            }
            if (component.types.includes("country")) {
              country = component.short_name;
            }
          });

          const formattedLocation = `${city}, ${state}, ${country}`;
          setLocation(formattedLocation || 'Location not found');
        })
        .catch(error => {
          console.warn(error);
          setLocation('Unknown location');
        });
    };

    getCurrentLocation();
  }, []);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    if (selectedImages.length >= 10) {
      alert('You can only add up to 10 images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10 - selectedImages.length,
    });

    if (!result.cancelled) {
      const newImages = result.assets.map(asset => ({ id: asset.uri, uri: asset.uri }));
      const totalImages = [...selectedImages, ...newImages].slice(0, 10);
      setSelectedImages(totalImages);
    }
  };

  const removeImage = (id) => {
    setSelectedImages(selectedImages.filter(image => image.id !== id));
  };

  const handlePush = async () => {
    if (!title || selectedImages.length === 0) {
      Alert.alert('Error', 'Please fill all fields and select at least one image');
      return;
    }

    const postData = {
      title,
      description,
      location: selectedLocation || location,
      images: selectedImages.map(image => image.uri),
      user: postData.nickname,
      userAvatar: postData.avatar,
    };

    const result = await publishPost(postData);

    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text> </Text>
        <TouchableOpacity onPress={handlePush} disabled={!(title && description && selectedImages.length)}>
          <Text style={styles.publishText}>Push</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: userData?.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>@{userData?.usernickname || 'Loading...'}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={openGallery} style={styles.selectButton}>
          <Text style={styles.selectButtonText}>Open Gallery</Text>
        </TouchableOpacity>
        <FlatList
          data={selectedImages}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.removeImageButton} onPress={() => removeImage(item.id)}>
                <Text style={styles.removeImageText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.textTitles}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something..."
          value={title}
          onChangeText={(text) => setTitle(text)}
          maxLength={60}
        />
        <Text style={styles.characterCount}>{180 - title.length}</Text>
        <Text style={styles.textTitles}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Write something..."
          value={description}
          onChangeText={(text) => setDescription(text)}
          maxLength={300}
          multiline
        />
        <Text style={styles.characterCount}>{400 - description.length}</Text>
        <Text style={styles.textTitles}>Location</Text>
        <Picker
          selectedValue={selectedLocation}
          style={styles.locationPicker}
          onValueChange={(itemValue) => setSelectedLocation(itemValue)}
        >
          <Picker.Item label={location} value={location} style={styles.input} />
          <Picker.Item label="Quilmes" value="Quilmes" style={styles.input}/>
        </Picker>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFF',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
  },
  publishText: {
    color: '#007AFF',
    fontSize: 16,
    marginTop: 50,
  },
  textTitles: {
    color: "#000000",
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 5,
  },
  removeImageText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  selectButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  flatListContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    marginTop: 0,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    textAlign: 'right',
    color: '#999',
    marginBottom: 10,
  },
  locationPicker: {
    width: '100%',
    height: 40,
  }
});

export default ImagePickerScreen;
