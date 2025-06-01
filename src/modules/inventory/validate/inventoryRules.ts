// src/modules/inventory/validate/inventoryRules.ts
export const inventoryValidationRules = {
  productId: [{ required: true, message: 'El producto es obligatorio' }],
  quantity: [{ required: true, message: 'La cantidad es obligatoria' }],
};
