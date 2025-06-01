// src/modules/categories/form/CategoryForm.tsx
import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createCategory,
  getCategoryById,
  updateCategory,
} from '../../../api/categoriesService';
import { categoryValidationRules } from '../validate/categoryRules';

const CategoryForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getCategoryById(id!).then(res => {
        form.setFieldsValue(res.data);
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateCategory(id!, values);
        message.success('Categoría actualizada');
      } else {
        await createCategory(values);
        message.success('Categoría creada');
      }
      navigate('/categories');
    } catch {
      message.error('Error al guardar la categoría');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="name" label="Nombre" rules={categoryValidationRules.name}>
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

export default CategoryForm;
