
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/components/layout/AppLayout";
import { useAppSelector } from '@/hooks/useAppSelector';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchDepartments,
  fetchRoles,
  fetchTeams,
  UserType
} from '@/store/slices/userManagementSlice';
import { useAppDispatch } from '@/hooks/useAppSelector';
import UserForm from '@/components/admin/UserForm';

const UserManagement = () => {
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector(state => state.userManagement);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchUsers());
      dispatch(fetchDepartments());
      dispatch(fetchRoles());
      dispatch(fetchTeams());
    }
  }, [dispatch, isAuthenticated, user]);

  // Show loading spinner while auth state is being determined
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show loading while user data is being fetched
  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AppLayout>
    );
  }

  // Check if user has admin role (role_id === '4' or role_id === 4)
  const isAdmin = user.role_id?.toString() === '4';

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const handleCreateUser = async (userData: any) => {
    try {
      await dispatch(createUser(userData));
      dispatch(fetchUsers()); // Refresh user list
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async (userId: number, userData: any) => {
    try {
      await dispatch(updateUser({ id: userId, data: userData }));
      dispatch(fetchUsers()); // Refresh user list
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId));
      dispatch(fetchUsers()); // Refresh user list
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
            {error && (
              <div className="text-red-500 py-4">Error: {error}</div>
            )}
            {!isLoading && !error && Array.isArray(users) && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((userItem) => (
                    <TableRow key={userItem.user_id}>
                      <TableCell>{userItem.user_id}</TableCell>
                      <TableCell>{`${userItem.firstname} ${userItem.lastname}`}</TableCell>
                      <TableCell>{userItem.email}</TableCell>
                      <TableCell>{userItem.role_name}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(userItem);
                              setIsEditModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem.user_id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create User Modal */}
        {isCreateModalOpen && (
          <UserForm
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateUser}
          />
        )}

        {/* Edit User Modal */}
        {selectedUser && (
          <UserForm
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={(userData) => handleUpdateUser(selectedUser.user_id, userData)}
            initialData={selectedUser}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default UserManagement;
