import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { setLanguage } from '@/shared/state/language.slice';
import { toggleSidebar } from '@/shared/state/ui.slice';
import type { SupportedLanguage } from '@/shared/types/common.types';

const LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
];

export function SettingsPage() {
  const { t } = useTranslation('settings');
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.language.current);
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed);

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">{t('title')}</h2>

      <Row className="g-4">
        {/* Language Settings */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">{t('language.title')}</Card.Title>
              <p className="text-muted small mb-3">{t('language.description')}</p>
              <Form.Group>
                <Form.Label>{t('language.select')}</Form.Label>
                <Form.Select
                  value={currentLanguage}
                  onChange={(e) => dispatch(setLanguage(e.target.value as SupportedLanguage))}
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Display Settings */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">{t('display.title')}</Card.Title>
              <p className="text-muted small mb-3">{t('display.description')}</p>
              <Form.Check
                type="switch"
                id="sidebar-collapsed"
                label={t('display.collapseSidebar')}
                checked={sidebarCollapsed}
                onChange={() => dispatch(toggleSidebar())}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* About */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">{t('about.title')}</Card.Title>
              <div className="d-flex flex-column gap-2">
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{t('about.appName')}</span>
                  <span className="fw-semibold">
                    {import.meta.env.VITE_APP_NAME || 'Just Eat Admin'}
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{t('about.version')}</span>
                  <span className="fw-semibold">{import.meta.env.VITE_APP_VERSION || '1.0.0'}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{t('about.apiUrl')}</span>
                  <span className="fw-semibold small">{import.meta.env.VITE_API_URL || '-'}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Danger Zone */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm border-danger">
            <Card.Body>
              <Card.Title className="mb-3 text-danger">{t('danger.title')}</Card.Title>
              <p className="text-muted small mb-3">{t('danger.description')}</p>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                {t('danger.clearData')}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
