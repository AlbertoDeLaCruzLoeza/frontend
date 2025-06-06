// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './modules/auth/form/LoginForm';
import RegisterForm from './modules/auth/form/RegisterForm';
import MainLayout from './layouts/MainLayout';
import EmailConfirmRedirect from './modules/auth/form/EmailConfirmRedirect';
import ActivationError from './modules/auth/form/activation-error';
import ActivationSuccess from './modules/auth/form/activation-success';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registro" element={<RegisterForm />} />
      <Route path="/auth/confirm-email" element={<EmailConfirmRedirect />} />
      <Route path="/activation-success" element={<ActivationSuccess />} />
      <Route path="/activation-error" element={<ActivationError />} />

      {/* Ruta protegida con layout y rutas internas */}
      {isAuthenticated ? (
        <Route path="/*" element={<MainLayout />} />
      ) : (
        <Route path="/*" element={<Navigate to="/home" replace />} />
      )}
    </Routes>
  );
};

export default App;
