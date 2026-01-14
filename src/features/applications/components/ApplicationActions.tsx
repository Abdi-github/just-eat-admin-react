import { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useApproveApplicationMutation, useRejectApplicationMutation } from '../applications.api';
import type { Application } from '../applications.types';

interface ApplicationActionsProps {
  application: Application;
}

export function ApplicationActions({ application }: ApplicationActionsProps) {
  const { t } = useTranslation('applications');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canUpdate = hasPermission('users:update');

  const [approveApplication, { isLoading: isApproving }] = useApproveApplicationMutation();
  const [rejectApplication, { isLoading: isRejecting }] = useRejectApplicationMutation();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const isPending = application.application_status === 'pending_approval';

  const handleApprove = async () => {
    try {
      await approveApplication(application.id).unwrap();
      toast.success(t('messages.approved'));
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleReject = async () => {
    try {
      await rejectApplication({
        userId: application.id,
        reason: rejectReason || 'Application rejected',
      }).unwrap();
      toast.success(t('messages.rejected'));
      setShowRejectModal(false);
      setRejectReason('');
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  if (!isPending || !canUpdate) {
    if (application.application_status === 'approved') {
      return (
        <span className="text-success small">
          <i className="bi bi-check-circle-fill me-1" />
          {tCommon('status.approved')}
        </span>
      );
    }
    if (application.application_status === 'rejected') {
      return (
        <span className="text-danger small" title={application.application_rejection_reason}>
          <i className="bi bi-x-circle-fill me-1" />
          {tCommon('status.rejected')}
        </span>
      );
    }
    return null;
  }

  return (
    <>
      <div className="d-flex gap-1">
        <Button
          variant="outline-success"
          size="sm"
          onClick={handleApprove}
          disabled={isApproving || isRejecting}
          title={tCommon('actions.approve')}
        >
          {isApproving ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-check-lg" />
          )}
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => setShowRejectModal(true)}
          disabled={isApproving || isRejecting}
          title={tCommon('actions.reject')}
        >
          <i className="bi bi-x-lg" />
        </Button>
      </div>

      {/* Reject Reason Modal */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">{t('rejectModal.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted mb-3">
            {t('rejectModal.description', {
              name: `${application.first_name} ${application.last_name}`,
            })}
          </p>
          <Form.Group>
            <Form.Label>{t('rejectModal.reason')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder={t('rejectModal.reasonPlaceholder')}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowRejectModal(false)}>
            {tCommon('actions.cancel')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleReject}
            disabled={isRejecting}
          >
            {isRejecting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" />
                {tCommon('actions.saving')}
              </>
            ) : (
              <>
                <i className="bi bi-x-circle me-1" />
                {tCommon('actions.reject')}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
