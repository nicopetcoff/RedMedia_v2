export const validateForm = ({email, password, name, lastName, nick}) => {

    let errors = {}
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(name)

    if (!name) {
      errors.name = "El nombre es obligatorio";
    }  if (!lastName) {
      errors.lastName = "El apellido es obligatorio";
    } if (!email || !regexEmail.test(email)) {
      errors.email = "El email es invalido";
    } if (!password || !regexPassword.test(password)) {
      errors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial";
    } if (!nick) {
      errors.nick = "El nick es obligatorio";
    }
    return errors;


  }