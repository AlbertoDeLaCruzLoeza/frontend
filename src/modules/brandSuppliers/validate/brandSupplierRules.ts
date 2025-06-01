import * as Yup from 'yup';

const brandSupplierValidationRules = Yup.object().shape({
  supplierName: Yup.string()
    .required('El nombre del proveedor es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  brandId: Yup.string()
    .required('La marca es obligatoria'),
});

export default brandSupplierValidationRules;
