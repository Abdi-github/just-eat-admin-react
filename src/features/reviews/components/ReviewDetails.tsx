import { Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatDateTime } from '@/shared/utils/formatters';
import type { Review } from '../reviews.types';

interface ReviewDetailsProps {
  review: Review;
}

export function ReviewDetails({ review }: ReviewDetailsProps) {
  const { t } = useTranslation('reviews');
  const { t: tCommon } = useTranslation();
  const currentLang = useAppSelector((state) => state.language.current);

  const renderStars = (rating: number) => (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}
          style={{ fontSize: '1.2rem' }}
        />
      ))}
      <span className="ms-2 fw-bold">{rating}/5</span>
    </span>
  );

  return (
    <Row className="g-4">
      {/* Main Content */}
      <Col lg={8}>
        {/* Review Content */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{t('detail.reviewContent')}</h5>
              <StatusBadge status={review.status} />
            </div>
          </Card.Header>
          <Card.Body>
            {/* Rating */}
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('fields.rating')}</small>
              {renderStars(review.rating)}
            </div>

            {/* Comment */}
            <div className="mb-3">
              <small className="text-muted d-block mb-1">{t('fields.comment')}</small>
              <p className="mb-0 bg-light p-3 rounded">
                {review.comment || <em className="text-muted">{t('detail.noComment')}</em>}
              </p>
            </div>

            {/* Moderation Reason */}
            {review.moderation_reason && (
              <div className="mb-3">
                <small className="text-muted d-block mb-1">{t('fields.moderationReason')}</small>
                <p className="mb-0 bg-warning bg-opacity-10 p-3 rounded border border-warning">
                  {review.moderation_reason}
                </p>
              </div>
            )}

            {/* Restaurant Reply */}
            {review.restaurant_reply && (
              <div className="mb-0">
                <small className="text-muted d-block mb-1">{t('fields.restaurantReply')}</small>
                <div className="bg-info bg-opacity-10 p-3 rounded border border-info">
                  <p className="mb-1">{review.restaurant_reply}</p>
                  {review.restaurant_reply_at && (
                    <small className="text-muted">
                      {formatDateTime(review.restaurant_reply_at, currentLang)}
                    </small>
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Sidebar */}
      <Col lg={4}>
        {/* Reviewer Info */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0">{t('detail.reviewer')}</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{t('fields.name')}</span>
                <strong>
                  {review.user.first_name} {review.user.last_name}
                </strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{t('fields.verified')}</span>
                {review.is_verified ? (
                  <Badge bg="success">{t('fields.verified')}</Badge>
                ) : (
                  <Badge bg="secondary">{t('fields.unverified')}</Badge>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Restaurant Info */}
        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0">{t('detail.restaurant')}</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{t('fields.name')}</span>
                <strong>{review.restaurant.name}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{t('fields.orderId')}</span>
                <code className="small">{review.order_id}</code>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Timestamps */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0">{t('detail.timestamps')}</h6>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{tCommon('fields.createdAt')}</span>
                <span>{formatDateTime(review.created_at, currentLang)}</span>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between px-0">
                <span className="text-muted">{tCommon('fields.updatedAt')}</span>
                <span>{formatDateTime(review.updated_at, currentLang)}</span>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
