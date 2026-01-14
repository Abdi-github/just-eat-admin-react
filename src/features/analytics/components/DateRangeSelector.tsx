import { Form, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import type { DatePreset, AnalyticsPeriod } from '../analytics.types';

interface DateRangeSelectorProps {
  preset: DatePreset;
  period: AnalyticsPeriod;
  customFrom?: string;
  customTo?: string;
  onPresetChange: (preset: DatePreset) => void;
  onPeriodChange: (period: AnalyticsPeriod) => void;
  onCustomFromChange: (date: string) => void;
  onCustomToChange: (date: string) => void;
  onApply: () => void;
  showPeriod?: boolean;
}

const DATE_PRESETS: DatePreset[] = [
  'today',
  'yesterday',
  'this_week',
  'this_month',
  'last_7_days',
  'last_30_days',
  'last_90_days',
  'this_year',
];

const PERIODS: AnalyticsPeriod[] = ['daily', 'weekly', 'monthly'];

export function DateRangeSelector({
  preset,
  period,
  customFrom,
  customTo,
  onPresetChange,
  onPeriodChange,
  onCustomFromChange,
  onCustomToChange,
  onApply,
  showPeriod = false,
}: DateRangeSelectorProps) {
  const { t } = useTranslation('analytics');

  const isCustom = !preset;

  return (
    <Row className="g-2 align-items-end">
      <Col xs="auto">
        <Form.Group>
          <Form.Label className="small mb-1">{t('dateRange.preset')}</Form.Label>
          <Form.Select
            size="sm"
            value={preset || ''}
            onChange={(e) => onPresetChange(e.target.value as DatePreset)}
          >
            <option value="">{t('dateRange.custom')}</option>
            {DATE_PRESETS.map((p) => (
              <option key={p} value={p}>
                {t(`dateRange.presets.${p}`)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      {isCustom && (
        <>
          <Col xs="auto">
            <Form.Group>
              <Form.Label className="small mb-1">{t('dateRange.from')}</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={customFrom || ''}
                onChange={(e) => onCustomFromChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Form.Group>
              <Form.Label className="small mb-1">{t('dateRange.to')}</Form.Label>
              <Form.Control
                type="date"
                size="sm"
                value={customTo || ''}
                onChange={(e) => onCustomToChange(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto">
            <Button size="sm" variant="outline-primary" onClick={onApply}>
              {t('dateRange.apply')}
            </Button>
          </Col>
        </>
      )}
      {showPeriod && (
        <Col xs="auto">
          <Form.Group>
            <Form.Label className="small mb-1">{t('dateRange.period')}</Form.Label>
            <Form.Select
              size="sm"
              value={period}
              onChange={(e) => onPeriodChange(e.target.value as AnalyticsPeriod)}
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {t(`dateRange.periods.${p}`)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      )}
    </Row>
  );
}
