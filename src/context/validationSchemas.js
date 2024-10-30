import * as yup from "yup";

export const signUpValidationSchema = yup.object().shape({
  email: yup
  .string()
  .email("E-mail invalido")
  .required("E-mail es requerido"),
    password: yup
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .required("La contraseña es requerida")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, 'La contraseña debe contener al menos una letra  y un número'),
    name: yup
    .string()
    .required("El nombre es requerido"),
    lastName: yup
    .string()
    .required("El apellido es requerido"),
    nick: yup
    .string()
    .required("El nick es requerido"),
});

export const SignInValidationSchema = yup.object().shape({
    email: yup
    .string()
    .email("E-mail invalido")
    .required("E-mail es requerido"),
    password: yup
    .string()
    .required("La contraseña es requerida"),
});
