import { Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { STATUS_VARIANTS } from '@/shared/utils/constants';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useTranslation();
  const variant = STATUS_VARIANTS[status] || 'secondary';

  return (
    <Badge bg={variant} className={className}>
      {t(`status.${status.toLowerCase()}`)}
    </Badge>
  );
}
