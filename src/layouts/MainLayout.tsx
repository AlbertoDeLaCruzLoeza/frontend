// src/layouts/MainLayout.tsx
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  UserOutlined,
  ShopOutlined,
  TagsOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet, Link, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

// Componentes de cada módulo
import Home from '../modules/home/Home';
import UserList from '../modules/users/list/UserList';
import UserForm from '../modules/users/form/UserForm';
import ProductList from '../modules/products/list/ProductList';
import ProductForm from '../modules/products/form/ProductForm';
import BrandList from '../modules/brands/list/BrandList';
import BrandForm from '../modules/brands/form/BrandForm';
import BrandSupplierList from '../modules/brandSuppliers/list/BrandSupplierList';
import BrandSupplierForm from '../modules/brandSuppliers/form/BrandSupplierForm';
import CategoryList from '../modules/categories/list/CategoryList';
import CategoryForm from '../modules/categories/form/CategoryForm';
import InventoryList from '../modules/inventory/list/InventoryList';
import InventoryForm from '../modules/inventory/form/InventoryForm';
import InventoryHistoryList from '../modules/inventory-history/list/InventoryHistoryList';
import InventoryHistoryForm from '../modules/inventory-history/form/InventoryHistoryForm';
import InventoryMovementForm from '../modules/inventoryMovement/form/InventoryMovementForm';
import PermissionList from '../modules/permissions/list/PermissionList';
import PermissionForm from '../modules/permissions/form/PermissionForm';
import RoleList from '../modules/roles/list/RoleList';
import RoleForm from '../modules/roles/form/RoleForm';
import SupplierList from '../modules/suppliers/list/SupplierList';
import SupplierForm from '../modules/suppliers/form/SupplierForm';
import ActionLogList from '../modules/actionLogs/list/ActionLogList';

const { Header, Content, Sider } = Layout;

const breadcrumbNames: Record<string, string> = {
  users: 'Usuarios',
  products: 'Productos',
  brands: 'Marcas',
  'brand-suppliers': 'Marca/Proveedor',
  'action-logs': 'Registros',
};

const breadcrumbActions: Record<string, Record<string, string>> = {
  users: {
    form: 'Nuevo Usuario',
    edit: 'Editar Usuario',
  },
  products: {
    form: 'Nuevo Producto',
    edit: 'Editar Producto',
  },
  brands: {
    form: 'Nueva Marca',
    edit: 'Editar Marca',
  },
  'brand-suppliers': {
    form: 'Nuevo Relacion Marca/Proveedor',
    edit: 'Editar Relacion Marca/Proveedor',
  },
};

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  useEffect(() => {
    const main = pathSnippets[0];
    const action = pathSnippets[1];

    const title =
      breadcrumbActions[main]?.[action] ||
      breadcrumbNames[main] ||
      'Inicio';

    document.title = `${title} | Mi App`;
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', width: '100vw' }}>
      <Sider collapsible>
        <div style={{ color: '#fff', padding: 16, fontWeight: 'bold' }}>Mi App</div>
        <Menu theme="dark" selectedKeys={[`/${pathSnippets[0] || ''}`]} mode="inline">
          <Menu.Item key="/users" icon={<UserOutlined />}><Link to="/users">Usuarios</Link></Menu.Item>
          <Menu.Item key="/products" icon={<ShopOutlined />}><Link to="/products">Productos</Link></Menu.Item>
          <Menu.Item key="/brands" icon={<TagsOutlined />}><Link to="/brands">Marcas</Link></Menu.Item>
          <Menu.Item key="/brand-suppliers" icon={<TeamOutlined />}><Link to="/brand-suppliers">Marca/Proveedor</Link></Menu.Item>
          <Menu.Item key="/action-logs" icon={<FileTextOutlined />}><Link to="/action-logs">Registros</Link></Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>Cerrar sesión</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ width: '100%' }}>
        <Header style={{ background: '#fff', paddingLeft: 24, fontWeight: 'bold' }}>
          {breadcrumbNames[pathSnippets[0]] || 'Inicio'}
        </Header>

        <Content style={{ padding: '16px' }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item><Link to="/">Inicio</Link></Breadcrumb.Item>
            {pathSnippets.map((part, index) => {
              const key = pathSnippets[index];
              const parent = pathSnippets[0];

              if ((key === 'form' || key === 'edit') && breadcrumbActions[parent]) {
                return (
                  <Breadcrumb.Item key={index}>
                    {breadcrumbActions[parent][key] || key}
                  </Breadcrumb.Item>
                );
              }

              return (
                <Breadcrumb.Item key={index}>
                  {breadcrumbNames[key] || key}
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>

          <div style={{ padding: 24, background: '#fff', minHeight: 'calc(100vh - 160px)' }}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/users" element={<UserList />} />
              <Route path="/users/form" element={<UserForm />} />
              <Route path="/users/edit/:id" element={<UserForm />} />

              <Route path="/products" element={<ProductList />} />
              <Route path="/products/form" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />

              <Route path="/brands" element={<BrandList />} />
              <Route path="/brands/form" element={<BrandForm />} />
              <Route path="/brands/edit/:id" element={<BrandForm />} />

              <Route path="/brand-suppliers" element={<BrandSupplierList />} />
              <Route path="/brand-suppliers/form" element={<BrandSupplierForm />} />
              <Route path="/brand-suppliers/edit/:id" element={<BrandSupplierForm />} />

              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/form" element={<CategoryForm />} />
              <Route path="/categories/edit/:id" element={<CategoryForm />} />

              <Route path="/inventory" element={<InventoryList />} />
              <Route path="/inventory/form" element={<InventoryForm />} />
              <Route path="/inventory/edit/:id" element={<InventoryForm />} />

              <Route path="/inventory-history" element={<InventoryHistoryList />} />
              <Route path="/inventory-history/form" element={<InventoryHistoryForm />} />
              <Route path="/inventory-history/edit/:id" element={<InventoryHistoryForm />} />

              <Route path="/inventory-movement/form" element={<InventoryMovementForm />} />
              <Route path="/inventory-movement/edit/:id" element={<InventoryMovementForm />} />

              <Route path="/permissions" element={<PermissionList />} />
              <Route path="/permissions/form" element={<PermissionForm />} />
              <Route path="/permissions/edit/:id" element={<PermissionForm />} />

              <Route path="/roles" element={<RoleList />} />
              <Route path="/roles/form" element={<RoleForm />} />
              <Route path="/roles/edit/:id" element={<RoleForm />} />

              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/suppliers/form" element={<SupplierForm />} />
              <Route path="/suppliers/edit/:id" element={<SupplierForm />} />

              <Route path="/action-logs" element={<ActionLogList />} />
            </Routes>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
