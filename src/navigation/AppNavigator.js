import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import BottomTabNavigator from './BottomTabNavigator';
import { restoreToken } from '../redux/authSlice';
import { Linking } from 'react-native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    const loadToken = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        dispatch(restoreToken({ token: userToken }));
      }
    };

    loadToken();

    // Manejar enlaces profundos
    const handleDeepLink = (url) => {
      const parsedUrl = new URL(url);
      const email = parsedUrl.searchParams.get('email');
      const resetToken = parsedUrl.pathname.split('/').pop(); // Obtener el token del path

      if (email && resetToken) {
        navigation.navigate('ResetPassword', { email, resetToken });
      }
    };

    const unsubscribe = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      unsubscribe.remove();
    };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;