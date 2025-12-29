import { Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { formatCHF, formatNumber } from '@/shared/utils/formatters';
import type { PlatformDashboardOverview, DashboardUserStats } from '../dashboard.types';

interface StatsCardsProps {
  overview: PlatformDashboardOverview;
  userStats?: DashboardUserStats | null;
}

interface StatCard {
  titleKey: string;
  value: string;
  icon: string;
  color: string;
  subValue?: string;
  subKey?: string;
}

export function StatsCards({ overview, userStats }: StatsCardsProps) {
  const { t } = useTranslation('dashboard');

  const stats: StatCard[] = [
    {
      titleKey: 'stats.totalOrders',
      value: formatNumber(overview.total_orders),
      icon: 'bi-cart3',
      color: 'primary',
      subValue: formatNumber(overview.delivered_orders),
      subKey: 'stats.delivered',
    },
    {
      titleKey: 'stats.totalRevenue',
      value: formatCHF(overview.total_revenue),
      icon: 'bi-currency-exchange',
      color: 'success',
      subValue: formatCHF(overview.avg_order_value),
      subKey: 'stats.avgOrder',
    },
    {
      titleKey: 'stats.activeRestaurants',
      value: formatNumber(overview.active_restaurants),
      icon: 'bi-shop',
      color: 'info',
      subValue: formatNumber(overview.total_restaurants),
      subKey: 'stats.totalRestaurants',
    },
    {
      titleKey: 'stats.totalUsers',
      value: formatNumber(userStats?.total ?? 0),
      icon: 'bi-people',
      color: 'warning',
      subValue: `+${formatNumber(userStats?.new_last_30_days ?? 0)}`,
      subKey: 'stats.newUsers',
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((stat) => (
        <Col key={stat.titleKey} xs={12} sm={6} xl={3}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div
                className={`bg-${stat.color} bg-opacity-10 rounded-3 p-3 me-3 d-flex align-items-center justify-content-center`}
              >
                <i className={`bi ${stat.icon} fs-3 text-${stat.color}`} />
              </div>
              <div>
                <p className="text-muted small mb-1">{t(stat.titleKey)}</p>
                <h4 className="mb-0 fw-bold">{stat.value}</h4>
                {stat.subValue && stat.subKey && (
                  <small className="text-muted">
                    {stat.subValue} {t(stat.subKey)}
                  </small>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
