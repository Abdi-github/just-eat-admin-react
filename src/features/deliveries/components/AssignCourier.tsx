import { useState } from 'react';
import { Modal, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAssignCourierMutation } from '../deliveries.api';

interface AssignCourierProps {
  deliveryId: string;
  show: boolean;
  onHide: () => void;
}

export function AssignCourier({ deliveryId, show, onHide }: AssignCourierProps) {
  const { t } = useTranslation(['deliveries', 'common']);
  const [courierId, setCourierId] = useState('');
  const [assignCourier, { isLoading, error }] = useAssignCourierMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courierId.trim()) return;

    try {
      await assignCourier({ id: deliveryId, body: { courier_id: courierId.trim() } }).unwrap();
      toast.success(t('messages.assignSuccess'));
      onHide();
    } catch (err) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || t('messages.assignError'));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('assign.title')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {(error as { data?: { message?: string } })?.data?.message ||
                t('messages.assignError')}
            </Alert>
          )}

          <Form.Group>
            <Form.Label className="fw-bold">{t('assign.courierId')}</Form.Label>
            <Form.Control
              type="text"
              placeholder={t('assign.courierIdPlaceholder')}
              value={courierId}
              onChange={(e) => setCourierId(e.target.value)}
              required
            />
            <Form.Text className="text-muted">{t('assign.courierIdHelp')}</Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={isLoading}>
            {t('common:actions.cancel')}
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading || !courierId.trim()}>
            {isLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-1" />
                {t('assign.assigning')}
              </>
            ) : (
              t('assign.submit')
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
