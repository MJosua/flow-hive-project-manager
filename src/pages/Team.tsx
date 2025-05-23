
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Plus, UserPlus } from 'lucide-react';

const Team = () => {
  const { users, tasks, projects } = useApp();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500 text-white';
      case 'manager': return 'bg-blue-500 text-white';
      case 'developer': return 'bg-green-500 text-white';
      case 'designer': return 'bg-purple-500 text-white';
      case 'tester': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getUserStats = (userId: string) => {
    const userTasks = tasks.filter(task => task.assigneeId === userId);
    const completedTasks = userTasks.filter(task => task.status === 'done').length;
    const activeTasks = userTasks.filter(task => task.status === 'in-progress').length;
    const userProjects = projects.filter(project => 
      project.managerId === userId || project.teamMembers.includes(userId)
    ).length;

    return { completedTasks, activeTasks, userProjects };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">Manage your team and track performance</p>
        </div>
        
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Total Members</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {users.filter(u => u.role === 'developer').length}
            </div>
            <div className="text-sm text-gray-600">Developers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.role === 'manager').length}
            </div>
            <div className="text-sm text-gray-600">Managers</div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          
          return (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {user.name}
                </CardTitle>
                
                <div className="space-y-2">
                  <Badge className={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                  
                  <div className="flex items-center justify-center space-x-1 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {user.department}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Performance Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{stats.completedTasks}</div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{stats.activeTasks}</div>
                    <div className="text-xs text-gray-600">Active</div>
                  </div>
                  
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{stats.userProjects}</div>
                    <div className="text-xs text-gray-600">Projects</div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge 
                    variant={user.status === 'active' ? 'default' : 'secondary'}
                    className={user.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {user.status}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Team;
