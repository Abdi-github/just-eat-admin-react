import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, GeoAlt, Bicycle, Clock, Shop, BoxSeam } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useGetDeliveryQuery, useCancelDeliveryMutation } from '../deliveries.api';
import { DELIVERY_STATUS_VARIANTS, DELIVERY_TERMINAL_STATUSES } from '../deliveries.types';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog/ConfirmDialog';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { useAppSelector } from '@/app/hooks';
import { AssignCourier } from './AssignCourier';

export function DeliveryDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['deliveries', 'common']);
  const language = useAppSelector((state) => state.language.current);

  const { data, isLoading, isError, error } = useGetDeliveryQuery(id!, { skip: !id });
  const [cancelDelivery, { isLoading: isCancelling }] = useCancelDeliveryMutation();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const handleCancel = async () => {
    if (!id) return;
    try {
      await cancelDelivery({ id, body: {} }).unwrap();
      toast.success(t('messages.cancelSuccess'));
      setShowCancelConfirm(false);
    } catch (err) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || t('messages.cancelError'));
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <Alert variant="danger">
        {(error as { data?: { message?: string } })?.data?.message || t('common:messages.error')}
      </Alert>
    );
  }

  const delivery = data.data;
  const isTerminal = DELIVERY_TERMINAL_STATUSES.includes(delivery.status);
  const canAssign = delivery.status === 'PENDING';
  const canCancel = !isTerminal;

  // Build delivery address string
  const addr = delivery.delivery_address;
  const deliveryAddrStr = addr
    ? `${addr.street} ${addr.street_number}, ${addr.postal_code} ${addr.city}${addr.floor ? `, ${t('detail.floor')}: ${addr.floor}` : ''}`
    : '—';

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/deliveries')}>
            <ArrowLeft className="me-1" /> {t('common:actions.back')}
          </Button>
          <h4 className="mb-0">
            {t('detail.title')} <code className="small">{delivery.id.slice(-8)}</code>
          </h4>
          <Badge bg={DELIVERY_STATUS_VARIANTS[delivery.status] || 'secondary'}>
            {t(`status.${delivery.status}`)}
          </Badge>
        </div>
        <div className="d-flex gap-2">
          {canAssign && (
            <Button variant="primary" size="sm" onClick={() => setShowAssignModal(true)}>
              {t('actions.assignCourier')}
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
            >
              {t('actions.cancel')}
            </Button>
          )}
        </div>
      </div>

      <Row className="g-4">
        {/* Delivery Info */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <BoxSeam className="me-2" />
              {t('detail.deliveryInfo')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow label={t('detail.deliveryId')} value={delivery.id} />
                  <InfoRow
                    label={t('detail.orderId')}
                    value={
                      <Link to={`/orders/${delivery.order_id}`}>
                        {delivery.order_number || <code>{delivery.order_id.slice(-8)}</code>}
                      </Link>
                    }
                  />
                  <InfoRow label={t('detail.fee')} value={formatCHF(delivery.delivery_fee)} />
                  {delivery.distance_km !== null && (
                    <InfoRow
                      label={t('detail.distance')}
                      value={`${delivery.distance_km.toFixed(1)} km`}
                    />
                  )}
                  {delivery.notes && <InfoRow label={t('detail.notes')} value={delivery.notes} />}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Restaurant Info */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <Shop className="me-2" />
              {t('detail.restaurantInfo')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow label={t('detail.restaurant')} value={delivery.restaurant_name || '—'} />
                  <InfoRow label={t('detail.pickupAddress')} value={delivery.pickup_address} />
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Addresses */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <GeoAlt className="me-2" />
              {t('detail.addresses')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow label={t('detail.pickupAddress')} value={delivery.pickup_address} />
                  <InfoRow label={t('detail.deliveryAddress')} value={deliveryAddrStr} />
                  {addr?.instructions && (
                    <InfoRow label={t('detail.instructions')} value={addr.instructions} />
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Courier Info */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <Bicycle className="me-2" />
              {t('detail.courierInfo')}
            </Card.Header>
            <Card.Body>
              {delivery.courier_id ? (
                <Table size="sm" borderless className="mb-0">
                  <tbody>
                    <InfoRow
                      label={t('detail.courierId')}
                      value={<code>{delivery.courier_id}</code>}
                    />
                    {delivery.courier_location && (
                      <>
                        <InfoRow
                          label={t('detail.courierLat')}
                          value={String(delivery.courier_location.lat)}
                        />
                        <InfoRow
                          label={t('detail.courierLng')}
                          value={String(delivery.courier_location.lng)}
                        />
                        <InfoRow
                          label={t('detail.locationUpdatedAt')}
                          value={formatDateTime(delivery.courier_location.updated_at, language)}
                        />
                      </>
                    )}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted fst-italic mb-0">{t('detail.noCourier')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Timestamps */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <Clock className="me-2" />
              {t('detail.timestamps')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow
                    label={t('detail.createdAt')}
                    value={formatDateTime(delivery.created_at, language)}
                  />
                  {delivery.assigned_at && (
                    <InfoRow
                      label={t('detail.assignedAt')}
                      value={formatDateTime(delivery.assigned_at, language)}
                    />
                  )}
                  {delivery.picked_up_at && (
                    <InfoRow
                      label={t('detail.pickedUpAt')}
                      value={formatDateTime(delivery.picked_up_at, language)}
                    />
                  )}
                  {delivery.in_transit_at && (
                    <InfoRow
                      label={t('detail.inTransitAt')}
                      value={formatDateTime(delivery.in_transit_at, language)}
                    />
                  )}
                  {delivery.delivered_at && (
                    <InfoRow
                      label={t('detail.deliveredAt')}
                      value={formatDateTime(delivery.delivered_at, language)}
                    />
                  )}
                  {delivery.cancelled_at && (
                    <InfoRow
                      label={t('detail.cancelledAt')}
                      value={formatDateTime(delivery.cancelled_at, language)}
                    />
                  )}
                  {delivery.estimated_pickup_at && (
                    <InfoRow
                      label={t('detail.estimatedPickup')}
                      value={formatDateTime(delivery.estimated_pickup_at, language)}
                    />
                  )}
                  {delivery.estimated_delivery_at && (
                    <InfoRow
                      label={t('detail.estimatedDelivery')}
                      value={formatDateTime(delivery.estimated_delivery_at, language)}
                    />
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Cancellation Info */}
        {delivery.cancellation_reason && (
          <Col md={6}>
            <Card border="danger">
              <Card.Header className="bg-danger bg-opacity-10">
                {t('detail.cancellationInfo')}
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{delivery.cancellation_reason}</p>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Assign Courier Modal */}
      {showAssignModal && (
        <AssignCourier
          deliveryId={id!}
          show={showAssignModal}
          onHide={() => setShowAssignModal(false)}
        />
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        show={showCancelConfirm}
        title={t('actions.cancelDelivery')}
        message={t('messages.confirmCancel')}
        confirmLabel={t('actions.cancel')}
        variant="danger"
        isLoading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
}

// ─── Helper Component ────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <tr>
      <td className="text-muted" style={{ width: '40%' }}>
        {label}
      </td>
      <td>{value}</td>
    </tr>
  );
}
