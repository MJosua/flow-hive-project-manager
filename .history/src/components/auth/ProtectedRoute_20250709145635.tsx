import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  selectHasCheckedAuth,
} from '@/store/slices/authSlice';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const hasCheckedAuth = useSelector(selectHasCheckedAuth);

  // ✅ Only show loading screen if we're still checking the session
  if (!hasCheckedAuth || isLoading) {
    return <div>Checking session...</div>;
  }

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting...');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
