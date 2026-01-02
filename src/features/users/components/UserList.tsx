import { useState, useMemo } from 'react';
import { Row, Col, Form, InputGroup, Card, Button, Table, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime } from '@/shared/utils/formatters';
import { SortableHeader } from '@/shared/components/SortableHeader';
import { useAppSelector } from '@/app/hooks';
import { useGetUsersQuery } from '../users.api';
import type { UserStatus, UserQueryParams, User } from '../users.types';
import { USER_STATUS_VARIANTS } from '../users.types';

const STATUS_OPTIONS: UserStatus[] = ['active', 'pending', 'suspended', 'inactive'];

export function UserList() {
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);

  // Extract filters from URL params
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const status = (searchParams.get('status') as UserStatus) || undefined;
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-created_at';

  const [searchInput, setSearchInput] = useState(search);

  // Parse sort into sort + order for the API
  const queryParams = useMemo<UserQueryParams>(() => {
    const params: UserQueryParams = { page, limit };
    if (status) params.status = status;
    if (search) params.search = search;

    // API expects sort + order separately
    if (sort.startsWith('-')) {
      params.sort = sort.slice(1);
      params.order = 'desc';
    } else {
      params.sort = sort;
      params.order = 'asc';
    }

    return params;
  }, [page, limit, status, search, sort]);

  const { data, isLoading, isError } = useGetUsersQuery(queryParams);

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

  const users = data?.data || [];

  const renderRoleBadges = (user: User) =>
    user.roles.map((role) => (
      <Badge
        key={role.id}
        bg="outline-primary"
        className="border border-primary text-primary me-1 fw-normal"
        pill
      >
        {role.name}
      </Badge>
    ));

  const renderRow = (user: User) => (
    <tr
      key={user.id}
      className="cursor-pointer"
      onClick={() => navigate(`/users/${user.id}`)}
      role="button"
    >
      <td>
        <div className="d-flex align-items-center">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className="rounded-circle me-2"
              style={{ width: 32, height: 32, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="bg-light rounded-circle me-2 d-flex align-items-center justify-content-center"
              style={{ width: 32, height: 32 }}
            >
              <i className="bi bi-person text-muted" />
            </div>
          )}
          <div>
            <div className="fw-semibold">{user.full_name}</div>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>
      </td>
      <td>{renderRoleBadges(user)}</td>
      <td>
        <Badge bg={USER_STATUS_VARIANTS[user.status] || 'secondary'}>
          {tCommon(`status.${user.status}`)}
        </Badge>
      </td>
      <td>
        {user.is_verified ? (
          <span className="text-success">
            <i className="bi bi-check-circle-fill me-1" />
            {t('fields.verified')}
          </span>
        ) : (
          <span className="text-muted">
            <i className="bi bi-x-circle me-1" />
            {t('fields.unverified')}
          </span>
        )}
      </td>
      <td className="text-muted small">
        {user.last_login_at ? formatDateTime(user.last_login_at, currentLang) : '—'}
      </td>
      <td className="text-muted small">{formatDateTime(user.created_at, currentLang)}</td>
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
                  {tCommon(`status.${s}`)}
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
              <option value="-created_at">{t('sort.newestFirst')}</option>
              <option value="created_at">{t('sort.oldestFirst')}</option>
              <option value="first_name">{t('sort.nameAZ')}</option>
              <option value="-first_name">{t('sort.nameZA')}</option>
              <option value="-last_login_at">{t('sort.lastLogin')}</option>
            </Form.Select>
          </Col>

          {/* Results count */}
          <Col xs={12} md={2} className="text-end">
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
        ) : users.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <i className="bi bi-people fs-1 d-block mb-3" />
            <p>{tCommon('table.noResults')}</p>
          </div>
        ) : (
          <>
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <SortableHeader
                    label={t('fields.name')}
                    field="first_name"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                  <th>{t('fields.roles')}</th>
                  <th>{t('fields.status')}</th>
                  <th>{t('fields.verification')}</th>
                  <SortableHeader
                    label={t('fields.lastLogin')}
                    field="last_login_at"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                  <SortableHeader
                    label={t('fields.createdAt')}
                    field="created_at"
                    currentSort={sort}
                    onSort={(v) => updateParams({ sort: v })}
                  />
                </tr>
              </thead>
              <tbody>{users.map(renderRow)}</tbody>
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
