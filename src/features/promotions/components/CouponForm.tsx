import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Coupon } from '../promotions.types';

// ── Schema ─────────────────────────────────────────────────────────

const couponSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Code must be at least 3 characters')
      .max(30, 'Code must be at most 30 characters')
      .regex(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, hyphens and underscores'),
    description: z.string().max(500).optional().or(z.literal('')),
    discount_type: z.enum(['PERCENTAGE', 'FLAT']),
    discount_value: z.coerce.number().positive('Must be greater than 0'),
    minimum_order: z.coerce.number().min(0).optional(),
    maximum_discount: z.coerce.number().positive().optional().or(z.literal('')),
    scope: z.enum(['PLATFORM', 'RESTAURANT']),
    restaurant_id: z.string().optional().or(z.literal('')),
    valid_from: z.string().optional().or(z.literal('')),
    valid_until: z.string().optional().or(z.literal('')),
    usage_limit: z.coerce.number().int().min(1).optional().or(z.literal('')),
    per_user_limit: z.coerce.number().int().min(1).optional(),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.discount_type === 'PERCENTAGE' && data.discount_value > 100) {
        return false;
      }
      return true;
    },
    { message: 'Percentage discount cannot exceed 100%', path: ['discount_value'] }
  )
  .refine(
    (data) => {
      if (data.scope === 'RESTAURANT' && !data.restaurant_id) {
        return false;
      }
      return true;
    },
    { message: 'Restaurant ID is required for restaurant-scoped coupons', path: ['restaurant_id'] }
  );

type CouponFormData = z.infer<typeof couponSchema>;

// ── Props ──────────────────────────────────────────────────────────

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

// ── Component ──────────────────────────────────────────────────────

