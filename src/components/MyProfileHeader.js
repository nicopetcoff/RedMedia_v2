import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import MyData from '../data/MyData.json';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const MyProfileHeader = ({ userData }) => {
  const { width: windowWidth } = Dimensions.get('window');
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate('EditProfile', { avatar: userData.avatar }); // Pasar el avatar como parámetro
  };


  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}
      
      <Image
        source={userData.coverImage ? { uri: userData.coverImage } : require('../assets/imgs/portadaDefault.png')}
        style={[styles.coverImage, { width: windowWidth }]}
        resizeMode="cover"
      />
      
      <View style={styles.profileInfoContainer}>
        <View style={styles.MyDataSection}>
          <View style={styles.buttonAllign}>
            <Image
              source={userData.avatar ? { uri: userData.avatar } : require('../assets/imgs/avatarDefault.jpg')}
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

      {MyData.bio && <Text style={styles.bio}>{userData.bio}</Text>}
      <View style={styles.buttonAllign}> 
        {MyData.level && <Text style={styles.level}>Nivel: {userData.level || 0}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    paddingTop: Constants.statusBarHeight,
  },
  coverImage: {
    height: 120, // Altura fija de la imagen de fondo
    width: '100%', // Aseguramos que ocupe todo el ancho de la pantalla
    resizeMode:"cover"
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
    resizeMode:"center"
  },
  MyDataDetails: {
    marginTop: 10,
    flexDirection: 'row',
  },
  name: {
    color: 'black',
    marginLeft:10,
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
    width: '85%',
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
});

export default MyProfileHeader;