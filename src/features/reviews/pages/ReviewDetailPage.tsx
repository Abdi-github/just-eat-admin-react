import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from 'react-bootstrap';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetReviewQuery } from '../reviews.api';
import { ReviewDetails } from '../components/ReviewDetails';
import { ModerationActions } from '../components/ModerationActions';

export function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('reviews');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetReviewQuery(id!, { skip: !id });

  const review = data?.data;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/reviews')}>
            <i className="bi bi-arrow-left me-1" />
            {tCommon('actions.back')}
          </Button>
          <h4 className="mb-0 fw-bold">{isLoading ? t('detail.loading') : t('detail.title')}</h4>
        </div>

        {review && <ModerationActions review={review} onDeleted={() => navigate('/reviews')} />}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : isError || !review ? (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2" />
          {tCommon('errors.notFound')}
        </Alert>
      ) : (
        <ReviewDetails review={review} />
      )}
    </div>
  );
}
