
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { Task } from '@/types';
import { Clock, Calendar, CheckCircle, ArrowRight, Play, Pause, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface TaskStatusCardProps {
  task: Task;
  isAssignedToCurrentUser?: boolean;
}

export const TaskStatusCard: React.FC<TaskStatusCardProps> = ({ 
  task, 
  isAssignedToCurrentUser = false 
}) => {
  const { users, updateTask, currentUser } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const assignee = users.find(user => user.id === task.assigneeId);
  const project = task.projectId;
  
  const canUpdateStatus = isAssignedToCurrentUser || currentUser.role === 'admin' || currentUser.role === 'manager';

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'review': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'done': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getNextStatus = (currentStatus: Task['status']): Task['status'] | null => {
    switch (currentStatus) {
      case 'todo': return 'in-progress';
      case 'in-progress': return 'review';
      case 'review': return 'done';
      case 'done': return null;
      default: return null;
    }
  };

  const getStatusActionText = (currentStatus: Task['status']) => {
    switch (currentStatus) {
      case 'todo': return 'Start Task';
      case 'in-progress': return 'Mark for Review';
      case 'review': return 'Mark Complete';
      case 'done': return 'Completed';
      default: return 'Update Status';
    }
  };

  const getStatusIcon = (currentStatus: Task['status']) => {
    switch (currentStatus) {
      case 'todo': return <Play className="h-4 w-4" />;
      case 'in-progress': return <ArrowRight className="h-4 w-4" />;
      case 'review': return <CheckCircle className="h-4 w-4" />;
      case 'done': return <CheckCircle className="h-4 w-4" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(task.status);
    if (!nextStatus) return;

    setIsUpdating(true);
    try {
      updateTask(task.id, { status: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMoveBack = () => {
    const previousStatus: Record<Task['status'], Task['status'] | null> = {
      'todo': null,
      'in-progress': 'todo',
      'review': 'in-progress',
      'done': 'review'
    };
    
    const prevStatus = previousStatus[task.status];
    if (prevStatus) {
      updateTask(task.id, { status: prevStatus });
    }
  };

  const progressPercentage = task.estimatedHours > 0 
    ? Math.min((task.actualHours / task.estimatedHours) * 100, 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getStatusColor(task.status)}>
                {task.status.replace('-', ' ')}
              </Badge>
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

        {/* Assignee and Project Info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {assignee && (
              <>
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                  <AvatarFallback className="text-xs">
                    {assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-gray-600">{assignee.name}</span>
              </>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            Project: {project}
          </Badge>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Due: {format(task.endDate, 'MMM dd')}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{task.actualHours}h / {task.estimatedHours}h</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {canUpdateStatus && (
          <div className="flex space-x-2 pt-2">
            {task.status !== 'todo' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMoveBack}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Move Back
              </Button>
            )}
            
            {task.status !== 'done' && (
              <Button
                size="sm"
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                {getStatusIcon(task.status)}
                <span className="ml-1">
                  {isUpdating ? 'Updating...' : getStatusActionText(task.status)}
                </span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
