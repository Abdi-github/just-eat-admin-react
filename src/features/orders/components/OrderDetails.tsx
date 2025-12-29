import { Card, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Shop, Clock, ChatLeftText } from 'react-bootstrap-icons';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { OrderItems } from './OrderItems';
import { OrderTimeline } from './OrderTimeline';
import type { Order } from '../orders.types';
import { PAYMENT_STATUS_VARIANTS } from '../orders.types';

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  const { t } = useTranslation(['orders', 'common']);

  return (
    <div>
      {/* ─── Header Summary ──────────────────────────────────── */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <h4 className="mb-0 fw-bold">{order.order_number}</h4>
                <StatusBadge status={order.status} />
                <Badge
                  bg={order.order_type === 'delivery' ? 'info' : 'secondary'}
                  className="bg-opacity-10"
                  text={order.order_type === 'delivery' ? 'info' : 'secondary'}
                >
                  {t(`orderType.${order.order_type}`)}
                </Badge>
              </div>

              {order.restaurant_name && (
                <div className="text-muted mb-2">
                  <Shop className="me-2" />
                  {order.restaurant_name}
                </div>
              )}

              {order.special_instructions && (
                <div className="text-muted mb-2">
                  <ChatLeftText className="me-2" />
                  <em>{order.special_instructions}</em>
                </div>
              )}

              <div className="text-muted small">
                <Clock className="me-1" />
                {t('fields.placedAt')}: {formatDateTime(order.placed_at)}
              </div>
            </Col>

            <Col md={4} className="text-md-end">
              <div className="mb-2">
                <span className="text-muted small d-block">{t('fields.total')}</span>
                <span className="fs-3 fw-bold text-primary">{formatCHF(order.total)}</span>
              </div>
              <div>
                <span className="text-muted small me-2">{t('fields.paymentMethod')}:</span>
                {t(`paymentMethod.${order.payment_method}`)}
              </div>
              <div>
                <span className="text-muted small me-2">{t('fields.paymentStatus')}:</span>
                <Badge bg={PAYMENT_STATUS_VARIANTS[order.payment_status]}>
                  {t(`paymentStatus.${order.payment_status.toLowerCase()}`)}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        {/* ─── Left Column ───────────────────────────────────── */}
        <Col lg={8}>
          {/* Order Items */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-bold">
                {t('sections.items')} ({order.items.length})
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <OrderItems items={order.items} currency={order.currency} />
            </Card.Body>
          </Card>

          {/* Price Breakdown */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-bold">{t('sections.priceBreakdown')}</h6>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-6 text-muted">{t('fields.subtotal')}</dt>
                <dd className="col-sm-6 text-end">{formatCHF(order.subtotal)}</dd>

                <dt className="col-sm-6 text-muted">{t('fields.deliveryFee')}</dt>
                <dd className="col-sm-6 text-end">{formatCHF(order.delivery_fee)}</dd>

                <dt className="col-sm-6 text-muted">{t('fields.serviceFee')}</dt>
                <dd className="col-sm-6 text-end">{formatCHF(order.service_fee)}</dd>

                {order.tip > 0 && (
                  <>
                    <dt className="col-sm-6 text-muted">{t('fields.tip')}</dt>
                    <dd className="col-sm-6 text-end">{formatCHF(order.tip)}</dd>
                  </>
                )}

                {order.discount > 0 && (
                  <>
                    <dt className="col-sm-6 text-muted text-success">{t('fields.discount')}</dt>
                    <dd className="col-sm-6 text-end text-success">-{formatCHF(order.discount)}</dd>
                  </>
                )}

                <hr className="my-2" />

                <dt className="col-sm-6 fw-bold fs-5">{t('fields.total')}</dt>
                <dd className="col-sm-6 text-end fw-bold fs-5">{formatCHF(order.total)}</dd>
              </dl>
            </Card.Body>
          </Card>

          {/* Rejection/Cancellation Reason */}
          {order.rejection_reason && (
            <Card className="border-0 shadow-sm mb-4 border-start border-danger border-3">
              <Card.Body>
                <h6 className="fw-bold text-danger">{t('fields.rejectionReason')}</h6>
                <p className="mb-0">{order.rejection_reason}</p>
              </Card.Body>
            </Card>
          )}

          {order.cancellation_reason && (
            <Card className="border-0 shadow-sm mb-4 border-start border-warning border-3">
              <Card.Body>
                <h6 className="fw-bold text-warning">{t('fields.cancellationReason')}</h6>
                <p className="mb-0">{order.cancellation_reason}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* ─── Right Column ──────────────────────────────────── */}
        <Col lg={4}>
          {/* Order Timeline */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-bold">{t('sections.timeline')}</h6>
            </Card.Header>
            <Card.Body>
              <OrderTimeline order={order} />
            </Card.Body>
          </Card>

          {/* IDs & References */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0 fw-bold">{t('sections.references')}</h6>
            </Card.Header>
            <Card.Body>
              <dl className="mb-0 small">
                <dt className="text-muted">{t('fields.orderId')}</dt>
                <dd className="font-monospace text-break">{order.id}</dd>

                <dt className="text-muted">{t('fields.userId')}</dt>
                <dd className="font-monospace text-break">{order.user_id}</dd>

                <dt className="text-muted">{t('fields.restaurantId')}</dt>
                <dd className="font-monospace text-break">{order.restaurant_id}</dd>

                {order.courier_id && (
                  <>
                    <dt className="text-muted">{t('fields.courierId')}</dt>
                    <dd className="font-monospace text-break">{order.courier_id}</dd>
                  </>
                )}

                {order.delivery_address_id && (
                  <>
                    <dt className="text-muted">{t('fields.deliveryAddressId')}</dt>
                    <dd className="font-monospace text-break">{order.delivery_address_id}</dd>
                  </>
                )}
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
