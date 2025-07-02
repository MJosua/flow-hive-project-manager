import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderOpen, CheckSquare, Clock, TrendingUp, Users, Target, Calendar, AlertCircle, FileText } from 'lucide-react';
import AppLayoutNew from "@/components/layout/AppLayoutNew";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { 
  fetchProjects, 
  selectProjects, 
  selectProjectsLoading,
  useFallbackProjectData 
} from '@/store/slices/projectSlice';
import { 
  fetchMyTasks, 
  selectMyTasks,
  useFallbackTaskData 
} from '@/store/slices/taskSlice';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const myTasks = useAppSelector(selectMyTasks);
  const isLoading = useAppSelector(selectProjectsLoading);

  useEffect(() => {
    // Try to fetch real data, fallback to dummy data if API fails
    dispatch(fetchProjects());
    dispatch(fetchMyTasks());
    
    // Initialize with fallback data immediately if empty
    if (projects.length === 0) {
      dispatch(useFallbackProjectData());
    }
    if (myTasks.length === 0) {
      dispatch(useFallbackTaskData());
    }
  }, [dispatch]);

  // Calculate project stats
  const activeProjects = projects.filter(p => p.status === 'active');
  const planningProjects = projects.filter(p => p.status === 'planning');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const overallProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  // Calculate task stats
  const pendingTasks = myTasks.filter(t => t.status !== 'done');
  const completedTasks = myTasks.filter(t => t.status === 'done');
  const overdueTasks = myTasks.filter(t => 
    new Date(t.due_date) < new Date() && t.status !== 'done'
  );
  const urgentTasks = myTasks.filter(t => 
    t.priority === 'high' || t.priority === 'critical'
  );

  // Get recent projects (last 3) - create a copy before sorting
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updated_date).getTime() - new Date(a.updated_date).getTime())
    .slice(0, 3);

  // Get upcoming tasks (next 5 due) - create a copy before sorting
  const upcomingTasks = [...myTasks]
    .filter(t => t.status !== 'done')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 5);

  const priorityColors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
  };

  const statusColors: Record<string, string> = {
    'planning': 'bg-yellow-100 text-yellow-800',
    'active': 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-orange-100 text-orange-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800',
  };

  return (
    <AppLayoutNew>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Project Management Hub</h1>
              <p className="text-blue-100 text-lg">Streamline your workflow and boost productivity</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200">Welcome back!</p>
              <p className="text-xl font-semibold">Ready to achieve excellence?</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-lift cursor-pointer shadow-professional" onClick={() => navigate('/projects')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                  <p className="text-sm text-success mt-1">
                    {activeProjects.length} active
                  </p>
                </div>
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift cursor-pointer shadow-professional" onClick={() => navigate('/my-tasks')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">My Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{myTasks.length}</p>
                  <p className="text-sm text-warning mt-1">
                    {pendingTasks.length} pending
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-professional" onClick={() => navigate('/approvals')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-3xl font-bold text-foreground">5</p>
                  <p className="text-sm text-warning mt-1">
                    Requires attention
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift shadow-professional">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                  <p className="text-3xl font-bold text-foreground">{overallProgress}%</p>
                  <p className="text-sm text-primary mt-1">
                    Across all projects
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects & Upcoming Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card className="shadow-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <span>Recent Projects</span>
                </CardTitle>
                <button
                  onClick={() => navigate('/projects')}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div 
                    key={project.project_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/project/${project.project_id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.manager_name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={statusColors[project.status]}>
                        {project.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{project.progress}%</p>
                        <Progress value={project.progress} className="w-16 h-1" />
                      </div>
                    </div>
                  </div>
                ))}
                {recentProjects.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No projects yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="shadow-professional">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>Upcoming Tasks</span>
                </CardTitle>
                <button
                  onClick={() => navigate('/my-tasks')}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  View all
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div 
                    key={task.task_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => navigate(`/task/${task.task_id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{task.name}</h3>
                      <p className="text-sm text-gray-600">{task.project_name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(task.due_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.due_date) < new Date() ? 'Overdue' : 'Due'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingTasks.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No upcoming tasks</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-professional">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/project/create')}
                className="flex items-center space-x-3 p-6 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all hover-lift text-left"
              >
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Create Project</h3>
                  <p className="text-sm text-muted-foreground">Start a new project</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/my-tasks')}
                className="flex items-center space-x-3 p-6 bg-success/5 hover:bg-success/10 rounded-xl transition-all hover-lift text-left"
              >
                <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">View My Tasks</h3>
                  <p className="text-sm text-muted-foreground">Check your assignments</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/approvals')}
                className="flex items-center space-x-3 p-6 bg-warning/5 hover:bg-warning/10 rounded-xl transition-all hover-lift text-left"
              >
                <div className="w-12 h-12 bg-warning rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Approvals</h3>
                  <p className="text-sm text-muted-foreground">Review pending requests</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/admin/team-management')}
                className="flex items-center space-x-3 p-6 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all hover-lift text-left"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Team Management</h3>
                  <p className="text-sm text-muted-foreground">Manage team members</p>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayoutNew>
  );
};

export default Index;
