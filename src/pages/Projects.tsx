import React, { useState, useEffect } from 'react';
import { FolderOpen, Plus, Calendar, Users, BarChart3, Clock, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AppLayout } from '@/components/layout/AppLayout';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { 
  fetchProjects, 
  selectProjects, 
  selectProjectsLoading, 
  selectProjectsError,
  useFallbackProjectData 
} from '@/store/slices/projectSlice';
import { useNavigate } from 'react-router-dom';

// Status color mapping
const statusColors: Record<string, string> = {
  'planning': 'bg-yellow-100 text-yellow-800',
  'active': 'bg-blue-100 text-blue-800',
  'on-hold': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800',
  'cancelled': 'bg-red-100 text-red-800',
};

// Priority color mapping
const priorityColors: Record<string, string> = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800',
};

const Projects = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const isLoading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  useEffect(() => {
    // Try to fetch real data, fallback to dummy data if API fails
    dispatch(fetchProjects());
    
    // Initialize with fallback data immediately if no projects
    if (projects.length === 0) {
      dispatch(useFallbackProjectData());
    }
  }, [dispatch]);

  // Filter projects based on search
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.manager_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
    project.department_name?.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Group projects by status
  const activeProjects = filteredProjects.filter(p => p.status === 'active');
  const planningProjects = filteredProjects.filter(p => p.status === 'planning');
  const completedProjects = filteredProjects.filter(p => p.status === 'completed');

  const SkeletonCard = () => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );

  const ProjectCard = ({ project }: { project: any }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/project/${project.project_id}`)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {project.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">{project.manager_name} • {project.department_name}</p>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <Badge className={statusColors[project.status]}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
            <Badge variant="outline" className={priorityColors[project.priority]}>
              {project.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {project.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.end_date).toLocaleDateString()}</span>
            </div>
            {project.budget && (
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>${project.budget.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading && projects.length === 0) {
    return (
      <AppLayout searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search projects...">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage and track your project portfolio</p>
            </div>
            <Button disabled>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search projects...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">Manage and track your project portfolio</p>
          </div>
          <Button onClick={() => navigate('/project/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold">{activeProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Planning</p>
                  <p className="text-2xl font-bold">{planningProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{completedProjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Projects */}
        {activeProjects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeProjects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Planning Projects */}
        {planningProjects.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">In Planning</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {planningProjects.map((project) => (
                <ProjectCard key={project.project_id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Other Projects */}
        {filteredProjects.filter(p => p.status !== 'active' && p.status !== 'planning').length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Other Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProjects
                .filter(p => p.status !== 'active' && p.status !== 'planning')
                .map((project) => (
                  <ProjectCard key={project.project_id} project={project} />
                ))}
            </div>
          </div>
        )}

        {filteredProjects.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {searchValue ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
            </p>
            <Button onClick={() => navigate('/project/create')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
