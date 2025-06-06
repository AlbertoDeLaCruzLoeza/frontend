// src/pages/auth/EmailConfirmRedirect.tsx
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import axios from 'axios';

const { Title, Text } = Typography;

const EmailConfirmRedirect = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'confirmed' | 'alreadyConfirmed' | 'error'>('loading');

  // Ref para evitar que el efecto se ejecute más de una vez
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

        console.log('Respuesta backend confirm-email:', res.status, res.data);

        const statusFromBackend = res.data?.data?.records?.status;

        if (statusFromBackend === 'confirmed') setStatus('confirmed');
        else if (statusFromBackend === 'alreadyConfirmed') setStatus('alreadyConfirmed');
        else setStatus('error');
      } catch (err) {
        console.error('Error al confirmar el correo:', err);
        setStatus('error');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      {status === 'loading' && (
        <>
          <Spin size="large" />
          <Title level={4} style={{ marginTop: 20 }}>Confirmando tu cuenta...</Title>
          <Text>Espera un momento mientras procesamos la activación.</Text>
        </>
      )}
      {status === 'confirmed' && (
        <>
          <Title level={3}>🎉 ¡Cuenta activada con éxito!</Title>
          <Text>Ya puedes iniciar sesión con tu correo electrónico.</Text>
        </>
      )}
      {status === 'alreadyConfirmed' && (
        <>
          <Title level={3}>🔓 Cuenta ya activada</Title>
          <Text>Tu cuenta ya había sido activada previamente.</Text>
        </>
      )}
      {status === 'error' && (
        <>
          <Title level={3} type="danger">❌ Error en la activación</Title>
          <Text>El enlace no es válido, ha expirado o ya fue usado.</Text>
        </>
      )}
    </div>
  );
};

export default EmailConfirmRedirect;
