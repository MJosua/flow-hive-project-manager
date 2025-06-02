
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AddMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const AddMemberModal = ({ open, onOpenChange, projectId }: AddMemberModalProps) => {
  const { users, projects } = useApp();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [roleData, setRoleData] = useState({
    role: '',
    hierarchy: 3,
    color: '#3B82F6',
    permissions: ''
  });

  const project = projects.find(p => p.id === projectId);
  const availableUsers = users.filter(user => 
    !project?.teamMembers.includes(user.id) && user.id !== project?.managerId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const permissions = roleData.permissions.split(',').map(p => p.trim()).filter(Boolean);
    console.log('Add Member Data:', {
      userId: selectedUserId,
      projectId,
      role: roleData.role,
      hierarchy: roleData.hierarchy,
      color: roleData.color,
      permissions
    });
    // Here you'll connect to backend
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select User</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role Title</Label>
            <Input
              id="role"
              value={roleData.role}
              onChange={(e) => setRoleData({ ...roleData, role: e.target.value })}
              placeholder="Lead Developer, UI Designer, QA Lead"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hierarchy">Hierarchy Level</Label>
            <Select 
              value={roleData.hierarchy.toString()} 
              onValueChange={(value) => setRoleData({ ...roleData, hierarchy: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 - Lead (Highest)</SelectItem>
                <SelectItem value="2">2 - Senior</SelectItem>
                <SelectItem value="3">3 - Regular</SelectItem>
                <SelectItem value="4">4 - Junior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Badge Color</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                value={roleData.color}
                onChange={(e) => setRoleData({ ...roleData, color: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                value={roleData.color}
                onChange={(e) => setRoleData({ ...roleData, color: e.target.value })}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="permissions">Permissions (comma separated)</Label>
            <Input
              id="permissions"
              value={roleData.permissions}
              onChange={(e) => setRoleData({ ...roleData, permissions: e.target.value })}
              placeholder="edit_tasks, view_budget, manage_team"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Add Member
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberModal;
