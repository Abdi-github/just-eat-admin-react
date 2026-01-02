import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { StampCardForm } from '../components/StampCardForm';
import { useCreateStampCardMutation } from '../promotions.api';
import type { CreateStampCardDto } from '../promotions.types';

export function StampCardCreatePage() {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();
  const [createStampCard, { isLoading }] = useCreateStampCardMutation();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createStampCard(data as unknown as CreateStampCardDto).unwrap();
      toast.success(t('promotions:stamps.createSuccess'));
      navigate('/promotions/stamp-cards');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  return (
    <>
      <h1 className="h3 mb-4">{t('promotions:stamps.createTitle')}</h1>
      <StampCardForm onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
