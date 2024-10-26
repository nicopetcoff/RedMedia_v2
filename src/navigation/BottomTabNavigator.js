import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeStackScreen from './HomeStackScreen';
import SearchScreen from '../screens/SearchScreen';
import ImagePickerScreen from '../screens/ImagePickerScreen';
import NotificationStackScreen from './NotificationStackScreen';
import LoggedInUserProfileScreen from '../screens/LoggedInUserProfileScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ route, color, size }) => {
  // Iconos de marcador de posición
  let iconName;
  switch (route.name) {
    case 'HomeStack':
      iconName = '🏠';
      break;
    case 'Search':
      iconName = '🔍';
      break;
    case 'CreatePost':
      iconName = '➕';
      break;
    case 'Notifications':
      iconName = '❤️';
      break;
    case 'Profile':
      iconName = '👤';
      break;
    default:
      iconName = '';
      break;
  }
  return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: props => <TabBarIcon route={route} {...props} />,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStackScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="CreatePost" component={ImagePickerScreen} />
      <Tab.Screen name="Notifications" component={NotificationStackScreen} />
      <Tab.Screen name="Profile" component={LoggedInUserProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;