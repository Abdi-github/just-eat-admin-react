import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { Pencil, Trash, ArrowLeft } from 'react-bootstrap-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetCouponQuery, useDeleteCouponMutation } from '../promotions.api';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { Alert } from 'react-bootstrap';

export function CouponDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCouponQuery(id!);
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCoupon(id!).unwrap();
      toast.success(t('promotions:coupons.deleteSuccess'));
      navigate('/promotions/coupons');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !data?.data) {
    return <Alert variant="danger">{t('promotions:coupons.notFound')}</Alert>;
  }

  const coupon = data.data;

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('/promotions/coupons')}
          >
            <ArrowLeft />
          </Button>
          <h1 className="h3 mb-0">
            <code>{coupon.code}</code>
          </h1>
          <StatusBadge status={coupon.status} />
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/promotions/coupons/${id}/edit`)}
          >
            <Pencil className="me-1" /> {t('common:actions.edit')}
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => setShowDelete(true)}>
            <Trash className="me-1" /> {t('common:actions.delete')}
          </Button>
        </div>
      </div>

      <Row>
        {/* Discount Info */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:coupons.discountInfo')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:coupons.discountType')}</dt>
                <dd className="col-sm-7">
                  <Badge bg="secondary">
                    {t(`promotions:coupons.${coupon.discount_type.toLowerCase()}`)}
                  </Badge>
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.discountValue')}</dt>
                <dd className="col-sm-7">
                  {coupon.discount_type === 'PERCENTAGE'
                    ? `${coupon.discount_value}%`
                    : formatCHF(coupon.discount_value)}
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.maxDiscount')}</dt>
                <dd className="col-sm-7">
                  {coupon.maximum_discount != null
                    ? formatCHF(coupon.maximum_discount)
                    : t('promotions:coupons.unlimited')}
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.minOrder')}</dt>
                <dd className="col-sm-7">{formatCHF(coupon.minimum_order)}</dd>

                {coupon.description && (
                  <>
                    <dt className="col-sm-5">{t('promotions:coupons.description')}</dt>
                    <dd className="col-sm-7">{coupon.description}</dd>
                  </>
                )}
              </dl>
            </Card.Body>
          </Card>
        </Col>

        {/* Scope & Restaurant */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:coupons.scopeSection')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:coupons.scope')}</dt>
                <dd className="col-sm-7">
                  <Badge bg={coupon.scope === 'PLATFORM' ? 'primary' : 'info'}>
                    {t(
                      `promotions:coupons.scope${coupon.scope === 'PLATFORM' ? 'Platform' : 'Restaurant'}`
                    )}
                  </Badge>
                </dd>

                {coupon.restaurant_name && (
                  <>
                    <dt className="col-sm-5">{t('promotions:coupons.restaurant')}</dt>
                    <dd className="col-sm-7">{coupon.restaurant_name}</dd>
                  </>
                )}

                <dt className="col-sm-5">{t('promotions:coupons.active')}</dt>
                <dd className="col-sm-7">
                  <Badge bg={coupon.is_active ? 'success' : 'secondary'}>
                    {coupon.is_active ? t('common:status.yes') : t('common:status.no')}
                  </Badge>
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Usage */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:coupons.usageSection')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:coupons.usageCount')}</dt>
                <dd className="col-sm-7">{coupon.usage_count}</dd>

                <dt className="col-sm-5">{t('promotions:coupons.usageLimit')}</dt>
                <dd className="col-sm-7">
                  {coupon.usage_limit != null
                    ? coupon.usage_limit
                    : t('promotions:coupons.unlimited')}
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.perUserLimit')}</dt>
                <dd className="col-sm-7">{coupon.per_user_limit}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>

        {/* Validity & Timestamps */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:coupons.validitySection')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:coupons.validFrom')}</dt>
                <dd className="col-sm-7">
                  {coupon.valid_from ? formatDateTime(coupon.valid_from) : '—'}
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.validUntil')}</dt>
                <dd className="col-sm-7">
                  {coupon.valid_until ? formatDateTime(coupon.valid_until) : '—'}
                </dd>

                <dt className="col-sm-5">{t('promotions:coupons.createdAt')}</dt>
                <dd className="col-sm-7">{formatDateTime(coupon.created_at)}</dd>

                <dt className="col-sm-5">{t('promotions:coupons.updatedAt')}</dt>
                <dd className="col-sm-7">{formatDateTime(coupon.updated_at)}</dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete confirmation */}
      <ConfirmDialog
        show={showDelete}
        title={t('promotions:coupons.deleteTitle')}
        message={t('promotions:coupons.deleteMessage', { code: coupon.code })}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
