// src/modules/suppliers/validate/supplierRules.ts
export const supplierValidationRules = {
  name: [{ required: true, message: 'El nombre del proveedor es obligatorio' }],
  contact: [{ required: true, message: 'El contacto es obligatorio' }],
  phone: [{ required: true, message: 'El teléfono es obligatorio' }],
};
