import React, { useState } from 'react';
import {
 View,
 Text,
 StyleSheet,
 Dimensions,
 TouchableOpacity,
 Image,
 Alert,
 ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { updateUserProfile } from '../controller/miApp.controller';
import { useUserContext } from '../context/AuthProvider';

const { width: windowWidth } = Dimensions.get('window');

const MyProfileHeader = ({ userData }) => {
 const navigation = useNavigation();
 const { token } = useUserContext();
 const [loading, setLoading] = useState(false);

 const handleEditPress = () => {
   navigation.navigate('EditProfile', { avatar: userData?.avatar });
 };

 const formatNumber = (num) => {
   if (!num) return '0';
   return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 };

 const handleUpdateCover = async () => {
   try {
     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

     if (!permissionResult.granted) {
       Alert.alert('Error', 'Permission to access gallery is required.');
       return;
     }

     const result = await ImagePicker.launchImageLibraryAsync({
       mediaTypes: ImagePicker.MediaTypeOptions.Images,
       allowsEditing: true,
       aspect: [16, 9],
       quality: 1,
     });

     if (!result.canceled) {
       setLoading(true);
       try {
         const response = await updateUserProfile({
           coverImage: result.assets[0].uri
         }, token);

         if (response.data && response.data.coverImage) {
           Alert.alert('Success', 'Cover image updated successfully');
           // Aquí podrías actualizar el estado global del usuario si es necesario
         }
       } catch (error) {
         Alert.alert('Error', 'Failed to update cover image');
         console.error(error);
       } finally {
         setLoading(false);
       }
     }
   } catch (error) {
     Alert.alert('Error', 'Error selecting image');
     console.error(error);
   }
 };

 return (
   <View style={styles.container}>
     <TouchableOpacity 
       onPress={handleUpdateCover} 
       style={styles.coverContainer}
       disabled={loading}
     >
       <Image
         source={
           userData?.coverImage
             ? { uri: userData.coverImage }
             : require('../assets/imgs/portadaDefault.png')
         }
         style={styles.coverImage}
       />
       {loading ? (
         <View style={styles.loadingContainer}>
           <ActivityIndicator color="#fff" />
         </View>
       ) : (
         <View style={styles.changeCoverButton}>
           <Text style={styles.changeCoverText}>Change Cover</Text>
         </View>
       )}
     </TouchableOpacity>

     <View style={styles.avatarContainer}>
       <Image
         source={
           userData?.avatar
             ? { uri: userData.avatar }
             : require('../assets/imgs/avatarDefault.jpg')
         }
         style={styles.avatar}
       />
     </View>

     <View style={styles.editButtonContainer}>
       <TouchableOpacity
         style={styles.editButton}
         onPress={handleEditPress}
         disabled={loading}
       >
         <Text style={styles.editButtonText}>Edit</Text>
       </TouchableOpacity>
     </View>

     <View style={styles.mainContent}>
       <View style={styles.userInfo}>
         <Text style={styles.name}>{userData?.nombre} {userData?.apellido}</Text>
         <Text style={styles.username}>@{userData?.usernickname}</Text>
         <Text style={styles.bio}>
           {userData?.bio ? userData.bio : "No bio yet"}
         </Text>
       </View>

       <View style={styles.statsRow}>
         <View style={styles.statItem}>
           <Text style={styles.statNumber}>{formatNumber(userData?.postsCount)}</Text>
           <Text style={styles.statLabel}>Posts</Text>
         </View>
         <View style={styles.statItem}>
           <Text style={styles.statNumber}>{formatNumber(userData?.followersCount)}</Text>
           <Text style={styles.statLabel}>Followers</Text>
         </View>
         <View style={styles.statItem}>
           <Text style={styles.statNumber}>{formatNumber(userData?.followingCount)}</Text>
           <Text style={styles.statLabel}>Following</Text>
         </View>
       </View>
     </View>

     <View style={styles.levelContainer}>
       <Text style={styles.level}>Level: {userData?.level || 0}</Text>
     </View>
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: '#fff',
 },
 coverContainer: {
   position: 'relative',
 },
 coverImage: {
   width: windowWidth,
   height: 150,
   resizeMode: 'cover',
 },
 changeCoverButton: {
   position: 'absolute',
   bottom: 10,
   right: 10,
   backgroundColor: 'rgba(0, 0, 0, 0.6)',
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 15,
 },
 changeCoverText: {
   color: '#fff',
   fontSize: 12,
   fontWeight: '500',
 },
 loadingContainer: {
   position: 'absolute',
   bottom: 10,
   right: 10,
   backgroundColor: 'rgba(0, 0, 0, 0.6)',
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 15,
 },
 avatarContainer: {
   position: 'absolute',
   top: 100,
   left: 15,
 },
 avatar: {
   width: 85,
   height: 85,
   borderRadius: 42.5,
   borderWidth: 3,
   borderColor: '#fff',
 },
 editButtonContainer: {
   position: 'absolute',
   top: 160,
   right: 15,
 },
 editButton: {
   backgroundColor: '#1DA1F2',
   paddingHorizontal: 20,
   paddingVertical: 6,
   borderRadius: 20,
   width: 100,
   height: 35,
   alignItems: 'center',
 },
 editButtonText: {
   color: '#fff',
   fontWeight: '500',
   fontSize: 14,
 },
 mainContent: {
   marginTop: 40,
   paddingHorizontal: 15,
 },
 userInfo: {
   flex: 1,
 },
 name: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#000',
   fontFamily: 'Roboto',
 },
 username: {
   fontSize: 14,
   color: '#657786',
   marginTop: 1,
   marginBottom: 4,
   fontFamily: 'Roboto',
 },
 bio: {
   fontSize: 14,
   color: '#000',
   fontFamily: 'Roboto',
   marginBottom: 4,
 },
 statsRow: {
   flexDirection: 'row',
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginTop: -45,
 },
 statItem: {
   alignItems: 'center',
   marginLeft: 20,
 },
 statNumber: {
   fontSize: 15,
   fontWeight: 'bold',
   color: '#000',
   marginBottom: 1,
   fontFamily: 'Roboto',
 },
 statLabel: {
   color: '#657786',
   fontSize: 12,
   fontFamily: 'Roboto',
 },
 levelContainer: {
   paddingHorizontal: 15,
   marginTop: 8,
   marginBottom: 10,
 },
 level: {
   fontSize: 14,
   color: '#14171A',
   fontFamily: 'Roboto',
 },
});

export default MyProfileHeader;