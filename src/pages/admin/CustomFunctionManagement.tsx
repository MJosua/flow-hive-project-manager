
import React from 'react';
import AppLayoutNew from "@/components/layout/AppLayoutNew";
import { useAppSelector } from '@/hooks/useAppSelector';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import CustomFunctionManager from '@/components/admin/CustomFunctionManager';

const CustomFunctionManagement = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  
  // Show loading spinner while auth state is being determined
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Show loading while user data is being fetched
  if (!user) {
    return (
      <AppLayoutNew>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayoutNew>
    );
  }
  
  // Check if user has admin role (role_id === '4' or role_id === 4)
  const isAdmin = user.role_id?.toString() === '4';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayoutNew>
      <CustomFunctionManager />
    </AppLayoutNew>
  );
};

export default CustomFunctionManagement;
