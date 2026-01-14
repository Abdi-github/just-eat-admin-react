import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { formatNumber } from '@/shared/utils/formatters';
import type { PlatformDashboard } from '../analytics.types';

interface RestaurantStatusChartProps {
  data: PlatformDashboard['restaurant_status_breakdown'];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#6c757d',
  PENDING_APPROVAL: '#ffc107',
  APPROVED: '#17a2b8',
  PUBLISHED: '#28a745',
  REJECTED: '#dc3545',
  SUSPENDED: '#343a40',
  ARCHIVED: '#495057',
};

export function RestaurantStatusChart({ data }: RestaurantStatusChartProps) {
  const { t } = useTranslation('analytics');

  const chartData = Object.entries(data).map(([key, value]) => ({
    name: t(`common:status.${key.toLowerCase()}`),
    value,
    fill: STATUS_COLORS[key] || '#999',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Row className="g-3 mb-4">
      <Col lg={8}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">{t('charts.restaurantStatusBreakdown')}</Card.Title>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => [formatNumber(value), t('charts.count')]} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">{t('charts.restaurantSummary')}</Card.Title>
            <div className="d-flex flex-column gap-2">
              {chartData.map((item) => (
                <div key={item.name} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle me-2"
                      style={{ width: 12, height: 12, backgroundColor: item.fill }}
                    />
                    <span className="small">{item.name}</span>
                  </div>
                  <div>
                    <span className="fw-semibold">{formatNumber(item.value)}</span>
                    <span className="text-muted small ms-1">
                      ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
