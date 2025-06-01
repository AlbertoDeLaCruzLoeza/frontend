// src/modules/roles/form/RoleForm.tsx
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  createRole,
  getRoleById,
  updateRole,
} from '../../../api/rolesService';
import { roleValidationRules } from '../validate/roleRules';

const RoleForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getRoleById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updateRole(id!, values);
        message.success('Rol actualizado');
      } else {
        await createRole(values);
        message.success('Rol creado');
      }
      navigate('/roles');
    } catch {
      message.error('Error al guardar rol');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Nombre del rol" name="name" rules={roleValidationRules.name}>
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

export default RoleForm;
