
import React from 'react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserManagement = () => {
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">User management functionality will be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </AppLayoutNew>
  );
};

export default UserManagement;
