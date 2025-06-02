
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Approval, User } from '@/types';

interface ProcessedApprovalCardProps {
  approval: Approval;
  requester?: User;
}

const ProcessedApprovalCard = ({ approval, requester }: ProcessedApprovalCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500 text-white';
      case 'rejected': return 'bg-red-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project_creation': return <FileText className="h-4 w-4" />;
      case 'assignment': return <CheckCircle className="h-4 w-4" />;
      case 'team_assignment': return <Users className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project_creation': return 'Project Creation';
      case 'assignment': return 'Task Assignment';
      case 'team_assignment': return 'Team Assignment';
      default: return type;
    }
  };

  return (
    <Card className="opacity-75">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              {getTypeIcon(approval.type)}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {getTypeLabel(approval.type)}
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                {requester && <span>{requester.name}</span>}
                <span>•</span>
                <span>{format(approval.resolvedAt || approval.createdAt, 'MMM dd')}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
            {approval.notes && (
              <p className="text-xs text-gray-500 mt-1">{approval.notes}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessedApprovalCard;
