import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useCreateCityMutation, useUpdateCityMutation } from '../locations.api';
import { CityList } from '../components/CityList';
import { CityForm } from '../components/CityForm';
import type { City, CreateCityDto, UpdateCityDto } from '../locations.types';

export function CitiesPage() {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('locations:create');

  const [createCity, { isLoading: isCreating }] = useCreateCityMutation();
  const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | undefined>(undefined);

  const handleCreate = async (data: CreateCityDto) => {
    try {
      await createCity(data).unwrap();
      toast.success(t('cities.messages.created'));
      setShowForm(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleUpdate = async (data: UpdateCityDto) => {
    if (!editingCity) return;
    try {
      await updateCity({ id: editingCity.id, body: data }).unwrap();
      toast.success(t('cities.messages.updated'));
      setShowForm(false);
      setEditingCity(undefined);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCity(undefined);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-building me-2" />
          {t('cities.title')}
        </h4>
        {canCreate && !showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-1" />
            {t('cities.actions.create')}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-4">
          <CityForm
            city={editingCity}
            onSubmit={editingCity ? handleUpdate : handleCreate}
            isLoading={editingCity ? isUpdating : isCreating}
            onCancel={handleCancel}
          />
        </div>
      )}

      <CityList onEdit={handleEdit} />
    </div>
  );
}
