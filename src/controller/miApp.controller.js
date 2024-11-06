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
    return data;
  } catch (error) {
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
    throw error;
  }
};

export const signIn = async (userData) => {
  const { email, token } = userData;

  console.log("Datos de inicio de sesión enviados al backend:", { email, firebaseToken: token });

  try {
    const response = await fetch(urlWebServices.signIn, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        firebaseToken: token, // Aquí usamos `firebaseToken` para que el backend lo reciba con el mismo nombre
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Datos recibidos del backend:", data); // Log para verificar datos
    return data;

  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email) => {
  let url = urlWebServices.passwordReset;
  console.log("Enviando solicitud de restablecimiento a URL:", url);

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
      console.log("Código de estado:", response.status, "Texto de estado:", response.statusText);
      throw new Error("Error al enviar el correo de recuperación: " + response.status);
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error("Error al parsear JSON:", error);
      throw new Error("La respuesta no es JSON válida.");
    }

    return data;
  } catch (error) {
    console.error("Error en sendPasswordResetEmail:", error.message);
    throw error;
  }
};

export const getUserData = async (token) => {
  let url = urlWebServices.getProfile;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateProfileImage = async (imageUri, token) => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });

  try {
    const response = await fetch(`${urlWebServices.updateProfileImage}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la imagen de perfil: ' + response.status);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};