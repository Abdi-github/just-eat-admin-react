import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Table, Form, Row, Col, InputGroup, Button, Spinner } from 'react-bootstrap';
import { Search, XCircle, Funnel } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useGetOrdersQuery } from '../orders.api';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Pagination } from '@/shared/components/Pagination';
import { formatCHF, formatRelativeTime } from '@/shared/utils/formatters';
import { SortableHeader } from '@/shared/components/SortableHeader';
import type {
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  OrderQueryParams,
} from '../orders.types';
import { ORDER_SORT_OPTIONS } from '../orders.types';

export function OrderList() {
  const { t } = useTranslation(['orders', 'common']);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Local search state (debounce-friendly)
  const [searchInput, setSearchInput] = useState(searchParams.get('order_number') || '');

  // Build query from URL params
  const queryParams: OrderQueryParams = {
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 20,
    sort: searchParams.get('sort') || '-created_at',
    ...(searchParams.get('status') && { status: searchParams.get('status') as OrderStatus }),
    ...(searchParams.get('order_type') && {
      order_type: searchParams.get('order_type') as OrderType,
    }),
    ...(searchParams.get('payment_method') && {
      payment_method: searchParams.get('payment_method') as PaymentMethod,
    }),
    ...(searchParams.get('payment_status') && {
      payment_status: searchParams.get('payment_status') as PaymentStatus,
    }),
    ...(searchParams.get('order_number') && { order_number: searchParams.get('order_number')! }),
    ...(searchParams.get('date_from') && { date_from: searchParams.get('date_from')! }),
    ...(searchParams.get('date_to') && { date_to: searchParams.get('date_to')! }),
  };

  const { data, isLoading, isError } = useGetOrdersQuery(queryParams);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter change (except page itself)
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = () => {
    updateParam('order_number', searchInput.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setSearchInput('');
    updateParam('order_number', '');
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    searchParams.get('status') ||
    searchParams.get('order_type') ||
    searchParams.get('payment_method') ||
    searchParams.get('payment_status') ||
    searchParams.get('order_number') ||
    searchParams.get('date_from') ||
    searchParams.get('date_to');

  const orders = data?.data || [];
  const meta = data?.meta;

  return (
    <div>
      {/* ─── Filters ─────────────────────────────────────────── */}
      <div className="bg-white rounded shadow-sm p-3 mb-4">
        {/* Search + Sort row */}
        <Row className="g-2 mb-3">
          <Col md={5}>
            <InputGroup>
              <Form.Control
                placeholder={t('filters.searchOrderNumber')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
              {searchInput && (
                <Button variant="outline-secondary" onClick={clearSearch}>
                  <XCircle />
                </Button>
              )}
              <Button variant="primary" onClick={handleSearch}>
                <Search />
              </Button>
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={searchParams.get('sort') || '-created_at'}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              {ORDER_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              value={searchParams.get('date_from') || ''}
              onChange={(e) => updateParam('date_from', e.target.value)}
              placeholder={t('filters.dateFrom')}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="date"
              value={searchParams.get('date_to') || ''}
              onChange={(e) => updateParam('date_to', e.target.value)}
              placeholder={t('filters.dateTo')}
            />
          </Col>
        </Row>

        {/* Filter dropdowns row */}
        <Row className="g-2 align-items-center">
          <Col md={3}>
            <Form.Select
              value={searchParams.get('status') || ''}
              onChange={(e) => updateParam('status', e.target.value)}
            >
              <option value="">{t('filters.allStatuses')}</option>
              {(
                [
                  'PLACED',
                  'ACCEPTED',
                  'REJECTED',
                  'PREPARING',
                  'READY',
                  'PICKED_UP',
                  'IN_TRANSIT',
                  'DELIVERED',
                  'CANCELLED',
                ] as OrderStatus[]
              ).map((s) => (
                <option key={s} value={s}>
                  {t(`common:status.${s.toLowerCase()}`)}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={searchParams.get('order_type') || ''}
              onChange={(e) => updateParam('order_type', e.target.value)}
            >
              <option value="">{t('filters.allTypes')}</option>
              <option value="delivery">{t('orderType.delivery')}</option>
              <option value="pickup">{t('orderType.pickup')}</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={searchParams.get('payment_method') || ''}
              onChange={(e) => updateParam('payment_method', e.target.value)}
            >
              <option value="">{t('filters.allPaymentMethods')}</option>
              <option value="card">{t('paymentMethod.card')}</option>
              <option value="twint">{t('paymentMethod.twint')}</option>
              <option value="postfinance">{t('paymentMethod.postfinance')}</option>
              <option value="cash">{t('paymentMethod.cash')}</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={searchParams.get('payment_status') || ''}
              onChange={(e) => updateParam('payment_status', e.target.value)}
            >
              <option value="">{t('filters.allPaymentStatuses')}</option>
              {(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED'] as PaymentStatus[]).map(
                (s) => (
                  <option key={s} value={s}>
                    {t(`paymentStatus.${s.toLowerCase()}`)}
                  </option>
                )
              )}
            </Form.Select>
          </Col>
          <Col md={2}>
            {hasActiveFilters && (
              <Button variant="outline-secondary" size="sm" onClick={clearAllFilters}>
                <Funnel className="me-1" />
                {t('common:actions.reset')}
              </Button>
            )}
          </Col>
        </Row>
      </div>

      {/* ─── Results ─────────────────────────────────────────── */}
      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : isError ? (
        <div className="alert alert-danger">{t('common:messages.error')}</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 text-muted">{t('common:table.noData')}</div>
      ) : (
        <>
          <div className="table-responsive">
            <Table hover className="align-middle bg-white shadow-sm rounded">
              <thead className="table-light">
                <tr>
                  <SortableHeader
                    label={t('fields.orderNumber')}
                    field="order_number"
                    currentSort={queryParams.sort || '-created_at'}
                    onSort={(v) => updateParam('sort', v)}
                  />
                  <th>{t('fields.restaurant')}</th>
                  <th>{t('fields.status')}</th>
                  <th>{t('fields.orderType')}</th>
                  <SortableHeader
                    label={t('fields.total')}
                    field="total"
                    currentSort={queryParams.sort || '-created_at'}
                    onSort={(v) => updateParam('sort', v)}
                  />
                  <th>{t('fields.paymentMethod')}</th>
                  <th>{t('fields.paymentStatus')}</th>
                  <SortableHeader
                    label={t('fields.placedAt')}
                    field="created_at"
                    currentSort={queryParams.sort || '-created_at'}
                    onSort={(v) => updateParam('sort', v)}
                  />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <td>
                      <span className="fw-semibold text-primary">{order.order_number}</span>
                    </td>
                    <td>{order.restaurant_name || '—'}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>
                      <span
                        className={`badge bg-${order.order_type === 'delivery' ? 'info' : 'secondary'} bg-opacity-10 text-${order.order_type === 'delivery' ? 'info' : 'secondary'}`}
                      >
                        {t(`orderType.${order.order_type}`)}
                      </span>
                    </td>
                    <td className="fw-semibold">{formatCHF(order.total)}</td>
                    <td>{t(`paymentMethod.${order.payment_method}`)}</td>
                    <td>
                      <StatusBadge status={order.payment_status} />
                    </td>
                    <td className="text-muted small">{formatRelativeTime(order.placed_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {meta && (
            <Pagination
              pagination={meta}
              onPageChange={(page) => updateParam('page', String(page))}
            />
          )}
        </>
      )}
    </div>
  );
}
