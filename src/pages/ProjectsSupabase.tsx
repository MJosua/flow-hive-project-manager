
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { 
  fetchProjects, 
  selectSupabaseProjects, 
  selectSupabaseProjectsLoading,
  selectSupabaseProjectsError 
} from '@/store/slices/supabaseProjectSlice';

const ProjectsSupabase = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectSupabaseProjects);
  const isLoading = useAppSelector(selectSupabaseProjectsLoading);
  const error = useAppSelector(selectSupabaseProjectsError);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-blue-500';
      case 'on-hold': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <AppLayoutNew>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Projects (Supabase)</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppLayoutNew>
    );
  }

  if (error) {
    return (
      <AppLayoutNew>
        <div className="p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Projects</h2>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => dispatch(fetchProjects())} 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </AppLayoutNew>
    );
  }

  return (
    <AppLayoutNew>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your projects from Supabase</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="flex items-center space-x-1">
              <span>Supabase Connected</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card key={project.project_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{project.manager_name}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(project.status)} text-white border-0`}
                    >
                      {project.status}
                    </Badge>
                    <Badge variant={getPriorityColor(project.priority) as any}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>
                    <Progress value={project.progress || 0} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'TBD'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {project.budget ? `$${project.budget.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {project.actual_hours || 0}h / {project.estimated_hours || 0}h
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{project.department_name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500">Start by creating your first project.</p>
          </div>
        )}
      </div>
    </AppLayoutNew>
  );
};

export default ProjectsSupabase;
