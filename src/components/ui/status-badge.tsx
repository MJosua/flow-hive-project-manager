import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'in-review' | 'active' | 'completed' | 'cancelled' | 'planning' | 'on-hold' | 'inactive';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'approved':
      case 'completed':
        return 'status-approved';
      case 'rejected':
      case 'cancelled':
        return 'status-rejected';
      case 'in-review':
      case 'active':
        return 'status-in-review';
      case 'planning':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'on-hold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'inactive':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium border',
        getStatusStyles(status),
        className
      )}
    >
      {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  );
};