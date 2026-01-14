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
import { useGetCitiesQuery, useDeleteCityMutation, useGetCantonsQuery } from '../locations.api';
import type { CityQueryParams, City } from '../locations.types';
import type { TranslatedField } from '@/shared/types/common.types';
import { toast } from 'react-toastify';

interface CityListProps {
  onEdit: (city: City) => void;
}

export function CityList({ onEdit }: CityListProps) {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('locations:update');
  const canDelete = hasPermission('locations:delete');

  const page = Number(searchParams.get('cityPage')) || 1;
  const search = searchParams.get('citySearch') || '';
  const sort = searchParams.get('citySort') || 'slug';
  const cantonFilter = searchParams.get('canton_id') || '';

  const [searchInput, setSearchInput] = useState(search);
  const [deleteTarget, setDeleteTarget] = useState<City | null>(null);

  const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();

  // Fetch cantons for filter dropdown
  const { data: cantonsData } = useGetCantonsQuery({ limit: 50, sort: 'code', order: 'asc' });

  const queryParams = useMemo<CityQueryParams>(() => {
    const params: CityQueryParams = { page, limit: 20 };
    if (search) params.search = search;
    if (cantonFilter) params.canton_id = cantonFilter;
    if (sort.startsWith('-')) {
      params.sort = sort.slice(1);
      params.order = 'desc';
    } else {
      params.sort = sort;
      params.order = 'asc';
    }
    return params;
  }, [page, search, sort, cantonFilter]);

  const { data, isLoading, isError } = useGetCitiesQuery(queryParams);

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    if (!('cityPage' in updates)) {
      newParams.set('cityPage', '1');
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ citySearch: searchInput || undefined });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ cityPage: String(newPage) });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCity(deleteTarget.id).unwrap();
      toast.success(t('cities.messages.deleted'));
      setDeleteTarget(null);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const getName = (item: { name: string | TranslatedField }): string => {
    if (typeof item.name === 'string') return item.name;
    return (item.name as TranslatedField)[currentLang] || (item.name as TranslatedField).de;
  };

  const cities = data?.data || [];
  const cantons = cantonsData?.data || [];

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3">
          <Row className="g-2 align-items-center">
            <Col xs={12} md={4}>
              <Form onSubmit={handleSearch}>
                <InputGroup size="sm">
                  <Form.Control
                    placeholder={t('cities.searchPlaceholder')}
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
                        updateParams({ citySearch: undefined });
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
                value={cantonFilter}
                onChange={(e) => updateParams({ canton_id: e.target.value || undefined })}
              >
                <option value="">{t('cities.allCantons')}</option>
                {cantons.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {getName(c)}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col xs={12} md={2}>
              <Form.Select
                size="sm"
                value={sort}
                onChange={(e) => updateParams({ citySort: e.target.value })}
              >
                <option value="slug">{t('cities.sort.nameAZ')}</option>
                <option value="-slug">{t('cities.sort.nameZA')}</option>
                <option value="-created_at">{t('cities.sort.newestFirst')}</option>
              </Form.Select>
            </Col>

            <Col xs={12} md={3} className="text-end">
              {data?.meta && (
                <small className="text-muted">
                  {data.meta.total} {t('cities.results')}
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
          ) : cities.length === 0 ? (
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
                      label={t('cities.fields.name')}
                      field="slug"
                      currentSort={sort}
                      onSort={(v) => updateParams({ citySort: v })}
                    />
                    <th>{t('cities.fields.canton')}</th>
                    <th>{t('cities.fields.postalCodes')}</th>
                    <th>{t('cities.fields.status')}</th>
                    <th className="text-end">{tCommon('table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city) => (
                    <tr key={city.id}>
                      <td className="fw-semibold">{getName(city)}</td>
                      <td>
                        {city.canton ? (
                          <Badge bg="dark" className="font-monospace">
                            {city.canton.code}
                          </Badge>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {city.postal_codes?.slice(0, 5).join(', ')}
                          {city.postal_codes?.length > 5 && ` +${city.postal_codes.length - 5}`}
                        </small>
                      </td>
                      <td>
                        <Badge bg={city.is_active ? 'success' : 'secondary'}>
                          {city.is_active ? tCommon('status.active') : tCommon('status.inactive')}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {canEdit && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1"
                            onClick={() => onEdit(city)}
                            aria-label={tCommon('actions.edit')}
                          >
                            <i className="bi bi-pencil" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => setDeleteTarget(city)}
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
        message={t('cities.messages.confirmDelete', {
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
