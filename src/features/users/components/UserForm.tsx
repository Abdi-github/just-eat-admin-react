import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { User } from '../users.types';

// ─── Schema ──────────────────────────────────────────────────────

const createUserSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  preferred_language: z.enum(['en', 'fr', 'de', 'it']).optional(),
});

const editUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  preferred_language: z.enum(['en', 'fr', 'de', 'it']).optional(),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;
type UserFormData = CreateUserFormData | EditUserFormData;

// ─── Component ───────────────────────────────────────────────────

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export function UserForm({ user, onSubmit, isLoading, onCancel }: UserFormProps) {
  const { t } = useTranslation('users');
  const { t: tCommon } = useTranslation();
  const isEdit = !!user;

  const schema = isEdit ? editUserSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? {
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone || '',
          preferred_language: user.preferred_language as 'en' | 'fr' | 'de' | 'it',
          is_active: user.is_active,
          is_verified: user.is_verified,
        }
      : {
          preferred_language: 'de',
        },
  });

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white border-bottom">
        <h5 className="mb-0">{isEdit ? t('form.editTitle') : t('form.createTitle')}</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.firstName')} *</Form.Label>
                <Form.Control
                  {...register('first_name')}
                  isInvalid={!!errors.first_name}
                  placeholder={t('form.firstNamePlaceholder')}
                />
                {errors.first_name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.first_name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.lastName')} *</Form.Label>
                <Form.Control
                  {...register('last_name')}
                  isInvalid={!!errors.last_name}
                  placeholder={t('form.lastNamePlaceholder')}
                />
                {errors.last_name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.last_name.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          {/* Email & Password only for Create */}
          {!isEdit && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('fields.email')} *</Form.Label>
                  <Form.Control
                    type="email"
                    {...register('email' as keyof UserFormData)}
                    isInvalid={!!(errors as Record<string, unknown>).email}
                    placeholder={t('form.emailPlaceholder')}
                  />
                  {(errors as Record<string, { message?: string }>).email && (
                    <Form.Control.Feedback type="invalid">
                      {(errors as Record<string, { message?: string }>).email?.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{t('fields.password')} *</Form.Label>
                  <Form.Control
                    type="password"
                    {...register('password' as keyof UserFormData)}
                    isInvalid={!!(errors as Record<string, unknown>).password}
                    placeholder={t('form.passwordPlaceholder')}
                  />
                  {(errors as Record<string, { message?: string }>).password && (
                    <Form.Control.Feedback type="invalid">
                      {(errors as Record<string, { message?: string }>).password?.message}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.phone')}</Form.Label>
                <Form.Control {...register('phone')} placeholder={t('form.phonePlaceholder')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t('fields.language')}</Form.Label>
                <Form.Select {...register('preferred_language')}>
                  <option value="de">Deutsch</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="it">Italiano</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Boolean fields for Edit */}
          {isEdit && (
            <Row>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="is_active"
                  label={t('fields.active')}
                  {...register('is_active' as keyof UserFormData)}
                  className="mb-3"
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="is_verified"
                  label={t('fields.verified')}
                  {...register('is_verified' as keyof UserFormData)}
                  className="mb-3"
                />
              </Col>
            </Row>
          )}

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
