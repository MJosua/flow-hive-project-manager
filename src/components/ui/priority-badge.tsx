import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'priority-low border-green-200';
      case 'medium':
        return 'priority-medium border-yellow-200';
      case 'high':
        return 'priority-high border-orange-200';
      case 'critical':
        return 'priority-critical border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border',
        getPriorityStyles(priority),
        className
      )}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};