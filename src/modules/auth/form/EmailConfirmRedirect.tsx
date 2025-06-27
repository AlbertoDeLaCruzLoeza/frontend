import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Card, Typography } from 'antd';
import {
  CheckCircleTwoTone,
  InfoCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { getToken } from 'firebase/messaging';
import { messaging } from '../../../firebase';
import { NotificationCenter } from '@novu/notification-center';

const { Title, Text } = Typography;

const EmailConfirmRedirect = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [status, setStatus] = useState<'loading' | 'confirmed' | 'alreadyConfirmed' | 'error'>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [showNovu, setShowNovu] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    const confirmEmail = async () => {
      if (didRun.current) return;
      didRun.current = true;

      if (!token) {
        setStatus('error');
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/confirm-email`, {
          params: { token },
          validateStatus: () => true,
        });

        const statusFromBackend = res.data?.data?.records?.status;
        const userIdFromBackend = res.data?.data?.records?.user_id;

        if (statusFromBackend === 'confirmed') {
          setStatus('confirmed');
          if (userIdFromBackend) setUserId(userIdFromBackend.toString());
        } else if (statusFromBackend === 'alreadyConfirmed') {
          setStatus('alreadyConfirmed');
        } else {
          setStatus('error');
        }
      } catch (err) {
        console.error('Error al confirmar el correo:', err);
        setStatus('error');
      }
    };

    confirmEmail();
  }, [token]);

  useEffect(() => {
    const registrarDispositivoConNovu = async () => {
      if (status !== 'confirmed' || !userId) return;

      try {
        // Obtener token FCM para push
        const fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (!fcmToken) {
          console.warn('No se pudo obtener el token FCM');
          return;
        }

        // Mostrar el widget de Novu y registrarse
        setShowNovu(true);

        // Aquí podrías hacer llamada a tu backend para registrar el fcmToken junto con userId
        // para que Novu pueda enviar notificaciones push luego (opcional).

      } catch (error) {
        console.error('Error obteniendo token push:', error);
      }
    };

    registrarDispositivoConNovu();
  }, [status, userId]);

  const renderIcon = () => {
    switch (status) {
      case 'loading':
        return <LoadingOutlined style={{ fontSize: 64, color: '#1890ff' }} spin />;
      case 'confirmed':
        return <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 64 }} />;
      case 'alreadyConfirmed':
        return <InfoCircleTwoTone twoToneColor="#faad14" style={{ fontSize: 64 }} />;
      case 'error':
        return <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 64 }} />;
    }
  };

  const renderTitle = () => {
    switch (status) {
      case 'loading':
        return 'Confirmando tu cuenta...';
      case 'confirmed':
        return '¡Cuenta activada con éxito!';
      case 'alreadyConfirmed':
        return 'Tu cuenta ya había sido activada';
      case 'error':
        return 'Error al activar la cuenta';
    }
  };

  const renderMessage = () => {
    switch (status) {
      case 'loading':
        return 'Por favor espera un momento.';
      case 'confirmed':
        return 'Ya puedes iniciar sesión con tu correo electrónico.';
      case 'alreadyConfirmed':
        return 'Puedes iniciar sesión normalmente.';
      case 'error':
        return 'El enlace es inválido, ha expirado o ya fue usado. Si crees que esto es un error, contacta a soporte@example.com';
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          padding: 32,
          textAlign: 'center',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        }}
      >
        <div style={{ marginBottom: 24 }}>{renderIcon()}</div>
        <Title level={3} style={{ marginBottom: 12 }}>
          {renderTitle()}
        </Title>
        <Text style={{ display: 'block', marginBottom: 24 }}>{renderMessage()}</Text>
        {(status === 'confirmed' || status === 'alreadyConfirmed') && (
          <Button type="primary" block onClick={() => navigate('/login')}>
            Ir al login
          </Button>
        )}

        {/* Aquí se monta el widget de Novu para notificaciones */}
        {showNovu && userId && (
          <NotificationCenter
            subscriberId={userId}
            applicationIdentifier={import.meta.env.VITE_PUBLIC_NOVU_APP_ID}
            // Opcional: puedes personalizar tema, posición, etc.
          />
        )}
      </Card>
    </div>
  );
};

export default EmailConfirmRedirect;
