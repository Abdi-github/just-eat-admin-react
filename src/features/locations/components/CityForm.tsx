import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { useGetCantonsQuery } from '../locations.api';
import type { City } from '../locations.types';
import type { TranslatedField } from '@/shared/types/common.types';

const citySchema = z.object({
  canton_id: z.string().min(1, 'Canton is required'),
  name: z.object({
    en: z.string().min(1, 'English name is required').max(200),
    fr: z.string().min(1, 'French name is required').max(200),
    de: z.string().min(1, 'German name is required').max(200),
    it: z.string().min(1, 'Italian name is required').max(200),
  }),
  slug: z.string().optional(),
  postal_codes: z
    .array(
      z.object({
        value: z.coerce.number().int().min(1000, 'Min 1000').max(9999, 'Max 9999'),
      })
    )
    .min(1, 'At least one postal code is required'),
  is_active: z.boolean().default(true),
});

type CityFormData = z.infer<typeof citySchema>;

interface CityFormProps {
  city?: City;
  onSubmit: (data: {
    canton_id: string;
    name: TranslatedField;
    slug?: string;
    postal_codes: number[];
    is_active?: boolean;
  }) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function CityForm({ city, onSubmit, isLoading, onCancel }: CityFormProps) {
  const { t } = useTranslation('locations');
  const { t: tCommon } = useTranslation();
  const currentLang = useAppSelector((state) => state.language.current);
  const isEdit = !!city;

  // Fetch cantons for dropdown
  const { data: cantonsData } = useGetCantonsQuery({ limit: 50, sort: 'code', order: 'asc' });
  const cantons = cantonsData?.data || [];

  const getNameDefaults = (): TranslatedField => {
    if (!city) return { en: '', fr: '', de: '', it: '' };
    if (typeof city.name === 'string') {
      return { en: city.name, fr: city.name, de: city.name, it: city.name };
    }
    return city.name as TranslatedField;
  };

  const getCantonName = (canton: { name: string | TranslatedField }): string => {
    if (typeof canton.name === 'string') return canton.name;
    return (canton.name as TranslatedField)[currentLang] || (canton.name as TranslatedField).de;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CityFormData>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      canton_id: city?.canton_id || '',
      name: getNameDefaults(),
      slug: city?.slug || '',
      postal_codes: city?.postal_codes?.map((v) => ({ value: v })) || [
        { value: '' as unknown as number },
      ],
      is_active: city?.is_active ?? true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'postal_codes',
  });

  const handleFormSubmit = (data: CityFormData) => {
    onSubmit({
      canton_id: data.canton_id,
      name: data.name,
      slug: data.slug || undefined,
      postal_codes: data.postal_codes.map((p) => p.value),
      is_active: data.is_active,
    });
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
          {isEdit ? t('cities.form.editTitle') : t('cities.form.createTitle')}
        </h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Canton + Slug */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('cities.fields.canton')} *</Form.Label>
                <Form.Select {...register('canton_id')} isInvalid={!!errors.canton_id}>
                  <option value="">{t('cities.form.selectCanton')}</option>
                  {cantons.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {getCantonName(c)}
                    </option>
                  ))}
                </Form.Select>
                {errors.canton_id && (
                  <Form.Control.Feedback type="invalid">
                    {errors.canton_id.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('cities.fields.slug')}</Form.Label>
                <Form.Control
                  {...register('slug')}
                  placeholder={t('cities.form.slugPlaceholder')}
                />
                <Form.Text className="text-muted">{t('cities.form.slugHint')}</Form.Text>
              </Form.Group>
            </Col>
          </Row>

          {/* Translated Names */}
          <h6 className="text-muted mb-3">{t('cities.form.nameSection')}</h6>
          <Row>
            {languages.map((lang) => (
              <Col md={6} key={lang.code}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    {t('cities.fields.name')} ({lang.label}) *
                  </Form.Label>
                  <Form.Control
                    {...register(`name.${lang.code}`)}
                    isInvalid={!!errors.name?.[lang.code]}
                    placeholder={t('cities.form.namePlaceholder', { lang: lang.label })}
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

          {/* Postal Codes */}
          <h6 className="text-muted mb-3">
            {t('cities.fields.postalCodes')} *
            <Badge bg="secondary" className="ms-2">
              {fields.length}
            </Badge>
          </h6>
          {fields.map((field, index) => (
            <Row key={field.id} className="mb-2">
              <Col xs={8} md={4}>
                <InputGroup size="sm">
                  <Form.Control
                    {...register(`postal_codes.${index}.value`)}
                    type="number"
                    min={1000}
                    max={9999}
                    placeholder="1000"
                    isInvalid={!!errors.postal_codes?.[index]?.value}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                  >
                    <i className="bi bi-x" />
                  </Button>
                </InputGroup>
                {errors.postal_codes?.[index]?.value && (
                  <Form.Text className="text-danger small">
                    {errors.postal_codes[index]?.value?.message}
                  </Form.Text>
                )}
              </Col>
            </Row>
          ))}
          {errors.postal_codes?.root && (
            <div className="text-danger small mb-2">{errors.postal_codes.root.message}</div>
          )}
          <Button
            variant="outline-secondary"
            size="sm"
            className="mb-3"
            onClick={() => append({ value: '' as unknown as number })}
          >
            <i className="bi bi-plus me-1" />
            {t('cities.form.addPostalCode')}
          </Button>

          {/* Active */}
          <Form.Check
            type="switch"
            id="city_is_active"
            label={t('cities.fields.active')}
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