export function CouponForm({ coupon, onSubmit, isLoading }: CouponFormProps) {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();
  const isEdit = !!coupon;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || '',
      description: coupon?.description || '',
      discount_type: coupon?.discount_type || 'PERCENTAGE',
      discount_value: coupon?.discount_value || 0,
      minimum_order: coupon?.minimum_order || 0,
      maximum_discount: coupon?.maximum_discount ?? '',
      scope: coupon?.scope || 'PLATFORM',
      restaurant_id: coupon?.restaurant_id || '',
      valid_from: coupon?.valid_from ? coupon.valid_from.slice(0, 16) : '',
      valid_until: coupon?.valid_until ? coupon.valid_until.slice(0, 16) : '',
      usage_limit: coupon?.usage_limit ?? '',
      per_user_limit: coupon?.per_user_limit || 1,
      is_active: coupon?.is_active ?? true,
    },
  });

  const discountType = watch('discount_type');
  const scope = watch('scope');

  const handleFormSubmit = (data: CouponFormData) => {
    // Clean up empty/undefined values for the API
    const cleaned: Record<string, unknown> = {
      discount_type: data.discount_type,
      discount_value: data.discount_value,
      is_active: data.is_active,
    };

    if (!isEdit) {
      cleaned.code = data.code.toUpperCase();
      cleaned.scope = data.scope;
      if (data.scope === 'RESTAURANT' && data.restaurant_id) {
        cleaned.restaurant_id = data.restaurant_id;
      }
    }

    if (data.description) cleaned.description = data.description;
    if (data.minimum_order != null && data.minimum_order > 0) {
      cleaned.minimum_order = data.minimum_order;
    } else if (isEdit) {
      cleaned.minimum_order = null;
    }
    if (data.maximum_discount && typeof data.maximum_discount === 'number') {
      cleaned.maximum_discount = data.maximum_discount;
    } else if (isEdit) {
      cleaned.maximum_discount = null; // clear on edit
    }
    if (data.valid_from) cleaned.valid_from = new Date(data.valid_from).toISOString();
    else if (isEdit) cleaned.valid_from = null;
    if (data.valid_until) cleaned.valid_until = new Date(data.valid_until).toISOString();
    else if (isEdit) cleaned.valid_until = null;
    if (data.usage_limit && typeof data.usage_limit === 'number') {
      cleaned.usage_limit = data.usage_limit;
    } else if (isEdit) {
      cleaned.usage_limit = null;
    }
    if (data.per_user_limit) cleaned.per_user_limit = data.per_user_limit;

    onSubmit(cleaned);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:coupons.basicInfo')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Code — only on create */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.code')}</Form.Label>
                <Form.Control
                  {...register('code')}
                  placeholder="SUMMER2024"
                  disabled={isEdit}
                  isInvalid={!!errors.code}
                  className="text-uppercase"
                />
                {errors.code && (
                  <Form.Control.Feedback type="invalid">
                    {errors.code.message}
                  </Form.Control.Feedback>
                )}
                {isEdit && (
                  <Form.Text className="text-muted">
                    {t('promotions:coupons.codeNotEditable')}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>

            {/* Description */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.description')}</Form.Label>
                <Form.Control
                  {...register('description')}
                  placeholder={t('promotions:coupons.descriptionPlaceholder')}
                  isInvalid={!!errors.description}
                />
                {errors.description && (
                  <Form.Control.Feedback type="invalid">
                    {errors.description.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Discount Type */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.discountType')}</Form.Label>
                <Form.Select {...register('discount_type')} isInvalid={!!errors.discount_type}>
                  <option value="PERCENTAGE">{t('promotions:coupons.percentage')}</option>
                  <option value="FLAT">{t('promotions:coupons.flat')}</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Discount Value */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.discountValue')}</Form.Label>
                <Form.Control
                  type="number"
                  step={discountType === 'PERCENTAGE' ? '1' : '0.5'}
                  min="0"
                  max={discountType === 'PERCENTAGE' ? '100' : undefined}
                  {...register('discount_value')}
                  isInvalid={!!errors.discount_value}
                />
                {errors.discount_value && (
                  <Form.Control.Feedback type="invalid">
                    {errors.discount_value.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            {/* Maximum Discount (for percentage) */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.maxDiscount')}</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('maximum_discount')}
                  placeholder={t('promotions:coupons.unlimited')}
                  disabled={discountType !== 'PERCENTAGE'}
                  isInvalid={!!errors.maximum_discount}
                />
                <Form.Text className="text-muted">
                  {t('promotions:coupons.maxDiscountHint')}
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Minimum Order */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.minOrder')}</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  min="0"
                  {...register('minimum_order')}
                  isInvalid={!!errors.minimum_order}
                />
              </Form.Group>
            </Col>

            {/* Active */}
            <Col md={6} className="d-flex align-items-center mt-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Form.Check
                    type="switch"
                    id="coupon-active"
                    label={t('promotions:coupons.active')}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Scope & Restaurant */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:coupons.scopeSection')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.scope')}</Form.Label>
                <Form.Select {...register('scope')} disabled={isEdit} isInvalid={!!errors.scope}>
                  <option value="PLATFORM">{t('promotions:coupons.scopePlatform')}</option>
                  <option value="RESTAURANT">{t('promotions:coupons.scopeRestaurant')}</option>
                </Form.Select>
                {isEdit && (
                  <Form.Text className="text-muted">
                    {t('promotions:coupons.scopeNotEditable')}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
            {scope === 'RESTAURANT' && !isEdit && (
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('promotions:coupons.restaurantId')}</Form.Label>
                  <Form.Control
                    {...register('restaurant_id')}
                    placeholder={t('promotions:coupons.restaurantIdPlaceholder')}
                    isInvalid={!!errors.restaurant_id}
                  />
                  {errors.restaurant_id && (
                    <Form.Control.Feedback type="invalid">
                      {errors.restaurant_id.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>

      {/* Validity & Usage */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:coupons.validitySection')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.validFrom')}</Form.Label>
                <Form.Control type="datetime-local" {...register('valid_from')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.validUntil')}</Form.Label>
                <Form.Control type="datetime-local" {...register('valid_until')} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.usageLimit')}</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  step="1"
                  {...register('usage_limit')}
                  placeholder={t('promotions:coupons.unlimited')}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:coupons.perUserLimit')}</Form.Label>
                <Form.Control type="number" min="1" step="1" {...register('per_user_limit')} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Submit */}
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" type="button" onClick={() => navigate('/promotions/coupons')}>
          {t('common:actions.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? t('common:actions.saving') : t('common:actions.save')}
        </Button>
      </div>
    </Form>
  );
}
