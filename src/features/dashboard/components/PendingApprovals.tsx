import { Card, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '@/shared/utils/formatters';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetPendingRestaurantsQuery } from '../dashboard.api';

export function PendingApprovals() {
  const { t } = useTranslation('dashboard');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetPendingRestaurantsQuery({});

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-bold">
          {t('pendingApprovals.title')}
          {data?.meta?.total ? (
            <span className="badge bg-warning ms-2">{data.meta.total}</span>
          ) : null}
        </h6>
        <button
          className="btn btn-sm btn-outline-warning"
          onClick={() => navigate('/restaurants?status=PENDING_APPROVAL')}
        >
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
          <div className="p-4 text-center text-success">
            <i className="bi bi-check-circle me-2" />
            {t('pendingApprovals.noPending')}
          </div>
        ) : (
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>{t('pendingApprovals.restaurant')}</th>
                <th>{t('pendingApprovals.location')}</th>
                <th>{t('pendingApprovals.status')}</th>
                <th>{t('pendingApprovals.submitted')}</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((restaurant) => (
                <tr
                  key={restaurant.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                >
                  <td className="fw-semibold">{restaurant.name}</td>
                  <td className="text-muted small">
                    {restaurant.city?.name || '—'}
                    {restaurant.canton?.code ? `, ${restaurant.canton.code}` : ''}
                  </td>
                  <td>
                    <StatusBadge status={restaurant.status} />
                  </td>
                  <td className="text-muted small">{formatRelativeTime(restaurant.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
