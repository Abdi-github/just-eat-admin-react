import { useState } from 'react';
import { Table, Form, Row, Col, InputGroup, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Trash, Pencil } from 'react-bootstrap-icons';
import { useGetCouponsQuery, useDeleteCouponMutation } from '../promotions.api';
import type { CouponQueryParams } from '../promotions.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { formatCHF, formatDate } from '@/shared/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { toast } from 'react-toastify';

export function CouponList() {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const [params, setParams] = useState<CouponQueryParams>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    sort: '-created_at',
  });

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);

  const { data, isLoading, isFetching, isError } = useGetCouponsQuery(params);
  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

  const handleFilterChange = (key: keyof CouponQueryParams, value: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      [key]: value || undefined,
    }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCoupon(deleteTarget.id).unwrap();
      toast.success(t('promotions:coupons.deleteSuccess'));
      setDeleteTarget(null);
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (isError) {
    return (
      <div className="text-center text-danger py-4">
        <i className="bi bi-exclamation-triangle me-2" />
        {t('common:messages.error')}
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <Row className="mb-3 g-2">
        <Col md={3}>
          <Form.Select
            size="sm"
            value={params.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">{t('promotions:coupons.allStatuses')}</option>
            <option value="active">{t('common:status.active')}</option>
            <option value="inactive">{t('common:status.inactive')}</option>
            <option value="expired">{t('common:status.expired')}</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            size="sm"
            value={params.scope || ''}
            onChange={(e) => handleFilterChange('scope', e.target.value)}
          >
            <option value="">{t('promotions:coupons.allScopes')}</option>
            <option value="PLATFORM">{t('promotions:coupons.scopePlatform')}</option>
            <option value="RESTAURANT">{t('promotions:coupons.scopeRestaurant')}</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <InputGroup size="sm">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder={t('promotions:coupons.filterByRestaurant')}
              value={params.restaurant_id || ''}
              onChange={(e) => handleFilterChange('restaurant_id', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3} className="text-end">
          <Button size="sm" variant="primary" onClick={() => navigate('/promotions/coupons/new')}>
            <PlusCircle className="me-1" /> {t('common:actions.create')}
          </Button>
        </Col>
      </Row>

      {/* Table */}
      <div className="table-responsive">
        <Table striped hover className={isFetching ? 'opacity-50' : ''}>
          <thead>
            <tr>
              <SortableHeader
                label={t('promotions:coupons.code')}
                field="code"
                currentSort={params.sort || '-created_at'}
                onSort={(v) => setParams((p) => ({ ...p, sort: v, page: 1 }))}
              />
              <th>{t('promotions:coupons.discount')}</th>
              <th>{t('promotions:coupons.scope')}</th>
              <th>{t('promotions:coupons.usage')}</th>
              <th>{t('promotions:coupons.validity')}</th>
              <th>{t('common:status.label')}</th>
              <th>{t('common:actions.label')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  {t('promotions:coupons.noCoupons')}
                </td>
              </tr>
            )}
            {data?.data.map((coupon) => (
              <tr key={coupon.id} style={{ cursor: 'pointer' }}>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  <code className="fw-bold">{coupon.code}</code>
                  {coupon.description && (
                    <div className="text-muted small">{coupon.description}</div>
                  )}
                </td>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  {coupon.discount_type === 'PERCENTAGE' ? (
                    <span>{coupon.discount_value}%</span>
                  ) : (
                    <span>{formatCHF(coupon.discount_value)}</span>
                  )}
                  {coupon.minimum_order > 0 && (
                    <div className="text-muted small">
                      {t('promotions:coupons.minOrder')}: {formatCHF(coupon.minimum_order)}
                    </div>
                  )}
                </td>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  <Badge bg={coupon.scope === 'PLATFORM' ? 'primary' : 'info'}>
                    {t(
                      `promotions:coupons.scope${coupon.scope === 'PLATFORM' ? 'Platform' : 'Restaurant'}`
                    )}
                  </Badge>
                  {coupon.restaurant_name && (
                    <div className="text-muted small">{coupon.restaurant_name}</div>
                  )}
                </td>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  {coupon.usage_count}
                  {coupon.usage_limit != null && <span> / {coupon.usage_limit}</span>}
                  {coupon.usage_limit == null && <span className="text-muted"> / ∞</span>}
                </td>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  {coupon.valid_from && (
                    <div className="small">{formatDate(coupon.valid_from)}</div>
                  )}
                  {coupon.valid_until && (
                    <div className="small text-muted">→ {formatDate(coupon.valid_until)}</div>
                  )}
                  {!coupon.valid_from && !coupon.valid_until && (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td onClick={() => navigate(`/promotions/coupons/${coupon.id}`)}>
                  <StatusBadge status={coupon.status} />
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-1"
                    title={t('common:actions.edit')}
                    onClick={() => navigate(`/promotions/coupons/${coupon.id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    title={t('common:actions.delete')}
                    onClick={() => setDeleteTarget({ id: coupon.id, code: coupon.code })}
                  >
                    <Trash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {data?.meta && <Pagination pagination={data.meta} onPageChange={handlePageChange} />}

      {/* Delete confirmation */}
      <ConfirmDialog
        show={!!deleteTarget}
        title={t('promotions:coupons.deleteTitle')}
        message={t('promotions:coupons.deleteMessage', { code: deleteTarget?.code })}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
