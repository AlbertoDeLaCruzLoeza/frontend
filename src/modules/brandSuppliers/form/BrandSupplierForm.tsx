// src/modules/brandSuppliers/form/BrandSupplierForm.tsx
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Switch,
  Spin,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBrands } from '../../../api/brandsService';
import { getSuppliers } from '../../../api/suppliersService';
import {
  createBrandSupplier,
  getBrandSupplierById,
  updateBrandSupplier,
} from '../../../api/brandSupplierService';

const BrandSupplierForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [brandsRes, suppliersRes] = await Promise.all([
          getBrands(),
          getSuppliers(),
        ]);

        setBrands(brandsRes.data?.data?.records || []);
        setSuppliers(suppliersRes.data?.data?.records || []);

        const records = brandsRes.data?.data?.records || [];

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

          setBrands(uniqueBrands);

        if (isEdit && id) {
          const res = await getBrandSupplierById(id);
          const record = res.data?.data?.records;
          const fetchedBrands = brandsRes.data?.data?.records || [];
          

          const matchedBrand = uniqueBrands.find(
            (b) => b.name === record.brand?.name
          );

          form.setFieldsValue({
            name: record.name,
            contactPerson: record.contactPerson,
            email: record.email,
            phone: record.phone,
            address: record.address,
            brandId: matchedBrand ? matchedBrand.id : null,
            isActive: record.isActive === 'Sí',
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
      name: values.name,
      contactPerson: values.contactPerson,
      email: values.email,
      phone: values.phone,
      address: values.address,
      brandId: Number(values.brandId),
      isActive: values.isActive,
    };

    try {
      if (isEdit && id) {
        await updateBrandSupplier(id, payload);
        message.success('Proveedor actualizado con éxito');
      } else {
        await createBrandSupplier(payload);
        message.success('Proveedor creado con éxito');
      }

      navigate('/brand-suppliers');
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 409) {
        message.error('El email ya está registrado');
      } else {
        message.error('Error al guardar el proveedor, ingrese lo datos correctamente y asegurese que no esten repetidos%El telefono ');
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
    <Card title={isEdit ? 'Editar Proveedor' : 'Nuevo Proveedor'}>
      <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{
    brandId: undefined, 
  }}>
        <Form.Item
          label="Nombre del proveedor"
          name="name"
          rules={[{ required: true, message: 'El nombre es obligatorio, por favor ingreselo correctamente' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Persona de contacto"
          name="contactPerson"
          rules={[{ required: true, message: 'Este campo es obligatorio, por favor ingreselo correctamente (Ejemplo: Jualian Caceres)' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: 'El correo es obligatorio, por favor ingreselo de forma correcta (Ejemplo: usuarioejemplo@gmail.com)' },
            { type: 'email', message: 'Correo inválido' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="phone"
          rules={[{ required: true, message: 'El teléfono es obligatorio, por favor ingreselo correctamente (Maximo 10 numeros)' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="address"
          rules={[{ required: true, message: 'La dirección es obligatoria, por favor ingresela de forma correcta' }]}
        >
          <Input />
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
            <Switch
              defaultChecked={false}
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
            />
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
            style={{ marginLeft: 8 }}
            onClick={() => navigate('/brand-suppliers')}
          >
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BrandSupplierForm;
