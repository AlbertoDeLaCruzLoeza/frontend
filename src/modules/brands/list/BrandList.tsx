// src/modules/brands/list/BrandList.tsx
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
  Select,
  DatePicker,
} from 'antd';
import { useEffect, useState } from 'react';
import { getBrands, deleteBrand } from '../../../api/brandsService';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultFilters = {
    search: '',
    isActive: undefined as boolean | undefined,
    dateType: 'created_at' as 'created_at' | 'updated_at' | 'deleted_at',
    dateRange: [] as any[],
  };

  const [filters, setFilters] = useState(defaultFilters);
  const navigate = useNavigate();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (filters.search) params.search = filters.search;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.dateRange.length === 2) {
        params.dateType = filters.dateType;
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const res = await getBrands(params);
      setBrands(res.data.records);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al cargar marcas';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrand(String(id));
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
    { title: 'Marca', dataIndex: 'name', key: 'name' },
    { title: 'Descripción', dataIndex: 'description', key: 'description' },
    { title: '¿Activa?', dataIndex: 'isActive', key: 'isActive' },
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
            placeholder="Buscar por nombre o descripción"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            placeholder="¿Activo?"
            value={filters.isActive}
            onChange={(value) => setFilters({ ...filters, isActive: value })}
            style={{ width: 120 }}
            allowClear
          >
            <Option value={true}>Sí</Option>
            <Option value={false}>No</Option>
          </Select>
          <Select
            placeholder="Tipo de fecha"
            value={filters.dateType}
            onChange={(value) => setFilters({ ...filters, dateType: value })}
            style={{ width: 150 }}
          >
            <Option value="created_at">Creación</Option>
            <Option value="updated_at">Actualización</Option>
            <Option value="deleted_at">Eliminación</Option>
          </Select>
          <RangePicker
            placeholder={['Fecha inicial', 'Fecha final']}
            value={filters.dateRange}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates || [] })}
          />
        </Space>

        <Space wrap>
          <Button type="primary" onClick={fetchBrands}>
            Buscar
          </Button>
          <Button onClick={handleResetFilters}>Limpiar filtros</Button>
          <Button type="primary" onClick={handleCreate}>
            Nueva Marca
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={brands}
        rowKey={(record) => record.id}
        loading={loading}
      />
    </div>
  );
};

export default BrandList;
