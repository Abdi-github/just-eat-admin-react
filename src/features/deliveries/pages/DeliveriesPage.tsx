import { useTranslation } from 'react-i18next';
import { DeliveryList } from '../components/DeliveryList';

export function DeliveriesPage() {
  const { t } = useTranslation('deliveries');

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">{t('title')}</h2>
      </div>
      <DeliveryList />
    </>
  );
}
