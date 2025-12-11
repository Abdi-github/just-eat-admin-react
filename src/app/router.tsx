import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { PermissionRoute } from '@/routes/PermissionRoute';
import { PageLoader } from '@/shared/components/PageLoader';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';

// ─── Lazy-loaded feature pages ────────────────────────────────
const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const DashboardPage = lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);

// Restaurants
const RestaurantsPage = lazy(() =>
  import('@/features/restaurants/pages/RestaurantsPage').then((m) => ({
    default: m.RestaurantsPage,
  }))
);
const RestaurantDetailPage = lazy(() =>
  import('@/features/restaurants/pages/RestaurantDetailPage').then((m) => ({
    default: m.RestaurantDetailPage,
  }))
);
const PendingApprovalsPage = lazy(() =>
  import('@/features/restaurants/pages/PendingApprovalsPage').then((m) => ({
    default: m.PendingApprovalsPage,
  }))
);

// Orders
const OrdersPage = lazy(() =>
  import('@/features/orders/pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
);
const OrderDetailPage = lazy(() =>
  import('@/features/orders/pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage }))
);

// Users
const UsersPage = lazy(() =>
  import('@/features/users/pages/UsersPage').then((m) => ({ default: m.UsersPage }))
);
const UserDetailPage = lazy(() =>
  import('@/features/users/pages/UserDetailPage').then((m) => ({ default: m.UserDetailPage }))
);

// Reviews
const ReviewsPage = lazy(() =>
  import('@/features/reviews/pages/ReviewsPage').then((m) => ({ default: m.ReviewsPage }))
);
const ReviewDetailPage = lazy(() =>
  import('@/features/reviews/pages/ReviewDetailPage').then((m) => ({ default: m.ReviewDetailPage }))
);

// Cuisines
const CuisinesPage = lazy(() =>
  import('@/features/cuisines/pages/CuisinesPage').then((m) => ({ default: m.CuisinesPage }))
);

// Brands
const BrandsPage = lazy(() =>
  import('@/features/brands/pages/BrandsPage').then((m) => ({ default: m.BrandsPage }))
);

// Locations
const CantonsPage = lazy(() =>
  import('@/features/locations/pages/CantonsPage').then((m) => ({ default: m.CantonsPage }))
);
const CitiesPage = lazy(() =>
  import('@/features/locations/pages/CitiesPage').then((m) => ({ default: m.CitiesPage }))
);

// Payments
const PaymentsPage = lazy(() =>
  import('@/features/payments/pages/PaymentsPage').then((m) => ({ default: m.PaymentsPage }))
);
const PaymentDetailPage = lazy(() =>
  import('@/features/payments/pages/PaymentDetailPage').then((m) => ({
    default: m.PaymentDetailPage,
  }))
);
const RefundPage = lazy(() =>
  import('@/features/payments/pages/RefundPage').then((m) => ({ default: m.RefundPage }))
);

// Deliveries
const DeliveriesPage = lazy(() =>
  import('@/features/deliveries/pages/DeliveriesPage').then((m) => ({ default: m.DeliveriesPage }))
);
const DeliveryDetailPage = lazy(() =>
  import('@/features/deliveries/pages/DeliveryDetailPage').then((m) => ({
    default: m.DeliveryDetailPage,
  }))
);

// Promotions
const CouponsPage = lazy(() =>
  import('@/features/promotions/pages/CouponsPage').then((m) => ({ default: m.CouponsPage }))
);
const CouponCreatePage = lazy(() =>
  import('@/features/promotions/pages/CouponCreatePage').then((m) => ({
    default: m.CouponCreatePage,
  }))
);
const CouponDetailPage = lazy(() =>
  import('@/features/promotions/pages/CouponDetailPage').then((m) => ({
    default: m.CouponDetailPage,
  }))
);
const CouponEditPage = lazy(() =>
  import('@/features/promotions/pages/CouponEditPage').then((m) => ({ default: m.CouponEditPage }))
);
const StampCardsPage = lazy(() =>
  import('@/features/promotions/pages/StampCardsPage').then((m) => ({ default: m.StampCardsPage }))
);
const StampCardCreatePage = lazy(() =>
  import('@/features/promotions/pages/StampCardCreatePage').then((m) => ({
    default: m.StampCardCreatePage,
  }))
);
const StampCardDetailPage = lazy(() =>
  import('@/features/promotions/pages/StampCardDetailPage').then((m) => ({
    default: m.StampCardDetailPage,
  }))
);
const StampCardEditPage = lazy(() =>
  import('@/features/promotions/pages/StampCardEditPage').then((m) => ({
    default: m.StampCardEditPage,
  }))
);

// Analytics, Notifications, Settings
const AnalyticsPage = lazy(() =>
  import('@/features/analytics/pages/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);

// Applications
const ApplicationsPage = lazy(() =>
  import('@/features/applications/pages/ApplicationsPage').then((m) => ({
    default: m.ApplicationsPage,
  }))
);

const NotificationsPage = lazy(() =>
  import('@/features/notifications/pages/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
  }))
);
const SettingsPage = lazy(() =>
  import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);

// Not Found
const NotFoundPage = lazy(() =>
  import('@/shared/components/NotFoundPage/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

// ─── Suspense wrapper ─────────────────────────────────────────
function Lazy({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// ─── Router ───────────────────────────────────────────────────
export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: (
            <Lazy>
              <LoginPage />
            </Lazy>
          ),
        },
      ],
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: (
                <Lazy>
                  <DashboardPage />
                </Lazy>
              ),
            },
            // Restaurants
            {
              path: 'restaurants',
              element: <PermissionRoute permissions={['restaurants:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <RestaurantsPage />
                    </Lazy>
                  ),
                },
                {
                  path: 'pending',
                  element: (
                    <Lazy>
                      <PendingApprovalsPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <RestaurantDetailPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Orders
            {
              path: 'orders',
              element: <PermissionRoute permissions={['orders:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <OrdersPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <OrderDetailPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Users
            {
              path: 'users',
              element: <PermissionRoute permissions={['users:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <UsersPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <UserDetailPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Applications
            {
              path: 'applications',
              element: <PermissionRoute permissions={['users:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <ApplicationsPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Reviews
            {
              path: 'reviews',
              element: <PermissionRoute permissions={['reviews:read', 'reviews:approve']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <ReviewsPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <ReviewDetailPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Cuisines
            {
              path: 'cuisines',
              element: <PermissionRoute permissions={['cuisines:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <CuisinesPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Brands
            {
              path: 'brands',
              element: <PermissionRoute permissions={['brands:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <BrandsPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Locations — Cantons & Cities
            {
              path: 'locations',
              element: <PermissionRoute permissions={['locations:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <CantonsPage />
                    </Lazy>
                  ),
                },
                {
                  path: 'cantons',
                  element: (
                    <Lazy>
                      <CantonsPage />
                    </Lazy>
                  ),
                },
                {
                  path: 'cities',
                  element: (
                    <Lazy>
                      <CitiesPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Payments
            {
              path: 'payments',
              element: <PermissionRoute permissions={['payments:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <PaymentsPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <PaymentDetailPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id/refund',
                  element: (
                    <Lazy>
                      <RefundPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Deliveries
            {
              path: 'deliveries',
              element: <PermissionRoute permissions={['deliveries:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <DeliveriesPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <DeliveryDetailPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Promotions — redirect index to coupons
            {
              path: 'promotions',
              element: <Navigate to="promotions/coupons" replace />,
            },
            // Promotions — Coupons
            {
              path: 'promotions/coupons',
              element: <PermissionRoute permissions={['promotions:read', 'promotions:manage']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <CouponsPage />
                    </Lazy>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <Lazy>
                      <CouponCreatePage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <CouponDetailPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <Lazy>
                      <CouponEditPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Promotions — Stamp Cards
            {
              path: 'promotions/stamp-cards',
              element: <PermissionRoute permissions={['promotions:read', 'promotions:manage']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <StampCardsPage />
                    </Lazy>
                  ),
                },
                {
                  path: 'new',
                  element: (
                    <Lazy>
                      <StampCardCreatePage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id',
                  element: (
                    <Lazy>
                      <StampCardDetailPage />
                    </Lazy>
                  ),
                },
                {
                  path: ':id/edit',
                  element: (
                    <Lazy>
                      <StampCardEditPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Analytics
            {
              path: 'analytics',
              element: <PermissionRoute permissions={['analytics:read']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <AnalyticsPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Notifications
            {
              path: 'notifications',
              element: <PermissionRoute permissions={['notifications:manage']} />,
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <NotificationsPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // Settings
            {
              path: 'settings',
              children: [
                {
                  index: true,
                  element: (
                    <Lazy>
                      <SettingsPage />
                    </Lazy>
                  ),
                },
              ],
            },
            // 404
            {
              path: '*',
              element: (
                <Lazy>
                  <NotFoundPage />
                </Lazy>
              ),
            },
          ],
        },
      ],
    },
  ],
  { basename: '/admin' }
);
