import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import Post from '../components/Post';
import { getPosts, getAds } from '../controller/miApp.controller';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsResponse, adsResponse] = await Promise.all([
        getPosts(),
        getAds()
      ]);

      setPosts(postsResponse.data);
      setAds(adsResponse.data);
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }, [navigation]);

  const renderAdOrPost = ({ item, index }) => {
    // Si el índice es divisible por 4 (cada 3 posts), mostrar un anuncio
    if ((index + 1) % 4 === 0) {
      // Obtener un anuncio aleatorio
      const ad = ads[Math.floor(Math.random() * ads.length)];
      if (ad) {
        return (
          <TouchableOpacity 
            style={styles.adContainer}
            onPress={() => Linking.openURL(ad.Url)}
          >
            <Image
              source={{ uri: ad.imagePath[0].landscape }}
              style={styles.adImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        );
      }
    }

    // Si no es posición de anuncio, mostrar post normal
    return (
      <View style={styles.postContainer}>
        <Post item={item} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image 
          source={require('../assets/imgs/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.header}>REDMEDIA</Text>
      </View>
      
      <FlatList
        data={posts}
        renderItem={renderAdOrPost}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
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
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Roboto',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  postContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
  },
  adContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
    height: 200, // Ajusta según necesites
    borderRadius: 10,
    overflow: 'hidden',
  },
  adImage: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;