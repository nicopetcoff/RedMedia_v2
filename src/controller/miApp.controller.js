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
      throw(data);
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
    if (data.status === 404) {
      throw (data);
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
    let url = urlWebServices.postPost;
    
    const formData = new FormData();
    
    // Agregar datos del post
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('location', postData.location);
    formData.append('user', postData.user);
    formData.append('userAvatar', postData.userAvatar);

    // Agregar imágenes
    postData.images.forEach((imageUri, index) => {
      let localUri = imageUri;
      let filename = localUri.split('/').pop();

      // Extraer la extensión del archivo
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append('images', {
        uri: localUri,
        name: filename,
        type
      });
    });


    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'x-access-token': token
      },
      body: formData
    });

    const responseData = await response.json();

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
