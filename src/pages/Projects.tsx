
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, DollarSign, Plus, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from '@/components/modals/NewProjectModal';
import { Layout } from '@/components/layout/Layout';

const Projects = () => {
  const { projects, users } = useApp();
  const { searchQuery, highlightText } = useSearch();
  const navigate = useNavigate();
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);

  // Apply search filtering
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'planning': return 'bg-yellow-500 text-black';
      case 'on-hold': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">
            Manage and track all your projects
            {searchQuery && (
              <span className="ml-2 text-sm text-yellow-600">
                • Filtering by: "{searchQuery}" ({filteredProjects.length} projects)
              </span>
            )}
          </p>
        </div>
        
        <Button 
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
          onClick={() => setNewProjectModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const manager = users.find(u => u.id === project.managerId);
          const teamMembers = users.filter(u => project.teamMembers.includes(u.id));
          
          return (
            <Card key={project.id} className={`hover:shadow-lg transition-shadow border-l-4 ${getPriorityColor(project.priority)}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {highlightText(project.name, searchQuery)}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(project.status)}>
                        {highlightText(project.status.replace('-', ' '), searchQuery)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {highlightText(project.priority, searchQuery)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {highlightText(project.description, searchQuery)}
                </p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Due Date</span>
                    </div>
                    <span className="font-medium">{format(project.endDate, 'MMM dd, yyyy')}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>Budget</span>
                    </div>
                    <span className="font-medium">${project.budget.toLocaleString()}</span>
                  </div>
                </div>

                {/* Team */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>Team ({teamMembers.length} members)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Manager */}
                    {manager && (
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={manager.avatar} alt={manager.name} />
                          <AvatarFallback className="text-xs">
                            {manager.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-600 font-medium">
                          {highlightText('Manager', searchQuery)}
                        </span>
                      </div>
                    )}
                    
                    {/* Team Members */}
                    <div className="flex -space-x-1">
                      {teamMembers.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {teamMembers.length > 3 && (
                        <div className="h-6 w-6 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{teamMembers.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tags */}
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

                {/* Open Project Button */}
                <div className="pt-2 border-t">
                  <Button 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No results message */}
      {filteredProjects.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ExternalLink className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            No projects match your search for "{searchQuery}". Try adjusting your search terms.
          </p>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        open={newProjectModalOpen}
        onOpenChange={setNewProjectModalOpen}
      />
    </Layout>
  );
};

export default Projects;
