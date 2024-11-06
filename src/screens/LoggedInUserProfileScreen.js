import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import MyProfileHeader from "../components/MyProfileHeader";
import Post from "../components/Post";
import { getPosts, getUserData } from "../controller/miApp.controller";
import { useUserContext } from "../context/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";

const LoggedInUserProfileScreen = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const { token } = useUserContext();

  const fetchUserData = async () => {
    try {
      const data = await getUserData(token);
      console.log("Datos de usuario obtenidos:", data.data); // Agrega log para revisar los datos del usuario
      setUserData(data.data);
    } catch (error) {
      // Manejo silencioso de errores
    }
  };

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      const filteredPosts = data.data.filter(
        (post) => post.user === userData?.usernickname
      );
      setUserPosts(filteredPosts);
    } catch (error) {
      // Manejo silencioso de errores
    }
    setLoading(false);
  };

  // Ejecuta fetchUserData y fetchUserPosts cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchUserData();
      }
    }, [token])
  );

  useEffect(() => {
    if (userData) {
      fetchUserPosts();
    }
  }, [userData]);

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
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<MyProfileHeader userData={userData} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  row: {
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LoggedInUserProfileScreen;