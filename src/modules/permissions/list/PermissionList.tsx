// src/modules/permissions/list/PermissionList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  deletePermission,
  getPermissions,
} from '../../../api/permissionsService';
import { useNavigate } from 'react-router-dom';

const PermissionList = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await getPermissions();
      setPermissions(res.data);
    } catch {
      message.error('Error al cargar permisos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePermission(id);
      message.success('Permiso eliminado');
      fetchPermissions();
    } catch {
      message.error('Error al eliminar permiso');
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const columns = [
    { title: 'Nombre del permiso', dataIndex: 'name' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/permissions/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Eliminar este permiso?" onConfirm={() => handleDelete(record.id)}>
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => navigate('/permissions/create')}
        style={{ marginBottom: 16 }}
      >
        Nuevo Permiso
      </Button>
      <Table columns={columns} dataSource={permissions} rowKey="id" loading={loading} />
    </div>
  );
};

export default PermissionList;
