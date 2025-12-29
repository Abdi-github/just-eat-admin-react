import { useState } from 'react';
import { Button, Modal, Form, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useChangeOrderStatusMutation } from '../orders.api';
import { usePermissions } from '@/shared/hooks/usePermissions';
import type { Order, OrderStatus } from '../orders.types';
import { ORDER_STATUS_TRANSITIONS, ORDER_STATUS_VARIANTS } from '../orders.types';

interface StatusOverrideProps {
  order: Order;
}

export function StatusOverride({ order }: StatusOverrideProps) {
  const { t } = useTranslation(['orders', 'common']);
  const { hasPermission } = usePermissions();
  const [changeStatus, { isLoading }] = useChangeOrderStatusMutation();

  const [showModal, setShowModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);
  const [reason, setReason] = useState('');

  const canUpdateOrders = hasPermission('orders:update');

  // Get valid transitions for current status
  const validTransitions = ORDER_STATUS_TRANSITIONS[order.status] || [];

  if (!canUpdateOrders || validTransitions.length === 0) {
    return null;
  }

  const needsReason = targetStatus === 'REJECTED' || targetStatus === 'CANCELLED';

  const handleStatusClick = (status: OrderStatus) => {
    if (status === 'REJECTED' || status === 'CANCELLED') {
      setTargetStatus(status);
      setReason('');
      setShowModal(true);
    } else {
      handleConfirmStatusChange(status);
    }
  };

  const handleConfirmStatusChange = async (status: OrderStatus, providedReason?: string) => {
    try {
      const body: { status: OrderStatus; rejection_reason?: string; cancellation_reason?: string } =
        {
          status,
        };

      if (status === 'REJECTED' && providedReason) {
        body.rejection_reason = providedReason;
      }
      if (status === 'CANCELLED' && providedReason) {
        body.cancellation_reason = providedReason;
      }

      await changeStatus({ id: order.id, body }).unwrap();
      toast.success(t('messages.statusUpdated'));
      setShowModal(false);
      setTargetStatus(null);
      setReason('');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  const handleModalSubmit = () => {
    if (targetStatus && (!needsReason || reason.trim().length >= 3)) {
      handleConfirmStatusChange(targetStatus, reason.trim());
    }
  };

  return (
    <>
      <ButtonGroup>
        {validTransitions.map((status) => {
          const variant = ORDER_STATUS_VARIANTS[status];
          const isDestructive = status === 'REJECTED' || status === 'CANCELLED';

          return (
            <Button
              key={status}
              variant={isDestructive ? `outline-${variant}` : variant}
              size="sm"
              disabled={isLoading}
              onClick={() => handleStatusClick(status)}
            >
              {t(`common:status.${status.toLowerCase()}`)}
            </Button>
          );
        })}
      </ButtonGroup>

      {/* Reason Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {targetStatus === 'REJECTED' ? t('modals.rejectTitle') : t('modals.cancelTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">
            {targetStatus === 'REJECTED'
              ? t('modals.rejectDescription')
              : t('modals.cancelDescription')}
          </p>
          <Form.Group>
            <Form.Label>
              {targetStatus === 'REJECTED'
                ? t('fields.rejectionReason')
                : t('fields.cancellationReason')}
              <span className="text-danger"> *</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('modals.reasonPlaceholder')}
              maxLength={500}
              isInvalid={reason.length > 0 && reason.trim().length < 3}
            />
            <Form.Text className="text-muted">{reason.length}/500</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t('common:actions.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleModalSubmit}
            disabled={isLoading || (needsReason && reason.trim().length < 3)}
          >
            {isLoading ? t('common:actions.saving') : t('common:actions.confirm')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
