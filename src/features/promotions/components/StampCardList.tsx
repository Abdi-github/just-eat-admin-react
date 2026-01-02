import { useState } from 'react';
import { Table, Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, PlusCircle, Trash, Pencil } from 'react-bootstrap-icons';
import { useGetStampCardsQuery, useDeleteStampCardMutation } from '../promotions.api';
import type { StampCardQueryParams } from '../promotions.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Pagination } from '@/shared/components/Pagination';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { formatDate, formatCHF } from '@/shared/utils/formatters';
import { DEFAULT_PAGE_SIZE } from '@/shared/utils/constants';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { toast } from 'react-toastify';
import { Badge } from 'react-bootstrap';

export function StampCardList() {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const [params, setParams] = useState<StampCardQueryParams>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    sort: '-created_at',
  });

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isFetching, isError } = useGetStampCardsQuery(params);
  const [deleteStampCard, { isLoading: isDeleting }] = useDeleteStampCardMutation();

  const handleFilterChange = (key: keyof StampCardQueryParams, value: string) => {
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
      await deleteStampCard(deleteTarget.id).unwrap();
      toast.success(t('promotions:stamps.deleteSuccess'));
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
        <Col md={6}>
          <InputGroup size="sm">
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
            <Form.Control
              placeholder={t('promotions:stamps.filterByRestaurant')}
              value={params.restaurant_id || ''}
              onChange={(e) => handleFilterChange('restaurant_id', e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/promotions/stamp-cards/new')}
          >
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
                label={t('promotions:stamps.name')}
                field="name"
                currentSort={params.sort || '-created_at'}
                onSort={(v) => setParams((p) => ({ ...p, sort: v, page: 1 }))}
              />
              <th>{t('promotions:stamps.restaurant')}</th>
              <th>{t('promotions:stamps.stampsRequired')}</th>
              <th>{t('promotions:stamps.reward')}</th>
              <th>{t('promotions:stamps.validity')}</th>
              <th>{t('common:status.label')}</th>
              <th>{t('common:actions.label')}</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted py-4">
                  {t('promotions:stamps.noStampCards')}
                </td>
              </tr>
            )}
            {data?.data.map((card) => (
              <tr key={card.id} style={{ cursor: 'pointer' }}>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  <strong>{card.name}</strong>
                  {card.description && <div className="text-muted small">{card.description}</div>}
                </td>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  {card.restaurant_name || card.restaurant_id}
                </td>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  <Badge bg="info">
                    {card.stamps_required} {t('promotions:stamps.stampsRequired')}
                  </Badge>
                </td>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  <div>{card.reward_description}</div>
                  <div className="text-muted small">
                    {card.reward_type === 'PERCENTAGE'
                      ? `${card.reward_value}%`
                      : formatCHF(card.reward_value)}
                  </div>
                </td>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  {card.valid_from && <div className="small">{formatDate(card.valid_from)}</div>}
                  {card.valid_until && (
                    <div className="small text-muted">→ {formatDate(card.valid_until)}</div>
                  )}
                  {!card.valid_from && !card.valid_until && <span className="text-muted">—</span>}
                </td>
                <td onClick={() => navigate(`/promotions/stamp-cards/${card.id}`)}>
                  <Badge bg={card.is_active ? 'success' : 'secondary'}>
                    {card.is_active ? t('common:status.active') : t('common:status.inactive')}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-1"
                    title={t('common:actions.edit')}
                    onClick={() => navigate(`/promotions/stamp-cards/${card.id}/edit`)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    title={t('common:actions.delete')}
                    onClick={() => setDeleteTarget({ id: card.id, name: card.name })}
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
        title={t('promotions:stamps.deleteTitle')}
        message={t('promotions:stamps.deleteMessage', { name: deleteTarget?.name })}
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
