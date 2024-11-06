import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const urlApi = 'http://10.0.2.2:4000/'; // Para Android Emulator
// const urlApi = "http://[TU_IP_LOCAL]:4000/";  // Para dispositivos reales o iOS
console.log('url', urlApi);

const urlWebServices = {
  getPosts: urlApi + "api/posts",         // Ruta para obtener los posts
  signUp: urlApi + "api/users/signup",    // Nueva ruta para registrar usuarios
  signIn: urlApi + "api/users/singin",    // Nueva ruta para iniciar sesión
  passwordReset: urlApi + 'api/users/forgot-password', // Nueva ruta para restablecer la contraseña
  getNotifications: urlApi + "api/users/notificaciones", // Ruta para obtener las notificaciones
  getProfile: urlApi + "api/users/me", // Ruta para obtener el perfil del usuario
  updateProfileImage: urlApi + "api/users/updateProfileImage", // Ruta para actualizar el perfil del usuario
};

export default urlWebServices;
