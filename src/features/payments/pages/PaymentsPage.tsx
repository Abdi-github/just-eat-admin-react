import { useTranslation } from 'react-i18next';
import { TransactionList } from '../components/TransactionList';

export function PaymentsPage() {
  const { t } = useTranslation('payments');

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">{t('title')}</h2>
      </div>
      <TransactionList />
    </>
  );
}
