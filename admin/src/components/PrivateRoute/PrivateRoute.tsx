import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { useStore } from '@nanostores/react';
import { $isLoggedIn } from '../../stores/admin';

interface iProps {
  predicate?: boolean;
  redirectTo?: ROUTES;
  children: React.ReactNode;
}
export function PrivateRoute({
  children,
  predicate = false,
  redirectTo = ROUTES.LOGIN,
}: iProps) {
  const isLoggedIn = useStore($isLoggedIn);

  if (isLoggedIn === predicate) return <Navigate to={redirectTo} />;

  return children;
}
