import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image, // Importamos el componente Image de React Native
} from 'react-native';
import MyData from '../data/MyData.json'; // Importamos el archivo JSON con los datos del usuario
import { useNavigation } from '@react-navigation/native';

// Importa las imágenes por defecto
import defaultAvatar from '../assets/imgs/avatar.svg'; // Imagen por defecto para avatar
import defaultCover from '../assets/imgs/cover_image.svg'; // Imagen por defecto para portada

const MyProfileHeader = ({userData}) => {
  const { width: windowWidth } = Dimensions.get('window'); // Obtener el ancho de la ventana
  const navigation = useNavigation();

  // Verificación explícita de que los valores followers y following existen y son números válidos
  const followersCount = typeof MyData.followers === 'number' ? MyData.followers : 0;
  const followingCount = typeof MyData.following === 'number' ? MyData.following : 0;

  const handleEditPress = () => {
    navigation.navigate('EditProfile');
  };

  const handleSavedPress = () => {
    console.log('Guardados');
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      <Image
        source={MyData.coverImage ? { uri: userData.coverImage } : defaultCover}
        style={[styles.coverImage, { width: windowWidth }]}
        resizeMode="cover"
      />

      
      <View style={styles.profileInfoContainer}>
        <View style={styles.MyDataSection}>
          <View style={styles.buttonAllign}>
            
            <Image
              source={MyData.avatar ? { uri: userData.avatar } : defaultAvatar}
              style={styles.avatar}
            />
            
            <TouchableOpacity
              style={styles.edit}
              onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.MyDataDetails}>
            <View>
              {MyData.name && <Text style={styles.name}>{userData.nombre}</Text>}
              {MyData.name && <Text style={styles.name}>{userData.apellido}</Text>}
              {MyData.username && (
                <Text style={styles.MyDataname}>{userData.usernickname}</Text>
              )}
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statText}>{userData.postsCount || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>{userData.followersCount || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>{userData.followingCount || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {MyData.bio && <Text style={styles.bio}>{userData.description}</Text>}
      <View style={styles.buttonAllign}> 
        {MyData.level && <Text style={styles.level}>Nivel: {userData.level}</Text>}
        <TouchableOpacity onPress={handleSavedPress}>
          <Image source={require('../assets/imgs/guardar.png')} style={{ width: 24, height: 24, marginRight: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  coverImage: {
    height: 120, // Altura fija de la imagen de fondo
    width: '100%', // Aseguramos que ocupe todo el ancho de la pantalla
  },
  profileInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -30,
    alignItems: 'center',
  },
  MyDataSection: {
    flexDirection: 'column',
  },
  buttonAllign: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  MyDataDetails: {
    marginTop: 10,
    flexDirection: 'row',
  },
  name: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: 'bold',
  },
  MyDataname: {
    fontFamily: 'Roboto',
    fontSize: 16,
    color: 'gray',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '80%',
  },
  statItem: {
    marginRight: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  bio: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'left',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  level: {
    fontSize: 14,
    color: 'black',
    marginLeft: 20,
    marginBottom: 10,
  },
  edit: {
    backgroundColor: '#1FA1FF',
    borderRadius: 8,
    width: 124,
    height: 35,
    marginTop: 15,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'semi-bold',
    fontFamily: 'Roboto',
    textAlign: 'center',
    lineHeight: 30,
  },
  postsContainer: {
    paddingBottom: 30, // Espacio al final para evitar superposición
  },
  columnWrapper: {
    justifyContent: 'space-between', // Asegura que los dos posts se distribuyan correctamente
    marginBottom: 10, // Espacio entre filas de posts
  },
});

export default MyProfileHeader;