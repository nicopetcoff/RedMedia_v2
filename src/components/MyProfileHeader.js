import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import MyData from "../data/MyData.json";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

const MyProfileHeader = ({ userData }) => {
  const { width: windowWidth } = Dimensions.get("window");
  const navigation = useNavigation();

  const handleEditPress = () => {
    navigation.navigate("EditProfile", { avatar: userData.avatar }); // Pasar el avatar como parámetro
  };

  return (
    <View style={styles.container}>
      {/* Imagen de fondo */}

      <Image
        source={
          userData.coverImage
            ? { uri: userData.coverImage }
            : require("../assets/imgs/portadaDefault.png")
        }
        style={[styles.coverImage, { width: windowWidth }]}
        resizeMode="cover"
      />

      <View style={styles.profileInfoContainer}>
        <View style={styles.MyDataSection}>
          <View style={styles.buttonAllign}>
            <Image
              source={
                userData.avatar
                  ? { uri: userData.avatar }
                  : require("../assets/imgs/avatarDefault.jpg")
              }
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.edit} onPress={handleEditPress}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.MyDataDetails}>
            <View>
              {MyData.name && (
                <Text style={styles.name}>
                  {userData.nombre} {userData.apellido}
                </Text>
              )}
              {MyData.username && (
                <Text style={styles.MyDataname}>@{userData.usernickname}</Text>
              )}
              <Text style={styles.bio}>Bio: {userData.bio || "No bio yet"}</Text>
            </View>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statText}>{userData.postsCount || 0}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>
                  {userData.followersCount || 0}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>
                  {userData.followingCount || 0}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {MyData.bio && <Text style={styles.bio}>{userData.bio}</Text>}
      <View style={styles.buttonAllign}>
        {MyData.level && (
          <Text style={styles.level}>Nivel: {userData.level || 0}</Text>
        )}
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
    height: 120,
    width: "100%",
    resizeMode: "cover",
  },
  profileInfoContainer: {
    flexDirection: "row",
    paddingHorizontal: 10, // Reducido el padding horizontal aún más
    marginTop: -20, // Ajustado para subir el contenido
    alignItems: "center",
  },
  MyDataSection: {
    flexDirection: "column",
  },
  buttonAllign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 90, // Reducido de 90 a 80
    height: 90, // Reducido de 90 a 80
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    resizeMode: "center",
  },
  MyDataDetails: {
    marginTop: 5, // Reducido el margen superior
    flexDirection: "row",
  },
  name: {
    color: "black",
    fontFamily: "Roboto",
    fontSize: 15, // Reducido de 16 a 15
    fontWeight: "bold",
  },
  MyDataname: {
    fontFamily: "Roboto",
    fontSize: 14, // Manteniendo 12
    color: "gray",
    marginTop: 1, // Reducido para ahorrar espacio
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "70%", // Reducido para dar más espacio al nombre y nickname
  },
  statItem: {
    marginRight: 10, // Reducido aún más el margen entre estadísticas
  },
  statText: {
    fontSize: 11, // Manteniendo el tamaño
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  statLabel: {
    fontSize: 11, // Manteniendo el tamaño
    color: "gray",
    textAlign: "center",
  },
  bio: {
    fontSize: 14, // Reducido para ahorrar espacio
    color: "black",
    textAlign: "left",
    marginTop: 5 ,
  },
  level: {
    fontSize: 14, // Reducido para ahorrar espacio
    color: "black",
    marginLeft: 10,
    marginBottom: 10,
  },
  edit: {
    backgroundColor: "#1FA1FF",
    borderRadius: 8,
    width: 100, // Reducido de 100 a 90
    height: 28, // Reducido para ajustarse mejor
    marginTop: 10,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "semi-bold",
    fontFamily: "Roboto",
    textAlign: "center",
    lineHeight: 26, // Ajustado para centrarse verticalmente
    fontSize: 14, // Reducido el tamaño del texto
  },
});

export default MyProfileHeader;
