// src/modules/inventory-history/form/InventoryHistoryForm.tsx
import { Button, Form, InputNumber, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createInventoryHistory,
  getInventoryHistoryById,
  updateInventoryHistory,
} from '../../../api/inventoryHistoryService';
import { historyValidationRules } from '../validate/historyRules';
import { getProducts } from '../../../api/productsService';

const InventoryHistoryForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const isEdit = !!id;

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
    if (isEdit) {
      getInventoryHistoryById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateInventoryHistory(id!, values);
        message.success('Historial actualizado');
      } else {
        await createInventoryHistory(values);
        message.success('Historial registrado');
      }
      navigate('/inventory-history');
    } catch {
      message.error('Error al guardar historial');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Producto" name="productId" rules={historyValidationRules.productId}>
        <Select options={products.map((p: any) => ({ label: p.name, value: p.id }))} />
      </Form.Item>
      <Form.Item label="Acción" name="action" rules={historyValidationRules.action}>
        <Select
          options={[
            { label: 'Agregado', value: 'agregado' },
            { label: 'Eliminado', value: 'eliminado' },
            { label: 'Actualizado', value: 'actualizado' },
          ]}
        />
      </Form.Item>
      <Form.Item label="Cantidad" name="quantity" rules={historyValidationRules.quantity}>
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

export default InventoryHistoryForm;
