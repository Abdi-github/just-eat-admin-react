import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Alert } from 'react-bootstrap';
import { StampCardForm } from '../components/StampCardForm';
import { useGetStampCardQuery, useUpdateStampCardMutation } from '../promotions.api';
import type { UpdateStampCardDto } from '../promotions.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

export function StampCardEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const { data, isLoading: isLoadingCard, error } = useGetStampCardQuery(id!);
  const [updateStampCard, { isLoading: isUpdating }] = useUpdateStampCardMutation();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      await updateStampCard({ id: id!, body: formData as UpdateStampCardDto }).unwrap();
      toast.success(t('promotions:stamps.updateSuccess'));
      navigate('/promotions/stamp-cards');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  if (isLoadingCard) return <LoadingSpinner />;
  if (error || !data?.data) {
    return <Alert variant="danger">{t('promotions:stamps.notFound')}</Alert>;
  }

  return (
    <>
      <h1 className="h3 mb-4">{t('promotions:stamps.editTitle')}</h1>
      <StampCardForm stampCard={data.data} onSubmit={handleSubmit} isLoading={isUpdating} />
    </>
  );
}
