import { useAppSelector } from '@/app/hooks';

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user);
  const permissions = user?.permissions || [];
  const roles = user?.roles || [];

  // super_admin has implicit access to everything
  const isSuperAdmin = roles.includes('super_admin');

  const hasPermission = (permission: string): boolean => {
    if (isSuperAdmin) return true;

    // Exact match or wildcard
    if (permissions.includes(permission) || permissions.includes('*')) return true;

    // Hierarchical: resource:manage implies resource:read, resource:create,
    // resource:update, resource:delete, and any other resource:* sub-permission
    const [resource] = permission.split(':');
    if (resource && permissions.includes(`${resource}:manage`)) return true;

    return false;
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((p) => hasPermission(p));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((p) => hasPermission(p));
  };

  const hasRole = (role: string): boolean => roles.includes(role);

  return { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isSuperAdmin, permissions };
}
