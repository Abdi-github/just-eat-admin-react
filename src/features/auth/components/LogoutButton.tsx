import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/shared/state/auth.slice';
import { useLogoutMutation } from '../auth.api';

export function LogoutButton() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Call API to invalidate token server-side
      await logoutApi().unwrap();
    } catch {
      // Even if API call fails, clear local state
    }

    dispatch(logout());
    toast.success(t('messages.logoutSuccess'));
    navigate('/login', { replace: true });
  };

  return (
    <button type="button" className="dropdown-item text-danger" onClick={handleLogout}>
      <i className="bi bi-box-arrow-right me-2" />
      {t('buttons.logout', { defaultValue: 'Logout' })}
    </button>
  );
}
