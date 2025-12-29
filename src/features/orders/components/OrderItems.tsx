import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { formatCHF } from '@/shared/utils/formatters';
import type { OrderItem as OrderItemType } from '../orders.types';

interface OrderItemsProps {
  items: OrderItemType[];
  currency: string;
}

export function OrderItems({ items }: OrderItemsProps) {
  const { t } = useTranslation('orders');

  return (
    <Table className="mb-0">
      <thead className="table-light">
        <tr>
          <th>{t('itemFields.name')}</th>
          <th className="text-center">{t('itemFields.quantity')}</th>
          <th className="text-end">{t('itemFields.unitPrice')}</th>
          <th className="text-end">{t('itemFields.totalPrice')}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={`${item.menu_item_id}-${index}`}>
            <td>
              <div className="fw-semibold">{item.name}</div>
              {item.options && item.options.length > 0 && (
                <div className="small text-muted">
                  {item.options.map((opt, i) => (
                    <span key={opt.name || `opt-${i}`}>
                      {i > 0 && ', '}
                      {opt.name}
                      {opt.price > 0 && ` (+${formatCHF(opt.price)})`}
                    </span>
                  ))}
                </div>
              )}
              {item.special_instructions && (
                <div className="small text-muted fst-italic mt-1">{item.special_instructions}</div>
              )}
            </td>
            <td className="text-center">{item.quantity}</td>
            <td className="text-end">{formatCHF(item.unit_price)}</td>
            <td className="text-end fw-semibold">{formatCHF(item.total_price)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
