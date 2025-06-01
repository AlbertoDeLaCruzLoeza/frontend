// src/modules/categories/list/CategoryList.tsx
import { Button, Popconfirm, Space, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../../api/categoriesService';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      message.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Categoría eliminada');
      fetchCategories();
    } catch {
      message.error('Error al eliminar categoría');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    { title: 'Nombre', dataIndex: 'name' },
    {
      title: 'Acciones',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/categories/edit/${record.id}`)}>Editar</Button>
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
        onClick={() => navigate('/categories/create')}
        style={{ marginBottom: 16 }}
      >
        Nueva Categoría
      </Button>
      <Table columns={columns} dataSource={categories} rowKey="id" loading={loading} />
    </div>
  );
};

export default CategoryList;
