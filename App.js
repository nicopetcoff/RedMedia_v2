// App.js
import React from 'react';
import { AuthProvider } from './src/context/AuthProvider';
import AppNavigator from './src/navigation/AppNavigator';
const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;