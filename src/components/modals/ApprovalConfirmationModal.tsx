
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { CheckCircle, XCircle } from 'lucide-react';

interface ApprovalConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'approve' | 'reject';
  approvalType: string;
  requesterName?: string;
  onConfirm: () => void;
}

const ApprovalConfirmationModal = ({ 
  open, 
  onOpenChange, 
  action, 
  approvalType, 
  requesterName, 
  onConfirm 
}: ApprovalConfirmationModalProps) => {
  const isApprove = action === 'approve';
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project_creation': return 'Project Creation';
      case 'assignment': return 'Task Assignment';
      case 'team_assignment': return 'Team Assignment';
      default: return type;
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center space-x-2 ${isApprove ? 'text-green-600' : 'text-red-600'}`}>
            {isApprove ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
            <span>{isApprove ? 'Approve' : 'Reject'} Request</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to <strong>{action}</strong> this {getTypeLabel(approvalType).toLowerCase()} request
              {requesterName && <span> from <strong>{requesterName}</strong></span>}?
            </p>
            <p className="text-sm text-gray-600">
              {isApprove 
                ? 'This will grant the requested permissions and allow the action to proceed.'
                : 'This will deny the request and the requester will be notified.'
              }
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={isApprove 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-red-600 hover:bg-red-700'
            }
          >
            {isApprove ? 'Approve' : 'Reject'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ApprovalConfirmationModal;
