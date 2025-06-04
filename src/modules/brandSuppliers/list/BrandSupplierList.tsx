import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFilteredBrandSuppliers,
  deleteBrandSupplier,
} from '../../../api/brandSupplierService';

interface BrandSupplier {
  id: number;
  brandName: string;
  supplierName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const BrandSupplierList = () => {
  const [data, setData] = useState<BrandSupplier[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getFilteredBrandSuppliers({
        // Puedes ajustar estos valores para los filtros reales del frontend
        startDate: '2024-01-01',
        endDate: '2025-12-31',
        dateType: 'created_at',
      });
      const records = response.data?.data?.records || [];
      setData(records);
    } catch (error) {
      message.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrandSupplier(id.toString());
      message.success('Relación eliminada');
      fetchData(); // refresca la lista
    } catch (error) {
      message.error('No se pudo eliminar');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: 'Marca',
      dataIndex: 'brand_name',
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplier_name',
    },
    {
      title: 'Acciones',
      render: (_: any, record: BrandSupplier) => (
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
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BrandSupplierList;
