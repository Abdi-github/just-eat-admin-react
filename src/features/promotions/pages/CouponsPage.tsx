import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { CouponList } from '../components/CouponList';

export function CouponsPage() {
  const { t } = useTranslation('promotions');

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{t('coupons.title')}</h1>
      </div>

      <Card>
        <Card.Body>
          <CouponList />
        </Card.Body>
      </Card>
    </>
  );
}
