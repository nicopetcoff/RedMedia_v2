import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Post from "../components/Post";
import { getPosts, getUsers } from "../controller/miApp.controller";
import { useUserContext } from "../context/AuthProvider";

const { width: windowWidth } = Dimensions.get("window");

const ProfileScreen = ({ route, navigation }) => {
  const { username } = route.params;
  const { token } = useUserContext();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!token) {
          setError("No token available");
          return;
        }

        // Obtener usuarios
        const usersResponse = await getUsers(token);
        const foundUser = usersResponse.data.find(
          (u) => u.usernickname === username
        );

        if (!foundUser) {
          setError("Usuario no encontrado");
          return;
        }

        setUser(foundUser);

        // Obtener posts del usuario
        const postsResponse = await getPosts();
        const userPosts = postsResponse.data.filter(
          (post) => post.user === username
        );
        setUserPosts(userPosts);
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("Error al cargar los datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, token]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
    // Aquí puedes añadir la lógica para seguir/dejar de seguir
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1DA1F2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Usuario no encontrado</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.postContainer}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("PostDetail", {
            item,
            previousScreen: "Profile",
            username: username,
          })
        }
      >
        <Post item={item} />
      </TouchableOpacity>
    </View>
  );

  const renderProfileHeader = () => (
    <View>
      <Image
        source={{
          uri: user.coverImage || "https://via.placeholder.com/500x150",
        }}
        style={[styles.coverImage, { width: windowWidth }]}
        resizeMode="cover"
      />

      <View style={styles.profileInfoContainer}>
        <View style={styles.userSection}>
          <Image
            source={{
              uri: user.avatar || "https://via.placeholder.com/100x100",
            }}
            style={styles.avatar}
          />
          <View style={styles.userDetails}>
            <Text style={styles.name}>
              {user.nombre} {user.apellido}
            </Text>
            <Text style={styles.username}>@{user.usernickname}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{userPosts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{user.followers || 0}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{user.following || 0}</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>
      </View>

      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      <TouchableOpacity
        style={[styles.followButton, isFollowing && styles.followingButton]}
        onPress={toggleFollow}
      >
        <Text
          style={[
            styles.followButtonText,
            isFollowing && styles.followingButtonText,
          ]}
        >
          {isFollowing ? "Siguiendo" : "Seguir"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userPosts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderProfileHeader}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  coverImage: {
    height: 150,
    width: "100%",
  },
  profileInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -30,
    alignItems: "center",
  },
  userSection: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  userDetails: {
    marginTop: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  username: {
    fontSize: 14,
    color: "#657786",
    marginTop: 2,
  },
  bio: {
    fontSize: 14,
    color: "#14171A",
    marginHorizontal: 20,
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  statItem: {
    marginLeft: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#657786",
    textAlign: "center",
  },
  followButton: {
    backgroundColor: "#1DA1F2",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginVertical: 15,
    alignItems: "center",
  },
  followingButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1DA1F2",
  },
  followButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  followingButtonText: {
    color: "#1DA1F2",
  },
  postsContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postContainer: {
    flex: 1,
    maxWidth: "50%", // Asegura que cada post ocupe la mitad del ancho
    padding: 5,
  },
  postsContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "flex-start", // Cambiado de space-between a flex-start
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default ProfileScreen;
