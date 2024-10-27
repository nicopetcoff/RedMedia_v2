import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import usersData from '../data/users.json'; // Local JSON data for users
import Post from '../components/Post'; // Importing custom Post component
import { getPosts } from '../controller/miApp.controller'; // Backend API call for posts

const { width: windowWidth } = Dimensions.get('window'); // Get device width

const ProfileScreen = ({ route }) => {
  const { username } = route.params || {};

  const [user, setUser] = useState(null); 
  const [userPosts, setUserPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const foundUser = usersData.find((u) => u.username === username);
    if (foundUser) {
      setUser(foundUser);
    }
  }, [username]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getPosts();
        const filteredPosts = data.data.filter(post => post.user === username);
        setUserPosts(filteredPosts);
      } catch (error) {
        console.error("Error loading posts", error);
      }
      setLoading(false);
    };

    if (user) {
      fetchPosts();
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

  const followersCount = typeof user.followers === 'number' ? user.followers : 0;
  const followingCount = typeof user.following === 'number' ? user.following : 0;

  const renderProfileHeader = () => (
    <View>
      {user.coverImage && (
        <Image 
          source={{ uri: user.coverImage }} 
          style={[styles.coverImage, { width: windowWidth }]}
          resizeMode="cover"
        />
      )}
      <View style={styles.profileInfoContainer}>
        <View style={styles.userSection}>
          {user.avatar && <Image source={{ uri: user.avatar }} style={styles.avatar} />}
          <View style={styles.userDetails}>
            {user.name && <Text style={styles.name}>{user.name}</Text>}
            {user.username && <Text style={styles.username}>@{user.username}</Text>}
          </View>
        </View>
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

      <TouchableOpacity style={styles.followButton} onPress={toggleFollow}>
        <Text style={styles.followButtonText}>
          {isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={userPosts}
      renderItem={({ item }) => <Post item={item} />}
      keyExtractor={(item) => item._id.toString()}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      ListHeaderComponent={renderProfileHeader}
      contentContainerStyle={styles.postsContainer}
      showsVerticalScrollIndicator={false}
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
    paddingBottom: 30,
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