import { useTranslation } from 'react-i18next';
import { OrderList } from '../components/OrderList';

export function OrdersPage() {
  const { t } = useTranslation('orders');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">{t('title')}</h2>
      </div>
      <OrderList />
    </div>
  );
}
