import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useGetUserStatisticsQuery } from '../users.api';
import { USER_STATUS_VARIANTS } from '../users.types';
import { UserList } from '../components/UserList';
import { UserForm } from '../components/UserForm';
import { useCreateUserMutation } from '../users.api';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export function UsersPage() {
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('users:create');

  const {
    data: statsData,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useGetUserStatisticsQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const stats = statsData?.data;

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      const result = await createUser(data as unknown as Parameters<typeof createUser>[0]).unwrap();
      toast.success(t('messages.created'));
      setShowCreateForm(false);
      navigate(`/users/${result.data.id}`);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-people me-2" />
          {t('title')}
        </h4>
        {canCreate && !showCreateForm && (
          <Button variant="primary" size="sm" onClick={() => setShowCreateForm(true)}>
            <i className="bi bi-plus-lg me-1" />
            {t('actions.createUser')}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {isStatsLoading && (
        <div className="text-center py-3">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {isStatsError && <div className="alert alert-warning mb-4">{tCommon('messages.error')}</div>}
      {stats && (
        <Row className="g-3 mb-4">
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-primary">{stats.total}</h3>
                <small className="text-muted">{t('stats.total')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-success">{stats.active}</h3>
                <small className="text-muted">{t('stats.active')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-info">{stats.verified}</h3>
                <small className="text-muted">{t('stats.verified')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-warning">{stats.new_last_30_days}</h3>
                <small className="text-muted">{t('stats.newLast30Days')}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Status breakdown badges */}
      {stats?.by_status && (
        <div className="d-flex flex-wrap gap-2 mb-4">
          {(Object.entries(stats.by_status) as [string, number][]).map(([status, count]) => (
            <span
              key={status}
              className={`badge bg-${USER_STATUS_VARIANTS[status as keyof typeof USER_STATUS_VARIANTS] || 'secondary'} py-2 px-3`}
            >
              {tCommon(`status.${status}`)}: {count}
            </span>
          ))}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="mb-4">
          <UserForm
            onSubmit={handleCreate}
            isLoading={isCreating}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* User List */}
      <UserList />
    </div>
  );
}
