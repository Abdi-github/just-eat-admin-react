import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CouponForm } from '../components/CouponForm';
import { useCreateCouponMutation } from '../promotions.api';
import type { CreateCouponDto } from '../promotions.types';

export function CouponCreatePage() {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const handleSubmit = async (data: Record<string, unknown>) => {
    try {
      await createCoupon(data as unknown as CreateCouponDto).unwrap();
      toast.success(t('promotions:coupons.createSuccess'));
      navigate('/promotions/coupons');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  return (
    <>
      <h1 className="h3 mb-4">{t('promotions:coupons.createTitle')}</h1>
      <CouponForm onSubmit={handleSubmit} isLoading={isLoading} />
    </>
  );
}
