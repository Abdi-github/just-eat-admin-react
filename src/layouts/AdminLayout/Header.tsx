import { Navbar, Container, Dropdown, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { logout } from '@/shared/state/auth.slice';
import { setLanguage } from '@/shared/state/language.slice';
import { toggleMobileSidebar } from '@/shared/state/ui.slice';
import { baseApi } from '@/shared/api/baseApi';
import { useLogoutMutation } from '@/features/auth/auth.api';
import type { SupportedLanguage } from '@/shared/types/common.types';

const languages: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'de', name: 'Deutsch', flag: '🇨🇭' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const currentLang = useAppSelector((state) => state.language.current);
  const [logoutApi] = useLogoutMutation();

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  const handleLanguageChange = (code: SupportedLanguage) => {
    dispatch(setLanguage(code));
    // Reset API cache so data is re-fetched with new Accept-Language
    dispatch(baseApi.util.resetApiState());
  };

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Even if API call fails, clear local state
    }
    dispatch(logout());
    toast.success(t('auth:messages.logoutSuccess', { defaultValue: 'Logged out' }));
    navigate('/login', { replace: true });
  };

  const userName = user ? `${user.first_name} ${user.last_name}` : '';
  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : '??';

  return (
    <Navbar bg="white" className="admin-header border-bottom px-3">
      <Container fluid className="px-0">
        <Button
          variant="link"
          className="d-lg-none text-dark p-0 me-3"
          onClick={() => dispatch(toggleMobileSidebar())}
          aria-label="Toggle menu"
        >
          <i className="bi bi-list fs-4" />
        </Button>

        <div className="ms-auto d-flex align-items-center gap-3">
          {/* Language Selector */}
          <Dropdown>
            <Dropdown.Toggle variant="light" size="sm" id="language-dropdown">
              {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((lang) => (
                <Dropdown.Item
                  key={lang.code}
                  active={currentLang === lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.flag} {lang.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* User Menu */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              id="user-dropdown"
              className="d-flex align-items-center gap-2"
            >
              <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
                {initials}
              </div>
              <span className="d-none d-md-inline">{userName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <i className="bi bi-gear me-2" />
                {t('nav.settings')}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2" />
                {t('header.logout')}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </Navbar>
  );
}
