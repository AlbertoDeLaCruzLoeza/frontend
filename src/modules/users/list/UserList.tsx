// src/modules/users/list/UserList.tsx
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import { deleteUser, getUsers } from '../../../api/usersService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchUsers = async (filters = {}) => {
  setLoading(true);
  try {
    const res = await getUsers(filters);
    const records = res.data.data.records || [];
    setUsers(records);
  } catch {
    message.error('Error al cargar usuarios');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchUsers(); // carga inicial sin filtros
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      message.success('Usuario eliminado');
      fetchUsers();
    } catch {
      message.error('Error al eliminar');
    }
  };

  const onFinish = (values: any) => {
    const { email, is_active, dateType, dateRange } = values;
    const filters: any = {};

    if (email) filters.email = email;
    if (is_active !== undefined) filters.isActive = is_active;
    if (dateType && dateRange?.length === 2) {
      filters.dateType = dateType;
      filters.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
      filters.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    }

    fetchUsers(filters);
  };

  const columns = [
    {
      title: 'Usuario ID',
      dataIndex: 'user_id'
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      render: (text: string) => {
        const isActive = text === 'Sí';
        return isActive ? (
          <span style={{ color: 'green' }}>Activo</span>
        ) : (
          <span style={{ color: 'red' }}>Inactivo</span>
        );
      },
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: any) => (
        <Space>
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        layout="inline"
        onFinish={onFinish}
        style={{ marginBottom: 16, gap: 8, flexWrap: 'wrap' }}
      >
        <Form.Item name="email">
          <Input placeholder="Buscar por correo" allowClear />
        </Form.Item>

        <Form.Item name="is_active">
          <Select placeholder="Estado" allowClear style={{ width: 120 }}>
            <Select.Option value="true">Activo</Select.Option>
            <Select.Option value="false">Inactivo</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateType">
          <Select placeholder="Tipo de fecha" allowClear style={{ width: 150 }}>
            <Select.Option value="created_at">Creación</Select.Option>
            <Select.Option value="updated_at">Actualización</Select.Option>
            <Select.Option value="deleted_at">Eliminación</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateRange">
          <RangePicker />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Filtrar
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="user_id"
        loading={loading}
      />
    </div>
  );
};

export default UserList;
