// src/modules/products/list/ProductList.tsx
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
import { getProducts, deleteProduct } from '../../../api/productsService';
import { getBrands } from '../../../api/brandsService';
import { getSuppliers } from '../../../api/suppliersService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandsOptions, setBrandsOptions] = useState<any[]>([]);
  const [supplierOptions, setSupplierOptions] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    search: '',
    isActive: undefined as boolean | undefined,
    dateType: 'created_at' as 'created_at' | 'updated_at' | 'deleted_at',
    dateRange: [] as any[],
    brandIds: [] as string[],
    supplierIds: [] as string[],
  });

  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (filters.search) params.search = filters.search;
      if (filters.isActive !== undefined) {
        params.isActive = String(filters.isActive); // Convertir a string
      };
      if (
        filters.dateRange.length === 2 &&
        filters.dateType &&
        filters.dateRange[0] &&
        filters.dateRange[1]
      ) {
        params.dateType = filters.dateType;
        params.startDate = filters.dateRange[0].format('YYYY-MM-DD');
        params.endDate = filters.dateRange[1].format('YYYY-MM-DD');
      }
      if (filters.brandIds.length > 0) {
        params.brandIds = filters.brandIds.join(',');
      }
      if (filters.supplierIds.length > 0) {
        params.supplierIds = filters.supplierIds.join(',');
      }

      const res = await getProducts(params);
      const records = res.data?.data?.records || [];

      const uniqueProducts = Object.values(
        records.reduce((acc: any, item: any) => {
          const id = item.product_id;
          if (!acc[id]) {
            acc[id] = item;
          }
          return acc;
        }, {})
      );

      setProducts(uniqueProducts);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al cargar productos';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrandsAndSuppliers = async () => {
    try {
      const [brandsRes, suppliersRes] = await Promise.all([
        getBrands({}),
        getSuppliers({}),
      ]);
      const brandRecords = brandsRes.data?.data?.records || [];
      const supplierRecords = suppliersRes.data?.data?.records || [];

      const uniqueBrands = Array.from(
      new Map(brandRecords.map((b: any) => [b.brand_id, b])).values()
      );
      setBrandsOptions(
        uniqueBrands.map((b: any) => ({
          label: b.brand_name,
          value: b.brand_id,
        }))
      );


      setSupplierOptions(
        supplierRecords.map((s: any) => ({
          label: s.name,
          value: s.id,
        }))
      );
    } catch (err) {
      message.warning('Error al cargar marcas o proveedores');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Producto eliminado');
      fetchProducts();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Error al eliminar producto';
      message.error(msg);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      isActive: undefined,
      dateType: 'created_at',
      dateRange: [],
      brandIds: [],
      supplierIds: [],
    });
    fetchProducts();
  };

  useEffect(() => {
    fetchBrandsAndSuppliers();
    fetchProducts();
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'product_id', key: 'product_id' },
    { title: 'Nombre', dataIndex: 'name', key: 'name' },
    { title: 'Código', dataIndex: 'code', key: 'code' },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) =>
        new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(price),
    },
    { title: 'Marca', dataIndex: 'brand_name', key: 'brand_name' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/products/edit/${record.product_id}`)}>
            Editar
          </Button>
          <Popconfirm
            title="¿Seguro que deseas eliminar?"
            onConfirm={() => handleDelete(record.product_id)}
          >
            <Button danger>Eliminar</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Buscar productos"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <Select
            placeholder="¿Activo?"
            value={filters.isActive}
            onChange={(value) => setFilters({ ...filters, isActive: value })}
            allowClear
            style={{ width: 120 }}
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
          <Select
            mode="multiple"
            placeholder="Filtrar por marcas"
            value={filters.brandIds}
            onChange={(value) => setFilters({ ...filters, brandIds: value })}
            options={brandsOptions}
            style={{ minWidth: 200 }}
          />
          <Select
            mode="multiple"
            placeholder="Filtrar por proveedores"
            value={filters.supplierIds}
            onChange={(value) => setFilters({ ...filters, supplierIds: value })}
            options={supplierOptions}
            style={{ minWidth: 200 }}
          />
        </Space>

        <Space wrap>
          <Button type="primary" onClick={fetchProducts}>
            Buscar
          </Button>
          <Button onClick={handleResetFilters}>Limpiar filtros</Button>
          <Button type="primary" onClick={() => navigate('/products/form')}>
            Nuevo Producto
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="product_id"
      />
    </div>
  );
};

export default ProductList;
