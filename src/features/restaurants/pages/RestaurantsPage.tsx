import { useTranslation } from 'react-i18next';
import { RestaurantList } from '../components/RestaurantList';

export function RestaurantsPage() {
  const { t } = useTranslation('restaurants');

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">{t('title')}</h4>
      </div>
      <RestaurantList />
    </div>
  );
}
