import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useGetOrderQuery } from '../orders.api';
import { OrderDetails } from '../components/OrderDetails';
import { StatusOverride } from '../components/StatusOverride';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation(['orders', 'common']);

  const { data, isLoading, isError } = useGetOrderQuery(id!, { skip: !id });

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
        {t('common:messages.error')}
        <Button variant="link" onClick={() => navigate('/orders')}>
          {t('actions.backToList')}
        </Button>
      </Alert>
    );
  }

  const order = data.data;

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/orders')}>
            <ArrowLeft className="me-1" />
            {t('actions.backToList')}
          </Button>
          <h3 className="mb-0 fw-bold">{order.order_number}</h3>
        </div>

        <StatusOverride order={order} />
      </div>

      {/* Order Details */}
      <OrderDetails order={order} />
    </div>
  );
}
