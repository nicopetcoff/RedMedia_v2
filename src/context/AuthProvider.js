import React, { useState, useEffect, useContext } from 'react';
import { signIn as signInAPI } from '../controller/miApp.controller';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { auth } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = React.createContext();
const toggleContext = React.createContext();

export function useUserContext() {
  return useContext(AuthContext);
}

export function useToggleContext() {
  return useContext(toggleContext);
}

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    token: null,
    isAuthenticated: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        const userString = await SecureStore.getItemAsync('user');

        if (token && userString) {
          const user = JSON.parse(userString);
          setAuthState({
            user,
            token,
            isAuthenticated: true,
          });
        }
      } catch (error) {
        console.error('Error al recuperar los datos de autenticación:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const login = async (userData) => {
    try {
      // Inicia sesión en Firebase con el correo y contraseña
      const firebaseUser = await signInWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseToken = await firebaseUser.user.getIdToken();

      // Enviar el token y el email al backend para autenticación
      const response = await signInAPI({ email: userData.email, token: firebaseToken });
  
      if (response.token) {
        const user = response.user || { email: userData.email };
        const userString = JSON.stringify(user);
  
        await SecureStore.setItemAsync('token', String(response.token));
        await SecureStore.setItemAsync('user', userString);
  
        setAuthState({
          user,
          token: response.token,
          isAuthenticated: true,
        });
      } else {
        Alert.alert('Error', 'Inicio de sesión fallido. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema durante el inicio de sesión.');
    }
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, loading }}>
      <toggleContext.Provider value={{ login, signOut }}>
        {children}
      </toggleContext.Provider>
    </AuthContext.Provider>
  );
};