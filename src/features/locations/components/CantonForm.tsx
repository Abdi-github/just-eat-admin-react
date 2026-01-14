import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { Canton } from '../locations.types';
import type { TranslatedField } from '@/shared/types/common.types';

const cantonSchema = z.object({
  code: z
    .string()
    .min(2, 'Code must be 2 characters')
    .max(2, 'Code must be 2 characters')
    .transform((v) => v.toUpperCase()),
  name: z.object({
    en: z.string().min(1, 'English name is required').max(200),
    fr: z.string().min(1, 'French name is required').max(200),
    de: z.string().min(1, 'German name is required').max(200),
    it: z.string().min(1, 'Italian name is required').max(200),
  }),
  slug: z.string().optional(),
  is_active: z.boolean().default(true),
});

type CantonFormData = z.infer<typeof cantonSchema>;

interface CantonFormProps {
  canton?: Canton;
  onSubmit: (data: CantonFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CantonForm({ canton, onSubmit, isLoading, onCancel }: CantonFormProps) {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const isEdit = !!canton;

  const getNameDefaults = (): TranslatedField => {
    if (!canton) return { en: '', fr: '', de: '', it: '' };
    if (typeof canton.name === 'string') {
      return { en: canton.name, fr: canton.name, de: canton.name, it: canton.name };
    }
    return canton.name as TranslatedField;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CantonFormData>({
    resolver: zodResolver(cantonSchema),
    defaultValues: {
      code: canton?.code || '',
      name: getNameDefaults(),
      slug: canton?.slug || '',
      is_active: canton?.is_active ?? true,
    },
  });

  const handleFormSubmit = (data: CantonFormData) => {
    const cleaned = { ...data };
    if (!cleaned.slug) delete cleaned.slug;
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
        <h5 className="mb-0">
          {isEdit ? t('cantons.form.editTitle') : t('cantons.form.createTitle')}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Code + Slug */}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>{t('cantons.fields.code')} *</Form.Label>
                <Form.Control
                  {...register('code')}
                  isInvalid={!!errors.code}
                  maxLength={2}
                  placeholder="ZH"
                  className="text-uppercase font-monospace"
                />
                {errors.code && (
                  <Form.Control.Feedback type="invalid">
                    {errors.code.message}
                  </Form.Control.Feedback>
                )}
                <Form.Text className="text-muted">{t('cantons.form.codeHint')}</Form.Text>
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>{t('cantons.fields.slug')}</Form.Label>
                <Form.Control
                  {...register('slug')}
                  placeholder={t('cantons.form.slugPlaceholder')}
                />
                <Form.Text className="text-muted">{t('cantons.form.slugHint')}</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Translated Names */}
          <h6 className="text-muted mb-3">{t('cantons.form.nameSection')}</h6>
          <Row>
            {languages.map((lang) => (
              <Col md={6} key={lang.code}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t('cantons.fields.name')} ({lang.label}) *
                  </Form.Label>
                  <Form.Control
                    {...register(`name.${lang.code}`)}
                    isInvalid={!!errors.name?.[lang.code]}
                    placeholder={t('cantons.form.namePlaceholder', { lang: lang.label })}
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

          {/* Active */}
          <Form.Check
            type="switch"
            id="canton_is_active"
            label={t('cantons.fields.active')}
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
