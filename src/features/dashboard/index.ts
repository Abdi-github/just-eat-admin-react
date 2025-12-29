// Pages
export { DashboardPage } from './pages/DashboardPage';

// Components
export { StatsCards } from './components/StatsCards';
export { RecentOrders } from './components/RecentOrders';
export { PendingApprovals } from './components/PendingApprovals';
export { OrderChart } from './components/OrderChart';
export { RevenueChart } from './components/RevenueChart';

// API
export {
  dashboardApi,
  useGetDashboardStatsQuery,
  useGetRevenueTimeSeriesQuery,
  useGetTopRestaurantsQuery,
  useGetRecentOrdersQuery,
  useGetPendingRestaurantsQuery,
} from './dashboard.api';
