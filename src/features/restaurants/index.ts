// Pages
export { RestaurantsPage } from './pages/RestaurantsPage';
export { RestaurantDetailPage } from './pages/RestaurantDetailPage';
export { PendingApprovalsPage } from './pages/PendingApprovalsPage';

// Components
export { RestaurantList } from './components/RestaurantList';
export { RestaurantDetails } from './components/RestaurantDetails';
export { ApprovalActions } from './components/ApprovalActions';

// API hooks
export {
  useGetRestaurantsQuery,
  useGetPendingRestaurantsQuery,
  useGetRestaurantQuery,
  useUpdateRestaurantMutation,
  useChangeRestaurantStatusMutation,
  useDeleteRestaurantMutation,
} from './restaurants.api';

// Types
export type {
  Restaurant,
  RestaurantStatus,
  RestaurantQueryParams,
  RestaurantUpdateDto,
  RestaurantStatusChangeDto,
} from './restaurants.types';
