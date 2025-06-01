import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import { useEffect, useState } from 'react';
import { getBrands, deleteBrand } from '../../../api/brandsService';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultFilters = {
    brandName: '',
    supplierId: undefined as number | undefined,
    isActive: undefined as boolean | undefined,
    createdRange: [] as any[],
    updatedRange: [] as any[],
  };

  const [filters, setFilters] = useState(defaultFilters);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (filters.brandName) params.brandName = filters.brandName;
      if (filters.supplierId !== undefined) params.supplierId = filters.supplierId;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.createdRange.length === 2) {
        params.createdStartDate = filters.createdRange[0].format('YYYY-MM-DD');
        params.createdEndDate = filters.createdRange[1].format('YYYY-MM-DD');
      }
      if (filters.updatedRange.length === 2) {
        params.updatedStartDate = filters.updatedRange[0].format('YYYY-MM-DD');
        params.updatedEndDate = filters.updatedRange[1].format('YYYY-MM-DD');
      }

      const res = await getBrands(params);
      setBrands(res.data);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al cargar marcas';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(id);
      message.success('Marca eliminada');
      fetchBrands();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al eliminar marca';
      message.error(msg);
    }
  };

  const handleCreate = () => {
    navigate('/brands/form');
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    fetchBrands();
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const columns = [
    { title: 'Nombre', dataIndex: 'name', key: 'name' }, // Corregido aquí
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    {
      title: 'Activo',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (val: boolean) => (val ? 'Sí' : 'No'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/brands/edit/${record.id}`)}>Editar</Button>
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
      <Space direction="vertical" size="middle" style={{ marginBottom: 16, width: '100%' }}>
        <Space wrap>
          <Input
            placeholder="Nombre de marca"
            value={filters.brandName}
            onChange={(e) => setFilters({ ...filters, brandName: e.target.value })}
          />
          <InputNumber
            placeholder="ID proveedor"
            value={filters.supplierId}
            onChange={(value) => setFilters({ ...filters, supplierId: value })}
          />
          <Select
            placeholder="¿Activo?"
            value={filters.isActive}
            onChange={(value) => setFilters({ ...filters, isActive: value })}
            style={{ width: 120 }}
            allowClear
          >
            <Select.Option value={true}>Sí</Select.Option>
            <Select.Option value={false}>No</Select.Option>
          </Select>
        </Space>
        <Space wrap>
          <RangePicker
            placeholder={['Fecha creación inicial', 'Fecha creación final']}
            value={filters.createdRange}
            onChange={(dates) => setFilters({ ...filters, createdRange: dates || [] })}
          />
          <RangePicker
            placeholder={['Fecha actualización inicial', 'Fecha actualización final']}
            value={filters.updatedRange}
            onChange={(dates) => setFilters({ ...filters, updatedRange: dates || [] })}
          />
        </Space>
        <Space wrap>
          <Button type="primary" onClick={fetchBrands}>
            Buscar
          </Button>
          <Button onClick={handleResetFilters}>
            Limpiar filtros
          </Button>
          <Button type="primary" onClick={handleCreate}>
            Nueva Marca
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default BrandList;
