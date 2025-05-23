import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { Users } from 'lucide-react';

const Approvals = () => {
  const { approvals, users, updateApproval } = useApp();

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

  const handleApproval = (approvalId: string, status: 'approved' | 'rejected') => {
    const notes = status === 'approved' ? 'Approved by admin' : 'Rejected - needs revision';
    updateApproval(approvalId, status, notes);
  };

  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const processedApprovals = approvals.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600">Review and approve pending requests</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-yellow-700 bg-yellow-50 border-yellow-200">
            {pendingApprovals.length} Pending
          </Badge>
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            <span>Pending Approvals</span>
          </h2>
          
          <div className="grid gap-4">
            {pendingApprovals.map((approval) => {
              const requester = users.find(u => u.id === approval.requesterId);
              
              return (
                <Card key={approval.id} className="border-l-4 border-l-yellow-500">
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
                      
                      <Badge className={getStatusColor(approval.status)}>
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
                        onClick={() => handleApproval(approval.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleApproval(approval.id, 'rejected')}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Approvals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Decisions</h2>
        
        <div className="grid gap-4">
          {processedApprovals.slice(0, 10).map((approval) => {
            const requester = users.find(u => u.id === approval.requesterId);
            
            return (
              <Card key={approval.id} className="opacity-75">
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
          })}
        </div>
      </div>
    </div>
  );
};

export default Approvals;
