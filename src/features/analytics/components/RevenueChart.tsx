import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { formatCHF } from '@/shared/utils/formatters';
import type { RevenueTimeSeriesPoint } from '../analytics.types';

interface RevenueChartProps {
  data: RevenueTimeSeriesPoint[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const { t } = useTranslation('analytics');

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="text-center py-5 text-muted">{t('common:loading')}</div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-3">{t('charts.revenueOverTime')}</Card.Title>
        {data.length === 0 ? (
          <div className="text-center py-5 text-muted">{t('charts.noData')}</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#457b9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#457b9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                tickFormatter={(v: number) => formatCHF(v)}
                tick={{ fontSize: 12 }}
              />
              <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === 'revenue'
                    ? [formatCHF(value), t('charts.revenue')]
                    : [value, t('charts.orders')]
                }
              />
              <Legend
                formatter={(value: string) =>
                  value === 'revenue' ? t('charts.revenue') : t('charts.orders')
                }
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#e63946"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#457b9d"
                fill="url(#ordersGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card.Body>
    </Card>
  );
}
