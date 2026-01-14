import { Row, Col, Card, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatCHF, formatNumber, formatDateTime } from '@/shared/utils/formatters';
import type { Restaurant } from '../restaurants.types';

interface RestaurantDetailsProps {
  restaurant: Restaurant;
}

export function RestaurantDetails({ restaurant }: RestaurantDetailsProps) {
  const { t } = useTranslation('restaurants');
  const { t: tCommon } = useTranslation();

  return (
    <Row className="g-3">
      {/* Cover Image Banner */}
      {restaurant.cover_image_url && (
        <Col xs={12}>
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="position-relative" style={{ height: 200 }}>
              <img
                src={restaurant.cover_image_url}
                alt={`${restaurant.name} cover`}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
              <div
                className="position-absolute bottom-0 start-0 w-100 p-2"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
                }}
              >
                <span className="text-white small fw-medium">
                  <i className="bi bi-image me-1" />
                  {t('fields.coverImage', 'Cover Image')}
                </span>
              </div>
            </div>
          </Card>
        </Col>
      )}

      {/* Main Info Card */}
      <Col xs={12} lg={8}>
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex align-items-start mb-4">
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt={restaurant.name}
                  className="rounded me-3"
                  style={{ width: 64, height: 64, objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="bg-light rounded me-3 d-flex align-items-center justify-content-center"
                  style={{ width: 64, height: 64 }}
                >
                  <i className="bi bi-shop fs-3 text-muted" />
                </div>
              )}
              <div className="flex-grow-1">
                <h5 className="mb-1 fw-bold">{restaurant.name}</h5>
                <p className="text-muted mb-2 small">{restaurant.slug}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <StatusBadge status={restaurant.status} />
                  {restaurant.is_featured && (
                    <Badge bg="warning" text="dark">
                      <i className="bi bi-star-fill me-1" />
                      {t('badges.featured')}
                    </Badge>
                  )}
                  {restaurant.is_active ? (
                    <Badge bg="success">{tCommon('status.active')}</Badge>
                  ) : (
                    <Badge bg="danger">{tCommon('status.inactive')}</Badge>
                  )}
                </div>
              </div>
            </div>

            {restaurant.description && (
              <div className="mb-4">
                <h6 className="text-muted small text-uppercase mb-2">{t('fields.description')}</h6>
                <p className="mb-0">{restaurant.description}</p>
              </div>
            )}

            {/* Rating & Reviews */}
            <Row className="g-3 mb-4">
              <Col xs={6} sm={3}>
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold fs-5">
                    <i className="bi bi-star-fill text-warning me-1" />
                    {(restaurant.rating ?? 0).toFixed(1)}
                  </div>
                  <small className="text-muted">{t('fields.rating')}</small>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold fs-5">{formatNumber(restaurant.review_count)}</div>
                  <small className="text-muted">{t('fields.reviews')}</small>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold fs-5">
                    {restaurant.delivery_fee != null ? formatCHF(restaurant.delivery_fee) : '—'}
                  </div>
                  <small className="text-muted">{t('fields.deliveryFee')}</small>
                </div>
              </Col>
              <Col xs={6} sm={3}>
                <div className="text-center p-2 bg-light rounded">
                  <div className="fw-bold fs-5">
                    {restaurant.minimum_order != null ? formatCHF(restaurant.minimum_order) : '—'}
                  </div>
                  <small className="text-muted">{t('fields.minimumOrder')}</small>
                </div>
              </Col>
            </Row>

            {/* Delivery Options */}
            <h6 className="text-muted small text-uppercase mb-2">
              {t('sections.deliveryOptions')}
            </h6>
            <div className="d-flex gap-3 flex-wrap mb-4">
              <div className="d-flex align-items-center">
                <i
                  className={`bi ${restaurant.supports_delivery ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-1`}
                />
                {t('fields.delivery')}
              </div>
              <div className="d-flex align-items-center">
                <i
                  className={`bi ${restaurant.supports_pickup ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-1`}
                />
                {t('fields.pickup')}
              </div>
              <div className="d-flex align-items-center">
                <i
                  className={`bi ${restaurant.is_partner_delivery ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'} me-1`}
                />
                {t('fields.partnerDelivery')}
              </div>
              {restaurant.estimated_delivery_minutes && (
                <div className="d-flex align-items-center">
                  <i className="bi bi-clock me-1 text-primary" />
                  {restaurant.estimated_delivery_minutes.min}–
                  {restaurant.estimated_delivery_minutes.max}{' '}
                  {t('fields.minutes', { defaultValue: 'min' })}
                </div>
              )}
            </div>

            {/* Cuisines */}
            {restaurant.cuisines && restaurant.cuisines.length > 0 && (
              <>
                <h6 className="text-muted small text-uppercase mb-2">{t('sections.cuisines')}</h6>
                <div className="d-flex gap-2 flex-wrap">
                  {restaurant.cuisines.map((cuisine) => (
                    <Badge key={cuisine.id} bg="light" text="dark" className="border">
                      {cuisine.name}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Sidebar Info */}
      <Col xs={12} lg={4}>
        {/* Contact & Location */}
        <Card className="border-0 shadow-sm mb-3">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0 fw-bold">{t('sections.contactLocation')}</h6>
          </Card.Header>
          <Card.Body>
            <dl className="mb-0">
              <dt className="text-muted small">{t('fields.address')}</dt>
              <dd>
                {restaurant.address}
                <br />
                {restaurant.postal_code} {restaurant.city?.name || ''}
              </dd>

              <dt className="text-muted small">{t('fields.canton')}</dt>
              <dd>
                {restaurant.canton
                  ? `${restaurant.canton.name}${restaurant.canton.code ? ` (${restaurant.canton.code})` : ''}`
                  : '—'}
              </dd>

              {restaurant.phone && (
                <>
                  <dt className="text-muted small">{t('fields.phone')}</dt>
                  <dd>{restaurant.phone}</dd>
                </>
              )}

              {restaurant.email && (
                <>
                  <dt className="text-muted small">{t('fields.email')}</dt>
                  <dd>
                    <a href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
                  </dd>
                </>
              )}
            </dl>
          </Card.Body>
        </Card>

        {/* Brand Info */}
        {restaurant.brand && (
          <Card className="border-0 shadow-sm mb-3">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-bold">{t('sections.brand')}</h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center">
                {restaurant.brand.logo_url ? (
                  <img
                    src={restaurant.brand.logo_url}
                    alt={restaurant.brand.name}
                    className="rounded me-2"
                    style={{ width: 32, height: 32, objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="bg-light rounded me-2 d-flex align-items-center justify-content-center"
                    style={{ width: 32, height: 32 }}
                  >
                    <i className="bi bi-building text-muted small" />
                  </div>
                )}
                <div>
                  <div className="fw-semibold">{restaurant.brand.name}</div>
                  <small className="text-muted">{restaurant.brand.slug}</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Timestamps */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white border-bottom">
            <h6 className="mb-0 fw-bold">{t('sections.timestamps')}</h6>
          </Card.Header>
          <Card.Body>
            <dl className="mb-0">
              {restaurant.created_at && (
                <>
                  <dt className="text-muted small">{t('fields.createdAt')}</dt>
                  <dd>{formatDateTime(restaurant.created_at)}</dd>
                </>
              )}

              {restaurant.updated_at && (
                <>
                  <dt className="text-muted small">{t('fields.updatedAt')}</dt>
                  <dd>{formatDateTime(restaurant.updated_at)}</dd>
                </>
              )}

              {restaurant.published_at && (
                <>
                  <dt className="text-muted small">{t('fields.publishedAt')}</dt>
                  <dd>{formatDateTime(restaurant.published_at)}</dd>
                </>
              )}
            </dl>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
