// App.js
import React, { useEffect } from "react";
import { AuthProvider } from "./src/context/AuthProvider";
import AppNavigator from "./src/navigation/AppNavigator";
import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
import {Restart} from 'fiction-expo-restart';
const App = () => {
  //console.log(reloadAppAsync)
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (!state.isConnected) {
      Alert.alert(
        "Sin conexion a internet",
        "Por favor conectese a internet para poder usar la aplicacion",
        [{ text: "Reintentar", onPress: () => Restart() }]
      );
    }
  });
  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, []);


  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};


export default App;



