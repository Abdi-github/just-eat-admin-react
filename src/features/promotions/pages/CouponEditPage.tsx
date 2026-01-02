import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CouponForm } from '../components/CouponForm';
import { useGetCouponQuery, useUpdateCouponMutation } from '../promotions.api';
import type { UpdateCouponDto } from '../promotions.types';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Alert } from 'react-bootstrap';

export function CouponEditPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const { data, isLoading: isLoadingCoupon, error } = useGetCouponQuery(id!);
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      await updateCoupon({ id: id!, body: formData as UpdateCouponDto }).unwrap();
      toast.success(t('promotions:coupons.updateSuccess'));
      navigate('/promotions/coupons');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  if (isLoadingCoupon) return <LoadingSpinner />;
  if (error || !data?.data) {
    return <Alert variant="danger">{t('promotions:coupons.notFound')}</Alert>;
  }

  return (
    <>
      <h1 className="h3 mb-4">{t('promotions:coupons.editTitle')}</h1>
      <CouponForm coupon={data.data} onSubmit={handleSubmit} isLoading={isUpdating} />
    </>
  );
}
