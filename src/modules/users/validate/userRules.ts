// src/modules/users/validate/userRules.ts
export const userValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio' }],
  email: [
    { required: true, message: 'El correo es obligatorio' },
    { type: 'email', message: 'Correo inválido' },
  ],
  password: [{ required: true, message: 'La contraseña es obligatoria' }],
};
