import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetDashboardStatsQuery, useGetDashboardUserStatsQuery } from '../dashboard.api';
import { StatsCards } from '../components/StatsCards';
import { RecentOrders } from '../components/RecentOrders';
import { PendingApprovals } from '../components/PendingApprovals';
import { OrderChart } from '../components/OrderChart';
import { RevenueChart } from '../components/RevenueChart';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError } = useGetDashboardStatsQuery({ preset: 'last_30_days' });
  const { data: userStatsData } = useGetDashboardUserStatsQuery();

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">{t('title')}</h4>
        {data?.data?.date_range && (
          <small className="text-muted">
            {new Date(data.data.date_range.from).toLocaleDateString()} –{' '}
            {new Date(data.data.date_range.to).toLocaleDateString()}
          </small>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : isError ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-exclamation-triangle fs-1 d-block mb-3" />
          <p>{t('errorLoading', { defaultValue: 'Failed to load dashboard data' })}</p>
        </div>
      ) : data?.data ? (
        <>
          {/* Stats Overview Cards */}
          <StatsCards overview={data.data.overview} userStats={userStatsData?.data} />

          {/* Charts Row */}
          <Row className="g-3 mb-4">
            <Col xs={12} lg={6}>
              <OrderChart />
            </Col>
            <Col xs={12} lg={6}>
              <RevenueChart />
            </Col>
          </Row>

          {/* Recent Activity Row */}
          <Row className="g-3">
            <Col xs={12} lg={7}>
              <RecentOrders />
            </Col>
            <Col xs={12} lg={5}>
              <PendingApprovals />
            </Col>
          </Row>
        </>
      ) : null}
    </div>
  );
}
