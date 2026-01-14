import { useState, useCallback } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { PlatformStats } from '../components/PlatformStats';
import { DateRangeSelector } from '../components/DateRangeSelector';
import { RevenueChart } from '../components/RevenueChart';
import { OrderBreakdownCharts } from '../components/OrderBreakdownCharts';
import { TopRestaurantsTable } from '../components/TopRestaurantsTable';
import { RestaurantStatusChart } from '../components/RestaurantStatusChart';
import {
  useGetPlatformDashboardQuery,
  useGetRevenueTimeSeriesQuery,
  useGetTopRestaurantsQuery,
} from '../analytics.api';
import type { DatePreset, AnalyticsPeriod, AnalyticsDateParams } from '../analytics.types';

export function AnalyticsPage() {
  const { t } = useTranslation('analytics');

  const [preset, setPreset] = useState<DatePreset>('last_30_days');
  const [period, setPeriod] = useState<AnalyticsPeriod>('daily');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [appliedCustom, setAppliedCustom] = useState<{ from: string; to: string } | null>(null);

  const dateParams: AnalyticsDateParams = preset
    ? { preset }
    : appliedCustom
      ? { from: appliedCustom.from, to: appliedCustom.to }
      : { preset: 'last_30_days' };

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useGetPlatformDashboardQuery(dateParams);

  const { data: revenueData, isLoading: revenueLoading } = useGetRevenueTimeSeriesQuery({
    ...dateParams,
    period,
  });

  const { data: topRestaurantsData, isLoading: topRestaurantsLoading } = useGetTopRestaurantsQuery({
    ...dateParams,
    limit: 10,
  });

  const handleApplyCustom = useCallback(() => {
    if (customFrom && customTo) {
      setAppliedCustom({ from: customFrom, to: customTo });
    }
  }, [customFrom, customTo]);

  const handlePresetChange = useCallback((newPreset: DatePreset) => {
    setPreset(newPreset);
    if (newPreset) {
      setAppliedCustom(null);
    }
  }, []);

  if (dashboardError) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{t('errors.loadFailed')}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{t('title')}</h2>
      </div>

      <div className="mb-4">
        <DateRangeSelector
          preset={preset}
          period={period}
          customFrom={customFrom}
          customTo={customTo}
          onPresetChange={handlePresetChange}
          onPeriodChange={setPeriod}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onApply={handleApplyCustom}
          showPeriod
        />
      </div>

      {dashboardLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : dashboardData?.data ? (
        <>
          <PlatformStats data={dashboardData.data} />
          <OrderBreakdownCharts data={dashboardData.data} />
          <RestaurantStatusChart data={dashboardData.data.restaurant_status_breakdown} />
        </>
      ) : null}

      <RevenueChart data={revenueData?.data || []} isLoading={revenueLoading} />

      <TopRestaurantsTable
        data={topRestaurantsData?.data || []}
        isLoading={topRestaurantsLoading}
      />
    </Container>
  );
}
