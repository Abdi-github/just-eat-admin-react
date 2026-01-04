import clsx from 'clsx';

interface SortableHeaderProps {
  /** Display label */
  label: string;
  /** The field name used in the API sort parameter */
  field: string;
  /** Current sort value (e.g. '-created_at', 'name') */
  currentSort: string;
  /** Callback when sort changes — returns new sort string like '-field' or 'field' */
  onSort: (sortValue: string) => void;
  /** Additional class names */
  className?: string;
}

/**
 * Clickable table header that toggles sort direction.
 * Follows the `-field` (desc) / `field` (asc) convention used across all list APIs.
 */
export function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  className,
}: SortableHeaderProps) {
  const isDesc = currentSort === `-${field}`;
  const isAsc = currentSort === field;

  const handleClick = () => {
    if (isAsc) {
      onSort(`-${field}`); // toggle to desc
    } else if (isDesc) {
      onSort(field); // toggle to asc
    } else {
      onSort(`-${field}`); // default to desc on first click
    }
  };

  return (
    <th
      className={clsx('user-select-none', className)}
      style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
      onClick={handleClick}
      role="columnheader"
      aria-sort={isAsc ? 'ascending' : isDesc ? 'descending' : 'none'}
    >
      <span className="d-inline-flex align-items-center gap-1">
        {label}
        <span className="d-inline-flex flex-column" style={{ fontSize: '0.55rem', lineHeight: 1 }}>
          <i
            className={clsx('bi bi-caret-up-fill', {
              'text-primary': isAsc,
              'text-muted opacity-25': !isAsc,
            })}
          />
          <i
            className={clsx('bi bi-caret-down-fill', {
              'text-primary': isDesc,
              'text-muted opacity-25': !isDesc,
            })}
          />
        </span>
      </span>
    </th>
  );
}
