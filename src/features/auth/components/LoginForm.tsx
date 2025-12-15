import { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/shared/state/auth.slice';
import { useLoginMutation } from '../auth.api';
import { ADMIN_ROLES } from '@/shared/types/common.types';

const loginSchema = z.object({
  email: z.string().min(1, 'errors.required').email('errors.invalidEmail'),
  password: z.string().min(1, 'errors.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const result = await login(data).unwrap();

      const { user, tokens } = result.data;

      // CRITICAL: Admin-only role gate
      const isAdmin = user.roles.some((role) => (ADMIN_ROLES as readonly string[]).includes(role));
      if (!isAdmin) {
        setServerError(t('errors.adminOnly'));
        return;
      }

      // Check account status
      if (!user.is_active || user.status !== 'active') {
        setServerError(t('errors.accountInactive'));
        return;
      }

      // Store credentials in Redux + localStorage
      dispatch(
        setCredentials({
          token: tokens.access_token,
          refreshToken: tokens.refresh_token,
          user,
        })
      );

      // Redirect to intended page or dashboard
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      // Handle API error responses
      const error = err as { status?: number; data?: { message?: string } };
      if (error.status === 401 || error.status === 400) {
        setServerError(t('errors.invalidCredentials'));
      } else if (error.data?.message) {
        setServerError(error.data.message);
      } else {
        setServerError(t('errors.invalidCredentials'));
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert variant="danger" dismissible onClose={() => setServerError(null)}>
          {serverError}
        </Alert>
      )}

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>{t('fields.email')}</Form.Label>
        <Form.Control
          type="email"
          placeholder={t('placeholders.email')}
          autoComplete="email"
          autoFocus
          isInvalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <Form.Control.Feedback type="invalid">{t(errors.email.message!)}</Form.Control.Feedback>
        )}
      </Form.Group>

      <Form.Group className="mb-4" controlId="password">
        <Form.Label>{t('fields.password')}</Form.Label>
        <Form.Control
          type="password"
          placeholder={t('placeholders.password')}
          autoComplete="current-password"
          isInvalid={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <Form.Control.Feedback type="invalid">
            {t(errors.password.message!)}
          </Form.Control.Feedback>
        )}
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100" disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Spinner animation="border" size="sm" className="me-2" />
            {t('buttons.loggingIn')}
          </>
        ) : (
          t('buttons.login')
        )}
      </Button>
    </Form>
  );
}
