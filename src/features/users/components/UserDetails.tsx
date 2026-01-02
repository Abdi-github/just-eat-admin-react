import { Row, Col, Card, Badge, ListGroup, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { formatDateTime } from '@/shared/utils/formatters';
import { USER_STATUS_VARIANTS } from '../users.types';
import { useActivateUserMutation, useSuspendUserMutation } from '../users.api';
import { RoleManager } from './RoleManager';
import type { User } from '../users.types';

interface UserDetailsProps {
  user: User;
}

export function UserDetails({ user }: UserDetailsProps) {
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();
  const currentLang = useAppSelector((state) => state.language.current);
  const { hasPermission } = usePermissions();
  const canManage = hasPermission('users:update');
  const canManageRoles = hasPermission('users:manage');

  const [activateUser, { isLoading: isActivating }] = useActivateUserMutation();
  const [suspendUser, { isLoading: isSuspending }] = useSuspendUserMutation();

  const [showActivate, setShowActivate] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);

  const handleActivate = async () => {
    try {
      await activateUser(user.id).unwrap();
      toast.success(t('messages.activated'));
      setShowActivate(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleSuspend = async () => {
    try {
      await suspendUser(user.id).unwrap();
      toast.success(t('messages.suspended'));
      setShowSuspend(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  return (
    <>
      <Row className="g-4">
        {/* User Info Card */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-0">{t('detail.userInfo')}</h5>
                <Badge bg={USER_STATUS_VARIANTS[user.status] || 'secondary'} className="fs-6">
                  {tCommon(`status.${user.status}`)}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.firstName')}</span>
                      <strong>{user.first_name}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.lastName')}</span>
                      <strong>{user.last_name}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.email')}</span>
                      <strong>{user.email}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.phone')}</span>
                      <strong>{user.phone || '—'}</strong>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={6}>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.language')}</span>
                      <strong>{user.preferred_language?.toUpperCase() || '—'}</strong>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.verification')}</span>
                      {user.is_verified ? (
                        <Badge bg="success">{t('fields.verified')}</Badge>
                      ) : (
                        <Badge bg="secondary">{t('fields.unverified')}</Badge>
                      )}
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.lastLogin')}</span>
                      <span>
                        {user.last_login_at ? formatDateTime(user.last_login_at, currentLang) : '—'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0">
                      <span className="text-muted">{t('fields.createdAt')}</span>
                      <span>{formatDateTime(user.created_at, currentLang)}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
            </Card.Body>

            {/* Status Actions */}
            {canManage && (
              <Card.Footer className="bg-white d-flex gap-2">
                {user.status !== 'active' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => setShowActivate(true)}
                    disabled={isActivating}
                  >
                    <i className="bi bi-check-circle me-1" />
                    {t('actions.activate')}
                  </Button>
                )}
                {user.status !== 'suspended' && (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => setShowSuspend(true)}
                    disabled={isSuspending}
                  >
                    <i className="bi bi-pause-circle me-1" />
                    {t('actions.suspend')}
                  </Button>
                )}
              </Card.Footer>
            )}
          </Card>
        </Col>

        {/* Roles & Permissions Sidebar */}
        <Col lg={4}>
          {/* Roles Card */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0">{t('detail.roles')}</h6>
            </Card.Header>
            <Card.Body>
              {user.roles.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <Badge key={role.id} bg="primary" className="py-2 px-3">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">{t('detail.noRoles')}</p>
              )}
            </Card.Body>
          </Card>

          {/* Role Manager */}
          {canManageRoles && <RoleManager user={user} />}

          {/* Permissions Card */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Header className="bg-white border-bottom">
              <h6 className="mb-0">{t('detail.permissions')}</h6>
            </Card.Header>
            <Card.Body>
              {user.permissions.length > 0 ? (
                <div className="d-flex flex-wrap gap-1">
                  {user.permissions.map((perm) => (
                    <Badge key={perm} bg="light" text="dark" className="border fw-normal">
                      {perm}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted mb-0">{t('detail.noPermissions')}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        show={showActivate}
        title={t('actions.activate')}
        message={t('messages.confirmActivate', { name: user.full_name })}
        variant="primary"
        isLoading={isActivating}
        onConfirm={handleActivate}
        onCancel={() => setShowActivate(false)}
      />
      <ConfirmDialog
        show={showSuspend}
        title={t('actions.suspend')}
        message={t('messages.confirmSuspend', { name: user.full_name })}
        variant="warning"
        isLoading={isSuspending}
        onConfirm={handleSuspend}
        onCancel={() => setShowSuspend(false)}
      />
    </>
  );
}
