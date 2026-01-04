import { Table, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import type { PaginationMeta } from '@/shared/types/api.types';

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  title?: string;
  headerActions?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  pagination,
  isLoading = false,
  onPageChange,
  onRowClick,
  keyExtractor,
  emptyMessage,
  title,
  headerActions,
}: DataTableProps<T>) {
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Card>
      {(title || headerActions) && (
        <Card.Header className="d-flex justify-content-between align-items-center">
          {title && <h5 className="mb-0">{title}</h5>}
          {headerActions && <div>{headerActions}</div>}
        </Card.Header>
      )}
      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-muted">
                  {emptyMessage || t('table.noResults')}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer' : ''}
                  role={onRowClick ? 'button' : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {col.render
                        ? col.render(item)
                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card.Body>
      {pagination && onPageChange && (
        <Card.Footer>
          <Pagination pagination={pagination} onPageChange={onPageChange} />
        </Card.Footer>
      )}
    </Card>
  );
}
