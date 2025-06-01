// src/modules/users/form/UserForm.tsx
import { Button, Form, Input, message } from 'antd';
import { useEffect, useState } from 'react';
import { createUser, getUserById, updateUser } from '../../../api/usersService';
import { userValidationRules } from '../validate/userRules';
import { useNavigate, useParams } from 'react-router-dom';

const UserForm = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getUserById(id!).then(res => {
        form.setFieldsValue(res.data);
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updateUser(id!, values);
        message.success('Usuario actualizado');
      } else {
        await createUser(values);
        message.success('Usuario creado');
      }
      navigate('/users');
    } catch {
      message.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="name" label="Nombre" rules={userValidationRules.name}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="Correo" rules={userValidationRules.email}>
        <Input />
      </Form.Item>
      {!isEdit && (
        <Form.Item name="password" label="Contraseña" rules={userValidationRules.password}>
          <Input.Password />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          {isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
