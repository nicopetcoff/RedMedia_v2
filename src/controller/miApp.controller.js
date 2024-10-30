import urlWebServices from "./webServices";
import { useSelector } from 'react-redux';

export const getPosts = async function () {
  let url = urlWebServices.getPosts;

  try {
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los posts: " + response.status);
    }

    let data = await response.json();
    return data;  // Aquí debería devolver los datos del backend.
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const signUp = async (userData) => {
  let url = urlWebServices.signUp;

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: userData.name,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        nick: userData.nick,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al registrar el usuario: " + response.status);
    }

    let data = await response.json();
    return data;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const signIn = async (userData) => {
  let url = urlWebServices.signIn;  // URL para el endpoint de inicio de sesión

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión: " + response.status);
    }

    let data = await response.json();
    return data;

  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

// Función nueva añadida
export const sendPasswordResetEmail = async (email) => {
  let url = urlWebServices.passwordReset;

  try {
    let response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Error al enviar el correo de recuperación: " + response.status);
    }

    let data = await response.json();
    return data;

  } catch (error) {
    console.error("Error al enviar el correo de recuperación:", error);
    throw error;
  }
};

// Función user/me
export const getUserData = async (token) => {
  let url = urlWebServices.getProfile; // URL para el endpoint de perfil
  try {
    console.log("Sending request to:", url); // Muestra la URL del endpoint

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token, // Enviar el token en los headers
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();

    return data; // Retorna los datos del usuario
  } catch (error) {
    console.error("Error fetching user data:", error); // Manejo de errores
    throw error; // Propaga el error
  }
};

export const updateProfileImage = async (imageUri, token) => {
  const formData = new FormData();
  
  // Cambia 'avatar' a lo que espera tu backend si es necesario
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg', // Ajusta el tipo si es necesario (image/png para PNG)
    name: 'profile.jpg', // El nombre que desees
  });

  try {
    const response = await fetch(`${urlWebServices.updateProfileImage}`, { // Asegúrate de que la URL sea correcta
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token, // Agrega el token aquí
      },
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la imagen de perfil: ' + response.status);
    }

    const data = await response.json();
    console.log('Imagen de perfil actualizada:', data);
    return data; // Devuelve los datos que necesites del backend
  } catch (error) {
    console.error('Error al enviar la imagen:', error);
    throw error; // Propaga el error
  }
};

