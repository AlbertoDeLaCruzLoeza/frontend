import { Button, Form, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const mockBrands = [
  { id: 10, name: 'Microsoft' },
  { id: 20, name: 'Apple' },
  { id: 30, name: 'Samsung' },
  { id: 40, name: 'Sony' },
  { id: 50, name: 'LG' },
];

const mockSuppliers = [
  { id: 100, name: 'Ingram Micro' },
  { id: 200, name: 'Tech Data' },
  { id: 300, name: 'Synnex' },
  { id: 400, name: 'Arrow Electronics' },
  { id: 500, name: 'Avnet' },
];

const mockBrandSuppliers = [
  { id: 1, brandId: 10, supplierId: 100 },
  { id: 2, brandId: 20, supplierId: 200 },
  { id: 3, brandId: 30, supplierId: 300 },
  { id: 4, brandId: 40, supplierId: 400 },
  { id: 5, brandId: 50, supplierId: 500 },
];

const BrandSupplierForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [brands] = useState(mockBrands);
  const [suppliers] = useState(mockSuppliers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      // Simular carga del registro para editar
      const record = mockBrandSuppliers.find((item) => item.id === Number(id));
      if (record) {
        form.setFieldsValue({
          brandId: record.brandId,
          supplierId: record.supplierId,
        });
      }
    }
  }, [id, form, isEdit]);

  const onFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (isEdit) {
        message.success('Relación actualizada');
      } else {
        message.success('Relación creada');
      }
      navigate('/brand-suppliers');
    }, 1000);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label="Marca"
        name="brandId"
        rules={[{ required: true, message: 'La marca es obligatoria' }]}
      >
        <Select
          placeholder="Seleccione una marca"
          options={brands.map((b) => ({ value: b.id, label: b.name }))}
        />
      </Form.Item>

      <Form.Item
        label="Proveedor"
        name="supplierId"
        rules={[{ required: true, message: 'El proveedor es obligatorio' }]}
      >
        <Select
          placeholder="Seleccione un proveedor"
          options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrandSupplierForm;
