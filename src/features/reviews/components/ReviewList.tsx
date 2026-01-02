import { useMemo } from 'react';
import { Row, Col, Form, Card, Table, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from '@/shared/components/Pagination';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime } from '@/shared/utils/formatters';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { useAppSelector } from '@/app/hooks';
import { useGetReviewsQuery } from '../reviews.api';
import type { ReviewStatus, ReviewQueryParams, Review } from '../reviews.types';
import { REVIEW_STATUS_OPTIONS } from '../reviews.types';

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export function ReviewList() {
  const { t } = useTranslation('reviews');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const status = (searchParams.get('status') as ReviewStatus) || undefined;
  const minRating = searchParams.get('min_rating')
    ? Number(searchParams.get('min_rating'))
    : undefined;
  const sort = searchParams.get('sort') || '-created_at';

  const queryParams = useMemo<ReviewQueryParams>(() => {
    const params: ReviewQueryParams = { page, limit, sort };
    if (status) params.status = status;
    if (minRating) params.min_rating = minRating;
    return params;
  }, [page, limit, status, minRating, sort]);

  const { data, isLoading, isError } = useGetReviewsQuery(queryParams);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const reviews = data?.data || [];

  const renderStars = (rating: number) => (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <i
          key={i}
          className={`bi ${i < rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'} me-0`}
          style={{ fontSize: '0.85rem' }}
        />
      ))}
    </span>
  );

  const renderRow = (review: Review) => (
    <tr
      key={review.id}
      className="cursor-pointer"
      onClick={() => navigate(`/reviews/${review.id}`)}
      role="button"
    >
      <td>
        <div>
          <div className="fw-semibold">
            {review.user?.first_name ?? '—'} {review.user?.last_name ?? ''}
          </div>
          <small className="text-muted">{review.restaurant?.name ?? '—'}</small>
        </div>
      </td>
      <td>{renderStars(review.rating)}</td>
      <td>
        <span className="text-truncate d-inline-block" style={{ maxWidth: 250 }}>
          {review.comment || '—'}
        </span>
      </td>
      <td>
        <StatusBadge status={review.status} />
      </td>
      <td>
        {review.is_verified ? (
          <Badge bg="success" pill>
            <i className="bi bi-check-circle me-1" />
            {t('fields.verified')}
          </Badge>
        ) : (
          <Badge bg="secondary" pill>
            {t('fields.unverified')}
          </Badge>
        )}
      </td>
      <td className="text-muted small">{formatDateTime(review.created_at, currentLang)}</td>
    </tr>
  );

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom py-3">
        <Row className="g-2 align-items-center">
          {/* Status Filter */}
          <Col xs={12} md={3}>
            <Form.Select
              size="sm"
              value={status || ''}
              onChange={(e) => updateParams({ status: e.target.value || undefined })}
            >
              <option value="">{t('filters.allStatuses')}</option>
              {REVIEW_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {tCommon(`status.${s.toLowerCase()}`)}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Min Rating Filter */}
          <Col xs={12} md={3}>
            <Form.Select
              size="sm"
              value={minRating || ''}
              onChange={(e) => updateParams({ min_rating: e.target.value || undefined })}
            >
              <option value="">{t('filters.allRatings')}</option>
              {RATING_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {t('filters.minStars', { count: r })}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Sort */}
          <Col xs={12} md={3}>
            <Form.Select
              size="sm"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              <option value="-created_at">{t('sort.newestFirst')}</option>
              <option value="created_at">{t('sort.oldestFirst')}</option>
              <option value="-rating">{t('sort.highestRating')}</option>
              <option value="rating">{t('sort.lowestRating')}</option>
            </Form.Select>
          </Col>

          {/* Results count */}
          <Col xs={12} md={3} className="text-end">
            {data?.meta && (
              <small className="text-muted">
                {data.meta.total} {t('list.results')}
              </small>
            )}
          </Col>
        </Row>
      </Card.Header>

      <Card.Body className="p-0">
        {isLoading ? (
          <div className="p-5">
            <LoadingSpinner />
          </div>
        ) : isError ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-exclamation-triangle fs-1 d-block mb-3" />
            <p>{tCommon('messages.error')}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-star-half fs-1 d-block mb-3" />
            <p>{tCommon('table.noResults')}</p>
          </div>
        ) : (
          <>
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>{t('fields.reviewer')}</th>
                  <SortableHeader
                    label={t('fields.rating')}
                    field="rating"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                  <th>{t('fields.comment')}</th>
                  <th>{t('fields.status')}</th>
                  <th>{t('fields.verified')}</th>
                  <SortableHeader
                    label={t('fields.createdAt')}
                    field="created_at"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                </tr>
              </thead>
              <tbody>{reviews.map(renderRow)}</tbody>
            </Table>
            {data?.meta && (
              <div className="p-3 border-top">
                <Pagination pagination={data.meta} onPageChange={handlePageChange} />
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}
