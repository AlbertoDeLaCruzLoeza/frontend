// src/modules/products/form/ProductForm.tsx
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Switch,
  Spin,
} from 'antd';
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
  const [initialLoading, setInitialLoading] = useState(true);

  const isEdit = Boolean(id);

 useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const resBrands = await getBrands();
      const records = resBrands.data?.data?.records || [];

      const uniqueBrands = Object.values(
        records.reduce((acc: Record<number, { id: number; name: string }>, item: any) => {
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

      console.log('Marcas únicas:', uniqueBrands);
      setBrands(uniqueBrands);

      if (isEdit && id) {
        const resProduct = await getProductById(id);
        const product = resProduct.data?.data?.records;

        console.log('Producto:', product);
        const matchedBrand = uniqueBrands.find(
          b => b.name.trim().toLowerCase() === product.brand_name.trim().toLowerCase()
        );

        console.log('Marca encontrada:', matchedBrand);

        form.setFieldsValue({
          code: product.code,
          name: product.product_name,
          description: product.description,
          price: Number(product.price),
          brandId: matchedBrand ? matchedBrand.id : null,
          isActive: product.is_active === 'Sí',
        });
      }
    } catch (error) {
      console.error(error);
      message.error('Error al cargar datos iniciales');
    } finally {
      setInitialLoading(false);
    }
  };

  fetchInitialData();
}, [id, isEdit, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      price: values.price,
      brandId: Number(values.brandId),
      isActive: values.isActive,
    };

    try {
      if (isEdit && id) {
        await updateProduct(id, payload);
        message.success('Producto actualizado correctamente');
      } else {
        await createProduct(payload);
        message.success('Producto creado correctamente');
      }
      navigate('/products');
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 409) {
        message.error('Ya existe un producto con ese código');
      } else {
        message.error('Error al guardar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <Spin tip="Cargando..." />
      </div>
    );
  }

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

        <Form.Item
          label="Nombre"
          name="name"
          rules={productValidationRules.name}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="description"
          rules={[{ required: true, message: 'La descripción es obligatoria' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="price"
          rules={productValidationRules.price}
        >
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

        <Form.Item label="Estado actual">
          <Form.Item name="isActive" valuePropName="checked" noStyle>
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>
          <span style={{ marginLeft: 10 }}>
            {form.getFieldValue('isActive') ? 'Activo' : 'Inactivo'}
          </span>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>

          <Button
            type="default"
            onClick={() => navigate('/products')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProductForm;
