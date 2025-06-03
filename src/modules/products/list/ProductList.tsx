import {
  Button,
  DatePicker,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../../api/productsService';

const { RangePicker } = DatePicker;

interface Filters {
  search: string;
  createdStartDate: string;
  createdEndDate: string;
  updatedStartDate: string;
  updatedEndDate: string;
  isActive?: string;
  brandIds: string;
  supplierIds: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: '',
    createdStartDate: '',
    createdEndDate: '',
    updatedStartDate: '',
    updatedEndDate: '',
    isActive: undefined,
    brandIds: '',
    supplierIds: '',
  });

  const navigate = useNavigate();

  const cleanFilters = (filters: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    for (const key in filters) {
      const val = filters[key];
      if (val !== '' && val !== undefined && val !== null) {
        cleaned[key] = val;
      }
    }
    return cleaned;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = cleanFilters(filters);
      const res = await getProducts(params);
      const records = res?.data?.data?.records;
      setProducts(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      message.error('Error al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      message.success('Producto eliminado');
      fetchProducts();
    } catch {
      message.error('Error al eliminar');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchChange = (e: any) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleCreatedDateChange = (_: any, dateStrings: [string, string]) => {
    setFilters({
      ...filters,
      createdStartDate: dateStrings[0],
      createdEndDate: dateStrings[1],
    });
  };

  const handleUpdatedDateChange = (_: any, dateStrings: [string, string]) => {
    setFilters({
      ...filters,
      updatedStartDate: dateStrings[0],
      updatedEndDate: dateStrings[1],
    });
  };

  const handleActiveChange = (checked: boolean) => {
    setFilters({ ...filters, isActive: String(checked) });
  };

  const handleBrandChange = (value: string[]) => {
    setFilters({ ...filters, brandIds: value.join(',') });
  };

  const handleSupplierChange = (value: string[]) => {
    setFilters({ ...filters, supplierIds: value.join(',') });
  };

  const handleSearch = () => {
    fetchProducts();
  };

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
          minimumFractionDigits: 2,
        }).format(price),
    },
    { title: 'Marca', dataIndex: 'brand_name', key: 'brand_name' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/products/edit/${record.product_id}`)}>Editar</Button>
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
      <Space direction="vertical" style={{ marginBottom: 16, width: '100%' }}>
        <Space wrap>
          <Input
            placeholder="Buscar productos"
            value={filters.search}
            onChange={handleSearchChange}
            style={{ width: 200 }}
          />
          <RangePicker onChange={handleCreatedDateChange} placeholder={['Creado desde', 'hasta']} />
          <RangePicker onChange={handleUpdatedDateChange} placeholder={['Actualizado desde', 'hasta']} />
          <Select
            mode="multiple"
            style={{ width: 150 }}
            placeholder="Marcas"
            onChange={handleBrandChange}
            options={[
              { label: 'Marca 1', value: '1' },
              { label: 'Marca 2', value: '2' },
            ]}
          />
          <Select
            mode="multiple"
            style={{ width: 150 }}
            placeholder="Proveedores"
            onChange={handleSupplierChange}
            options={[
              { label: 'Proveedor 1', value: '5' },
              { label: 'Proveedor 2', value: '9' },
            ]}
          />
          <span>Activo:</span>
          <Switch onChange={handleActiveChange} checked={filters.isActive === 'true'} />
          <Button type="primary" onClick={handleSearch}>Buscar</Button>
        </Space>
        <Button type="primary" onClick={() => navigate('/products/form')}>
          Nuevo Producto
        </Button>
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
