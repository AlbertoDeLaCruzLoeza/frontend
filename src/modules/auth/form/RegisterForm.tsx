// src/modules/auth/form/RegisterForm.tsx
import { Button, Card, Form, Input, message } from 'antd';
import { register } from '../../../api/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const siteKey = '6LckoVIrAAAAAAmv_2Z52o4hK0nMDxFSpqeIBZoO'; // ← reemplaza con tu clave real

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const onFinish = async (values: { email: string; password: string }) => {
    if (!recaptchaToken) {
      message.warning('Por favor, completa el reCAPTCHA');
      return;
    }

    setLoading(true);
    try {
      console.log('Valores enviados al backend:', { ...values, recaptchaToken });
      const response = await register({ ...values, recaptchaToken });
      message.success(response.message || 'Registro exitoso');
      navigate('/login');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const backendMessage = err.response?.data?.message;

        if (status === 409) {
          message.error('El email ya está registrado');
        } else if (status === 400 || status === 401) {
          message.error(backendMessage || 'Datos inválidos');
        } else {
          message.error('Error del servidor. Inténtalo más tarde.');
        }
      } else {
        message.error('Ocurrió un error inesperado.');
      }

      // Reiniciar el reCAPTCHA en caso de error
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
            <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            onChange={(token) => {
              console.log('reCAPTCHA token generado:', token);
              setRecaptchaToken(token);
            }}
          />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
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
