import { Card, Table, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'react-bootstrap-icons';
import { formatCHF, formatNumber } from '@/shared/utils/formatters';
import type { TopRestaurant } from '../analytics.types';

interface TopRestaurantsTableProps {
  data: TopRestaurant[];
  isLoading?: boolean;
}

export function TopRestaurantsTable({ data, isLoading }: TopRestaurantsTableProps) {
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

  const getRankBadge = (index: number) => {
    const variants = ['warning', 'secondary', 'danger'];
    if (index < 3) {
      return (
        <Badge bg={variants[index]} className="me-2">
          <Trophy size={12} className="me-1" />
          {index + 1}
        </Badge>
      );
    }
    return <span className="text-muted me-2">{index + 1}</span>;
  };

  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Body>
        <Card.Title className="mb-3">{t('charts.topRestaurants')}</Card.Title>
        {data.length === 0 ? (
          <div className="text-center py-5 text-muted">{t('charts.noData')}</div>
        ) : (
          <Table hover responsive className="mb-0">
            <thead>
              <tr>
                <th>{t('table.rank')}</th>
                <th>{t('table.restaurant')}</th>
                <th className="text-end">{t('table.orders')}</th>
                <th className="text-end">{t('table.revenue')}</th>
                <th className="text-end">{t('table.avgOrder')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((restaurant, index) => (
                <tr key={restaurant.restaurant_id}>
                  <td>{getRankBadge(index)}</td>
                  <td className="fw-semibold">{restaurant.name}</td>
                  <td className="text-end">{formatNumber(restaurant.total_orders)}</td>
                  <td className="text-end">{formatCHF(restaurant.total_revenue)}</td>
                  <td className="text-end">{formatCHF(restaurant.avg_order_value)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
