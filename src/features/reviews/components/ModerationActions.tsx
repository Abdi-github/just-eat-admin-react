import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useModerateReviewMutation, useDeleteReviewMutation } from '../reviews.api';
import type { Review, ReviewStatus } from '../reviews.types';

interface ModerationActionsProps {
  review: Review;
  onDeleted?: () => void;
}

export function ModerationActions({ review, onDeleted }: ModerationActionsProps) {
  const { t } = useTranslation('reviews');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canModerate = hasPermission('reviews:approve');
  const canDelete = hasPermission('reviews:delete') || hasPermission('reviews:approve');

  const [moderateReview, { isLoading: isModerating }] = useModerateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const [showReject, setShowReject] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleModerate = async (status: ReviewStatus, moderation_reason?: string) => {
    try {
      await moderateReview({
        id: review.id,
        body: { status, ...(moderation_reason && { moderation_reason }) },
      }).unwrap();
      toast.success(t(`messages.${status.toLowerCase()}`));
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    await handleModerate('REJECTED', rejectReason);
    setShowReject(false);
    setRejectReason('');
  };

  const handleDelete = async () => {
    try {
      await deleteReview(review.id).unwrap();
      toast.success(t('messages.deleted'));
      setShowDelete(false);
      onDeleted?.();
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  if (!canModerate && !canDelete) return null;

  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {/* Approve */}
        {canModerate && review.status !== 'APPROVED' && (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleModerate('APPROVED')}
            disabled={isModerating}
          >
            <i className="bi bi-check-circle me-1" />
            {tCommon('actions.approve')}
          </Button>
        )}

        {/* Reject (opens modal with reason) */}
        {canModerate && review.status !== 'REJECTED' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowReject(true)}
            disabled={isModerating}
          >
            <i className="bi bi-x-circle me-1" />
            {tCommon('actions.reject')}
          </Button>
        )}

        {/* Flag */}
        {canModerate && review.status !== 'FLAGGED' && (
          <Button
            variant="warning"
            size="sm"
            onClick={() => handleModerate('FLAGGED')}
            disabled={isModerating}
          >
            <i className="bi bi-flag me-1" />
            {tCommon('actions.flag')}
          </Button>
        )}

        {/* Delete */}
        {canDelete && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => setShowDelete(true)}
            disabled={isDeleting}
          >
            <i className="bi bi-trash me-1" />
            {tCommon('actions.delete')}
          </Button>
        )}
      </div>

      {/* Reject Reason Modal */}
      <Modal show={showReject} onHide={() => setShowReject(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('moderation.rejectTitle')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>{t('moderation.reasonLabel')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('moderation.reasonPlaceholder')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReject(false)}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={handleReject}
            disabled={!rejectReason.trim() || isModerating}
          >
            {isModerating ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i className="bi bi-x-circle me-1" />
            )}
            {tCommon('actions.reject')}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        show={showDelete}
        title={tCommon('actions.delete')}
        message={t('messages.confirmDelete')}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
