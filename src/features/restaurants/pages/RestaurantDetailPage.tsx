import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from 'react-bootstrap';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetRestaurantQuery } from '../restaurants.api';
import { RestaurantDetails } from '../components/RestaurantDetails';
import { ApprovalActions } from '../components/ApprovalActions';

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('restaurants');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetRestaurantQuery(id!, { skip: !id });

  const restaurant = data?.data;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/restaurants')}>
            <i className="bi bi-arrow-left me-1" />
            {tCommon('actions.back')}
          </Button>
          <h4 className="mb-0 fw-bold">
            {isLoading ? t('detail.loading') : restaurant?.name || t('detail.title')}
          </h4>
        </div>

        {restaurant && (
          <ApprovalActions restaurant={restaurant} onDeleted={() => navigate('/restaurants')} />
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : isError || !restaurant ? (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2" />
          {tCommon('errors.notFound')}
        </Alert>
      ) : (
        <RestaurantDetails restaurant={restaurant} />
      )}
    </div>
  );
}
