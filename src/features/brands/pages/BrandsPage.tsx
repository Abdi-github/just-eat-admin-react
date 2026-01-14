import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useCreateBrandMutation, useUpdateBrandMutation } from '../brands.api';
import { BrandList } from '../components/BrandList';
import { BrandForm } from '../components/BrandForm';
import { LogoUpload } from '../components/LogoUpload';
import type { Brand, CreateBrandDto, UpdateBrandDto } from '../brands.types';

export function BrandsPage() {
  const { t } = useTranslation('brands');
  const { t: tCommon } = useTranslation();
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('brands:create');

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();
  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(undefined);

  const handleCreate = async (data: CreateBrandDto) => {
    try {
      await createBrand(data).unwrap();
      toast.success(t('messages.created'));
      setShowForm(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleUpdate = async (data: UpdateBrandDto) => {
    if (!editingBrand) return;
    try {
      await updateBrand({ id: editingBrand.id, body: data }).unwrap();
      toast.success(t('messages.updated'));
      setShowForm(false);
      setEditingBrand(undefined);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBrand(undefined);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">
          <i className="bi bi-building me-2" />
          {t('title')}
        </h4>
        {canCreate && !showForm && (
          <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-1" />
            {t('actions.create')}
          </Button>
        )}
      </div>

      {/* Form + Logo Upload */}
      {showForm && (
        <Row className="mb-4">
          <Col md={editingBrand ? 8 : 12}>
            <BrandForm
              brand={editingBrand}
              onSubmit={editingBrand ? handleUpdate : handleCreate}
              isLoading={editingBrand ? isUpdating : isCreating}
              onCancel={handleCancel}
            />
          </Col>
          {editingBrand && (
            <Col md={4}>
              <LogoUpload brand={editingBrand} />
            </Col>
          )}
        </Row>
      )}

      {/* List */}
      <BrandList onEdit={handleEdit} />
    </div>
  );
}
