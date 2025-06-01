// src/modules/inventory/form/InventoryForm.tsx
import { Button, Form, InputNumber, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createInventory,
  getInventoryById,
  updateInventory,
} from '../../../api/inventoryService';
import { inventoryValidationRules } from '../validate/inventoryRules';
import { getProducts } from '../../../api/productsService';

const InventoryForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
    if (isEdit) {
      getInventoryById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateInventory(id!, values);
        message.success('Inventario actualizado');
      } else {
        await createInventory(values);
        message.success('Inventario creado');
      }
      navigate('/inventory');
    } catch {
      message.error('Error al guardar inventario');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Producto" name="productId" rules={inventoryValidationRules.productId}>
        <Select options={products.map((p: any) => ({ label: p.name, value: p.id }))} />
      </Form.Item>
      <Form.Item label="Cantidad" name="quantity" rules={inventoryValidationRules.quantity}>
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InventoryForm;
