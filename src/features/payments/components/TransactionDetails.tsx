import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Row, Col, Badge, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Receipt, CreditCard, Clock, ExclamationTriangle } from 'react-bootstrap-icons';
import { useGetPaymentQuery } from '../payments.api';
import { PAYMENT_TX_STATUS_VARIANTS } from '../payments.types';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { useAppSelector } from '@/app/hooks';

export function TransactionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['payments', 'common']);
  const language = useAppSelector((state) => state.language.current);

  const { data, isLoading, isError, error } = useGetPaymentQuery(id!, { skip: !id });

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

  const tx = data.data;
  const canRefund = tx.status === 'COMPLETED';
  const isRefunded = tx.status === 'REFUNDED' || tx.status === 'PARTIAL_REFUND';

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/payments')}>
            <ArrowLeft className="me-1" /> {t('common:actions.back')}
          </Button>
          <h4 className="mb-0">
            {t('detail.title')} <code className="small">{tx.id.slice(-8)}</code>
          </h4>
          <Badge bg={PAYMENT_TX_STATUS_VARIANTS[tx.status] || 'secondary'}>
            {t(`status.${tx.status}`)}
          </Badge>
        </div>
        {canRefund && (
          <Button variant="warning" size="sm" onClick={() => navigate(`/payments/${id}/refund`)}>
            {t('common:actions.refund')}
          </Button>
        )}
      </div>

      <Row className="g-4">
        {/* Transaction Info */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <Receipt className="me-2" />
              {t('detail.transactionInfo')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow label={t('detail.transactionId')} value={tx.id} />
                  <InfoRow
                    label={t('detail.orderId')}
                    value={
                      <Link to={`/orders/${tx.order_id}`}>
                        <code>{tx.order_id.slice(-8)}</code>
                      </Link>
                    }
                  />
                  <InfoRow label={t('detail.userId')} value={<code>{tx.user_id.slice(-8)}</code>} />
                  <InfoRow
                    label={t('detail.amount')}
                    value={<span className="fw-bold fs-5">{formatCHF(tx.amount)}</span>}
                  />
                  <InfoRow label={t('detail.currency')} value={tx.currency} />
                  <InfoRow label={t('detail.attempts')} value={String(tx.attempts)} />
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Payment Method */}
        <Col md={6}>
          <Card>
            <Card.Header className="bg-light">
              <CreditCard className="me-2" />
              {t('detail.paymentMethod')}
            </Card.Header>
            <Card.Body>
              <Table size="sm" borderless className="mb-0">
                <tbody>
                  <InfoRow label={t('detail.method')} value={t(`methods.${tx.payment_method}`)} />
                  <InfoRow
                    label={t('detail.provider')}
                    value={<span className="text-capitalize">{tx.provider_name}</span>}
                  />
                  {tx.provider_transaction_id && (
                    <InfoRow
                      label={t('detail.providerTxId')}
                      value={<code className="small">{tx.provider_transaction_id}</code>}
                    />
                  )}
                  {tx.cash_confirmed !== undefined && (
                    <InfoRow
                      label={t('detail.cashConfirmed')}
                      value={
                        tx.cash_confirmed ? (
                          <Badge bg="success">{t('common:status.yes')}</Badge>
                        ) : (
                          <Badge bg="warning">{t('common:status.no')}</Badge>
                        )
                      }
                    />
                  )}
                  {tx.cash_collected_at && (
                    <InfoRow
                      label={t('detail.cashCollectedAt')}
                      value={formatDateTime(tx.cash_collected_at, language)}
                    />
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        {/* Refund Info (if refunded) */}
        {isRefunded && (
          <Col md={6}>
            <Card border="warning">
              <Card.Header className="bg-warning bg-opacity-10">
                <ExclamationTriangle className="me-2" />
                {t('detail.refundInfo')}
              </Card.Header>
              <Card.Body>
                <Table size="sm" borderless className="mb-0">
                  <tbody>
                    {tx.refund_amount !== undefined && (
                      <InfoRow
                        label={t('detail.refundAmount')}
                        value={
                          <span className="fw-bold text-danger">{formatCHF(tx.refund_amount)}</span>
                        }
                      />
                    )}
                    {tx.refund_reason && (
                      <InfoRow label={t('detail.refundReason')} value={tx.refund_reason} />
                    )}
                    {tx.refunded_at && (
                      <InfoRow
                        label={t('detail.refundedAt')}
                        value={formatDateTime(tx.refunded_at, language)}
                      />
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Error Info */}
        {(tx.error_message || tx.error_code) && (
          <Col md={6}>
            <Card border="danger">
              <Card.Header className="bg-danger bg-opacity-10">
                <ExclamationTriangle className="me-2" />
                {t('detail.errorInfo')}
              </Card.Header>
              <Card.Body>
                <Table size="sm" borderless className="mb-0">
                  <tbody>
                    {tx.error_code && (
                      <InfoRow label={t('detail.errorCode')} value={<code>{tx.error_code}</code>} />
                    )}
                    {tx.error_message && (
                      <InfoRow label={t('detail.errorMessage')} value={tx.error_message} />
                    )}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        )}

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
                    value={formatDateTime(tx.created_at, language)}
                  />
                  <InfoRow
                    label={t('detail.updatedAt')}
                    value={formatDateTime(tx.updated_at, language)}
                  />
                  {tx.session_expires_at && (
                    <InfoRow
                      label={t('detail.sessionExpiresAt')}
                      value={formatDateTime(tx.session_expires_at, language)}
                    />
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
