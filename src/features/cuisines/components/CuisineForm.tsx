import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { Cuisine } from '../cuisines.types';
import type { TranslatedField } from '@/shared/types/common.types';

const cuisineSchema = z.object({
  name: z.object({
    en: z.string().min(1, 'English name is required').max(200),
    fr: z.string().min(1, 'French name is required').max(200),
    de: z.string().min(1, 'German name is required').max(200),
    it: z.string().min(1, 'Italian name is required').max(200),
  }),
  slug: z.string().optional(),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

type CuisineFormData = z.infer<typeof cuisineSchema>;

interface CuisineFormProps {
  cuisine?: Cuisine;
  onSubmit: (data: CuisineFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CuisineForm({ cuisine, onSubmit, isLoading, onCancel }: CuisineFormProps) {
  const { t } = useTranslation('cuisines');
  const { t: tCommon } = useTranslation();
  const isEdit = !!cuisine;

  // Extract translated fields from existing cuisine
  const getNameDefaults = (): TranslatedField => {
    if (!cuisine) return { en: '', fr: '', de: '', it: '' };
    if (typeof cuisine.name === 'string') {
      return { en: cuisine.name, fr: cuisine.name, de: cuisine.name, it: cuisine.name };
    }
    return cuisine.name as TranslatedField;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CuisineFormData>({
    resolver: zodResolver(cuisineSchema),
    defaultValues: {
      name: getNameDefaults(),
      slug: cuisine?.slug || '',
      image_url: cuisine?.image_url || '',
      is_active: cuisine?.is_active ?? true,
    },
  });

  const handleFormSubmit = (data: CuisineFormData) => {
    // Clean up empty optional fields
    const cleaned = { ...data };
    if (!cleaned.slug) delete cleaned.slug;
    if (!cleaned.image_url) delete cleaned.image_url;
    onSubmit(cleaned);
  };

  const languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
  ] as const;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">{isEdit ? t('form.editTitle') : t('form.createTitle')}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Translated Name Fields */}
          <h6 className="text-muted mb-3">{t('form.nameSection')}</h6>
          <Row>
            {languages.map((lang) => (
              <Col md={6} key={lang.code}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t('fields.name')} ({lang.label}) *
                  </Form.Label>
                  <Form.Control
                    {...register(`name.${lang.code}`)}
                    isInvalid={!!errors.name?.[lang.code]}
                    placeholder={t('form.namePlaceholder', { lang: lang.label })}
                  />
                  {errors.name?.[lang.code] && (
                    <Form.Control.Feedback type="invalid">
                      {errors.name[lang.code]?.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            ))}
          </Row>

          {/* Slug & Image */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.slug')}</Form.Label>
                <Form.Control {...register('slug')} placeholder={t('form.slugPlaceholder')} />
                <Form.Text className="text-muted">{t('form.slugHint')}</Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.imageUrl')}</Form.Label>
                <Form.Control
                  {...register('image_url')}
                  isInvalid={!!errors.image_url}
                  placeholder="https://..."
                />
                {errors.image_url && (
                  <Form.Control.Feedback type="invalid">
                    {errors.image_url.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Active Toggle */}
          <Form.Check
            type="switch"
            id="is_active"
            label={t('fields.active')}
            {...register('is_active')}
            className="mb-3"
          />

          {/* Actions */}
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
