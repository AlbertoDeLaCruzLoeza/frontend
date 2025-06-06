export const userValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio' }],
  email: [
    { required: true, message: 'El correo es obligatorio (La forma correcta de llenar el campo: usuarioejemplo@gmail.com)' },
    { type: 'email', message: 'Correo inválido' },
  ],
  password: (isEdit: boolean = false) => {
    if (isEdit) {
      // En edición: contraseña NO es obligatoria, pero si la ponen debe validar:
      return [
        {
          validator: (_: any, value: string) => {
            if (!value) return Promise.resolve();
            // Validación de ejemplo: mínimo 8 caracteres
            if (value.length >= 8) return Promise.resolve();
            return Promise.reject(new Error('La contraseña debe tener al menos 8 caracteres'));
          },
        },
      ];
    } else {
      // En creación: contraseña obligatoria y con reglas
      return [
        { required: true, message: 'La contraseña es obligatoria' },
        {
          validator: (_: any, value: string) => {
            if (!value) return Promise.reject('La contraseña es obligatoria');
            if (value.length < 8) return Promise.reject('La contraseña debe tener al menos 8 caracteres');
            // Aquí puedes agregar regex para mayúsculas, minúsculas, caracteres especiales, etc.
            return Promise.resolve();
          },
        },
      ];
    }
  },
};
