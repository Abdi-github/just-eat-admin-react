import { Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { SendNotificationForm } from '../components/SendNotificationForm';

export function NotificationsPage() {
  const { t } = useTranslation('notifications');

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">{t('title')}</h2>
      <SendNotificationForm />
    </Container>
  );
}
