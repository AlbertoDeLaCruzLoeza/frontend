// src/modules/auth/form/RegisterForm.tsx
import { Button, Card, Form, Input, message } from 'antd';
import { register } from '../../../api/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const siteKey = '6LfVDEwrAAAAAODAcPsp9Ypk_SETfk-PK1HgR0bE'; // ← reemplaza con tu clave del sitio de reCAPTCHA

const RegisterForm = () => {
  const navigate = useNavigate();
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const onFinish = async (values: any) => {
    if (!recaptchaToken) {
      message.warning('Por favor, completa el reCAPTCHA');
      return;
    }

    try {
      await register({ ...values, recaptchaToken });
      message.success('Registro exitoso');
      navigate('/login');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          const errorMessage = err.response.data?.message || 'El correo ya está registrado';
          message.error(errorMessage);
        } else {
          message.error('Error del servidor. Inténtalo más tarde.');
        }
      } else {
        message.error('Ocurrió un error inesperado.');
      }
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
      <Card title="Registro de Usuario" style={{ width: 400 }}>
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
            rules={[
              { required: true, message: 'La contraseña es obligatoria' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
                message:
                  'Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <ReCAPTCHA sitekey={siteKey} onChange={setRecaptchaToken} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Registrarse
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterForm;
