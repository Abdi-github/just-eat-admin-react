import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useGetDeliveriesQuery } from '../deliveries.api';
import {
  DELIVERY_STATUS_OPTIONS,
  DELIVERY_STATUS_VARIANTS,
  DELIVERY_SORT_OPTIONS,
} from '../deliveries.types';
import { Pagination } from '@/shared/components/Pagination/Pagination';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';
import { useAppSelector } from '@/app/hooks';

export function DeliveryList() {
  const { t } = useTranslation(['deliveries', 'common']);
  const navigate = useNavigate();
  const language = useAppSelector((state) => state.language.current);

  // ─── Filter State ──────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // ─── Build Query Params ────────────────────────────────────────
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page,
      limit: DEFAULT_PAGE_SIZE,
      sort: sortBy,
    };
    if (statusFilter) params.status = statusFilter;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    return params;
  }, [page, statusFilter, sortBy, dateFrom, dateTo]);

  const { data, isLoading, isError, error } = useGetDeliveriesQuery(queryParams);

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRowClick = (id: string) => {
    navigate(`/deliveries/${id}`);
  };

  // ─── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.status')}</Form.Label>
                <Form.Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="">{t('filters.allStatuses')}</option>
                  {DELIVERY_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.sort')}</Form.Label>
                <Form.Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  {DELIVERY_SORT_OPTIONS.map(({ value, labelKey }) => (
                    <option key={value} value={value}>
                      {t(labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.dateFrom')}</Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.dateTo')}</Form.Label>
                <Form.Control
                  type="date"
                  size="sm"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <Alert variant="danger">
          {(error as { data?: { message?: string } })?.data?.message || t('common:messages.error')}
        </Alert>
      )}

      {/* Table */}
      {data && (
        <>
          <Card>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>{t('table.id')}</th>
                    <th>{t('table.orderNumber')}</th>
                    <th>{t('table.restaurant')}</th>
                    <th>{t('table.status')}</th>
                    <th>{t('table.courier')}</th>
                    <SortableHeader
                      label={t('table.fee')}
                      field="fee"
                      currentSort={sortBy}
                      onSort={(v) => {
                        setSortBy(v);
                        setPage(1);
                      }}
                    />
                    <SortableHeader
                      label={t('table.date')}
                      field="created_at"
                      currentSort={sortBy}
                      onSort={(v) => {
                        setSortBy(v);
                        setPage(1);
                      }}
                    />
                  </tr>
                </thead>
                <tbody>
                  {data.data.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-4">
                        {t('messages.noDeliveries')}
                      </td>
                    </tr>
                  ) : (
                    data.data.map((delivery) => (
                      <tr
                        key={delivery.id}
                        onClick={() => handleRowClick(delivery.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <code className="small">{delivery.id.slice(-8)}</code>
                        </td>
                        <td>
                          {delivery.order_number ? (
                            <span className="fw-semibold">{delivery.order_number}</span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>{delivery.restaurant_name || '—'}</td>
                        <td>
                          <span
                            className={`badge bg-${DELIVERY_STATUS_VARIANTS[delivery.status] || 'secondary'}`}
                          >
                            {t(`status.${delivery.status}`)}
                          </span>
                        </td>
                        <td>
                          {delivery.courier_id ? (
                            <code className="small">{delivery.courier_id.slice(-8)}</code>
                          ) : (
                            <span className="text-muted fst-italic">{t('table.unassigned')}</span>
                          )}
                        </td>
                        <td>{formatCHF(delivery.delivery_fee)}</td>
                        <td className="small text-muted">
                          {formatDateTime(delivery.created_at, language)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          {data.meta && (
            <div className="mt-3">
              <Pagination pagination={data.meta} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </>
  );
}
