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
  const url = urlWebServices.signIn;  // URL del endpoint

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Si la respuesta no es exitosa, lanzamos un error con el mensaje del backend
      const errorMessage = data.message || `Error ${response.status}: Error en el login.`;
      const error = new Error(errorMessage);
      error.status = response.status; // Adjuntamos el estado HTTP al error
      throw error;
    }

    return { status: response.status, data };  // Retornamos datos y estado

  } catch (error) {
    console.error("Error en signIn API:", error.message);
    // Si el error es de red o no hay respuesta del servidor
    if (!error.status) {
      throw new Error("No se pudo conectar con el servidor. Inténtalo más tarde.");
    }
    throw error; // Lanzamos el error para que el frontend lo maneje
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