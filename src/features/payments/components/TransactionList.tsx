import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Form, Row, Col, Card, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Search } from 'react-bootstrap-icons';
import { useGetPaymentsQuery } from '../payments.api';
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_TX_STATUS_VARIANTS,
} from '../payments.types';

import { Pagination } from '@/shared/components/Pagination/Pagination';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';
import { useAppSelector } from '@/app/hooks';

export function TransactionList() {
  const { t } = useTranslation(['payments', 'common']);
  const navigate = useNavigate();
  const language = useAppSelector((state) => state.language.current);

  // ─── Filter State ──────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [orderIdFilter, setOrderIdFilter] = useState('');
  const [sortBy, setSortBy] = useState('-created_at');

  // ─── Build Query Params ────────────────────────────────────────
  const queryParams = useMemo(() => {
    const params: Record<string, unknown> = {
      page,
      limit: DEFAULT_PAGE_SIZE,
      sort: sortBy,
    };
    if (statusFilter) params.status = statusFilter;
    if (methodFilter) params.payment_method = methodFilter;
    if (orderIdFilter.trim()) params.order_id = orderIdFilter.trim();
    return params;
  }, [page, statusFilter, methodFilter, orderIdFilter, sortBy]);

  const { data, isLoading, isError, error } = useGetPaymentsQuery(queryParams);

  // ─── Handlers ──────────────────────────────────────────────────
  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleMethodChange = (value: string) => {
    setMethodFilter(value);
    setPage(1);
  };

  const handleOrderIdChange = (value: string) => {
    setOrderIdFilter(value);
    setPage(1);
  };

  const handleRowClick = (id: string) => {
    navigate(`/payments/${id}`);
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
                <Form.Label className="small fw-bold">{t('common:actions.filter')}</Form.Label>
                <Form.Select
                  size="sm"
                  value={statusFilter}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="">{t('filters.allStatuses')}</option>
                  {PAYMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {t(`status.${status}`)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.paymentMethod')}</Form.Label>
                <Form.Select
                  size="sm"
                  value={methodFilter}
                  onChange={(e) => handleMethodChange(e.target.value)}
                >
                  <option value="">{t('filters.allMethods')}</option>
                  {PAYMENT_METHOD_OPTIONS.map(({ value, labelKey }) => (
                    <option key={value} value={value}>
                      {t(labelKey)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label className="small fw-bold">{t('filters.orderId')}</Form.Label>
                <InputGroup size="sm">
                  <InputGroup.Text>
                    <Search size={14} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder={t('filters.orderIdPlaceholder')}
                    value={orderIdFilter}
                    onChange={(e) => handleOrderIdChange(e.target.value)}
                  />
                </InputGroup>
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
                    <SortableHeader
                      label={t('table.amount')}
                      field="amount"
                      currentSort={sortBy}
                      onSort={(v) => {
                        setSortBy(v);
                        setPage(1);
                      }}
                    />
                    <th>{t('table.method')}</th>
                    <th>{t('table.provider')}</th>
                    <th>{t('table.status')}</th>
                    <th>{t('table.attempts')}</th>
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
                        {t('messages.noTransactions')}
                      </td>
                    </tr>
                  ) : (
                    data.data.map((tx) => (
                      <tr
                        key={tx.id}
                        onClick={() => handleRowClick(tx.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>
                          <code className="small">{tx.id.slice(-8)}</code>
                        </td>
                        <td className="fw-semibold">{formatCHF(tx.amount)}</td>
                        <td>{t(`methods.${tx.payment_method}`)}</td>
                        <td>
                          <span className="text-capitalize">{tx.provider_name}</span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${PAYMENT_TX_STATUS_VARIANTS[tx.status] || 'secondary'}`}
                          >
                            {t(`status.${tx.status}`)}
                          </span>
                        </td>
                        <td className="text-center">{tx.attempts}</td>
                        <td className="small text-muted">
                          {formatDateTime(tx.created_at, language)}
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
