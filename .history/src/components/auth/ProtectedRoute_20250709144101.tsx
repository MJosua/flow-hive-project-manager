import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  selectIsAuthenticated,
  selectAuthLoading,
  loadPersistentUser,
} from '@/store/slices/authSlice';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const dispatch = useDispatch(); // ✅ required
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    dispatch(loadPersistentUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading user session...</div>; // Replace with your spinner if needed
  }

  if (!isAuthenticated) {

    console.log("isAuthenticated",isAuthenticated)
    
    return (
    <Navigate to="/login" replace />)
  }

  return children;
};

export default ProtectedRoute;
