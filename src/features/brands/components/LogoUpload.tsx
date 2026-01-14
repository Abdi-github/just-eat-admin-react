import { useRef, useState } from 'react';
import { Button, Card, Image } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useUploadBrandLogoMutation, useDeleteBrandLogoMutation } from '../brands.api';
import type { Brand } from '../brands.types';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';

interface LogoUploadProps {
  brand: Brand;
}

export function LogoUpload({ brand }: LogoUploadProps) {
  const { t } = useTranslation('brands');
  const { t: tCommon } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [uploadLogo, { isLoading: isUploading }] = useUploadBrandLogoMutation();
  const [deleteLogo, { isLoading: isDeletingLogo }] = useDeleteBrandLogoMutation();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      toast.error(t('logo.invalidType'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('logo.tooLarge'));
      return;
    }

    try {
      await uploadLogo({ id: brand.id, file }).unwrap();
      toast.success(t('logo.uploadSuccess'));
    } catch {
      toast.error(tCommon('messages.error'));
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteLogo = async () => {
    try {
      await deleteLogo(brand.id).unwrap();
      toast.success(t('logo.deleteSuccess'));
      setShowDeleteConfirm(false);
    } catch {
      toast.error(tCommon('messages.error'));
    }
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <h6 className="mb-0">{t('logo.title')}</h6>
        </Card.Header>
        <Card.Body className="text-center">
          {brand.logo_url ? (
            <div className="mb-3">
              <Image
                src={brand.logo_url}
                alt={brand.name}
                rounded
                className="border"
                style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div
              className="bg-light rounded d-flex align-items-center justify-content-center mx-auto mb-3"
              style={{ width: 120, height: 120 }}
            >
              <i className="bi bi-image text-muted" style={{ fontSize: '2rem' }} />
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="d-none"
            onChange={handleFileSelect}
          />

          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" />
                  {t('logo.uploading')}
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-1" />
                  {brand.logo_url ? t('logo.change') : t('logo.upload')}
                </>
              )}
            </Button>
            {brand.logo_url && (
              <Button
                variant="outline-danger"
                size="sm"
                disabled={isDeletingLogo}
                onClick={() => setShowDeleteConfirm(true)}
              >
                <i className="bi bi-trash me-1" />
                {t('logo.remove')}
              </Button>
            )}
          </div>
          <div className="mt-2">
            <small className="text-muted">{t('logo.hint')}</small>
          </div>
        </Card.Body>
      </Card>

      <ConfirmDialog
        show={showDeleteConfirm}
        title={t('logo.removeTitle')}
        message={t('logo.removeConfirm')}
        variant="danger"
        isLoading={isDeletingLogo}
        onConfirm={handleDeleteLogo}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
