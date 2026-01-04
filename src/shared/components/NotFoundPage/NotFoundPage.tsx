import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '60vh' }}
    >
      <Card className="border-0 shadow-sm text-center" style={{ maxWidth: 480 }}>
        <Card.Body className="p-5">
          <div className="text-muted mb-3" style={{ fontSize: '5rem', lineHeight: 1 }}>
            404
          </div>
          <h4 className="mb-2">{t('errors.notFound', { defaultValue: 'Page Not Found' })}</h4>
          <p className="text-muted mb-4">
            {t('errors.notFoundDescription', {
              defaultValue: 'The page you are looking for does not exist or has been moved.',
            })}
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            {t('nav.dashboard', { defaultValue: 'Go to Dashboard' })}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
