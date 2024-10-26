// src/screens/NotificationScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Notification from '../components/Notification';
import notificaciones from '../data/notificaciones.json';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.icon}>
          <Text style={styles.backIcon}> ← </Text> 
          
        </TouchableOpacity>
        <Text style={styles.title}>Activity</Text>
      </View>
      <FlatList
        data={notificaciones}
        renderItem={({ item }) => <Notification item={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    paddingHorizontal: 10,
  },
  headerContainer: {
    height: 100,
    backgroundColor: '#fcfcfc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop: 20,
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: 'black',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default NotificationScreen;