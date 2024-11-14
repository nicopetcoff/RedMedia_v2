import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  Alert,
  Switch
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";
import { publishPost, getUserData } from "../controller/miApp.controller";
import { useUserContext } from "../context/AuthProvider";
import { useFocusEffect } from "@react-navigation/native";

Geocoder.init("AIzaSyAWjptknqVfMwmLDOiN5sBOoP5Rx2sxiSc");

const ImagePickerScreen = ({ navigation }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Loading current location...");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const deleteLocation = () => setSelectedLocation("");

  const { token } = useUserContext();

  const fetchUserData = async () => {
    try {
      const response = await getUserData(token);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (token) {
        fetchUserData();
      }
    }, [token])
  );

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocation("Permission denied");
          return;
        }

        const { coords } = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = coords;

        const response = await Geocoder.from(latitude, longitude);
        const addressComponents = response.results[0].address_components;

        let city = "";
        let state = "";
        let country = "";

        addressComponents.forEach((component) => {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
          }
          if (component.types.includes("country")) {
            country = component.short_name;
          }
        });

        const formattedLocation = `${city}, ${state}, ${country}`;
        setLocation(formattedLocation || "Location not found");
        setSelectedLocation(formattedLocation || "Location not found");
      } catch (error) {
        console.error("Error getting location:", error);
        setLocation("Unknown location");
      }
    };

    getCurrentLocation();
  }, []);

  const openGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access gallery is required!"
        );
        return;
      }

      if (selectedImages.length >= 10) {
        Alert.alert("Limit Reached", "You can only add up to 10 images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 10 - selectedImages.length,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset) => ({
          id: asset.uri,
          uri: asset.uri,
        }));
        const totalImages = [...selectedImages, ...newImages].slice(0, 10);
        setSelectedImages(totalImages);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (id) => {
    setSelectedImages(selectedImages.filter((image) => image.id !== id));
  };

  const handlePush = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }

    if (selectedImages.length === 0) {
      Alert.alert("Error", "Please select at least one image");
      return;
    }

    if (!userData) {
      Alert.alert("Error", "User data not available");
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title: title.trim(),
        description: description.trim(),
        location: selectedLocation,
        images: selectedImages.map((image) => image.uri),
        user: userData.usernickname,
        userAvatar: userData.avatar,
      };

      // Log del objeto postData completo

      const result = await publishPost(postData, token);

      // Log del resultado

      if (result.success) {
        Alert.alert("Success", "Post published successfully", [
          {
            text: "OK",
            onPress: () => {
              setTitle("");
              setDescription("");
              setSelectedImages([]);
              setSelectedLocation("");
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert("Error", result.message || "Failed to publish post");
      }
    } catch (error) {
      console.error("Error en handlePush:", error);
      Alert.alert("Error", "Failed to publish post");
    } finally {
      setLoading(false);
    }
  };

  const isPublishDisabled =
    !title.trim() || selectedImages.length === 0 || loading;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text> </Text>
        <TouchableOpacity onPress={handlePush} disabled={isPublishDisabled}>
          <Text
            style={[
              styles.publishText,
              isPublishDisabled && styles.publishTextDisabled,
            ]}
          >
            {loading ? "Publishing..." : "Push"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              userData?.avatar ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>
          @{userData?.usernickname || "Loading..."}
        </Text>
      </View>

      <TouchableOpacity
        onPress={openGallery}
        style={[
          styles.selectButton,
          selectedImages.length >= 10 && styles.selectButtonDisabled,
        ]}
        disabled={selectedImages.length >= 10}
      >
        <Text style={styles.selectButtonText}>
          {selectedImages.length >= 10
            ? "Maximum images selected"
            : "Open Gallery"}
        </Text>
      </TouchableOpacity>

      {selectedImages.length > 0 && (
        <FlatList
          data={selectedImages}
          keyExtractor={(item) => item.id}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeImage(item.id)}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.textTitles}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Write something..."
          value={title}
          onChangeText={setTitle}
          maxLength={60}
          editable={!loading}
        />
        <Text style={styles.characterCount}>{60 - title.length}</Text>

        <Text style={styles.textTitles}>Description</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Write something..."
          value={description}
          onChangeText={setDescription}
          maxLength={300}
          multiline
          editable={!loading}
        />
        <Text style={styles.characterCount}>{300 - description.length}</Text>

        <Text style={styles.textTitles}>Location</Text>
        <View style={styles.switchContainer}>
        <Text>Use Actual Location</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            deleteLocation();
            toggleSwitch();
          }}
          value={isEnabled}
        />
        </View>
        {isEnabled ? (
        <Text style={styles.locationText}>
          {location}
        </Text>
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          onChangeText={setSelectedLocation}
          editable={!loading}
        />
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#FFF",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  publishText: {
    color: "#007AFF",
    fontSize: 16,
    marginTop: 50,
  },
  publishTextDisabled: {
    color: "#999",
  },
  textTitles: {
    color: "#000",
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 18,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
  },
  selectedImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  selectButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  selectButtonDisabled: {
    backgroundColor: "#999",
  },
  selectButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 16,
  },
  flatListContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    textAlign: "right",
    color: "#999",
    marginBottom: 15,
    fontSize: 12,
  },
  locationPicker: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  }, 
});

export default ImagePickerScreen;
