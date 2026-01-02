import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useGetUserQuery, useUpdateUserMutation, useDeleteUserMutation } from '../users.api';
import { UserDetails } from '../components/UserDetails';
import { UserForm } from '../components/UserForm';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();
  const navigate = useNavigate();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('users:update');
  const canDelete = hasPermission('users:delete');

  const { data, isLoading, isError } = useGetUserQuery(id!, { skip: !id });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const user = data?.data;

  const handleUpdate = async (formData: Record<string, unknown>) => {
    try {
      await updateUser({
        id: id!,
        body: formData as Parameters<typeof updateUser>[0]['body'],
      }).unwrap();
      toast.success(t('messages.updated'));
      setIsEditing(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(id!).unwrap();
      toast.success(t('messages.deleted'));
      navigate('/users');
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-3">
          <Button variant="outline-secondary" size="sm" onClick={() => navigate('/users')}>
            <i className="bi bi-arrow-left me-1" />
            {tCommon('actions.back')}
          </Button>
          <h4 className="mb-0 fw-bold">
            {isLoading ? t('detail.loading') : user?.full_name || t('detail.title')}
          </h4>
        </div>

        {user && !isEditing && (
          <div className="d-flex gap-2">
            {canEdit && (
              <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil me-1" />
                {tCommon('actions.edit')}
              </Button>
            )}
            {canDelete && (
              <Button variant="outline-danger" size="sm" onClick={() => setShowDelete(true)}>
                <i className="bi bi-trash me-1" />
                {tCommon('actions.delete')}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : isError || !user ? (
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2" />
          {tCommon('errors.notFound')}
        </Alert>
      ) : isEditing ? (
        <UserForm
          user={user}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <UserDetails user={user} />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        show={showDelete}
        title={tCommon('actions.delete')}
        message={t('messages.confirmDelete', { name: user?.full_name })}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
