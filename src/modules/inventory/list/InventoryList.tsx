// src/modules/inventory/list/InventoryList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { deleteInventory, getInventory } from '../../../api/inventoryService';
import { useNavigate } from 'react-router-dom';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
      setInventory(res.data);
    } catch {
      message.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventory(id);
      message.success('Registro eliminado');
      fetchInventory();
    } catch {
      message.error('Error al eliminar');
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const columns = [
    { title: 'Producto ID', dataIndex: 'productId' },
    { title: 'Cantidad', dataIndex: 'quantity' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/inventory/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Seguro que deseas eliminar?" onConfirm={() => handleDelete(record.id)}>
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
        onClick={() => navigate('/inventory/create')}
        style={{ marginBottom: 16 }}
      >
        Nuevo Registro
      </Button>
      <Table columns={columns} dataSource={inventory} rowKey="id" loading={loading} />
    </div>
  );
};

export default InventoryList;
