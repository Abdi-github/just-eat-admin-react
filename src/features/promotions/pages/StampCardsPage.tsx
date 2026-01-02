import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { StampCardList } from '../components/StampCardList';

export function StampCardsPage() {
  const { t } = useTranslation('promotions');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{t('stamps.title')}</h1>
      </div>

      <Card>
        <Card.Body>
          <StampCardList />
        </Card.Body>
      </Card>
    </>
  );
}
