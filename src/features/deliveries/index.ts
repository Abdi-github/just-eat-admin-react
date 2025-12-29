export { DeliveriesPage } from './pages/DeliveriesPage';
export { DeliveryDetailPage } from './pages/DeliveryDetailPage';
export {
  deliveriesApi,
  useGetDeliveriesQuery,
  useGetDeliveryQuery,
  useCreateDeliveryMutation,
  useAssignCourierMutation,
  useCancelDeliveryMutation,
} from './deliveries.api';
export type { Delivery, DeliveryQueryParams } from './deliveries.types';
