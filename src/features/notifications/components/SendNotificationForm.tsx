import { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Send } from 'react-bootstrap-icons';
import { useSendNotificationMutation } from '../notifications.api';
import type {
  NotificationType,
  NotificationChannel,
  NotificationPriority,
} from '../notifications.types';

const NOTIFICATION_TYPES: NotificationType[] = [
  'ORDER_PLACED',
  'ORDER_ACCEPTED',
  'ORDER_REJECTED',
  'ORDER_PREPARING',
  'ORDER_READY',
  'ORDER_PICKED_UP',
  'ORDER_IN_TRANSIT',
  'ORDER_DELIVERED',
  'ORDER_CANCELLED',
  'PAYMENT_RECEIVED',
  'PAYMENT_REFUNDED',
  'RESTAURANT_APPROVED',
  'RESTAURANT_REJECTED',
  'RESTAURANT_PUBLISHED',
  'RESTAURANT_SUSPENDED',
  'REVIEW_APPROVED',
  'REVIEW_REJECTED',
  'PROMOTION_AVAILABLE',
  'ACCOUNT_UPDATE',
  'SYSTEM',
];

const CHANNELS: NotificationChannel[] = ['IN_APP', 'EMAIL', 'BOTH'];
const PRIORITIES: NotificationPriority[] = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

const sendNotificationSchema = z.object({
  user_ids_text: z.string().min(1, 'At least one user ID is required'),
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1, 'Body is required').max(2000),
  channel: z.string().default('IN_APP'),
  priority: z.string().default('NORMAL'),
});

type FormData = z.infer<typeof sendNotificationSchema>;

export function SendNotificationForm() {
  const { t } = useTranslation('notifications');
  const [sendNotification, { isLoading }] = useSendNotificationMutation();
  const [sentCount, setSentCount] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(sendNotificationSchema),
    defaultValues: {
      user_ids_text: '',
      type: 'SYSTEM',
      title: '',
      body: '',
      channel: 'IN_APP',
      priority: 'NORMAL',
    },
  });

  const onSubmit = async (data: FormData) => {
    const user_ids = data.user_ids_text
      .split(/[\n,]+/)
      .map((id) => id.trim())
      .filter(Boolean);

    if (user_ids.length === 0) {
      toast.error(t('errors.noUsers'));
      return;
    }

    try {
      const result = await sendNotification({
        user_ids,
        type: data.type as NotificationType,
        title: data.title,
        body: data.body,
        channel: data.channel as NotificationChannel,
        priority: data.priority as NotificationPriority,
      }).unwrap();

      setSentCount(result.data.sent);
      toast.success(t('messages.sendSuccess', { count: result.data.sent }));
      reset();
    } catch {
      toast.error(t('errors.sendFailed'));
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">{t('form.title')}</Card.Title>

        {sentCount !== null && (
          <Alert variant="success" dismissible onClose={() => setSentCount(null)}>
            {t('messages.lastSent', { count: sentCount })}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="g-3">
            {/* User IDs */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>{t('form.userIds')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder={t('form.userIdsPlaceholder')}
                  {...register('user_ids_text')}
                  isInvalid={!!errors.user_ids_text}
                />
                <Form.Text className="text-muted">{t('form.userIdsHelp')}</Form.Text>
                {errors.user_ids_text && (
                  <Form.Control.Feedback type="invalid">
                    {errors.user_ids_text.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            {/* Type + Channel */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>{t('form.type')}</Form.Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} isInvalid={!!errors.type}>
                      {NOTIFICATION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {t(`types.${type}`)}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>{t('form.channel')}</Form.Label>
                <Controller
                  name="channel"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field}>
                      {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>
                          {t(`channels.${ch}`)}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>{t('form.priority')}</Form.Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field}>
                      {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                          {t(`priorities.${p}`)}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Form.Group>
            </Col>

            {/* Title */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>{t('form.notifTitle')}</Form.Label>
                <Form.Control
                  {...register('title')}
                  placeholder={t('form.titlePlaceholder')}
                  isInvalid={!!errors.title}
                  maxLength={200}
                />
                {errors.title && (
                  <Form.Control.Feedback type="invalid">
                    {errors.title.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            {/* Body */}
            <Col md={12}>
              <Form.Group>
                <Form.Label>{t('form.body')}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  {...register('body')}
                  placeholder={t('form.bodyPlaceholder')}
                  isInvalid={!!errors.body}
                  maxLength={2000}
                />
                {errors.body && (
                  <Form.Control.Feedback type="invalid">
                    {errors.body.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Button type="submit" variant="primary" disabled={isLoading}>
                <Send size={16} className="me-2" />
                {isLoading ? t('form.sending') : t('form.send')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
