// src/modules/inventory-movement/validate/movementRules.ts
export const movementValidationRules = {
  productId: [{ required: true, message: 'El producto es obligatorio' }],
  type: [{ required: true, message: 'El tipo de movimiento es obligatorio' }],
  quantity: [{ required: true, message: 'La cantidad es obligatoria' }],
};
