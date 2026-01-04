import { useAppSelector } from '@/app/hooks';
import { ADMIN_ROLES } from '@/shared/types/common.types';

export function useAuth() {
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);

  const isAdmin =
    isAuthenticated &&
    !!user &&
    user.roles.some((role) => (ADMIN_ROLES as readonly string[]).includes(role));

  const isSuperAdmin = isAuthenticated && !!user && user.roles.includes('super_admin');

  return {
    user,
    isAuthenticated,
    token,
    isAdmin,
    isSuperAdmin,
  };
}
