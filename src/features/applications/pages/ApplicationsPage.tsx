import { useTranslation } from 'react-i18next';
import { Row, Col, Card } from 'react-bootstrap';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetApplicationsQuery } from '../applications.api';
import { ApplicationList } from '../components/ApplicationList';

export function ApplicationsPage() {
  const { t } = useTranslation('applications');

  // Fetch pending count for stats
  const { data: pendingData, isLoading: isPendingLoading } = useGetApplicationsQuery({
    status: 'pending_approval',
    limit: 1,
  });
  const { data: approvedData, isLoading: isApprovedLoading } = useGetApplicationsQuery({
    status: 'approved',
    limit: 1,
  });
  const { data: rejectedData, isLoading: isRejectedLoading } = useGetApplicationsQuery({
    status: 'rejected',
    limit: 1,
  });

  const isStatsLoading = isPendingLoading || isApprovedLoading || isRejectedLoading;

  const pendingCount = pendingData?.data?.pagination?.total ?? 0;
  const approvedCount = approvedData?.data?.pagination?.total ?? 0;
  const rejectedCount = rejectedData?.data?.pagination?.total ?? 0;
  const totalCount = pendingCount + approvedCount + rejectedCount;

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-file-earmark-check me-2" />
          {t('title')}
        </h4>
      </div>

      {/* Stats Cards */}
      {isStatsLoading && (
        <div className="text-center py-3">
          <LoadingSpinner size="sm" />
        </div>
      )}
      {!isStatsLoading && (
        <Row className="g-3 mb-4">
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-primary">{totalCount}</h3>
                <small className="text-muted">{t('stats.total')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-warning">{pendingCount}</h3>
                <small className="text-muted">{t('stats.pending')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-success">{approvedCount}</h3>
                <small className="text-muted">{t('stats.approved')}</small>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={6} md={3}>
            <Card className="border-0 shadow-sm text-center py-2">
              <Card.Body>
                <h3 className="mb-1 fw-bold text-danger">{rejectedCount}</h3>
                <small className="text-muted">{t('stats.rejected')}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Application List */}
      <ApplicationList />
    </div>
  );
}
