import { Button, Form, Input, message, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBrand, getBrandById, updateBrand } from '../../../api/brandsService';
import { brandValidationRules } from '../validate/brandRules';

const BrandForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getBrandById(id!).then(res => {
        form.setFieldsValue(res.data);
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateBrand(id!, values);
        message.success('Marca actualizada');
      } else {
        await createBrand(values);
        message.success('Marca creada');
      }
      navigate('/brands');
    } catch {
      message.error('Error al guardar marca');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="name" label="Nombre" rules={brandValidationRules.name}>
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Descripción" rules={brandValidationRules.description}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item name="isActive" label="¿Está activa?" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BrandForm;
