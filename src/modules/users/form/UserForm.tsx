import { Button, Form, Input, Switch, message, Space } from 'antd';
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
    if (isEdit && id) {
      getUserById(id)
        .then(res => {
          const records = res.data?.data?.records;
          const userData = Array.isArray(records) ? records[0] : records;

          if (!userData) {
            message.error('No se encontró el usuario');
            return;
          }

          form.setFieldsValue({
            email: userData.email,
            is_active: userData.is_active === 'Sí',
          });
        })
        .catch(err => {
          console.error('Error al cargar el usuario', err);
          message.error('Error al cargar los datos del usuario');
        });
    }
  }, [id]);

  // ✅ Se invoca correctamente para obtener reglas según si es edición o no
  const passwordRules = userValidationRules.password(isEdit);

  const onFinish = async (values: any) => {
    setLoading(true);

    const payload: any = {
      email: values.email,
      is_active: values.is_active ?? false,
    };

    if (isEdit) {
      if (values.password && values.password.trim() !== '') {
        payload.password_hash = values.password;
      }
    } else {
      payload.password_hash = values.password;
    }

    try {
      if (isEdit) {
        await updateUser(id!, payload);
        message.success('Usuario actualizado');
      } else {
        await createUser(payload);
        message.success('Usuario creado');
      }
      navigate('/users');
    } catch (err) {
      console.error(err);
      message.error('Error al guardar, por favor ingrese los datos de forma correcta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item name="email" label="Correo" rules={userValidationRules.email}>
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label={isEdit ? 'Contraseña (opcional)' : 'Contraseña'}
        rules={passwordRules}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="Estado actual">
        <Form.Item name="is_active" valuePropName="checked" noStyle>
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
        </Form.Item>
        <span style={{ marginLeft: 10 }}>
          {form.getFieldValue('is_active') ? 'Activo' : 'Inactivo'}
        </span>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
          <Button onClick={() => navigate('/users')} disabled={loading}>
            Cancelar
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
