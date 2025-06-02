// src/modules/products/list/ProductList.tsx
import { Button, DatePicker, Input, Popconfirm, Select, Space, Switch, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getProducts, deleteProduct } from '../../../api/productsService';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;

interface Filters {
  search: string;
  createdStartDate: string;
  createdEndDate: string;
  updatedStartDate: string;
  updatedEndDate: string;
  isActive?: string; // o isActive: string | undefined
  brandIds: string;
  supplierIds: string;
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    createdStartDate: '',
    createdEndDate: '',
    updatedStartDate: '',
    updatedEndDate: '',
    isActive: undefined,
    brandIds: '',
    supplierIds: ''
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
      setProducts(res.data);
    } catch {
      message.error('Error al cargar productos');
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
    { title: 'Nombre', dataIndex: 'name' },
    { title: 'Precio', dataIndex: 'price' },
    { title: 'Stock', dataIndex: 'stock' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/products/edit/${record.id}`)}>Editar</Button>
          <Popconfirm title="¿Seguro que deseas eliminar?" onConfirm={() => handleDelete(record.id)}>
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
        rowKey={(record, index) => record.id || index}
      />
    </div>
  );
};

export default ProductList;
