// src/modules/products/form/ProductForm.tsx
import { Button, Card, Form, Input, InputNumber, message, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../../api/productsService';
import { productValidationRules } from '../validate/productRules';

const ProductForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);

  const isEdit = !!id;

  useEffect(() => {
    // MOCK temporal de marcas
    const mockBrands = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Samsung' },
      { id: 3, name: 'Dell' },
      { id: 4, name: 'HP' },
      { id: 5, name: 'Lenovo' },
      { id: 6, name: 'LG' },
      { id: 7, name: 'Microsoft' },
      { id: 8, name: 'Asus' },
      { id: 9, name: 'Sony' },
      { id: 10, name: 'Nescafe' },
      { id: 11, name: 'CocaCola' },
    ];
    setBrands(mockBrands);

    if (isEdit) {
      getProductById(id!).then(res => {
        form.setFieldsValue(res.data);
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateProduct(id!, values);
        message.success('Producto actualizado');
      } else {
        await createProduct(values);
        message.success('Producto creado');
      }
      navigate('/products');
    } catch {
      message.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item label="Código" name="code" rules={[{ required: true, message: 'El código es obligatorio' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Nombre" name="name" rules={productValidationRules.name}>
          <Input />
        </Form.Item>
        <Form.Item label="Descripción" name="description" rules={[{ required: true, message: 'La descripción es obligatoria' }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Precio" name="price" rules={productValidationRules.price}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Marca" name="brandId" rules={[{ required: true, message: 'Seleccione una marca' }]}>
          <Select
            options={brands.map((brand) => ({
              label: brand.name,
              value: brand.id,
            }))}
            placeholder="Seleccione una marca"
          />
        </Form.Item>
        <Form.Item label="Activo" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm;
