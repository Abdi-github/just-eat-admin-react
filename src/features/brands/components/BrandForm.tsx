import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { Brand } from '../brands.types';

const brandSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BrandFormData = z.infer<typeof brandSchema>;

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: BrandFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function BrandForm({ brand, onSubmit, isLoading, onCancel }: BrandFormProps) {
  const { t } = useTranslation('brands');
  const { t: tCommon } = useTranslation();
  const isEdit = !!brand;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || '',
      slug: brand?.slug || '',
      is_active: brand?.is_active ?? true,
    },
  });

  const handleFormSubmit = (data: BrandFormData) => {
    const cleaned = { ...data };
    if (!cleaned.slug) delete cleaned.slug;
    onSubmit(cleaned);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">{isEdit ? t('form.editTitle') : t('form.createTitle')}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.name')} *</Form.Label>
                <Form.Control
                  {...register('name')}
                  isInvalid={!!errors.name}
                  placeholder={t('form.namePlaceholder')}
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
                <Form.Label>{t('fields.slug')}</Form.Label>
                <Form.Control {...register('slug')} placeholder={t('form.slugPlaceholder')} />
                <Form.Text className="text-muted">{t('form.slugHint')}</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Form.Check
            type="switch"
            id="is_active"
            label={t('fields.active')}
            {...register('is_active')}
            className="mb-3"
          />

          <div className="d-flex gap-2 pt-3 border-top">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {tCommon('messages.loading')}
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-1" />
                  {tCommon('actions.save')}
                </>
              )}
            </Button>
            <Button variant="outline-secondary" onClick={onCancel} disabled={isLoading}>
              {tCommon('actions.cancel')}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
