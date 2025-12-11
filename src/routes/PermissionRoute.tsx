import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '@/shared/hooks/usePermissions';

interface PermissionRouteProps {
  permissions: string[];
  requireAll?: boolean;
}

export function PermissionRoute({ permissions, requireAll = false }: PermissionRouteProps) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  const hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
