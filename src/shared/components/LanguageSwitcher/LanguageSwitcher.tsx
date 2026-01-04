import { Dropdown } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setLanguage } from '@/shared/state/language.slice';
import { baseApi } from '@/shared/api/baseApi';
import type { SupportedLanguage } from '@/shared/types/common.types';

const languages: { code: SupportedLanguage; name: string; flag: string }[] = [
  { code: 'de', name: 'Deutsch', flag: '🇨🇭' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

export function LanguageSwitcher() {
  const dispatch = useAppDispatch();
  const currentLang = useAppSelector((state) => state.language.current);

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  const handleChange = (code: SupportedLanguage) => {
    dispatch(setLanguage(code));
    dispatch(baseApi.util.resetApiState());
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" size="sm" id="language-switcher">
        {currentLanguage?.flag} {currentLanguage?.code.toUpperCase()}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {languages.map((lang) => (
          <Dropdown.Item
            key={lang.code}
            active={currentLang === lang.code}
            onClick={() => handleChange(lang.code)}
          >
            {lang.flag} {lang.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
