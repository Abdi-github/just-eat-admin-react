import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { StampCard } from '../promotions.types';

// ── Schema ─────────────────────────────────────────────────────────

const stampCardSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().max(500).optional().or(z.literal('')),
    restaurant_id: z.string().min(1, 'Restaurant ID is required'),
    stamps_required: z.coerce
      .number()
      .int()
      .min(2, 'Minimum 2 stamps')
      .max(50, 'Maximum 50 stamps'),
    reward_description: z.string().min(1, 'Reward description is required').max(200),
    reward_type: z.enum(['PERCENTAGE', 'FLAT']),
    reward_value: z.coerce.number().positive('Must be greater than 0'),
    valid_from: z.string().optional().or(z.literal('')),
    valid_until: z.string().optional().or(z.literal('')),
    is_active: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.reward_type === 'PERCENTAGE' && data.reward_value > 100) {
        return false;
      }
      return true;
    },
    { message: 'Percentage reward cannot exceed 100%', path: ['reward_value'] }
  );

type StampCardFormData = z.infer<typeof stampCardSchema>;

// ── Props ──────────────────────────────────────────────────────────

interface StampCardFormProps {
  stampCard?: StampCard;
  onSubmit: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

// ── Component ──────────────────────────────────────────────────────

export function StampCardForm({ stampCard, onSubmit, isLoading }: StampCardFormProps) {
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();
  const isEdit = !!stampCard;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<StampCardFormData>({
    resolver: zodResolver(stampCardSchema),
    defaultValues: {
      name: stampCard?.name || '',
      description: stampCard?.description || '',
      restaurant_id: stampCard?.restaurant_id || '',
      stamps_required: stampCard?.stamps_required || 10,
      reward_description: stampCard?.reward_description || '',
      reward_type: stampCard?.reward_type || 'PERCENTAGE',
      reward_value: stampCard?.reward_value || 0,
      valid_from: stampCard?.valid_from ? stampCard.valid_from.slice(0, 16) : '',
      valid_until: stampCard?.valid_until ? stampCard.valid_until.slice(0, 16) : '',
      is_active: stampCard?.is_active ?? true,
    },
  });

  const rewardType = watch('reward_type');

  const handleFormSubmit = (data: StampCardFormData) => {
    const cleaned: Record<string, unknown> = {
      name: data.name,
      stamps_required: data.stamps_required,
      reward_description: data.reward_description,
      reward_type: data.reward_type,
      reward_value: data.reward_value,
      is_active: data.is_active,
    };

    if (!isEdit) {
      cleaned.restaurant_id = data.restaurant_id;
    }

    if (data.description) cleaned.description = data.description;
    if (data.valid_from) cleaned.valid_from = new Date(data.valid_from).toISOString();
    else if (isEdit) cleaned.valid_from = null;
    if (data.valid_until) cleaned.valid_until = new Date(data.valid_until).toISOString();
    else if (isEdit) cleaned.valid_until = null;

    onSubmit(cleaned);
  };

  return (
    <Form onSubmit={handleSubmit(handleFormSubmit)}>
      {/* Basic Info */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:stamps.basicInfo')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.name')}</Form.Label>
                <Form.Control
                  {...register('name')}
                  placeholder={t('promotions:stamps.namePlaceholder')}
                  isInvalid={!!errors.name}
                />
                {errors.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.restaurantId')}</Form.Label>
                <Form.Control
                  {...register('restaurant_id')}
                  placeholder={t('promotions:stamps.restaurantIdPlaceholder')}
                  disabled={isEdit}
                  isInvalid={!!errors.restaurant_id}
                />
                {errors.restaurant_id && (
                  <Form.Control.Feedback type="invalid">
                    {errors.restaurant_id.message}
                  </Form.Control.Feedback>
                )}
                {isEdit && (
                  <Form.Text className="text-muted">
                    {t('promotions:stamps.restaurantNotEditable')}
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.description')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  {...register('description')}
                  placeholder={t('promotions:stamps.descriptionPlaceholder')}
                  isInvalid={!!errors.description}
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-center mt-2">
              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <Form.Check
                    type="switch"
                    id="stamp-active"
                    label={t('promotions:stamps.active')}
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Reward Configuration */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:stamps.rewardSection')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.stampsRequired')}</Form.Label>
                <Form.Control
                  type="number"
                  min="2"
                  max="50"
                  step="1"
                  {...register('stamps_required')}
                  isInvalid={!!errors.stamps_required}
                />
                {errors.stamps_required && (
                  <Form.Control.Feedback type="invalid">
                    {errors.stamps_required.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.rewardType')}</Form.Label>
                <Form.Select {...register('reward_type')}>
                  <option value="PERCENTAGE">{t('promotions:coupons.percentage')}</option>
                  <option value="FLAT">{t('promotions:coupons.flat')}</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.rewardValue')}</Form.Label>
                <Form.Control
                  type="number"
                  step={rewardType === 'PERCENTAGE' ? '1' : '0.5'}
                  min="0"
                  max={rewardType === 'PERCENTAGE' ? '100' : undefined}
                  {...register('reward_value')}
                  isInvalid={!!errors.reward_value}
                />
                {errors.reward_value && (
                  <Form.Control.Feedback type="invalid">
                    {errors.reward_value.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.rewardDescription')}</Form.Label>
                <Form.Control
                  {...register('reward_description')}
                  placeholder={t('promotions:stamps.rewardDescriptionPlaceholder')}
                  isInvalid={!!errors.reward_description}
                />
                {errors.reward_description && (
                  <Form.Control.Feedback type="invalid">
                    {errors.reward_description.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Validity */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:stamps.validitySection')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.validFrom')}</Form.Label>
                <Form.Control type="datetime-local" {...register('valid_from')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('promotions:stamps.validUntil')}</Form.Label>
                <Form.Control type="datetime-local" {...register('valid_until')} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Submit */}
      <div className="d-flex justify-content-end gap-2">
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate('/promotions/stamp-cards')}
        >
          {t('common:actions.cancel')}
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? t('common:actions.saving') : t('common:actions.save')}
        </Button>
      </div>
    </Form>
  );
}
