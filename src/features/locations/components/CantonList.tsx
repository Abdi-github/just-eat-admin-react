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
import { useGetCantonsQuery, useDeleteCantonMutation } from '../locations.api';
import type { CantonQueryParams, Canton } from '../locations.types';
import type { TranslatedField } from '@/shared/types/common.types';
import { toast } from 'react-toastify';

interface CantonListProps {
  onEdit: (canton: Canton) => void;
}

export function CantonList({ onEdit }: CantonListProps) {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('locations:update');
  const canDelete = hasPermission('locations:delete');

  const page = Number(searchParams.get('cantonPage')) || 1;
  const search = searchParams.get('cantonSearch') || '';
  const sort = searchParams.get('cantonSort') || 'code';

  const [searchInput, setSearchInput] = useState(search);
  const [deleteTarget, setDeleteTarget] = useState<Canton | null>(null);

  const [deleteCanton, { isLoading: isDeleting }] = useDeleteCantonMutation();

  const queryParams = useMemo<CantonQueryParams>(() => {
    const params: CantonQueryParams = { page, limit: 26 }; // 26 Swiss cantons
    if (search) params.search = search;
    if (sort.startsWith('-')) {
      params.sort = sort.slice(1);
      params.order = 'desc';
    } else {
      params.sort = sort;
      params.order = 'asc';
    }
    return params;
  }, [page, search, sort]);

  const { data, isLoading, isError } = useGetCantonsQuery(queryParams);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (!('cantonPage' in updates)) {
      newParams.set('cantonPage', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ cantonSearch: searchInput || undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ cantonPage: String(newPage) });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCanton(deleteTarget.id).unwrap();
      toast.success(t('cantons.messages.deleted'));
      setDeleteTarget(null);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const getName = (canton: Canton): string => {
    if (typeof canton.name === 'string') return canton.name;
    return (canton.name as TranslatedField)[currentLang] || (canton.name as TranslatedField).de;
  };

  const cantons = data?.data || [];

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3">
          <Row className="g-2 align-items-center">
            <Col xs={12} md={5}>
              <Form onSubmit={handleSearch}>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder={t('cantons.searchPlaceholder')}
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
                        updateParams({ cantonSearch: undefined });
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
                onChange={(e) => updateParams({ cantonSort: e.target.value })}
              >
                <option value="code">{t('cantons.sort.codeAZ')}</option>
                <option value="-code">{t('cantons.sort.codeZA')}</option>
                <option value="-created_at">{t('cantons.sort.newestFirst')}</option>
                <option value="created_at">{t('cantons.sort.oldestFirst')}</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={4} className="text-end">
              {data?.meta && (
                <small className="text-muted">
                  {data.meta.total} {t('cantons.results')}
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
          ) : cantons.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-geo-alt fs-1 d-block mb-3" />
              <p>{tCommon('table.noResults')}</p>
            </div>
          ) : (
            <>
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <SortableHeader
                      label={t('cantons.fields.code')}
                      field="code"
                      currentSort={sort}
                      onSort={(v) => updateParams({ cantonSort: v })}
                    />
                    <SortableHeader
                      label={t('cantons.fields.name')}
                      field="name"
                      currentSort={sort}
                      onSort={(v) => updateParams({ cantonSort: v })}
                    />
                    <th>{t('cantons.fields.slug')}</th>
                    <th>{t('cantons.fields.status')}</th>
                    <th className="text-end">{tCommon('table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cantons.map((canton) => (
                    <tr key={canton.id}>
                      <td>
                        <Badge bg="dark" className="font-monospace">
                          {canton.code}
                        </Badge>
                      </td>
                      <td className="fw-semibold">{getName(canton)}</td>
                      <td className="text-muted">{canton.slug}</td>
                      <td>
                        <Badge bg={canton.is_active ? 'success' : 'secondary'}>
                          {canton.is_active ? tCommon('status.active') : tCommon('status.inactive')}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {canEdit && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => onEdit(canton)}
                            aria-label={tCommon('actions.edit')}
                          >
                            <i className="bi bi-pencil" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteTarget(canton)}
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
        message={t('cantons.messages.confirmDelete', {
          name: deleteTarget ? getName(deleteTarget) : '',
        })}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
