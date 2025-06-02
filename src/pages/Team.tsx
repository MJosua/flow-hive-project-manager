
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Plus, UserPlus, Crown, Star, User, Settings } from 'lucide-react';

const Team = () => {
  const { users, tasks, projects, projectRoles } = useApp();
  const [selectedProject, setSelectedProject] = useState<string | 'all'>('all');

  const getHierarchyIcon = (hierarchy: number) => {
    switch (hierarchy) {
      case 1: return <Crown className="h-3 w-3" />;
      case 2: return <Star className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getHierarchyColor = (hierarchy: number) => {
    switch (hierarchy) {
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-blue-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getUserStats = (userId: string, projectId?: string) => {
    const userTasks = tasks.filter(task => 
      task.assigneeId === userId && (!projectId || task.projectId === projectId)
    );
    const completedTasks = userTasks.filter(task => task.status === 'done').length;
    const activeTasks = userTasks.filter(task => task.status === 'in-progress').length;
    
    return { completedTasks, activeTasks };
  };

  const getProjectTeams = () => {
    if (selectedProject === 'all') {
      return projects.map(project => {
        const projectTeam = projectRoles
          .filter(role => role.projectId === project.id)
          .sort((a, b) => a.hierarchy - b.hierarchy)
          .map(role => {
            const user = users.find(u => u.id === role.userId);
            return user ? { ...user, projectRole: role } : null;
          })
          .filter(Boolean);
        
        return { project, team: projectTeam };
      });
    } else {
      const project = projects.find(p => p.id === selectedProject);
      if (!project) return [];
      
      const projectTeam = projectRoles
        .filter(role => role.projectId === project.id)
        .sort((a, b) => a.hierarchy - b.hierarchy)
        .map(role => {
          const user = users.find(u => u.id === role.userId);
          return user ? { ...user, projectRole: role } : null;
        })
        .filter(Boolean);
      
      return [{ project, team: projectTeam }];
    }
  };

  const projectTeams = getProjectTeams();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600">Manage teams by project with custom roles and hierarchy</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Roles
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* Project Filter */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedProject === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedProject('all')}
        >
          All Projects
        </Button>
        {projects.map(project => (
          <Button
            key={project.id}
            variant={selectedProject === project.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProject(project.id)}
            style={{
              backgroundColor: selectedProject === project.id ? project.color : undefined,
              borderColor: project.color
            }}
          >
            {project.name}
          </Button>
        ))}
      </div>

      {/* Project Teams */}
      {projectTeams.map(({ project, team }) => (
        <Card key={project.id} className="border-l-4" style={{ borderLeftColor: project.color }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <span>{project.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {team.length} members
                  </Badge>
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">{project.description}</p>
              </div>
              <Badge 
                className="text-xs"
                style={{ backgroundColor: project.color, color: 'white' }}
              >
                {project.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => {
                if (!member) return null;
                const stats = getUserStats(member.id, project.id);
                
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {member.name}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {member.email}
                              </p>
                            </div>
                            {getHierarchyIcon(member.projectRole.hierarchy)}
                          </div>
                          
                          <div className="mt-2 space-y-2">
                            {/* Project Role Badge */}
                            <Badge 
                              className={`text-xs flex items-center space-x-1 ${getHierarchyColor(member.projectRole.hierarchy)}`}
                              style={{ backgroundColor: member.projectRole.color, color: 'white' }}
                            >
                              {getHierarchyIcon(member.projectRole.hierarchy)}
                              <span>{member.projectRole.role}</span>
                            </Badge>
                            
                            {/* Global Role */}
                            <Badge variant="outline" className="text-xs">
                              {member.role}
                            </Badge>
                          </div>
                          
                          {/* Stats */}
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-50 p-1 rounded text-center">
                              <div className="font-bold text-green-600">{stats.completedTasks}</div>
                              <div className="text-gray-600">Done</div>
                            </div>
                            <div className="bg-yellow-50 p-1 rounded text-center">
                              <div className="font-bold text-yellow-600">{stats.activeTasks}</div>
                              <div className="text-gray-600">Active</div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="mt-3 flex space-x-1">
                            <Button variant="outline" size="sm" className="flex-1 text-xs">
                              Profile
                            </Button>
                            <Button variant="outline" size="sm" className="px-2">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Overall Team Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{users.length}</div>
              <div className="text-sm text-gray-600">Total Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {projectRoles.filter(r => r.hierarchy === 1).length}
              </div>
              <div className="text-sm text-gray-600">Project Leads</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {[...new Set(projectRoles.map(r => r.role))].length}
              </div>
              <div className="text-sm text-gray-600">Unique Roles</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
