import { useRef, useState } from 'react';
import { Button, Card, Form, Input, message } from 'antd';
import { login } from '../../../api/authService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

import { getToken } from 'firebase/messaging';
import { messaging } from '../../../firebase';

const siteKey = '6LckoVIrAAAAAAmv_2Z52o4hK0nMDxFSpqeIBZoO';

const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const onFinish = async (values: any) => {
    if (!recaptchaToken) {
      message.warning('Por favor, completa el reCAPTCHA');
      return;
    }

    setLoading(true);
    try {
      // 🔔 Obtener permiso y token FCM antes del login
      let fcmToken: string | null = null;
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (fcmToken) {
          console.log('Token FCM obtenido:', fcmToken);
        } else {
          console.warn('No se pudo obtener el token FCM');
        }
      } else {
        console.warn('El usuario rechazó los permisos de notificación');
      }

      const loginPayload = {
        ...values,
        recaptchaToken,
        fcmToken, 
      };

      const res: any = await login(loginPayload);
      const token = res.data?.data?.records?.login_token;
      const userId = res.data?.data?.records?.user_id;

      if (userId) {
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId.toString());
        message.success('Inicio de sesión exitoso');
        navigate('/home');
      } else {
        console.error('No se recibió el token de autenticación o userId');
      }
    } catch (err: any) {
      console.error('Error en el login:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          message.error('Correo o contraseña inválidos');
        } else if (
          err.response?.data?.message === 'reCAPTCHA inválido' ||
          err.response?.data?.message?.includes('recaptcha')
        ) {
          message.error('El reCAPTCHA expiró o no es válido. Intenta de nuevo.');
        } else {
          message.error('Usuario no registrado. Verifica tus datos.');
        }
      } else {
        message.error('Ocurrió un error inesperado.');
      }
    } finally {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
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
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={setRecaptchaToken}
              onExpired={() => {
                setRecaptchaToken(null);
                message.warning('El reCAPTCHA ha expirado, por favor verifícalo nuevamente.');
              }}
              onErrored={() => {
                setRecaptchaToken(null);
                message.error('Error al cargar reCAPTCHA, intenta recargar la página.');
              }}
            />
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
