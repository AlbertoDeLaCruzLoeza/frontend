// src/modules/users/list/UserList.tsx
import {
  Button,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  message,
  Popconfirm,
} from 'antd';
import { useEffect, useState } from 'react';
import { deleteUser, getUsers, reactivateUser } from '../../../api/usersService'; 
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

  const handleReactivate = async (id: string) => {
    try {
      await reactivateUser(id);
      message.success('Usuario reactivado');
      fetchUsers();
    } catch {
      message.error('Error al reactivar');
    }
  };

  const onFinish = (values: any) => {
    const { email, is_active, dateType, dateRange } = values;
    const filters: any = {};

    if (email) filters.email = email;
    if (is_active !== undefined) {
      if (is_active === 'pending') {
        filters.pending = true;
      } else {
        filters.isActive = is_active;
      }
    }
    if (dateType && dateRange?.length === 2) {
      filters.dateType = dateType;
      filters.startDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
      filters.endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    }

    console.log('Filtros enviados:', filters);

    fetchUsers(filters);
  };

  const onReset = () => {
    form.resetFields();
    fetchUsers();
  };

  const columns = [
    {
      title: 'Usuario ID',
      dataIndex: 'user_id',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Estado',
      dataIndex: 'is_active',
      render: (_: any, record: any) => {
        const isPendingActivation =
          record.activation_token && !record.activated_at && !record.deleted_at;
        const isActive = record.is_active === true || record.is_active === 'true' || record.is_active === 'Sí';

        if (isPendingActivation) {
          return <span style={{ color: 'orange' }}>Inactivo (Pendiente de activar)</span>;
        }

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
  render: (_: any, record: any) => {
    const isPendingActivation =
      record.activation_token && !record.activated_at && !record.deleted_at;
    const isDeleted = !!record.deleted_at;

    return (
      <Space>
        <Button onClick={() => navigate(`/users/edit/${record.user_id}`)}>
          Editar
        </Button>

        {isPendingActivation ? null : isDeleted ? (
          <Button type="default" onClick={() => handleReactivate(record.user_id)}>
            Reactivar
          </Button>
        ) : (
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.user_id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        )}
      </Space>
    );
  },
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
          <Select placeholder="Estado" allowClear style={{ width: 150 }}>
            <Select.Option value={true}>Activo</Select.Option>
            <Select.Option value={false}>Inactivo</Select.Option>
            <Select.Option value="pending">Pendiente de activación</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="dateType">
          <Select placeholder="Tipo de fecha" allowClear style={{ width: 150 }}>
            <Select.Option value="created_at">Creación</Select.Option>
            <Select.Option value="updated_at">Actualización</Select.Option>
            <Select.Option value="deleted_at">Eliminación</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="dateRange"
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length !== 2) return Promise.resolve();

                const [start, end] = value;
                const today = dayjs().endOf('day');

                if (start && start.isAfter(today)) {
                  return Promise.reject(new Error('La fecha inicial no puede ser futura'));
                }

                if (end && end.isAfter(today)) {
                  return Promise.reject(new Error('La fecha final no puede ser futura'));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <RangePicker
            disabledDate={(current) => current && current > dayjs().endOf('day')}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Filtrar
            </Button>
            <Button onClick={onReset}>Limpiar filtros</Button>
            <Button type="dashed" onClick={() => navigate('/users/form')}>
              Crear usuario nuevo
            </Button>
          </Space>
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
