import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';
import MyProfileHeader from '../components/MyProfileHeader';
import Post from '../components/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from '../redux/authSlice';
import { getPosts } from '../controller/miApp.controller';
import MyData from '../data/MyData.json'; // Importa el JSON del usuario

const LoggedInUserProfileScreen = () => {
  const dispatch = useDispatch();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      // Filtra los posts que corresponden al usuario del JSON
      const filteredPosts = data.data.filter(post => post.user === MyData.username);
      setUserPosts(filteredPosts);
    } catch (error) {
      console.error("Error loading posts", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserPosts();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(signOut());
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        renderItem={({ item }) => <Post item={item} />}
        keyExtractor={item => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <>
            <MyProfileHeader userData={MyData} /> 
            <View style={styles.logoutButtonContainer}>
              <Button title="Cerrar Sesión" onPress={handleLogout} color="#FF3B30" />
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  logoutButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoggedInUserProfileScreen;