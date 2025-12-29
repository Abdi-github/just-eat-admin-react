import { Card, Table, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatCHF, formatRelativeTime } from '@/shared/utils/formatters';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetRecentOrdersQuery } from '../dashboard.api';

export function RecentOrders() {
  const { t } = useTranslation('dashboard');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetRecentOrdersQuery({});

  const paymentMethodLabels: Record<string, string> = {
    card: t('paymentMethods.card', { defaultValue: 'Card' }),
    twint: 'TWINT',
    postfinance: 'PostFinance',
    cash: t('paymentMethods.cash', { defaultValue: 'Cash' }),
  };

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold">{t('recentOrders.title')}</h6>
        <button className="btn btn-sm btn-outline-primary" onClick={() => navigate('/orders')}>
          {tCommon('actions.viewAll', { defaultValue: 'View All' })}
        </button>
      </Card.Header>
      <Card.Body className="p-0">
        {isLoading ? (
          <div className="p-4">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="p-4 text-center text-muted">
            <i className="bi bi-exclamation-triangle me-2" />
            {tCommon('messages.error')}
          </div>
        ) : !data?.data?.length ? (
          <div className="p-4 text-center text-muted">{tCommon('table.noData')}</div>
        ) : (
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>{t('recentOrders.orderNumber')}</th>
                <th>{t('recentOrders.restaurant')}</th>
                <th>{t('recentOrders.status')}</th>
                <th>{t('recentOrders.total')}</th>
                <th>{t('recentOrders.payment')}</th>
                <th>{t('recentOrders.time')}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((order) => (
                <tr
                  key={order.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td>
                    <code className="text-primary small">{order.order_number}</code>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: 150 }}>
                    {order.restaurant_name || '—'}
                  </td>
                  <td>
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="fw-semibold">{formatCHF(order.total)}</td>
                  <td>
                    <Badge bg="light" text="dark" className="border">
                      {paymentMethodLabels[order.payment_method] || order.payment_method}
                    </Badge>
                  </td>
                  <td className="text-muted small">{formatRelativeTime(order.placed_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
