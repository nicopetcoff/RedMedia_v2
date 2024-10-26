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

// Función que crea una promesa que se rechaza tras un tiempo definido
const timeout = (ms) => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Tiempo de espera agotado. Intenta más tarde.")), ms)
  );
};

export const signIn = async (userData) => {
  const url = urlWebServices.signIn; // URL del endpoint

  try {
    // Usamos Promise.race para establecer el timeout
    const response = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
        }),
      }),
      timeout(3000), // Timeout de 3 segundos
    ]);

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.message || `Error ${response.status}: Error en el login.`;
      const error = new Error(errorMessage);
      error.status = response.status;
      throw error;
    }

    return { status: response.status, data };
  } catch (error) {
    console.error("Error en signIn API:", error.message);
    if (!error.status) {
      throw new Error("No se pudo conectar con el servidor.");
    }
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