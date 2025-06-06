import { useSearchParams } from 'react-router-dom';
import { Typography, Button } from 'antd';

const { Title, Text } = Typography;

const ActivationError = () => {
  const [params] = useSearchParams();
  const message = params.get('message') || 'Ocurrió un error al activar tu cuenta.';

  return (
    <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
      <Title level={2}>Error de activación</Title>
      <Text type="danger">{message}</Text>
      <br /><br />
      <Button href="/">Volver al inicio</Button>
    </div>
  );
};

export default ActivationError;
