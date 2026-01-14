import { Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Cart3, CurrencyExchange, Shop, People } from 'react-bootstrap-icons';
import { formatCHF, formatNumber } from '@/shared/utils/formatters';
import type { PlatformDashboard } from '../analytics.types';

interface PlatformStatsProps {
  data: PlatformDashboard;
}

export function PlatformStats({ data }: PlatformStatsProps) {
  const { t } = useTranslation('analytics');
  const { overview } = data;

  const cards = [
    {
      title: t('stats.totalOrders'),
      value: formatNumber(overview.total_orders),
      sub: `${formatNumber(overview.delivered_orders)} ${t('stats.delivered')}`,
      icon: Cart3,
      color: 'primary',
    },
    {
      title: t('stats.totalRevenue'),
      value: formatCHF(overview.total_revenue),
      sub: `${t('stats.avgOrder')}: ${formatCHF(overview.avg_order_value)}`,
      icon: CurrencyExchange,
      color: 'success',
    },
    {
      title: t('stats.restaurants'),
      value: formatNumber(overview.total_restaurants),
      sub: `${formatNumber(overview.active_restaurants)} ${t('stats.active')}`,
      icon: Shop,
      color: 'info',
    },
    {
      title: t('stats.users'),
      value: formatNumber(overview.total_users),
      sub: `+${formatNumber(overview.new_users_period)} ${t('stats.newInPeriod')}`,
      icon: People,
      color: 'warning',
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((card) => (
        <Col key={card.title} sm={6} xl={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="text-muted small mb-1">{card.title}</div>
                  <div className="h4 mb-1">{card.value}</div>
                  <div className="text-muted small">{card.sub}</div>
                </div>
                <div className={`bg-${card.color} bg-opacity-10 rounded-3 p-2`}>
                  <card.icon size={24} className={`text-${card.color}`} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
