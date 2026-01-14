import { useState } from 'react';
import { Button, Modal, Form, Spinner, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useApiError } from '@/shared/hooks/useApiError';
import { useChangeRestaurantStatusMutation, useDeleteRestaurantMutation } from '../restaurants.api';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import type { Restaurant, RestaurantStatus } from '../restaurants.types';
import { STATUS_TRANSITIONS } from '../restaurants.types';

interface ApprovalActionsProps {
  restaurant: Restaurant;
  onDeleted?: () => void;
}

const STATUS_ACTION_VARIANTS: Record<RestaurantStatus, string> = {
  DRAFT: 'secondary',
  PENDING_APPROVAL: 'warning',
  APPROVED: 'info',
  PUBLISHED: 'success',
  REJECTED: 'danger',
  SUSPENDED: 'dark',
  ARCHIVED: 'dark',
};

export function ApprovalActions({ restaurant, onDeleted }: ApprovalActionsProps) {
  const { t } = useTranslation('restaurants');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const { getErrorMessage } = useApiError();

  const [changeStatus, { isLoading: isChangingStatus }] = useChangeRestaurantStatusMutation();
  const [deleteRestaurant, { isLoading: isDeleting }] = useDeleteRestaurantMutation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const allowedTransitions = STATUS_TRANSITIONS[restaurant.status] || [];

  const handleStatusChange = async (newStatus: RestaurantStatus) => {
    if (newStatus === 'REJECTED') {
      setShowRejectModal(true);
      return;
    }

    try {
      await changeStatus({
        id: restaurant.id,
        body: { status: newStatus },
      }).unwrap();
      toast.success(t('messages.statusChanged'));
    } catch (err) {
      toast.error(getErrorMessage(err as Parameters<typeof getErrorMessage>[0]));
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;

    try {
      await changeStatus({
        id: restaurant.id,
        body: {
          status: 'REJECTED',
          rejection_reason: rejectionReason.trim(),
        },
      }).unwrap();
      toast.success(t('messages.statusChanged'));
      setShowRejectModal(false);
      setRejectionReason('');
    } catch (err) {
      toast.error(getErrorMessage(err as Parameters<typeof getErrorMessage>[0]));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRestaurant(restaurant.id).unwrap();
      toast.success(t('messages.deleted'));
      setShowDeleteConfirm(false);
      onDeleted?.();
    } catch (err) {
      toast.error(getErrorMessage(err as Parameters<typeof getErrorMessage>[0]));
    }
  };

  const canApprove = hasPermission('restaurants:approve');
  const canDelete = hasPermission('restaurants:delete');

  // Map status to button label and icon
  const getActionLabel = (status: RestaurantStatus): { label: string; icon: string } => {
    switch (status) {
      case 'PENDING_APPROVAL':
        return { label: t('actions.submitForApproval'), icon: 'bi-send' };
      case 'APPROVED':
        return { label: tCommon('actions.approve'), icon: 'bi-check-lg' };
      case 'REJECTED':
        return { label: tCommon('actions.reject'), icon: 'bi-x-lg' };
      case 'PUBLISHED':
        return { label: tCommon('actions.publish'), icon: 'bi-globe' };
      case 'SUSPENDED':
        return { label: tCommon('actions.suspend'), icon: 'bi-pause-circle' };
      case 'ARCHIVED':
        return { label: tCommon('actions.archive'), icon: 'bi-archive' };
      case 'DRAFT':
        return { label: t('actions.backToDraft'), icon: 'bi-pencil' };
      default:
        return { label: status, icon: 'bi-arrow-right' };
    }
  };

  if (!canApprove && !canDelete) return null;

  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {/* Status Transition Buttons */}
        {canApprove && allowedTransitions.length > 0 && (
          <ButtonGroup>
            {allowedTransitions.map((nextStatus) => {
              const { label, icon } = getActionLabel(nextStatus);
              return (
                <Button
                  key={nextStatus}
                  variant={
                    nextStatus === 'REJECTED'
                      ? 'outline-danger'
                      : `outline-${STATUS_ACTION_VARIANTS[nextStatus] || 'primary'}`
                  }
                  size="sm"
                  disabled={isChangingStatus}
                  onClick={() => handleStatusChange(nextStatus)}
                >
                  {isChangingStatus ? (
                    <Spinner size="sm" className="me-1" />
                  ) : (
                    <i className={`bi ${icon} me-1`} />
                  )}
                  {label}
                </Button>
              );
            })}
          </ButtonGroup>
        )}

        {/* Delete Button */}
        {canDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Spinner size="sm" className="me-1" />
            ) : (
              <i className="bi bi-trash me-1" />
            )}
            {tCommon('actions.delete')}
          </Button>
        )}
      </div>

      {/* Rejection Reason Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('modals.rejectTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">{t('modals.rejectDescription')}</p>
          <Form.Group>
            <Form.Label>{t('fields.rejectionReason')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t('placeholders.rejectionReason')}
              maxLength={1000}
            />
            <Form.Text className="text-muted">{rejectionReason.length}/1000</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={!rejectionReason.trim() || isChangingStatus}
          >
            {isChangingStatus ? (
              <Spinner size="sm" className="me-1" />
            ) : (
              <i className="bi bi-x-lg me-1" />
            )}
            {tCommon('actions.reject')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        show={showDeleteConfirm}
        title={t('modals.deleteTitle')}
        message={t('modals.deleteDescription', { name: restaurant.name })}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
        variant="danger"
      />
    </>
  );
}
