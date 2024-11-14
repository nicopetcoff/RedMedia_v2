import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,  // Añade esta importación
  Platform     // Añade esta importación
} from 'react-native';
import { useUserContext, useToggleContext } from '../context/AuthProvider';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile, getUserData } from '../controller/miApp.controller';

const EditProfileScreen = ({ navigation, route }) => {
  const { avatar } = route.params;
  const { token } = useUserContext();
  const { signOut } = useToggleContext();

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(avatar);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getUserData(token);
      
      setNickname(userData.data.usernickname || '');
      setName(userData.data.nombre || '');
      setDescription(userData.data.bio || '');
      setProfileImage(userData.data.avatar || avatar);
    } catch (error) {
      
      showMessage('Error loading user data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, logout", onPress: () => signOut() }
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (loading) return;

    try {
      setLoading(true);
      
      
      const updateData = {
        nombre: name,
        bio: description
      };

      
      const result = await updateUserProfile(updateData, token);
      
      
      showMessage('Profile updated successfully');
    } catch (error) {
      
      showMessage('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpdate = async (imageUri) => {
    try {
      setLoading(true);
      
      
      // Asegúrate de que la imagen exista
      if (!imageUri) {
        throw new Error('No image URI provided');
      }
  
      const result = await updateUserProfile({
        avatar: imageUri
      }, token);
  
      
      
      if (result?.data?.avatar) {
        setProfileImage(result.data.avatar);
        showMessage('Profile picture updated successfully');
      } else {
        throw new Error('No avatar URL in response');
      }
    } catch (error) {
      console.error('Error updating image:', error);
      showMessage('Error updating profile picture: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Error', 'Permission to access gallery is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        
        await handleImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      showMessage('Error selecting image: ' + error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!cameraPermission.granted) {
        Alert.alert('Error', 'Permission to access camera is required.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        
        await handleImageUpdate(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      showMessage('Error taking photo: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.closeButton}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Account</Text>

      <View style={styles.profileImageContainer}>
        <Image
          source={
            profileImage 
              ? { uri: profileImage } 
              : require("../assets/imgs/avatarDefault.jpg")
          }
          style={styles.profileImage}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={pickImage} disabled={loading}>
          <Text style={[styles.changePhotoText, loading && styles.disabledText]}>
            Change photo from gallery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} disabled={loading}>
          <Text style={[styles.changePhotoText, loading && styles.disabledText]}>
            Take a photo
          </Text>
        </TouchableOpacity>
      </View>

      {message ? (
        <Text style={[styles.message, message.includes('Error') && styles.errorMessage]}>
          {message}
        </Text>
      ) : null}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>PROFILE</Text>
        <TextInput
          placeholder="Nickname"
          value={nickname}
          onChangeText={setNickname}
          style={[styles.input, { color: '#999' }]}
          editable={false}
        />
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={!loading}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
          editable={!loading}
        />
        <TextInput
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          editable={!loading}
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
              onValueChange={setIsDarkMode}
              disabled={loading}
            />
            <Text style={styles.darkText}>Dark</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleUpdateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save changes</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={[styles.logoutText, loading && styles.disabledText]}>
            Logout
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton}
          disabled={loading}
          onPress={() => Alert.alert(
            "Delete Account",
            "This action cannot be undone. Are you sure?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive" }
            ]
          )}
        >
          <Text style={[styles.deleteText, loading && styles.disabledText]}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ontainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Añade esto
  },
  closeButton: {
    alignSelf: 'flex-start',
    padding: 15,
    marginTop: 10, // Añade margen superior
    zIndex: 1, // Asegura que el botón esté por encima
  },
  closeButtonText: {
    fontSize: 28,
    color: '#000',
    fontWeight: '300', // Hace el símbolo × más delgado
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 5, // Reduce el margen superior
    marginBottom: 20,
  },
  profileImageContainer: {
    alignSelf: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#007AFF',
    fontSize: 16,
    marginVertical: 5,
    padding: 5,
  },
  disabledText: {
    opacity: 0.5,
  },
  message: {
    textAlign: 'center',
    padding: 10,
    marginHorizontal: 20,
    marginVertical: 10,
    color: '#4CAF50',
    borderRadius: 5,
  },
  errorMessage: {
    color: '#FF3B30',
  },
  formSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  settingsSection: {
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 50,
  },
  appearanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lightText: {
    marginRight: 10,
    fontSize: 16,
  },
  darkText: {
    marginLeft: 10,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 15,
    marginTop: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButton: {
    padding: 15,
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
  appearanceLabel: {
    fontSize: 16,
  }
});

export default EditProfileScreen;