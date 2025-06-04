import { logout } from '../../../api/authService'; // ajusta la ruta si es distinta
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const navigate = useNavigate();

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('token');
    message.success('Sesión cerrada correctamente');
    navigate('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    message.error('Error al cerrar sesión');
    // Si quieres limpiar localStorage aunque falle el logout:
    localStorage.removeItem('token');
    navigate('/login');
  }
};

export default handleLogout;