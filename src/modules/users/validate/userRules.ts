export const userValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio' }],
  email: [
    {
      required: true,
      message:
        'El correo es obligatorio (La forma correcta de llenar el campo: usuarioejemplo@gmail.com)',
    },
    { type: 'email', message: 'Correo inválido' },
  ],
  password: (isEdit: boolean = false) => {
    const passwordValidator = (_: any, value: string) => {
      if (!value) {
        return isEdit
          ? Promise.resolve() // En edición puede estar vacío
          : Promise.reject('La contraseña es obligatoria');
      }

      if (value.length < 8) {
        return Promise.reject('La contraseña debe tener al menos 8 caracteres');
      }

      if (!/[A-Z]/.test(value)) {
        return Promise.reject('Debe incluir al menos una letra mayúscula');
      }

      if (!/[a-z]/.test(value)) {
        return Promise.reject('Debe incluir al menos una letra minúscula');
      }

      if (!/[0-9]/.test(value)) {
        return Promise.reject('Debe incluir al menos un número');
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return Promise.reject('Debe incluir al menos un carácter especial');
      }

      return Promise.resolve();
    };

    return isEdit
      ? [
          {
            validator: passwordValidator,
          },
        ]
      : [
          { required: true, message: 'La contraseña es obligatoria' },
          {
            validator: passwordValidator,
          },
        ];
  },
};
