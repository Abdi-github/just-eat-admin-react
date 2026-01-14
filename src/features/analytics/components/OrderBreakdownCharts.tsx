import { Card, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { PlatformDashboard } from '../analytics.types';

interface OrderBreakdownChartsProps {
  data: PlatformDashboard;
}

const STATUS_COLORS: Record<string, string> = {
  PLACED: '#457b9d',
  ACCEPTED: '#2a9d8f',
  PREPARING: '#e9c46a',
  READY: '#f4a261',
  PICKED_UP: '#264653',
  IN_TRANSIT: '#1d3557',
  DELIVERED: '#2d6a4f',
  CANCELLED: '#e63946',
  REJECTED: '#d62828',
};

const TYPE_COLORS = ['#e63946', '#457b9d'];

const PAYMENT_COLORS: Record<string, string> = {
  stripe_card: '#635bff',
  twint: '#000000',
  postfinance: '#ffcc00',
  cash: '#2d6a4f',
};

export function OrderBreakdownCharts({ data }: OrderBreakdownChartsProps) {
  const { t } = useTranslation('analytics');

  const statusData = Object.entries(data.order_status_breakdown).map(([key, value]) => ({
    name: t(`common:status.${key.toLowerCase()}`),
    value,
    fill: STATUS_COLORS[key] || '#999',
  }));

  const typeData = Object.entries(data.order_type_breakdown).map(([key, value], i) => ({
    name: t(`charts.orderTypes.${key}`),
    value,
    fill: TYPE_COLORS[i] || '#999',
  }));

  const paymentData = Object.entries(data.payment_method_breakdown).map(([key, value]) => ({
    name: t(`charts.paymentMethods.${key}`),
    value,
    fill: PAYMENT_COLORS[key] || '#999',
  }));

  return (
    <Row className="g-3 mb-4">
      {/* Order Status Breakdown */}
      <Col lg={6}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">{t('charts.orderStatusBreakdown')}</Card.Title>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>

      {/* Order Type Breakdown */}
      <Col lg={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">{t('charts.orderTypeBreakdown')}</Card.Title>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>

      {/* Payment Method Breakdown */}
      <Col lg={3}>
        <Card className="border-0 shadow-sm h-100">
          <Card.Body>
            <Card.Title className="mb-3">{t('charts.paymentMethodBreakdown')}</Card.Title>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
