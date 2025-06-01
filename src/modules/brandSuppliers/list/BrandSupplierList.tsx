import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockBrandSuppliers = [
  { id: 1, brandName: 'Microsoft', supplierName: 'Ingram Micro' },
  { id: 2, brandName: 'Apple', supplierName: 'Tech Data' },
  { id: 3, brandName: 'Samsung', supplierName: 'Synnex' },
  { id: 4, brandName: 'Sony', supplierName: 'Arrow Electronics' },
  { id: 5, brandName: 'LG', supplierName: 'Avnet' },
];

const BrandSupplierList = () => {
  const [data, setData] = useState(mockBrandSuppliers);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = (id: number) => {
    // Solo simulamos la eliminación en mock
    setData((prev) => prev.filter((item) => item.id !== id));
    message.success('Relación eliminada');
  };

  const columns = [
    {
      title: 'Marca',
      dataIndex: 'brandName',
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplierName',
    },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/brand-suppliers/edit/${record.id}`)}>
            Editar
          </Button>
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
      <Button
        type="primary"
        onClick={() => navigate('/brand-suppliers/form')}
        style={{ marginBottom: 16 }}
      >
        Nueva Relación
      </Button>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />
    </div>
  );
};

export default BrandSupplierList;
