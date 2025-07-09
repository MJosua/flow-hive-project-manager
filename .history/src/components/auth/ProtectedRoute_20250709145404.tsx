import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/authSlice';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  // Wait until loading finishes before rendering anything
  if (isLoading) {
    return <div>Loading session...</div>; // or use a Spinner component
  }

  if (isAuthenticated) {
    console.log("isAuthenticated", isAuthenticated)
  } else {
    console.log("isAuthenticated false", isAuthenticated)
    return <Navigate to="/login" replace />;

  }

  return children;
};

export default ProtectedRoute;
