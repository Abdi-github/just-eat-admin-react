import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Table, Button, Badge } from 'react-bootstrap';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import { formatRelativeTime } from '@/shared/utils/formatters';
import { useGetPendingRestaurantsQuery } from '../restaurants.api';

export function PendingApprovalsPage() {
  const { t } = useTranslation('restaurants');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const limit = 20;

  const { data, isLoading, isError } = useGetPendingRestaurantsQuery({ page, limit });

  const restaurants = data?.data || [];
  const total = data?.meta?.total || 0;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h4 className="mb-0 fw-bold">{t('pendingApprovals.title')}</h4>
          {total > 0 && (
            <Badge bg="warning" text="dark" pill>
              {total}
            </Badge>
          )}
        </div>
        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/restaurants')}>
          <i className="bi bi-list me-1" />
          {t('pendingApprovals.viewAll')}
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          {isLoading ? (
            <div className="p-5">
              <LoadingSpinner />
            </div>
          ) : isError ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-exclamation-triangle fs-1 d-block mb-3" />
              <p>{tCommon('messages.error')}</p>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-check-circle fs-1 d-block mb-3 text-success" />
              <p className="fw-semibold">{t('pendingApprovals.noPending')}</p>
              <small>{t('pendingApprovals.allCaughtUp')}</small>
            </div>
          ) : (
            <>
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>{t('fields.name')}</th>
                    <th>{t('fields.location')}</th>
                    <th>{t('fields.status')}</th>
                    <th>{t('fields.submittedAt')}</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((restaurant) => (
                    <tr
                      key={restaurant.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                      role="button"
                    >
                      <td>
                        <div className="fw-semibold">{restaurant.name}</div>
                        <small className="text-muted">{restaurant.slug}</small>
                      </td>
                      <td>
                        {[restaurant.city?.name, restaurant.canton?.code || restaurant.canton?.name]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </td>
                      <td>
                        <StatusBadge status={restaurant.status} />
                      </td>
                      <td className="text-muted small">
                        {formatRelativeTime(restaurant.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {data?.meta && (
                <div className="p-3 border-top">
                  <Pagination pagination={data.meta} onPageChange={handlePageChange} />
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
