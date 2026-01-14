import { useMemo } from 'react';
import { Row, Col, Form, Card, Table, Badge, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Pagination } from '@/shared/components/Pagination';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { formatDateTime } from '@/shared/utils/formatters';
import { useAppSelector } from '@/app/hooks';
import { useGetApplicationsQuery } from '../applications.api';
import type {
  ApplicationStatus,
  ApplicationType,
  ApplicationQueryParams,
  Application,
} from '../applications.types';
import { APPLICATION_STATUS_VARIANTS, APPLICATION_TYPE_VARIANTS } from '../applications.types';
import { ApplicationActions } from './ApplicationActions';

const STATUS_OPTIONS: ApplicationStatus[] = ['pending_approval', 'approved', 'rejected'];
const TYPE_OPTIONS: ApplicationType[] = ['restaurant_owner', 'courier'];

export function ApplicationList() {
  const { t } = useTranslation('applications');
  const { t: tCommon } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentLang = useAppSelector((state) => state.language.current);

  // Extract filters from URL params
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;
  const status = (searchParams.get('status') as ApplicationStatus) || undefined;
  const type = (searchParams.get('type') as ApplicationType) || undefined;

  const queryParams = useMemo<ApplicationQueryParams>(
    () => ({
      page,
      limit,
      ...(status && { status }),
      ...(type && { type }),
    }),
    [page, limit, status, type]
  );

  const { data, isLoading, isError } = useGetApplicationsQuery(queryParams);

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

  const handlePageChange = (newPage: number) => {
    updateParams({ page: String(newPage) });
  };

  const applications = data?.data?.applications || [];
  const pagination = data?.data?.pagination;

  const renderRow = (application: Application) => (
    <tr key={application.id}>
      <td>
        <div>
          <div className="fw-semibold">
            {application.first_name} {application.last_name}
          </div>
          <small className="text-muted">{application.email}</small>
        </div>
      </td>
      <td>
        {application.phone || <span className="text-muted">—</span>}
      </td>
      <td>
        <Badge bg={APPLICATION_TYPE_VARIANTS[application.application_type]}>
          {t(`types.${application.application_type}`)}
        </Badge>
      </td>
      <td>
        {application.application_type === 'courier' && application.vehicle_type && (
          <span className="small">{t(`vehicles.${application.vehicle_type}`)}</span>
        )}
        {application.application_type === 'restaurant_owner' && application.restaurant && (
          <div className="small">
            <div className="fw-semibold">{application.restaurant.name}</div>
            <span className="text-muted">{application.restaurant.address}</span>
          </div>
        )}
        {!application.vehicle_type && !application.restaurant && (
          <span className="text-muted">—</span>
        )}
      </td>
      <td>
        <Badge bg={APPLICATION_STATUS_VARIANTS[application.application_status]}>
          {tCommon(`status.${application.application_status}`)}
        </Badge>
      </td>
      <td className="text-muted small">
        {formatDateTime(application.created_at, currentLang)}
      </td>
      <td>
        <ApplicationActions application={application} />
      </td>
    </tr>
  );

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom py-3">
        <Row className="g-2 align-items-center">
          {/* Status Filter */}
          <Col xs={12} md={4}>
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

          {/* Type Filter */}
          <Col xs={12} md={4}>
            <Form.Select
              size="sm"
              value={type || ''}
              onChange={(e) => updateParams({ type: e.target.value || undefined })}
            >
              <option value="">{t('filters.allTypes')}</option>
              {TYPE_OPTIONS.map((tp) => (
                <option key={tp} value={tp}>
                  {t(`types.${tp}`)}
                </option>
              ))}
            </Form.Select>
          </Col>

          {/* Reset */}
          <Col xs={12} md={4} className="text-md-end">
            {(status || type) && (
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                }}
              >
                <i className="bi bi-x-circle me-1" />
                {tCommon('actions.reset')}
              </Button>
            )}
          </Col>
        </Row>
      </Card.Header>

      <Card.Body className="p-0">
        {isLoading && (
          <div className="text-center py-5">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="alert alert-danger m-3">{tCommon('messages.error')}</div>
        )}

        {!isLoading && !isError && applications.length === 0 && (
          <div className="text-center text-muted py-5">
            <i className="bi bi-inbox fs-1 d-block mb-2" />
            {t('noApplications')}
          </div>
        )}

        {!isLoading && !isError && applications.length > 0 && (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>{t('columns.applicant')}</th>
                  <th>{t('columns.phone')}</th>
                  <th>{t('columns.type')}</th>
                  <th>{t('columns.details')}</th>
                  <th>{t('columns.status')}</th>
                  <th>{t('columns.appliedAt')}</th>
                  <th>{tCommon('table.actions')}</th>
                </tr>
              </thead>
              <tbody>{applications.map(renderRow)}</tbody>
            </Table>
          </div>
        )}
      </Card.Body>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <Card.Footer className="bg-white border-top">
          <Pagination
            pagination={{
              page: pagination.page,
              limit: pagination.limit,
              total: pagination.total,
              totalPages: pagination.total_pages,
              hasNextPage: pagination.page < pagination.total_pages,
              hasPrevPage: pagination.page > 1,
            }}
            onPageChange={handlePageChange}
          />
        </Card.Footer>
      )}
    </Card>
  );
}
