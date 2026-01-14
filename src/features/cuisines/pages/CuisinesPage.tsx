import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useCreateCuisineMutation, useUpdateCuisineMutation } from '../cuisines.api';
import { CuisineList } from '../components/CuisineList';
import { CuisineForm } from '../components/CuisineForm';
import type { Cuisine, CreateCuisineDto, UpdateCuisineDto } from '../cuisines.types';

export function CuisinesPage() {
  const { t } = useTranslation('cuisines');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('cuisines:create');

  const [createCuisine, { isLoading: isCreating }] = useCreateCuisineMutation();
  const [updateCuisine, { isLoading: isUpdating }] = useUpdateCuisineMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingCuisine, setEditingCuisine] = useState<Cuisine | undefined>(undefined);

  const handleCreate = async (data: CreateCuisineDto) => {
    try {
      await createCuisine(data).unwrap();
      toast.success(t('messages.created'));
      setShowForm(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleUpdate = async (data: UpdateCuisineDto) => {
    if (!editingCuisine) return;
    try {
      await updateCuisine({ id: editingCuisine.id, body: data }).unwrap();
      toast.success(t('messages.updated'));
      setShowForm(false);
      setEditingCuisine(undefined);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleEdit = (cuisine: Cuisine) => {
    setEditingCuisine(cuisine);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCuisine(undefined);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-egg-fried me-2" />
          {t('title')}
        </h4>
        {canCreate && !showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-1" />
            {t('actions.create')}
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4">
          <CuisineForm
            cuisine={editingCuisine}
            onSubmit={editingCuisine ? handleUpdate : handleCreate}
            isLoading={editingCuisine ? isUpdating : isCreating}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* List */}
      <CuisineList onEdit={handleEdit} />
    </div>
  );
}
