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
      body: JSON.stringify(userData),
    });;
    

    let data = await response.json();
    if (data.status===400) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const signIn = async (userData) => {
  let url = urlWebServices.signIn;

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

    let data = await response.json();
    if (data.status === 400) {
      throw new Error(data.message);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

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

    let data = await response.json();
    if (data.status === 500) {
      throw (data.message);
    }
    return data;
  } catch (error) {
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

export const publishPost = async (postData, token) => {
  try {
    console.log("FRONT POSTDATA", postData);

    // La URL de los servicios web
    const url = urlWebServices.postPost;

    // Crear un objeto FormData para enviar los datos y archivos
    const formData = new FormData();

    // Agregar datos de texto del post
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('location', postData.location);
    formData.append('user', postData.user);
    formData.append('userAvatar', postData.userAvatar);

    // Agregar archivos multimedia (imágenes y videos)
    if (Array.isArray(postData.media) && postData.media.length > 0) {
      postData.media.forEach((fileUri) => {
        const localUri = fileUri;
        const filename = localUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const fileExtension = match ? match[1].toLowerCase() : '';
        let type = '';

        // Verificar si el archivo es una imagen
        if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          type = `image/${fileExtension}`;
          // Cambiar 'images' a un nombre de campo único
          formData.append(`images`, {
            uri: localUri,
            name: filename,
            type: type,
          });
        }
        // Verificar si el archivo es un video
        else if (['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension)) {
          type = `video/${fileExtension}`;
          // Cambiar 'videos' a un nombre de campo único
          formData.append(`videos`, {
            uri: localUri,
            name: filename,
            type: type,
          });
        }
      });
    }

    // Verificar los datos enviados
    console.log("Datos de FormData:");
    for (let i = 0; i < formData._parts.length; i++) {
      const part = formData._parts[i];
      console.log(`Key: ${part[0]}, Value: ${JSON.stringify(part[1])}`);
    }

    // Realizar la solicitud fetch para enviar los datos al backend
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-access-token': token
      },
      body: formData
    });

    // Verificar si la respuesta es exitosa
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error en la respuesta: ${response.status} - ${errorText}`);
    } else if (!contentType || !contentType.includes("application/json")) {
      const errorText = await response.text();
      throw new Error(`Respuesta no es JSON: ${errorText}`);
    }

    // Analizar JSON si la respuesta es válida
    const responseData = await response.json();
    console.log('Server response:', responseData);

    // Si la respuesta es exitosa, retornar el resultado
    if (response.ok) {
      return { 
        success: true, 
        message: 'Post published successfully', 
        data: responseData.data 
      };
    } else {
      throw new Error(responseData.message || 'Failed to publish post');
    }
  } catch (error) {
    console.error('Error en publishPost:', error);
    return { 
      success: false, 
      message: error.message || 'Error connecting to server'
    };
  }
};





export const getAds = async () => {
  let url = urlWebServices.getAds;

  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              Accept: "application/json",
          },
      });

      if (!response.ok) {
          throw new Error("Error al obtener los anuncios: " + response.status);
      }

      const data = await response.json();
      return data;
  } catch (error) {
      throw error;
  }
};

export const getUsers = async (token) => {
  let url = urlWebServices.getUsers;
  

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-access-token": token
      },
    });

    
    
    if (!response.ok) {
      throw new Error("Error al obtener los usuarios: " + response.status);
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error en getUsers:', error);
    throw error;
  }
};