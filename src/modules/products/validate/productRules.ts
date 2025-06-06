// src/modules/products/validate/productRules.ts
export const productValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio, por favor ingreselo de forma correcta' }],
  price: [{ required: true, message: 'El precio es obligatorio, por favor ingreselo de forma correcta (Ejemplo: 1500)' }],
  stock: [{ required: true, message: 'El stock es obligatorio' }],
};
