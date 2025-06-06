// src/modules/users/validate/userRules.ts
export const userValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio' }],
  email: [
    { required: true, message: 'El correo es obligatorio (La forma correcta de llenar el campo: usuarioejemplo@gmail.com)' },
    { type: 'email', message: 'Correo inválido' },
  ],
  password: [{ required: true, message: 'La contraseña es obligatoria, debe contener por lo menos 8 caracteres, una mayúscula, una minúscula y un carácter especial (?=%$)' }],
};
