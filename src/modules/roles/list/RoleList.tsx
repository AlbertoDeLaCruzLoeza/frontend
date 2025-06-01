// src/modules/roles/list/RoleList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { deleteRole, getRoles } from '../../../api/rolesService';
import { useNavigate } from 'react-router-dom';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await getRoles();
      setRoles(res.data);
    } catch {
      message.error('Error al cargar roles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRole(id);
      message.success('Rol eliminado');
      fetchRoles();
    } catch {
      message.error('Error al eliminar rol');
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns = [
    { title: 'Nombre del rol', dataIndex: 'name' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/roles/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Eliminar este rol?" onConfirm={() => handleDelete(record.id)}>
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
        onClick={() => navigate('/roles/create')}
        style={{ marginBottom: 16 }}
      >
        Nuevo Rol
      </Button>
      <Table columns={columns} dataSource={roles} rowKey="id" loading={loading} />
    </div>
  );
};

export default RoleList;
