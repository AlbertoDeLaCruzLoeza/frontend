import {
  Button,
  Popconfirm,
  Space,
  Table,
  message,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFilteredBrandSuppliers,
  deleteBrandSupplier,
} from '../../../api/brandSupplierService';
import { getBrands } from '../../../api/brandsService';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface BrandSupplier {
  supplier_id: string;
  brand_name: string;
  supplier_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  supplier_is_active: string;
  brand_id: string;
}

const defaultFilters = {
  search: '',
  isActive: undefined as boolean | undefined,
  dateType: 'created_at' as 'created_at' | 'updated_at' | 'deleted_at',
  dateRange: [] as any[],
  brandIds: [] as number[],
};

const BrandSupplierList = () => {
  const [data, setData] = useState<BrandSupplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [brands, setBrands] = useState<{ brand_id: number; brand_name: string }[]>([]);

  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        search: filters.search || undefined,
        isActive: filters.isActive,
        brandIds: filters.brandIds.length > 0 ? filters.brandIds.join(',') : undefined,
      };
      if (filters.dateRange.length === 2) {
        params.dateType = filters.dateType;
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }

      const response = await getFilteredBrandSuppliers(params);
      const records = response.data?.data?.records || [];

      const mappedRecords: BrandSupplier[] = records.map((r: any) => ({
        supplier_id: r.supplier_id,
        brand_name: r.brand_name,
        supplier_name: r.supplier_name,
        contact_person: r.contact_person,
        email: r.email,
        phone: r.phone,
        address: r.address,
        supplier_is_active: r.supplier_is_active,
        brand_id: r.brand_id,
      }));

      setData(mappedRecords);
    } catch (error) {
      message.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await getBrands();
      const all = response.data?.data?.records || [];
      const uniqueBrands = Array.from(
        new Map(all.map((b: any) => [Number(b.brand_id), b.brand_name])),
        ([brand_id, brand_name]) => ({ brand_id, brand_name })
      );
      setBrands(uniqueBrands);
    } catch (error) {
      message.error('Error al cargar las marcas');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBrandSupplier(id);
      message.success('Relación eliminada');
      fetchData();
    } catch {
      message.error('No se pudo eliminar');
    }
  };

  useEffect(() => {
    fetchData();
    fetchBrands();
  }, []);

  const columns = [
    {
      title: 'Marca',
      dataIndex: 'brand_name',
      key: 'brand_name',
    },
    {
      title: 'Proveedor',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: 'Contacto',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Dirección',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '¿Activo?',
      dataIndex: 'supplier_is_active',
      key: 'supplier_is_active',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: BrandSupplier) => (
        <Space>
          <Button onClick={() => navigate(`/brand-suppliers/edit/${record.supplier_id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.supplier_id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space
        direction="vertical"
        size="middle"
        style={{ marginBottom: 16, width: '100%' }}
      >
        <Space wrap>
          <Input
            placeholder="Buscar por proveedor o marca"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="¿Activo?"
            value={filters.isActive}
            onChange={(value) => setFilters((prev) => ({ ...prev, isActive: value }))}
            style={{ width: 120 }}
            allowClear
          >
            <Option value={true}>Sí</Option>
            <Option value={false}>No</Option>
          </Select>
          <Select
            mode="multiple"
            placeholder="Filtrar por marcas"
            value={filters.brandIds}
            onChange={(values) => setFilters((prev) => ({ ...prev, brandIds: values }))}
            style={{ width: 250 }}
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {brands.map((brand) => (
              <Option key={brand.brand_id} value={brand.brand_id}>
                {brand.brand_name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Tipo de fecha"
            value={filters.dateType}
            onChange={(value) => setFilters((prev) => ({ ...prev, dateType: value }))}
            style={{ width: 150 }}
          >
            <Option value="created_at">Creación</Option>
            <Option value="updated_at">Actualización</Option>
            <Option value="deleted_at">Eliminación</Option>
          </Select>
          <RangePicker
            placeholder={['Fecha inicial', 'Fecha final']}
            value={filters.dateRange}
            onChange={(dates) =>
              setFilters((prev) => ({ ...prev, dateRange: dates || [] }))
            }
          />
          <Button type="primary" onClick={fetchData}>
            Buscar
          </Button>
          <Button
            onClick={() => {
              setFilters(defaultFilters);
              fetchData();
            }}
          >
            Limpiar filtros
          </Button>
        </Space>
      </Space>

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
        rowKey="supplier_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BrandSupplierList;
