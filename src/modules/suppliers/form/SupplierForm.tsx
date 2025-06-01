// src/modules/suppliers/form/SupplierForm.tsx
import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createSupplier,
  getSupplierById,
  updateSupplier,
} from '../../../api/suppliersService';
import { supplierValidationRules } from '../validate/supplierRules';

const SupplierForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getSupplierById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateSupplier(id!, values);
        message.success('Proveedor actualizado');
      } else {
        await createSupplier(values);
        message.success('Proveedor creado');
      }
      navigate('/suppliers');
    } catch {
      message.error('Error al guardar el proveedor');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Nombre" name="name" rules={supplierValidationRules.name}>
        <Input />
      </Form.Item>
      <Form.Item label="Contacto" name="contact" rules={supplierValidationRules.contact}>
        <Input />
      </Form.Item>
      <Form.Item label="Teléfono" name="phone" rules={supplierValidationRules.phone}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SupplierForm;
