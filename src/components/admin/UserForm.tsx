
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAppSelector } from '@/hooks/useAppSelector';

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: any) => void;
  initialData?: any;
}

const UserForm: React.FC<UserFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { departments, roles, teams } = useAppSelector(state => state.userManagement);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    uid: '',
    role_id: '',
    department_id: '',
    team_id: '',
    job_title: '',
    superior_id: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstname: initialData.firstname || '',
        lastname: initialData.lastname || '',
        email: initialData.email || '',
        uid: initialData.uid || '',
        role_id: initialData.role_id?.toString() || '',
        department_id: initialData.department_id?.toString() || '',
        team_id: initialData.team_id?.toString() || '',
        job_title: initialData.job_title || '',
        superior_id: initialData.superior_id?.toString() || ''
      });
    } else {
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        uid: '',
        role_id: '',
        department_id: '',
        team_id: '',
        job_title: '',
        superior_id: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      role_id: parseInt(formData.role_id),
      department_id: parseInt(formData.department_id),
      team_id: formData.team_id ? parseInt(formData.team_id) : null,
      superior_id: formData.superior_id ? parseInt(formData.superior_id) : null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname">First Name</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastname">Last Name</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="uid">User ID</Label>
            <Input
              id="uid"
              value={formData.uid}
              onChange={(e) => setFormData({ ...formData, uid: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role_id} onValueChange={(value) => setFormData({ ...formData, role_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.role_id} value={role.role_id.toString()}>
                    {role.role_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department_id} onValueChange={(value) => setFormData({ ...formData, department_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
                    {dept.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="job_title">Job Title</Label>
            <Input
              id="job_title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
