// src/modules/products/form/ProductForm.tsx
import { Button, Card, Form, Input, InputNumber, message, Select, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../../../api/productsService';
import { getBrands } from '../../../api/brandsService';
import { productValidationRules } from '../validate/productRules';

const ProductForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);

  const isEdit = !!id;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        const allRecords = res.data?.data?.records || [];

        const uniqueBrands = Object.values(
          allRecords.reduce((acc: any, item: any) => {
            const brandId = item.brand_id;
            if (!acc[brandId]) {
              acc[brandId] = {
                id: brandId,
                name: item.brand_name,
              };
            }
            return acc;
          }, {})
        );
        setBrands(uniqueBrands);
      } catch (error) {
        message.error('Error al cargar marcas');
      }
    };

    fetchBrands();

    if (isEdit) {
      getProductById(id!).then(res => {
        const data = res.data;
        form.setFieldsValue({
          code: data.code,
          name: data.name,
          description: data.description,
          price: data.price,
          brandId: data.brand_id,
          isActive: data.is_active,
        });
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);

    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      price: values.price,
      brandId: Number(values.brandId), // ✅ Convertimos a número
      isActive: values.isActive,
    };

    console.log('Payload a enviar:', payload); // 👀 Verificación

    try {
      if (isEdit) {
        await updateProduct(id!, payload);
        message.success('Producto actualizado');
      } else {
        await createProduct(payload);
        message.success('Producto creado');
      }
      navigate('/products');
    } catch (err) {
      console.error('Error en la creación:', err);
      message.error('Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title={isEdit ? 'Editar Producto' : 'Nuevo Producto'}>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Código"
          name="code"
          rules={[{ required: true, message: 'El código es obligatorio' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Nombre" name="name" rules={productValidationRules.name}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'La descripción es obligatoria' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Precio" name="price" rules={productValidationRules.price}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Marca"
          name="brandId"
          rules={[{ required: true, message: 'Seleccione una marca' }]}
        >
          <Select
            options={brands.map((brand) => ({
              label: brand.name,
              value: brand.id,
            }))}
            placeholder="Seleccione una marca"
          />
        </Form.Item>
        <Form.Item label="Activo" name="isActive" valuePropName="checked" initialValue={true}>
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
