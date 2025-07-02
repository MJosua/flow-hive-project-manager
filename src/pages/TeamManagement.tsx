import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { StatusBadge } from '@/components/ui/status-badge';
import { Users, Plus, Mail, Phone, Building, UserCheck, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  phone?: string;
  manager?: string;
  permissions: string[];
}

const TeamManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const { toast } = useToast();

  // Mock team data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      role: 'Project Manager',
      department: 'IT',
      status: 'active',
      joinDate: '2023-01-15',
      phone: '+1 (555) 123-4567',
      manager: 'Sarah Wilson',
      permissions: ['view_projects', 'edit_tasks', 'approve_requests']
    },
    {
      id: 2,
      name: 'Jane Doe',
      email: 'jane.doe@company.com',
      role: 'Senior Developer',
      department: 'IT',
      status: 'active',
      joinDate: '2022-08-20',
      phone: '+1 (555) 234-5678',
      manager: 'John Smith',
      permissions: ['view_projects', 'edit_tasks']
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Designer',
      department: 'Design',
      status: 'active',
      joinDate: '2023-03-10',
      phone: '+1 (555) 345-6789',
      manager: 'Lisa Brown',
      permissions: ['view_projects']
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      role: 'Team Lead',
      department: 'IT',
      status: 'active',
      joinDate: '2021-11-05',
      phone: '+1 (555) 456-7890',
      permissions: ['view_projects', 'edit_tasks', 'approve_requests', 'manage_team']
    },
    {
      id: 5,
      name: 'Alex Chen',
      email: 'alex.chen@company.com',
      role: 'Junior Developer',
      department: 'IT',
      status: 'pending',
      joinDate: '2024-01-15',
      phone: '+1 (555) 567-8901',
      manager: 'Jane Doe',
      permissions: ['view_projects']
    }
  ]);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchValue.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchValue.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleStatusChange = (memberId: number, newStatus: 'active' | 'inactive' | 'pending') => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status: newStatus } : member
    ));
    
    toast({
      title: 'Status Updated',
      description: `Team member status has been updated to ${newStatus}.`,
    });
  };

  const departments = Array.from(new Set(teamMembers.map(m => m.department)));
  const roles = Array.from(new Set(teamMembers.map(m => m.role)));

  const activeCount = teamMembers.filter(m => m.status === 'active').length;
  const pendingCount = teamMembers.filter(m => m.status === 'pending').length;
  const inactiveCount = teamMembers.filter(m => m.status === 'inactive').length;

  return (
    <AppLayoutNew searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search team members...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground mt-2">Manage team members, roles, and permissions</p>
          </div>
          <Button className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover-lift shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold text-foreground">{teamMembers.length}</p>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-3xl font-bold text-foreground">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-3xl font-bold text-foreground">{departments.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-professional">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Department:</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Role:</label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members Table */}
        <Card className="shadow-professional">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role & Department</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="gradient-primary text-white">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{member.role}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Building className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{member.department}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{member.email}</span>
                        </div>
                        {member.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{member.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{member.manager || 'N/A'}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{new Date(member.joinDate).toLocaleDateString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                        {member.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="bg-success text-white hover:bg-success/90"
                            onClick={() => handleStatusChange(member.id, 'active')}
                          >
                            Activate
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground">
              {searchValue ? 'Try adjusting your search terms' : 'No members match your current filters'}
            </p>
          </div>
        )}
      </div>
    </AppLayoutNew>
  );
};

export default TeamManagement;