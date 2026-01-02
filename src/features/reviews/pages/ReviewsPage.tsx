import { useTranslation } from 'react-i18next';
import { ReviewList } from '../components/ReviewList';

export function ReviewsPage() {
  const { t } = useTranslation('reviews');

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-star-half me-2" />
          {t('title')}
        </h4>
      </div>

      {/* Review List */}
      <ReviewList />
    </div>
  );
}
