import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetRevenueTimeSeriesQuery } from '../dashboard.api';

export function OrderChart() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError } = useGetRevenueTimeSeriesQuery({
    preset: 'last_30_days',
    period: 'daily',
  });

  const chartData = data?.data || [];

  // Format date labels for display
  const formattedData = chartData.map((point) => ({
    ...point,
    label: new Date(point.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white border-bottom">
        <h6 className="mb-0 fw-bold">{t('charts.ordersOverTime')}</h6>
      </Card.Header>
      <Card.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: 300 }}>
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div
            className="d-flex justify-content-center align-items-center text-muted"
            style={{ height: 300 }}
          >
            <i className="bi bi-exclamation-triangle me-2" />
            {t('charts.errorLoading')}
          </div>
        ) : formattedData.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center text-muted"
            style={{ height: 300 }}
          >
            {t('charts.noData')}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                formatter={(value: number) => [value, t('charts.orders')]}
              />
              <Legend />
              <Bar
                dataKey="orders"
                name={t('charts.orders')}
                fill="#e63946"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
}
