// src/modules/inventory-history/validate/historyRules.ts
export const historyValidationRules = {
  productId: [{ required: true, message: 'El producto es obligatorio' }],
  action: [{ required: true, message: 'La acción es obligatoria' }],
  quantity: [{ required: true, message: 'La cantidad es obligatoria' }],
};
