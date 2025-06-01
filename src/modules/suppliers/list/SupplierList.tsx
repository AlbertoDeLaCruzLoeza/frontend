// src/modules/suppliers/list/SupplierList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getSuppliers, deleteSupplier } from '../../../api/suppliersService';
import { useNavigate } from 'react-router-dom';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
      setSuppliers(res.data);
    } catch {
      message.error('Error al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplier(id);
      message.success('Proveedor eliminado');
      fetchSuppliers();
    } catch {
      message.error('Error al eliminar proveedor');
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const columns = [
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Contacto', dataIndex: 'contact' },
    { title: 'Teléfono', dataIndex: 'phone' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/suppliers/edit/${record.id}`)}>Editar</Button>
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
      <Button type="primary" onClick={() => navigate('/suppliers/create')} style={{ marginBottom: 16 }}>
        Nuevo Proveedor
      </Button>
      <Table columns={columns} dataSource={suppliers} rowKey="id" loading={loading} />
    </div>
  );
};

export default SupplierList;
