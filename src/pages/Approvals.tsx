
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import PendingApprovalCard from '@/components/approvals/PendingApprovalCard';
import ProcessedApprovalCard from '@/components/approvals/ProcessedApprovalCard';
import ApprovalConfirmationModal from '@/components/modals/ApprovalConfirmationModal';
import { Approval } from '@/types';
import { Layout } from '@/components/layout/Layout';

const Approvals = () => {
  const { approvals, users, updateApproval } = useApp();
  const { searchQuery, highlightText } = useSearch();
  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    approval: Approval | null;
  }>({
    open: false,
    action: 'approve',
    approval: null
  });

  // Apply search filtering
  const filteredApprovals = searchQuery.trim()
    ? approvals.filter(approval => {
        const requester = users.find(u => u.id === approval.requesterId);
        const searchLower = searchQuery.toLowerCase();
        
        return approval.type.toLowerCase().includes(searchLower) ||
               approval.status.toLowerCase().includes(searchLower) ||
               (approval.notes && approval.notes.toLowerCase().includes(searchLower)) ||
               (requester && requester.name.toLowerCase().includes(searchLower));
      })
    : approvals;

  const handleApprovalAction = (approvalId: string, action: 'approve' | 'reject') => {
    const approval = approvals.find(a => a.id === approvalId);
    if (approval) {
      setConfirmationModal({
        open: true,
        action,
        approval
      });
    }
  };

  const confirmApproval = () => {
    if (confirmationModal.approval) {
      const { action, approval } = confirmationModal;
      const notes = action === 'approve' ? 'Approved by admin' : 'Rejected - needs revision';
      updateApproval(approval.id, action === 'approve' ? 'approved' : 'rejected', notes);
    }
  };

  const pendingApprovals = filteredApprovals.filter(a => a.status === 'pending');
  const processedApprovals = filteredApprovals.filter(a => a.status !== 'pending');

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Approvals</h1>
          <p className="text-gray-600">
            Review and approve pending requests
            {searchQuery && (
              <span className="ml-2 text-sm text-yellow-600">
                • Filtering by: "{searchQuery}" ({filteredApprovals.length} total)
              </span>
            )}
          </p>
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
            <span>Pending Approvals {searchQuery && `(${pendingApprovals.length})`}</span>
          </h2>
          
          <div className="grid gap-4">
            {pendingApprovals.map((approval) => {
              const requester = users.find(u => u.id === approval.requesterId);
              
              return (
                <PendingApprovalCard
                  key={approval.id}
                  approval={approval}
                  requester={requester}
                  onApprove={(id) => handleApprovalAction(id, 'approve')}
                  onReject={(id) => handleApprovalAction(id, 'reject')}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Approvals */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Decisions {searchQuery && `(${processedApprovals.length})`}
        </h2>
        
        <div className="grid gap-4">
          {processedApprovals.slice(0, 10).map((approval) => {
            const requester = users.find(u => u.id === approval.requesterId);
            
            return (
              <ProcessedApprovalCard
                key={approval.id}
                approval={approval}
                requester={requester}
              />
            );
          })}
          {processedApprovals.length === 0 && searchQuery && (
            <div className="text-center text-gray-500 py-8">
              No processed approvals found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ApprovalConfirmationModal
        open={confirmationModal.open}
        onOpenChange={(open) => setConfirmationModal(prev => ({ ...prev, open }))}
        action={confirmationModal.action}
        approvalType={confirmationModal.approval?.type || ''}
        requesterName={users.find(u => u.id === confirmationModal.approval?.requesterId)?.name}
        onConfirm={confirmApproval}
      />
    </Layout>
  );
};

export default Approvals;
