import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { LoginForm } from '../components/LoginForm';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export function LoginPage() {
  const { t } = useTranslation('auth');
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary mb-1">
            <i className="bi bi-shop me-2" />
            Just Eat
          </h1>
          <p className="text-muted small mb-0">{t('subtitle')}</p>
        </div>

        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4 h4">{t('title')}</h2>
            <LoginForm />
          </div>
        </div>

        <div className="text-center mt-3">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
