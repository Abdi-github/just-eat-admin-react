import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCHF } from '@/shared/utils/formatters';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useGetRevenueTimeSeriesQuery } from '../dashboard.api';

export function RevenueChart() {
  const { t } = useTranslation('dashboard');
  const { data, isLoading, isError } = useGetRevenueTimeSeriesQuery({
    preset: 'last_30_days',
    period: 'daily',
  });

  const chartData = data?.data || [];

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
        <h6 className="mb-0 fw-bold">{t('charts.revenueOverTime')}</h6>
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
            <AreaChart data={formattedData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#28a745" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#28a745" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `${Math.round(value)}`} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #eee' }}
                formatter={(value: number) => [formatCHF(value), t('charts.revenue')]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name={t('charts.revenue')}
                stroke="#28a745"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
}
