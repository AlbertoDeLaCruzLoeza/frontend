// src/modules/auth/form/LoginForm.tsx
import { useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { login } from '../../../api/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const siteKey = '6LckoVIrAAAAAAmv_2Z52o4hK0nMDxFSpqeIBZoO'; // tu clave pública de reCAPTCHA

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    if (!recaptchaToken) {
      message.warning('Por favor, completa el reCAPTCHA');
      return;
    }

    setLoading(true);
    try {
      const res = await login(values); // 👈 ya no se envía recaptchaToken
      localStorage.setItem('token', res.data.token);
      message.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          message.error('Correo o contraseña inválidos');
        } else {
          message.error('Error del servidor. Intenta nuevamente.');
        }
      } else {
        message.error('Ocurrió un error inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f0f2f5',
      }}
    >
      <Card title="Iniciar Sesión" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaToken} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Ingresar
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            ¿No tienes cuenta? <a href="/registro">Regístrate</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
