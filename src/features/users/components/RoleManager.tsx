import { useState } from 'react';
import { Card, Button, Form, Badge, ListGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAssignRoleMutation, useRemoveRoleMutation } from '../users.api';
import { ALL_ROLES } from '../users.types';
import type { User } from '../users.types';

interface RoleManagerProps {
  user: User;
}

export function RoleManager({ user }: RoleManagerProps) {
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();

  const [assignRole, { isLoading: isAssigning }] = useAssignRoleMutation();
  const [removeRole, { isLoading: isRemoving }] = useRemoveRoleMutation();

  const [selectedRole, setSelectedRole] = useState('');

  // Roles already assigned (by code)
  const assignedCodes = user.roles.map((r) => r.code);
  const availableRoles = ALL_ROLES.filter((r) => !assignedCodes.includes(r));

  const handleAssign = async () => {
    if (!selectedRole) return;
    try {
      await assignRole({ id: user.id, body: { role: selectedRole } }).unwrap();
      toast.success(t('messages.roleAssigned'));
      setSelectedRole('');
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleRemove = async (roleCode: string) => {
    try {
      await removeRole({ id: user.id, role: roleCode }).unwrap();
      toast.success(t('messages.roleRemoved'));
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h6 className="mb-0">{t('detail.manageRoles')}</h6>
      </Card.Header>
      <Card.Body>
        {/* Current roles with remove buttons */}
        {user.roles.length > 0 && (
          <ListGroup variant="flush" className="mb-3">
            {user.roles.map((role) => (
              <ListGroup.Item
                key={role.id}
                className="d-flex justify-content-between align-items-center px-0"
              >
                <Badge bg="primary" className="py-2 px-3">
                  {role.name}
                </Badge>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleRemove(role.code)}
                  disabled={isRemoving}
                  title={t('actions.removeRole')}
                >
                  <i className="bi bi-x-lg" />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        {/* Assign new role */}
        {availableRoles.length > 0 && (
          <div className="d-flex gap-2">
            <Form.Select
              size="sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">{t('form.selectRole')}</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {tCommon(`roles.${role}`, { defaultValue: role.replace(/_/g, ' ') })}
                </option>
              ))}
            </Form.Select>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAssign}
              disabled={!selectedRole || isAssigning}
            >
              {isAssigning ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <i className="bi bi-plus-lg" />
              )}
            </Button>
          </div>
        )}

        {availableRoles.length === 0 && user.roles.length > 0 && (
          <small className="text-muted">{t('messages.allRolesAssigned')}</small>
        )}
      </Card.Body>
    </Card>
  );
}
