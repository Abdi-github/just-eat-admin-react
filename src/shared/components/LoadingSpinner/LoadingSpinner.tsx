import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | undefined;
  fullPage?: boolean;
  message?: string;
}

export function LoadingSpinner({ size, fullPage = false, message }: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const displayMessage = message || t('messages.loading');

  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status" size={size}>
            <span className="visually-hidden">{displayMessage}</span>
          </Spinner>
          <p className="mt-2 text-muted">{displayMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <Spinner animation="border" variant="primary" role="status" size={size}>
        <span className="visually-hidden">{displayMessage}</span>
      </Spinner>
    </div>
  );
}
