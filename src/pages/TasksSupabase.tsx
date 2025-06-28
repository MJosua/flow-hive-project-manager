
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, User } from 'lucide-react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { 
  fetchMyTasks, 
  selectSupabaseMyTasks, 
  selectSupabaseTasksLoading,
  selectSupabaseTasksError 
} from '@/store/slices/supabaseTaskSlice';

const TasksSupabase = () => {
  const dispatch = useAppDispatch();
  const myTasks = useAppSelector(selectSupabaseMyTasks);
  const isLoading = useAppSelector(selectSupabaseTasksLoading);
  const error = useAppSelector(selectSupabaseTasksError);

  useEffect(() => {
    dispatch(fetchMyTasks());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'secondary';
      case 'in-progress': return 'default';
      case 'review': return 'outline';
      case 'done': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
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
            <h1 className="text-2xl font-bold">My Tasks (Supabase)</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Tasks</h2>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => dispatch(fetchMyTasks())} 
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
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-gray-600">Tasks assigned to you from Supabase</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="flex items-center space-x-1">
              <span>Supabase Connected</span>
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myTasks.map((task: any) => (
            <Card key={task.task_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{task.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{task.project_name}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge variant={getStatusColor(task.status) as any}>
                      {task.status}
                    </Badge>
                    <Badge variant={getPriorityColor(task.priority) as any}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{task.progress || 0}%</span>
                    </div>
                    <Progress value={task.progress || 0} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No deadline'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {task.actual_hours || 0}h / {task.estimated_hours || 0}h
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">{task.assigned_to_name}</span>
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {myTasks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
            <p className="text-gray-500">You have no tasks assigned to you at the moment.</p>
          </div>
        )}
      </div>
    </AppLayoutNew>
  );
};

export default TasksSupabase;
