import { useSearchParams } from 'react-router-dom';
import { Typography, Button } from 'antd';

const { Title, Text } = Typography;

const ActivationSuccess = () => {
  const [params] = useSearchParams();
  const email = params.get('email');

  return (
    <div style={{ textAlign: 'center', paddingTop: '10vh' }}>
      <Title level={2}>¡Cuenta activada!</Title>
      <Text>Tu cuenta {email} fue activada correctamente.</Text>
      <br /><br />
      <Button type="primary" href="/login">Iniciar sesión</Button>
    </div>
  );
};

export default ActivationSuccess;
