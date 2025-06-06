export const brandValidationRules = {
  name: [{ required: true, message: 'El nombre de la marca es obligatorio, porfavor ingreselo de forma correcta' }],
  description: [
    { required: true, message: 'La descripción es obligatoria, por favor ingresela (no debe superar los 255 caracteres)' },
    { max: 255, message: 'La descripción no debe superar los 255 caracteres' },
  ],
  isActive: [
    {
      validator: (_: any, value: boolean) => {
        if (typeof value === 'boolean') return Promise.resolve();
        return Promise.reject('Debe indicar si la marca está activa');
      },
    },
  ],
};
