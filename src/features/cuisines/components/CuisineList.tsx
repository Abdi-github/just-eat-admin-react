import { useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Card, Table, Button, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { useAppSelector } from '@/app/hooks';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useGetCuisinesQuery, useDeleteCuisineMutation } from '../cuisines.api';
import type { CuisineQueryParams, Cuisine } from '../cuisines.types';
import type { TranslatedField } from '@/shared/types/common.types';
import { toast } from 'react-toastify';

interface CuisineListProps {
  onEdit: (cuisine: Cuisine) => void;
}

export function CuisineList({ onEdit }: CuisineListProps) {
  const { t } = useTranslation('cuisines');
  const { t: tCommon } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('cuisines:update');
  const canDelete = hasPermission('cuisines:delete');

  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'slug';

  const [searchInput, setSearchInput] = useState(search);
  const [deleteTarget, setDeleteTarget] = useState<Cuisine | null>(null);

  const [deleteCuisine, { isLoading: isDeleting }] = useDeleteCuisineMutation();

  const queryParams = useMemo<CuisineQueryParams>(() => {
    const params: CuisineQueryParams = { page, limit };
    if (search) params.search = search;
    if (sort.startsWith('-')) {
      params.sort = sort.slice(1);
      params.order = 'desc';
    } else {
      params.sort = sort;
      params.order = 'asc';
    }
    return params;
  }, [page, limit, search, sort]);

  const { data, isLoading, isError } = useGetCuisinesQuery(queryParams);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchInput || undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCuisine(deleteTarget.id).unwrap();
      toast.success(t('messages.deleted'));
      setDeleteTarget(null);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const getName = (cuisine: Cuisine): string => {
    if (typeof cuisine.name === 'string') return cuisine.name;
    return (cuisine.name as TranslatedField)[currentLang] || (cuisine.name as TranslatedField).de;
  };

  const cuisines = data?.data || [];

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3">
          <Row className="g-2 align-items-center">
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

            <Col xs={12} md={3}>
              <Form.Select
                size="sm"
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
              >
                <option value="slug">{t('sort.nameAZ')}</option>
                <option value="-slug">{t('sort.nameZA')}</option>
                <option value="-created_at">{t('sort.newestFirst')}</option>
                <option value="created_at">{t('sort.oldestFirst')}</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={4} className="text-end">
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
          ) : cuisines.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-egg-fried fs-1 d-block mb-3" />
              <p>{tCommon('table.noResults')}</p>
            </div>
          ) : (
            <>
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <SortableHeader
                      label={t('fields.name')}
                      field="slug"
                      currentSort={sort}
                      onSort={(v) => updateParams({ sort: v })}
                    />
                    <th>{t('fields.slug')}</th>
                    <th>{t('fields.status')}</th>
                    <th>{t('fields.image')}</th>
                    <th className="text-end">{tCommon('table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cuisines.map((cuisine) => (
                    <tr key={cuisine.id}>
                      <td className="fw-semibold">{getName(cuisine)}</td>
                      <td className="text-muted">{cuisine.slug}</td>
                      <td>
                        <Badge bg={cuisine.is_active ? 'success' : 'secondary'}>
                          {cuisine.is_active
                            ? tCommon('status.active')
                            : tCommon('status.inactive')}
                        </Badge>
                      </td>
                      <td>
                        {cuisine.image_url ? (
                          <img
                            src={cuisine.image_url}
                            alt={getName(cuisine)}
                            className="rounded"
                            style={{ width: 32, height: 32, objectFit: 'cover' }}
                          />
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        {canEdit && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => onEdit(cuisine)}
                            aria-label={tCommon('actions.edit')}
                          >
                            <i className="bi bi-pencil" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteTarget(cuisine)}
                            aria-label={tCommon('actions.delete')}
                          >
                            <i className="bi bi-trash" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
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

      <ConfirmDialog
        show={!!deleteTarget}
        title={tCommon('actions.delete')}
        message={t('messages.confirmDelete', { name: deleteTarget ? getName(deleteTarget) : '' })}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
