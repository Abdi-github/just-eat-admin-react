import { Spinner, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message }: PageLoaderProps) {
  const { t } = useTranslation();

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: '60vh' }}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" role="status" />
        <p className="text-muted mt-3 mb-0">{message || t('messages.loading')}</p>
      </div>
    </Container>
  );
}
