import { NavLink, useLocation } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { toggleSidebar, closeMobileSidebar } from '@/shared/state/ui.slice';
import { usePermissions } from '@/shared/hooks/usePermissions';
import clsx from 'clsx';
import { useEffect } from 'react';

interface NavItem {
  path: string;
  icon: string;
  label: string;
  permission?: string | null;
}

interface NavDivider {
  divider: true;
}

type SidebarItem = NavItem | NavDivider;

const sidebarItems: SidebarItem[] = [
  { path: '/', icon: 'bi-speedometer2', label: 'nav.dashboard', permission: null },
  {
    path: '/restaurants',
    icon: 'bi-shop',
    label: 'nav.restaurants',
    permission: 'restaurants:read',
  },
  { path: '/orders', icon: 'bi-cart3', label: 'nav.orders', permission: 'orders:read' },
  { path: '/users', icon: 'bi-people', label: 'nav.users', permission: 'users:read' },
  {
    path: '/applications',
    icon: 'bi-file-earmark-check',
    label: 'nav.applications',
    permission: 'users:read',
  },
  { path: '/reviews', icon: 'bi-star-half', label: 'nav.reviews', permission: 'reviews:read' },
  { divider: true },
  { path: '/cuisines', icon: 'bi-egg-fried', label: 'nav.cuisines', permission: 'cuisines:read' },
  { path: '/brands', icon: 'bi-building', label: 'nav.brands', permission: 'brands:read' },
  {
    path: '/locations',
    icon: 'bi-geo-alt',
    label: 'nav.locations',
    permission: 'locations:read',
  },
  { divider: true },
  {
    path: '/payments',
    icon: 'bi-credit-card',
    label: 'nav.payments',
    permission: 'payments:read',
  },
  {
    path: '/deliveries',
    icon: 'bi-bicycle',
    label: 'nav.deliveries',
    permission: 'deliveries:read',
  },
  {
    path: '/promotions',
    icon: 'bi-tag',
    label: 'nav.promotions',
    permission: 'promotions:read',
  },
  { divider: true },
  {
    path: '/analytics',
    icon: 'bi-bar-chart',
    label: 'nav.analytics',
    permission: 'analytics:read',
  },
  {
    path: '/notifications',
    icon: 'bi-bell',
    label: 'nav.notifications',
    permission: 'notifications:create',
  },
  { path: '/settings', icon: 'bi-gear', label: 'nav.settings', permission: null },
];

function isDivider(item: SidebarItem): item is NavDivider {
  return 'divider' in item;
}

export function Sidebar() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector((state) => state.ui);
  const { hasPermission } = usePermissions();

  // Close mobile sidebar on route change
  useEffect(() => {
    dispatch(closeMobileSidebar());
  }, [location.pathname, dispatch]);

  const filteredItems = sidebarItems.filter((item) => {
    if (isDivider(item)) return true;
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <aside
      className={clsx('sidebar bg-dark', {
        collapsed: sidebarCollapsed,
        'mobile-open': sidebarMobileOpen,
      })}
    >
      <div className="sidebar-header d-flex align-items-center justify-content-between p-3">
        {sidebarCollapsed ? (
          <span className="sidebar-brand text-white fw-bold">JE</span>
        ) : (
          <img src="/logo.svg" alt="Just Eat" style={{ height: 28, filter: 'brightness(0) invert(1)' }} />
        )}
        <button
          className="btn btn-link text-white p-0"
          onClick={() => dispatch(toggleSidebar())}
          aria-label="Toggle sidebar"
        >
          <i className={clsx('bi', sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left')} />
        </button>
      </div>
      <Nav className="flex-column sidebar-nav">
        {filteredItems.map((item, index) => {
          if (isDivider(item)) {
            return (
              <hr key={`divider-${index}`} className="sidebar-divider mx-3 my-1 border-secondary" />
            );
          }

          return (
            <Nav.Item key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  clsx('nav-link d-flex align-items-center', { active: isActive })
                }
                title={t(item.label)}
              >
                <i className={clsx('bi', item.icon, 'nav-icon')} />
                {!sidebarCollapsed && <span className="nav-text">{t(item.label)}</span>}
              </NavLink>
            </Nav.Item>
          );
        })}
      </Nav>
    </aside>
  );
}
