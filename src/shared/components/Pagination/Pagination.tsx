import { useTranslation } from 'react-i18next';
import type { PaginationMeta } from '@/shared/types/api.types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { t } = useTranslation();
  const { page, totalPages, total, limit, hasPrevPage, hasNextPage } = pagination;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  if (total === 0) return null;

  // Generate page numbers to show
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <small className="text-muted">{t('pagination.showing', { from, to, total })}</small>
      <nav aria-label="Pagination">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${!hasPrevPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page - 1)}
              disabled={!hasPrevPage}
            >
              &laquo;
            </button>
          </li>
          {getPageNumbers().map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <li key={`ellipsis-${index}`} className="page-item disabled">
                <span className="page-link">&hellip;</span>
              </li>
            ) : (
              <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => onPageChange(pageNum)}>
                  {pageNum}
                </button>
              </li>
            )
          )}
          <li className={`page-item ${!hasNextPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(page + 1)}
              disabled={!hasNextPage}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
