
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Approval, User } from '@/types';

interface PendingApprovalCardProps {
  approval: Approval;
  requester?: User;
  onApprove: (approvalId: string) => void;
  onReject: (approvalId: string) => void;
}

const PendingApprovalCard = ({ approval, requester, onApprove, onReject }: PendingApprovalCardProps) => {
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
    <Card className="border-l-4 border-l-yellow-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              {getTypeIcon(approval.type)}
            </div>
            <div>
              <CardTitle className="text-lg">
                {getTypeLabel(approval.type)}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {requester && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={requester.avatar} alt={requester.name} />
                      <AvatarFallback className="text-xs">
                        {requester.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{requester.name}</span>
                  </div>
                )}
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {format(approval.createdAt, 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-yellow-500 text-black">
            {approval.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Request Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
          <div className="space-y-2 text-sm">
            {approval.type === 'project_creation' && (
              <>
                <div><strong>Project Name:</strong> {approval.details.projectName}</div>
                <div><strong>Budget:</strong> ${approval.details.budget?.toLocaleString()}</div>
                <div><strong>Timeline:</strong> {approval.details.timeline}</div>
              </>
            )}
            {approval.type === 'assignment' && (
              <>
                <div><strong>Task ID:</strong> {approval.details.taskId}</div>
                <div><strong>Assignee ID:</strong> {approval.details.assigneeId}</div>
                <div><strong>Reason:</strong> {approval.details.reason}</div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            onClick={() => onApprove(approval.id)}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
          <Button 
            variant="outline"
            onClick={() => onReject(approval.id)}
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApprovalCard;
