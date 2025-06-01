// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './modules/auth/form/LoginForm';
import RegisterForm from './modules/auth/form/RegisterForm';
import MainLayout from './layouts/MainLayout';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/registro" element={<RegisterForm />} />
      <Route
        path="/*"
        element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
