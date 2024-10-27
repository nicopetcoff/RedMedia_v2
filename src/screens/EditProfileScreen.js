// EditProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/authSlice';

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(signOut());
  };

  return (
    <View style={styles.container}>
      {/* Header con icono de cerrar */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>My Account</Text>

      {/* Imagen de perfil y botón de cambio de foto */}
      <Image
        source={{ uri: 'https://randomuser.me/api/portraits/men/10.jpg' }}
        style={styles.profileImage}
      />
      <TouchableOpacity>
        <Text style={styles.changePhotoText}>Change profile photo</Text>
      </TouchableOpacity>

      {/* Formulario de edición de perfil */}
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

      {/* Configuración de apariencia y botones de cierre de sesión y eliminación de cuenta */}
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