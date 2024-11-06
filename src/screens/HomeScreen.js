import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Post from '../components/Post';
import { getPosts, getUserData } from "../controller/miApp.controller";
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { useUserContext } from '../context/AuthProvider';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // Estado para almacenar datos de usuario
  const navigation = useNavigation();
  const { token } = useUserContext(); // Obtener el token de usuario autenticado

  // Obtener datos del usuario al cargar la pantalla
  const fetchUserData = async () => {
    try {
      const data = await getUserData(token); // Obtener datos del usuario usando el token
      setUserData(data.data);
      
    } catch (error) {
      
    }
  };

  // Obtener posts desde el backend
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data.data);
    } catch (error) {
      console.error("Error al cargar los posts", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData(); // Cargar los datos de usuario al inicio
    fetchPosts(); // Cargar los posts al inicio

    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../assets/imgs/logo.png')} style={styles.logo} />
        <Text style={styles.header}>REDMEDIA</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => {
          const isOwnPost = userData?.usernickname === item.user;
          return (
            <Post
              item={item}
              isOwnPost={isOwnPost}
              onPress={() => navigation.navigate('PostDetail', { item, userData })}
            />
          );
        }}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  row: {
    justifyContent: 'space-between',
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;