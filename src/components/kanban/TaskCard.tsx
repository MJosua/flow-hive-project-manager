
import React from 'react';
import { Task } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { users } = useApp();
  const { searchQuery, highlightText } = useSearch();
  const assignee = users.find(user => user.user_id === task.assigneeId);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-red-400';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityTextColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-50 border-red-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-50 border-green-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white">
      <CardContent className="p-4">
        {/* Priority indicator */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
          <Badge variant="outline" className={`text-xs ${getPriorityTextColor(task.priority)}`}>
            {highlightText(task.priority, searchQuery)}
          </Badge>
        </div>

        {/* Task title and description */}
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {highlightText(task.title, searchQuery)}
        </h4>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {highlightText(task.description, searchQuery)}
        </p>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {highlightText(tag, searchQuery)}
              </Badge>
            ))}
            {task.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{task.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Due date and assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{format(task.endDate, 'MMM dd')}</span>
          </div>
          
          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
              <AvatarFallback className="text-xs">
                {assignee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-3 flex items-center space-x-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{task.actualHours}h / {task.estimatedHours}h</span>
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-500 h-1 rounded-full"
              style={{ width: `${Math.min((task.actualHours / task.estimatedHours) * 100, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
