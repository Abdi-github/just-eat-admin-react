import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import { Pencil, Trash, ArrowLeft } from 'react-bootstrap-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetStampCardQuery, useDeleteStampCardMutation } from '../promotions.api';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { formatCHF, formatDateTime } from '@/shared/utils/formatters';

export function StampCardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation(['promotions', 'common']);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetStampCardQuery(id!);
  const [deleteStampCard, { isLoading: isDeleting }] = useDeleteStampCardMutation();
  const [showDelete, setShowDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteStampCard(id!).unwrap();
      toast.success(t('promotions:stamps.deleteSuccess'));
      navigate('/promotions/stamp-cards');
    } catch {
      toast.error(t('common:messages.error'));
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !data?.data) {
    return <Alert variant="danger">{t('promotions:stamps.notFound')}</Alert>;
  }

  const card = data.data;

  return (
    <>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => navigate('/promotions/stamp-cards')}
          >
            <ArrowLeft />
          </Button>
          <h1 className="h3 mb-0">{card.name}</h1>
          <Badge bg={card.is_active ? 'success' : 'secondary'}>
            {card.is_active ? t('common:status.active') : t('common:status.inactive')}
          </Badge>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate(`/promotions/stamp-cards/${id}/edit`)}
          >
            <Pencil className="me-1" /> {t('common:actions.edit')}
          </Button>
          <Button variant="outline-danger" size="sm" onClick={() => setShowDelete(true)}>
            <Trash className="me-1" /> {t('common:actions.delete')}
          </Button>
        </div>
      </div>

      <Row>
        {/* Card Info */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:stamps.basicInfo')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:stamps.name')}</dt>
                <dd className="col-sm-7">{card.name}</dd>

                {card.description && (
                  <>
                    <dt className="col-sm-5">{t('promotions:stamps.description')}</dt>
                    <dd className="col-sm-7">{card.description}</dd>
                  </>
                )}

                <dt className="col-sm-5">{t('promotions:stamps.restaurant')}</dt>
                <dd className="col-sm-7">{card.restaurant_name || card.restaurant_id}</dd>

                <dt className="col-sm-5">{t('promotions:stamps.active')}</dt>
                <dd className="col-sm-7">
                  <Badge bg={card.is_active ? 'success' : 'secondary'}>
                    {card.is_active ? t('common:status.yes') : t('common:status.no')}
                  </Badge>
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>

        {/* Reward Info */}
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>
              <Card.Title as="h6" className="mb-0">
                {t('promotions:stamps.rewardSection')}
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <dl className="row mb-0">
                <dt className="col-sm-5">{t('promotions:stamps.stampsRequired')}</dt>
                <dd className="col-sm-7">
                  <Badge bg="info">{card.stamps_required}</Badge>
                </dd>

                <dt className="col-sm-5">{t('promotions:stamps.rewardDescription')}</dt>
                <dd className="col-sm-7">{card.reward_description}</dd>

                <dt className="col-sm-5">{t('promotions:stamps.rewardType')}</dt>
                <dd className="col-sm-7">
                  <Badge bg="secondary">
                    {t(`promotions:coupons.${card.reward_type.toLowerCase()}`)}
                  </Badge>
                </dd>

                <dt className="col-sm-5">{t('promotions:stamps.rewardValue')}</dt>
                <dd className="col-sm-7">
                  {card.reward_type === 'PERCENTAGE'
                    ? `${card.reward_value}%`
                    : formatCHF(card.reward_value)}
                </dd>
              </dl>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Validity & Timestamps */}
      <Card className="mb-3">
        <Card.Header>
          <Card.Title as="h6" className="mb-0">
            {t('promotions:stamps.validitySection')}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <dl className="row mb-0">
            <dt className="col-sm-3">{t('promotions:stamps.validFrom')}</dt>
            <dd className="col-sm-3">{card.valid_from ? formatDateTime(card.valid_from) : '—'}</dd>

            <dt className="col-sm-3">{t('promotions:stamps.validUntil')}</dt>
            <dd className="col-sm-3">
              {card.valid_until ? formatDateTime(card.valid_until) : '—'}
            </dd>

            <dt className="col-sm-3">{t('promotions:stamps.createdAt')}</dt>
            <dd className="col-sm-3">{formatDateTime(card.created_at)}</dd>

            <dt className="col-sm-3">{t('promotions:stamps.updatedAt')}</dt>
            <dd className="col-sm-3">{formatDateTime(card.updated_at)}</dd>
          </dl>
        </Card.Body>
      </Card>

      {/* Delete confirmation */}
      <ConfirmDialog
        show={showDelete}
        title={t('promotions:stamps.deleteTitle')}
        message={t('promotions:stamps.deleteMessage', { name: card.name })}
        confirmLabel={t('common:actions.delete')}
        cancelLabel={t('common:actions.cancel')}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </>
  );
}
