import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useCreateCantonMutation, useUpdateCantonMutation } from '../locations.api';
import { CantonList } from '../components/CantonList';
import { CantonForm } from '../components/CantonForm';
import type { Canton, CreateCantonDto, UpdateCantonDto } from '../locations.types';

export function CantonsPage() {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('locations:create');

  const [createCanton, { isLoading: isCreating }] = useCreateCantonMutation();
  const [updateCanton, { isLoading: isUpdating }] = useUpdateCantonMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingCanton, setEditingCanton] = useState<Canton | undefined>(undefined);

  const handleCreate = async (data: CreateCantonDto) => {
    try {
      await createCanton(data).unwrap();
      toast.success(t('cantons.messages.created'));
      setShowForm(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleUpdate = async (data: UpdateCantonDto) => {
    if (!editingCanton) return;
    try {
      await updateCanton({ id: editingCanton.id, body: data }).unwrap();
      toast.success(t('cantons.messages.updated'));
      setShowForm(false);
      setEditingCanton(undefined);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleEdit = (canton: Canton) => {
    setEditingCanton(canton);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCanton(undefined);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-geo-alt me-2" />
          {t('cantons.title')}
        </h4>
        {canCreate && !showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-1" />
            {t('cantons.actions.create')}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <CantonForm
            canton={editingCanton}
            onSubmit={editingCanton ? handleUpdate : handleCreate}
            isLoading={editingCanton ? isUpdating : isCreating}
            onCancel={handleCancel}
          />
        </div>
      )}

      <CantonList onEdit={handleEdit} />
    </div>
  );
}
