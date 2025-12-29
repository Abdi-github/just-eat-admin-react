import { useTranslation } from 'react-i18next';
import {
  CheckCircleFill,
  XCircleFill,
  ClockFill,
  Fire,
  BoxSeam,
  Bicycle,
  GeoAltFill,
  BagCheckFill,
} from 'react-bootstrap-icons';
import type { IconProps } from 'react-bootstrap-icons';
import { formatDateTime } from '@/shared/utils/formatters';
import type { Order, OrderStatus } from '../orders.types';
import { ORDER_STATUS_VARIANTS } from '../orders.types';

interface OrderTimelineProps {
  order: Order;
}

// Timeline steps in chronological order
const TIMELINE_STEPS: {
  status: OrderStatus;
  dateField: keyof Order;
  icon: React.ComponentType<IconProps>;
}[] = [
  { status: 'PLACED', dateField: 'placed_at', icon: ClockFill },
  { status: 'ACCEPTED', dateField: 'accepted_at', icon: CheckCircleFill },
  { status: 'REJECTED', dateField: 'rejected_at', icon: XCircleFill },
  { status: 'PREPARING', dateField: 'preparing_at', icon: Fire },
  { status: 'READY', dateField: 'ready_at', icon: BoxSeam },
  { status: 'PICKED_UP', dateField: 'picked_up_at', icon: BagCheckFill },
  { status: 'IN_TRANSIT', dateField: 'in_transit_at', icon: Bicycle },
  { status: 'DELIVERED', dateField: 'delivered_at', icon: GeoAltFill },
  { status: 'CANCELLED', dateField: 'cancelled_at', icon: XCircleFill },
];

export function OrderTimeline({ order }: OrderTimelineProps) {
  const { t } = useTranslation(['orders', 'common']);

  // Filter to only show steps that have a timestamp
  const completedSteps = TIMELINE_STEPS.filter((step) => {
    const val = order[step.dateField];
    return val !== null && val !== undefined;
  });

  if (completedSteps.length === 0) {
    return <p className="text-muted mb-0">{t('timeline.noEvents')}</p>;
  }

  return (
    <div className="timeline">
      {completedSteps.map((step, index) => {
        const dateValue = order[step.dateField] as string;
        const isLast = index === completedSteps.length - 1;
        const variant = ORDER_STATUS_VARIANTS[step.status];
        const Icon = step.icon;

        return (
          <div key={step.status} className="d-flex mb-3 position-relative">
            {/* Connector line */}
            {!isLast && (
              <div
                className="position-absolute"
                style={{
                  left: '11px',
                  top: '24px',
                  bottom: '-12px',
                  width: '2px',
                  backgroundColor: '#dee2e6',
                }}
              />
            )}

            {/* Icon */}
            <div className="me-3 flex-shrink-0" style={{ width: '24px', zIndex: 1 }}>
              <Icon className={`text-${variant}`} size={20} />
            </div>

            {/* Content */}
            <div className="flex-grow-1">
              <div className="fw-semibold small">
                {t(`common:status.${step.status.toLowerCase()}`)}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                {formatDateTime(dateValue)}
              </div>

              {/* Show reason for rejection/cancellation */}
              {step.status === 'REJECTED' && order.rejection_reason && (
                <div className="text-danger small mt-1">
                  <em>{order.rejection_reason}</em>
                </div>
              )}
              {step.status === 'CANCELLED' && order.cancellation_reason && (
                <div className="text-warning small mt-1">
                  <em>{order.cancellation_reason}</em>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
