import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/MainLayout';
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

import SupplierList from '../modules/suppliers/list/SupplierList';
import SupplierForm from '../modules/suppliers/form/SupplierForm';

import InventoryList from '../modules/inventory/list/InventoryList';
import InventoryForm from '../modules/inventory/form/InventoryForm';

import InventoryHistoryList from '../modules/inventory-history/list/InventoryHistoryList';
import InventoryHistoryForm from '../modules/inventory-history/form/InventoryHistoryForm';

import InventoryMovementList from '../modules/inventoryMovement/list/InventoryMovementList';
import InventoryMovementForm from '../modules/inventoryMovement/form/InventoryMovementForm';

import RoleList from '../modules/roles/list/RoleList';
import RoleForm from '../modules/roles/form/RoleForm';

import PermissionList from '../modules/permissions/list/PermissionList';
import PermissionForm from '../modules/permissions/form/PermissionForm';

import LoginForm from '../modules/auth/form/LoginForm';

const routes = createBrowserRouter([
  { path: 'login', element: <LoginForm /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '', element: <Navigate to="/login" replace /> },
      {
        path: 'brand-suppliers',
        children: [
          { path: '', element: <BrandSupplierList /> },
          { path: 'create', element: <BrandSupplierForm /> },
          { path: 'edit/:id', element: <BrandSupplierForm /> },
        ],
      },
      {
        path: 'brands',
        children: [
          { path: '', element: <BrandList /> },
          { path: 'create', element: <BrandForm /> },
          { path: 'edit/:id', element: <BrandForm /> },
        ],
      },
      {
        path: 'categories',
        children: [
          { path: '', element: <CategoryList /> },
          { path: 'create', element: <CategoryForm /> },
          { path: 'edit/:id', element: <CategoryForm /> },
        ],
      },
      {
        path: 'inventory',
        children: [
          { path: '', element: <InventoryList /> },
          { path: 'create', element: <InventoryForm /> },
          { path: 'edit/:id', element: <InventoryForm /> },
        ],
      },
      {
        path: 'inventory-history',
        children: [
          { path: '', element: <InventoryHistoryList /> },
          { path: 'create', element: <InventoryHistoryForm /> },
          { path: 'edit/:id', element: <InventoryHistoryForm /> },
        ],
      },
      {
        path: 'inventory-movement',
        children: [
          { path: '', element: <InventoryMovementList /> },
          { path: 'create', element: <InventoryMovementForm /> },
          { path: 'edit/:id', element: <InventoryMovementForm /> },
        ],
      },
      {
        path: 'permissions',
        children: [
          { path: '', element: <PermissionList /> },
          { path: 'create', element: <PermissionForm /> },
          { path: 'edit/:id', element: <PermissionForm /> },
        ],
      },
      {
        path: 'products',
        children: [
          { path: '/home', element: <ProductList /> },
          { path: 'create', element: <ProductForm /> },
          { path: 'edit/:id', element: <ProductForm /> },
        ],
      },
      {
        path: 'roles',
        children: [
          { path: '', element: <RoleList /> },
          { path: 'create', element: <RoleForm /> },
          { path: 'edit/:id', element: <RoleForm /> },
        ],
      },
      {
        path: 'suppliers',
        children: [
          { path: '', element: <SupplierList /> },
          { path: 'create', element: <SupplierForm /> },
          { path: 'edit/:id', element: <SupplierForm /> },
        ],
      },
      {
        path: 'users',
        children: [
          { path: '', element: <UserList /> },
          { path: 'create', element: <UserForm /> },
          { path: 'edit/:id', element: <UserForm /> },
        ],
      },
    ],
  },
]);

export default routes;
