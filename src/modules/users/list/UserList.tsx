// src/modules/users/list/UserList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '../../../api/usersService';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch {
      message.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('Usuario eliminado');
      fetchUsers();
    } catch {
      message.error('Error al eliminar');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Correo', dataIndex: 'email' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space> 
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
    </div>
  );
};

export default UserList;
