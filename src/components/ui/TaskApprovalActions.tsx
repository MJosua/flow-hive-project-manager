
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, X, MessageSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { approveTicket, rejectTicket, fetchTaskList } from '@/store/slices/ticketsSlice';
import { toast } from '@/hooks/use-toast';

interface TaskApprovalActionsProps {
  ticketId: string;
  approvalOrder: number;
  canApprove: boolean;
  currentStatus: number;
  currentUserId?: number;
  assignedToId?: number;
}

const TaskApprovalActions: React.FC<TaskApprovalActionsProps> = ({
  ticketId,
  approvalOrder,
  canApprove,
  currentStatus,
  currentUserId,
  assignedToId
}) => {
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector(state => state.tickets);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [rejectionRemark, setRejectionRemark] = useState('');
  const [showRejectBox, setShowRejectBox] = useState(false);

  // Check if current user can approve this ticket
  const userCanApprove = canApprove && 
                        currentStatus === 0 && 
                        currentUserId && 
                        assignedToId && 
                        currentUserId === assignedToId;

  if (!userCanApprove) {
    return null;
  }

  const handleApprove = async () => {
    try {
      await dispatch(approveTicket({
        ticketId,
        approvalOrder,
        comment: comment.trim()
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Ticket approved successfully",
      });
      
      // Refresh the task list
      dispatch(fetchTaskList(1));
      setComment('');
      setShowCommentBox(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error as string || "Failed to approve ticket",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!rejectionRemark.trim()) {
      toast({
        title: "Error",
        description: "Rejection reason is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await dispatch(rejectTicket({
        ticketId,
        approvalOrder,
        rejectionRemark: rejectionRemark.trim()
      })).unwrap();
      
      toast({
        title: "Success",
        description: "Ticket rejected successfully",
      });
      
      // Refresh the task list
      dispatch(fetchTaskList(1));
      setRejectionRemark('');
      setShowRejectBox(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error as string || "Failed to reject ticket",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-orange-800">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Action Required</span>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCommentBox(!showCommentBox)}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            
            <Button
              onClick={() => setShowRejectBox(!showRejectBox)}
              disabled={isSubmitting}
              variant="destructive"
            >
              <X className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>

          {showCommentBox && (
            <div className="space-y-2">
              <Label htmlFor="approval-comment">Approval Comment (Optional)</Label>
              <Textarea
                id="approval-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment for this approval..."
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Confirm Approval
                </Button>
                <Button
                  onClick={() => setShowCommentBox(false)}
                  disabled={isSubmitting}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {showRejectBox && (
            <div className="space-y-2">
              <Label htmlFor="rejection-remark">Rejection Reason *</Label>
              <Textarea
                id="rejection-remark"
                value={rejectionRemark}
                onChange={(e) => setRejectionRemark(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                rows={3}
                required
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={isSubmitting || !rejectionRemark.trim()}
                  size="sm"
                  variant="destructive"
                >
                  Confirm Rejection
                </Button>
                <Button
                  onClick={() => setShowRejectBox(false)}
                  disabled={isSubmitting}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskApprovalActions;
