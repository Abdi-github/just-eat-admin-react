import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { closeMobileSidebar } from '@/shared/state/ui.slice';
import clsx from 'clsx';

export function AdminLayout() {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector((state) => state.ui);

  return (
    <div className="admin-layout d-flex">
      <Sidebar />
      {sidebarMobileOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={() => dispatch(closeMobileSidebar())} />
      )}
      <div
        className={clsx('admin-content flex-grow-1 d-flex flex-column', {
          'sidebar-collapsed': sidebarCollapsed,
        })}
      >
        <Header />
        <main className="admin-main flex-grow-1">
          <Container fluid className="py-4">
            <Outlet />
          </Container>
        </main>
        <Footer />
      </div>
    </div>
  );
}
