import { useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Card, Button, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from '@/shared/components/Pagination';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatNumber } from '@/shared/utils/formatters';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { useGetRestaurantsQuery } from '../restaurants.api';
import type { RestaurantStatus, RestaurantQueryParams, Restaurant } from '../restaurants.types';

const STATUS_OPTIONS: RestaurantStatus[] = [
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'PUBLISHED',
  'REJECTED',
  'SUSPENDED',
  'ARCHIVED',
];

export function RestaurantList() {
  const { t } = useTranslation('restaurants');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract filters from URL params
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const status = (searchParams.get('status') as RestaurantStatus) || undefined;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-created_at';

  const [searchInput, setSearchInput] = useState(search);

  const queryParams = useMemo<RestaurantQueryParams>(() => {
    const params: RestaurantQueryParams = { page, limit, sort };
    if (status) params.status = status;
    if (search) params.search = search;
    return params;
  }, [page, limit, status, search, sort]);

  const { data, isLoading, isError } = useGetRestaurantsQuery(queryParams);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Reset to page 1 when filters change (except when page itself changes)
    if (!('page' in updates)) {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const restaurants = data?.data || [];

  const renderRow = (row: Restaurant) => (
    <tr
      key={row.id}
      className="cursor-pointer"
      onClick={() => navigate(`/restaurants/${row.id}`)}
      role="button"
    >
      <td>
        <div className="d-flex align-items-center">
          {row.logo_url ? (
            <img
              src={row.logo_url}
              alt={row.name}
              className="rounded me-2"
              style={{ width: 32, height: 32, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="bg-light rounded me-2 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <i className="bi bi-shop text-muted small" />
            </div>
          )}
          <div>
            <div className="fw-semibold">{row.name}</div>
            <small className="text-muted">{row.slug}</small>
          </div>
        </div>
      </td>
      <td>
        {[row.city?.name, row.canton?.code || row.canton?.name].filter(Boolean).join(', ') || '—'}
      </td>
      <td>
        <StatusBadge status={row.status} />
      </td>
      <td>
        <i className="bi bi-star-fill text-warning me-1 small" />
        {(row.rating ?? 0).toFixed(1)}{' '}
        <small className="text-muted">({formatNumber(row.review_count)})</small>
      </td>
      <td>
        <span className={row.is_active ? 'text-success' : 'text-danger'}>
          <i className={`bi ${row.is_active ? 'bi-check-circle-fill' : 'bi-x-circle-fill'} me-1`} />
          {row.is_active ? tCommon('status.active') : tCommon('status.inactive')}
        </span>
      </td>
    </tr>
  );

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom py-3">
        <Row className="g-2 align-items-center">
          {/* Search */}
          <Col xs={12} md={5}>
            <Form onSubmit={handleSearch}>
              <InputGroup size="sm">
                <Form.Control
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <Button variant="outline-secondary" type="submit">
                  <i className="bi bi-search" />
                </Button>
                {search && (
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setSearchInput('');
                      updateParams({ search: undefined });
                    }}
                  >
                    <i className="bi bi-x" />
                  </Button>
                )}
              </InputGroup>
            </Form>
          </Col>

          {/* Status Filter */}
          <Col xs={12} md={3}>
            <Form.Select
              size="sm"
              value={status || ''}
              onChange={(e) => updateParams({ status: e.target.value || undefined })}
            >
              <option value="">{t('filters.allStatuses')}</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {tCommon(`status.${s.toLowerCase()}`)}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Sort */}
          <Col xs={12} md={2}>
            <Form.Select
              size="sm"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value })}
            >
              <option value="-created_at">{t('filters.newest')}</option>
              <option value="created_at">{t('filters.oldest')}</option>
              <option value="name">{t('filters.nameAZ')}</option>
              <option value="-name">{t('filters.nameZA')}</option>
              <option value="-rating">{t('filters.highestRating')}</option>
            </Form.Select>
          </Col>

          {/* Results count */}
          <Col xs={12} md={2} className="text-end">
            {data?.meta && (
              <small className="text-muted">
                {formatNumber(data.meta.total)} {t('list.results')}
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
        ) : restaurants.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-shop fs-1 d-block mb-3" />
            <p>{tCommon('table.noResults')}</p>
          </div>
        ) : (
          <>
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <SortableHeader
                    label={t('fields.name')}
                    field="name"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                  <th>{t('fields.location')}</th>
                  <th>{t('fields.status')}</th>
                  <SortableHeader
                    label={t('fields.rating')}
                    field="rating"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                  <th>{t('fields.active')}</th>
                </tr>
              </thead>
              <tbody>{restaurants.map(renderRow)}</tbody>
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
