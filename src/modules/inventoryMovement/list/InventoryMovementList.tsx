// src/modules/inventory-movement/list/InventoryMovementList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getInventoryMovements, deleteInventoryMovement } from '../../../api/inventoryMovementService';
import { useNavigate } from 'react-router-dom';

const InventoryMovementList = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const res = await getInventoryMovements();
      setMovements(res.data);
    } catch {
      message.error('Error al cargar movimientos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryMovement(id);
      message.success('Movimiento eliminado');
      fetchMovements();
    } catch {
      message.error('Error al eliminar');
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const columns = [
    { title: 'Producto ID', dataIndex: 'productId' },
    { title: 'Tipo', dataIndex: 'type' },
    { title: 'Cantidad', dataIndex: 'quantity' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/inventory-movement/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Eliminar este movimiento?" onConfirm={() => handleDelete(record.id)}>
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
        onClick={() => navigate('/inventory-movement/create')}
        style={{ marginBottom: 16 }}
      >
        Nuevo Movimiento
      </Button>
      <Table columns={columns} dataSource={movements} rowKey="id" loading={loading} />
    </div>
  );
};

export default InventoryMovementList;
