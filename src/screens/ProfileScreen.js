import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import usersData from '../data/users.json'; // Importamos el archivo JSON con los usuarios
import Post from '../components/Post'; // Importamos el componente Post
import { getPosts } from '../controller/miApp.controller'; // Importamos la función getPosts

const { width: windowWidth } = Dimensions.get('window'); // Obtener el ancho de la ventana

const ProfileScreen = ({ route }) => {
  const { username } = route.params || {}; // Recibimos el 'username' desde la navegación

  const [user, setUser] = useState(null); // Estado para almacenar el usuario encontrado
  const [userPosts, setUserPosts] = useState([]); // Estado para almacenar los posts del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar el indicador de carga
  const [isFollowing, setIsFollowing] = useState(false);

  // Buscar el usuario por su username
  useEffect(() => {
    const foundUser = usersData.find((u) => u.username === username);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [username]);

  // Obtener los posts del backend y filtrar por usuario
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Mostrar el spinner mientras cargan los posts
      try {
        const data = await getPosts(); // Llamada a la función para obtener los posts del backend
        const filteredPosts = data.data.filter(post => post.user === username); // Filtrar los posts por el usuario
        setUserPosts(filteredPosts);
      } catch (error) {
        console.error("Error al cargar los posts", error);
      }
      setLoading(false); // Ocultar el spinner cuando termine la carga
    };

    if (user) {
      fetchPosts(); // Cargar los posts solo si el usuario es válido
    }
  }, [user, username]);

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Verificación explícita de que los valores followers y following existen y son números válidos
  const followersCount = typeof user.followers === 'number' ? user.followers : 0;
  const followingCount = typeof user.following === 'number' ? user.following : 0;

  // Renderizado del encabezado del perfil
  const renderProfileHeader = () => (
    <View>
      {/* Imagen de fondo */}
      {user.coverImage && (
        <Image 
          source={{ uri: user.coverImage }} 
          style={[styles.coverImage, { width: windowWidth }]} // Ajustamos el ancho de la imagen al de la pantalla
          resizeMode="cover" // Aseguramos que la imagen cubra todo el área del cover
        />
      )}

      {/* Información del perfil */}
      <View style={styles.profileInfoContainer}>
        <View style={styles.userSection}>
          {/* Avatar */}
          {user.avatar && <Image source={{ uri: user.avatar }} style={styles.avatar} />}
          {/* Nombre y username debajo del avatar */}
          <View style={styles.userDetails}>
            {user.name && <Text style={styles.name}>{user.name}</Text>}
            {user.username && <Text style={styles.username}>@{user.username}</Text>}
          </View>
        </View>

        {/* Estadísticas a la derecha */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{userPosts.length || 0}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{followersCount}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statText}>{followingCount}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
      {user.level && <Text style={styles.level}>Nivel: {user.level}</Text>}

      {/* Botón de seguir */}
      <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
        <Text style={styles.followButtonText}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={userPosts} // Usamos los posts filtrados del usuario
      renderItem={({ item }) => <Post item={item} />} // Usa el componente Post
      keyExtractor={(item) => item._id.toString()}
      numColumns={2} // Mostramos 2 columnas
      columnWrapperStyle={styles.columnWrapper} // Estilo para las columnas
      ListHeaderComponent={renderProfileHeader} // Renderizamos el perfil como encabezado
      contentContainerStyle={styles.postsContainer} // Estilo para el contenedor de los posts
      showsVerticalScrollIndicator={false} // Ocultamos el indicador de scroll vertical
    />
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  coverImage: {
    height: 120,
    width: '100%',
  },
  profileInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: -30,
    alignItems: 'center',
  },
  userSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userDetails: {
    marginTop: 10,
  },
  name: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  statItem: {
    marginLeft: 20,
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
  followButton: {
    backgroundColor: '#439CEE',
    borderRadius: 8,
    paddingHorizontal: 30,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  postsContainer: {
    paddingBottom: 30, // Espacio al final para evitar superposición
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;