import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import { useGetPaymentQuery, useProcessRefundMutation } from '../payments.api';
import { formatCHF } from '@/shared/utils/formatters';

const refundSchema = z.object({
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? undefined : Number(val)))
    .pipe(z.number().min(0.01).optional())
    .optional(),
  reason: z.string().max(500).optional(),
});

type RefundFormData = z.infer<typeof refundSchema>;

export function RefundDialog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['payments', 'common']);
  const [isFullRefund, setIsFullRefund] = useState(true);

  const {
    data: paymentData,
    isLoading: isLoadingPayment,
    isError: isPaymentError,
  } = useGetPaymentQuery(id!, { skip: !id });
  const [processRefund, { isLoading: isProcessing }] = useProcessRefundMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RefundFormData>({
    resolver: zodResolver(refundSchema),
    defaultValues: {
      amount: undefined,
      reason: '',
    },
  });

  const onSubmit = async (formData: RefundFormData) => {
    if (!paymentData?.data) return;

    const body: { amount?: number; reason?: string } = {};
    if (!isFullRefund && formData.amount) {
      body.amount = formData.amount;
    }
    if (formData.reason) {
      body.reason = formData.reason;
    }

    try {
      await processRefund({ orderId: paymentData.data.order_id, body }).unwrap();
      toast.success(t('messages.refundSuccess'));
      navigate(`/payments/${id}`);
    } catch (err) {
      const apiErr = err as { data?: { message?: string } };
      toast.error(apiErr?.data?.message || t('messages.refundError'));
    }
  };

  if (isLoadingPayment) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isPaymentError || !paymentData?.data) {
    return (
      <Alert variant="danger">
        {isPaymentError ? t('common:messages.error') : t('messages.notFound')}
      </Alert>
    );
  }

  const tx = paymentData.data;

  if (tx.status !== 'COMPLETED') {
    return (
      <Alert variant="warning">
        {t('messages.cannotRefund')}
        <div className="mt-2">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/payments/${id}`)}>
            <ArrowLeft className="me-1" /> {t('common:actions.back')}
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <Button variant="outline-secondary" size="sm" onClick={() => navigate(`/payments/${id}`)}>
          <ArrowLeft className="me-1" /> {t('common:actions.back')}
        </Button>
        <h4 className="mb-0">{t('refund.title')}</h4>
      </div>

      <Card style={{ maxWidth: 600 }}>
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between">
            <span>{t('refund.transactionAmount')}</span>
            <span className="fw-bold">{formatCHF(tx.amount)}</span>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            {/* Refund Type Toggle */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">{t('refund.type')}</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="full-refund"
                  label={t('refund.fullRefund')}
                  checked={isFullRefund}
                  onChange={() => setIsFullRefund(true)}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="partial-refund"
                  label={t('refund.partialRefund')}
                  checked={!isFullRefund}
                  onChange={() => setIsFullRefund(false)}
                />
              </div>
            </Form.Group>

            {/* Partial Amount */}
            {!isFullRefund && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">{t('refund.amount')}</Form.Label>
                <InputGroup>
                  <InputGroup.Text>{t('common:currency', { defaultValue: 'CHF' })}</InputGroup.Text>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={tx.amount}
                    placeholder="0.00"
                    {...register('amount')}
                    isInvalid={!!errors.amount}
                  />
                  {errors.amount && (
                    <Form.Control.Feedback type="invalid">
                      {errors.amount.message}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
                <Form.Text className="text-muted">
                  {t('refund.maxAmount', { amount: formatCHF(tx.amount) })}
                </Form.Text>
              </Form.Group>
            )}

            {/* Reason */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">{t('refund.reason')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={t('refund.reasonPlaceholder')}
                {...register('reason')}
                isInvalid={!!errors.reason}
              />
              {errors.reason && (
                <Form.Control.Feedback type="invalid">
                  {errors.reason.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Actions */}
            <div className="d-flex gap-2">
              <Button type="submit" variant="warning" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-1" />
                    {t('refund.processing')}
                  </>
                ) : (
                  t('refund.submit')
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate(`/payments/${id}`)}
                disabled={isProcessing}
              >
                {t('common:actions.cancel')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
