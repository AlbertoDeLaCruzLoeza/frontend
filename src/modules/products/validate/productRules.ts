// src/modules/products/validate/productRules.ts
export const productValidationRules = {
  name: [{ required: true, message: 'El nombre es obligatorio' }],
  price: [{ required: true, message: 'El precio es obligatorio' }],
  stock: [{ required: true, message: 'El stock es obligatorio' }],
};
