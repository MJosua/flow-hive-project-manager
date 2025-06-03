
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '@/types';

export const SearchableProjectGrid: React.FC = () => {
  const { projects, users } = useApp();
  const { searchQuery, highlightText } = useSearch();

  const filteredProjects = searchQuery.trim()
    ? projects.filter(project => {
        const searchLower = searchQuery.toLowerCase();
        const manager = users.find(u => u.id === project.managerId);
        
        return project.name.toLowerCase().includes(searchLower) ||
               project.description.toLowerCase().includes(searchLower) ||
               project.status.toLowerCase().includes(searchLower) ||
               project.priority.toLowerCase().includes(searchLower) ||
               project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               (manager && manager.name.toLowerCase().includes(searchLower));
      })
    : projects;

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'planning': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProjects.map((project) => {
        const manager = users.find(u => u.id === project.managerId);
        const teamMembers = users.filter(u => project.teamMembers.includes(u.id));

        return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {highlightText(project.name, searchQuery)}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getStatusColor(project.status)}>
                      {highlightText(project.status, searchQuery)}
                    </Badge>
                    <Badge className={getPriorityColor(project.priority)}>
                      {highlightText(project.priority, searchQuery)}
                    </Badge>
                  </div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 line-clamp-2">
                {highlightText(project.description, searchQuery)}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-1 text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{format(project.endDate, 'MMM dd')}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <DollarSign className="h-4 w-4" />
                  <span>${project.budget.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Team</span>
                </div>
                <div className="flex -space-x-2">
                  {teamMembers.slice(0, 3).map((member) => (
                    <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {teamMembers.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{teamMembers.length - 3}</span>
                    </div>
                  )}
                </div>
              </div>

              {project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {highlightText(tag, searchQuery)}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {manager && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Manager:</span>
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={manager.avatar} alt={manager.name} />
                    <AvatarFallback className="text-xs">
                      {manager.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span>{highlightText(manager.name, searchQuery)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
