import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { useToggleContext } from '../context/AuthProvider';

const EditProfileScreen = ({ navigation }) => {
  const { signOut } = useToggleContext();
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(avatar); // Inicializa el perfil con el avatar recibido
  const [message, setMessage] = useState('');

  useEffect(() => {
    setProfileImage(avatar); // Asegúrate de que profileImage tenga el valor inicial del avatar
  }, [avatar]);

  const handleLogout = async () => {
    signOut();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Es necesario dar permisos para acceder a la galería.');
      return;
    }

    const action = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!action.canceled) {
      setProfileImage(action.assets[0].uri);
      await handleImageUpdate(action.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.granted === false) {
      alert('Es necesario dar permisos para acceder a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      await handleImageUpdate(result.assets[0].uri);
    }
  };

  const handleImageUpdate = async (imageUri) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      try {
        const response = await updateProfileImage(imageUri, token);
        setMessage('Foto de perfil actualizada correctamente.');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        setMessage('Error al actualizar la foto de perfil.');
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      alert('No se pudo obtener el token de usuario.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Account</Text>

      <Image
        source={profileImage ? { uri: profileImage } : { uri: 'https://randomuser.me/api/portraits/men/18.jpg' }}
        style={styles.profileImage}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.changePhotoText}>Change profile photo from gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto}>
          <Text style={styles.changePhotoText}>Take a photo</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>PROFILE</Text>
        <TextInput
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
        />
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>SETTINGS</Text>
        <View style={styles.appearanceRow}>
          <Text style={styles.appearanceLabel}>Appearance:</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.lightText}>Light</Text>
            <Switch
              value={isDarkMode}
              onValueChange={(value) => setIsDarkMode(value)}
            />
            <Text style={styles.darkText}>Dark</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  closeButton: {
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: 20,
    alignSelf: 'center',
  },
  changePhotoText: {
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  message: {
    color: 'green',
    textAlign: 'center',
    marginVertical: 10,
  },
  formSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'gray',
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  settingsSection: {
    marginTop: 30,
  },
  appearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  appearanceLabel: {
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightText: {
    fontSize: 16,
    marginRight: 10,
  },
  darkText: {
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    marginVertical: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
  },
  deleteButton: {
    marginVertical: 10,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default EditProfileScreen;