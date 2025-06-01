// src/modules/permissions/form/PermissionForm.tsx
import { Button, Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  createPermission,
  getPermissionById,
  updatePermission,
} from '../../../api/permissionsService';
import { permissionValidationRules } from '../validate/permissionRules';

const PermissionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      getPermissionById(id!).then(res => form.setFieldsValue(res.data));
    }
  }, [id]);

  const onFinish = async (values: any) => {
    try {
      if (isEdit) {
        await updatePermission(id!, values);
        message.success('Permiso actualizado');
      } else {
        await createPermission(values);
        message.success('Permiso creado');
      }
      navigate('/permissions');
    } catch {
      message.error('Error al guardar permiso');
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item label="Nombre del permiso" name="name" rules={permissionValidationRules.name}>
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

export default PermissionForm;
