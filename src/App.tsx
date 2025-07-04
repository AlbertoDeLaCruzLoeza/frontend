// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './modules/auth/form/LoginForm';
import RegisterForm from './modules/auth/form/RegisterForm';
import MainLayout from './layouts/MainLayout';
import EmailConfirmRedirect from './modules/auth/form/EmailConfirmRedirect';
import ActivationError from './modules/auth/form/activation-error';
import ActivationSuccess from './modules/auth/form/activation-success';

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail'); // Recuperar email del login

  return (
    <NovuProvider
      subscriberId={userEmail || 'anonimo'}
      applicationIdentifier="635fa0d994282ddc7b10735c6f32b7d9"
    >
      <Routes>

        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Rutas públicas */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/registro" element={<RegisterForm />} />
        <Route path="/auth/confirm-email" element={<EmailConfirmRedirect />} />
        <Route path="/activation-success" element={<ActivationSuccess />} />
        <Route path="/activation-error" element={<ActivationError />} />

        {/* Rutas protegidas */}
        {isAuthenticated ? (
          <Route path="/*" element={<MainLayout />} />
        ) : (
          <Route path="/*" element={<Navigate to="/home" replace />} />
        )}
      </Routes>
    </NovuProvider>
  );
};

export default App;
