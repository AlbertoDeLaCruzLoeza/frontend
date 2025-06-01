// src/modules/inventory-history/list/InventoryHistoryList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import {
  deleteInventoryHistory,
  getInventoryHistory,
} from '../../../api/inventoryHistoryService';
import { useNavigate } from 'react-router-dom';

const InventoryHistoryList = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getInventoryHistory();
      setHistory(res.data);
    } catch {
      message.error('Error al cargar historial');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryHistory(id);
      message.success('Registro eliminado');
      fetchHistory();
    } catch {
      message.error('Error al eliminar');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    { title: 'Producto ID', dataIndex: 'productId' },
    { title: 'Acción', dataIndex: 'action' },
    { title: 'Cantidad', dataIndex: 'quantity' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/inventory-history/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Eliminar historial?" onConfirm={() => handleDelete(record.id)}>
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
        onClick={() => navigate('/inventory-history/create')}
        style={{ marginBottom: 16 }}
      >
        Nuevo Historial
      </Button>
      <Table columns={columns} dataSource={history} rowKey="id" loading={loading} />
    </div>
  );
};

export default InventoryHistoryList;
