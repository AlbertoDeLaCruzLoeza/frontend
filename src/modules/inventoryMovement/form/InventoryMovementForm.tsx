// src/modules/inventory-movement/form/InventoryMovementForm.tsx
import { Button, Form, InputNumber, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createInventoryMovement,
  getInventoryMovementById,
  updateInventoryMovement,
} from '../../../api/inventoryMovementService';
import { movementValidationRules } from '../validate/movementRules';
import { getProducts } from '../../../api/productsService';

const InventoryMovementForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
    if (isEdit) {
      getInventoryMovementById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateInventoryMovement(id!, values);
        message.success('Movimiento actualizado');
      } else {
        await createInventoryMovement(values);
        message.success('Movimiento creado');
      }
      navigate('/inventory-movement');
    } catch {
      message.error('Error al guardar movimiento');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Producto" name="productId" rules={movementValidationRules.productId}>
        <Select options={products.map((p: any) => ({ label: p.name, value: p.id }))} />
      </Form.Item>
      <Form.Item label="Tipo de movimiento" name="type" rules={movementValidationRules.type}>
        <Select
          options={[
            { label: 'Entrada', value: 'entrada' },
            { label: 'Salida', value: 'salida' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Cantidad" name="quantity" rules={movementValidationRules.quantity}>
        <InputNumber min={1} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InventoryMovementForm;
