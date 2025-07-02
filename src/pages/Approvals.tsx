import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { StatusBadge } from '@/components/ui/status-badge';
import { PriorityBadge } from '@/components/ui/priority-badge';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalRequest {
  id: number;
  type: 'task' | 'project' | 'expense' | 'timeoff';
  title: string;
  description: string;
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  amount?: number;
  dueDate?: string;
  category: string;
}

const Approvals = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  // Mock approval requests
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([
    {
      id: 1,
      type: 'project',
      title: 'Website Redesign Phase 2',
      description: 'Requesting approval for the second phase of website redesign including mobile optimization',
      requestedBy: 'John Smith',
      requestedDate: '2024-01-15',
      status: 'pending',
      priority: 'high',
      amount: 25000,
      dueDate: '2024-03-01',
      category: 'Development'
    },
    {
      id: 2,
      type: 'task',
      title: 'Database Migration',
      description: 'Approval needed for migrating user data to new database system',
      requestedBy: 'Jane Doe',
      requestedDate: '2024-01-14',
      status: 'pending',
      priority: 'critical',
      dueDate: '2024-02-15',
      category: 'Infrastructure'
    },
    {
      id: 3,
      type: 'expense',
      title: 'Software License Renewal',
      description: 'Annual renewal for design software licenses',
      requestedBy: 'Mike Johnson',
      requestedDate: '2024-01-13',
      status: 'approved',
      priority: 'medium',
      amount: 5000,
      category: 'Software'
    },
    {
      id: 4,
      type: 'timeoff',
      title: 'Vacation Request - March',
      description: 'Requesting 5 days off for family vacation',
      requestedBy: 'Sarah Wilson',
      requestedDate: '2024-01-12',
      status: 'pending',
      priority: 'low',
      category: 'Personal'
    }
  ]);

  const handleApproval = (id: number, action: 'approve' | 'reject') => {
    setApprovals(prev => prev.map(approval => 
      approval.id === id 
        ? { ...approval, status: action === 'approve' ? 'approved' : 'rejected' }
        : approval
    ));
    
    toast({
      title: `Request ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `The approval request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
    });
  };

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                         approval.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                         approval.requestedBy.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || approval.status === statusFilter;
    const matchesType = typeFilter === 'all' || approval.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FileText className="w-4 h-4" />;
      case 'task':
        return <CheckCircle className="w-4 h-4" />;
      case 'expense':
        return <User className="w-4 h-4" />;
      case 'timeoff':
        return <Calendar className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const pendingCount = approvals.filter(a => a.status === 'pending').length;
  const approvedCount = approvals.filter(a => a.status === 'approved').length;
  const rejectedCount = approvals.filter(a => a.status === 'rejected').length;

  return (
    <AppLayoutNew searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search approval requests...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Approval Center</h1>
            <p className="text-muted-foreground mt-2">Review and manage approval requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <p className="text-3xl font-bold text-foreground">{approvedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <p className="text-3xl font-bold text-foreground">{rejectedCount}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold text-foreground">{approvals.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Status:</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Type:</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="timeoff">Time Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Requests Table */}
        <Card className="shadow-professional">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Request</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow key={approval.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(approval.type)}
                        <span className="capitalize font-medium">{approval.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-semibold text-foreground">{approval.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{approval.description}</p>
                        {approval.amount && (
                          <p className="text-sm font-medium text-primary">${approval.amount.toLocaleString()}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{approval.requestedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={approval.priority} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(approval.requestedDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={approval.status} />
                    </TableCell>
                    <TableCell>
                      {approval.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleApproval(approval.id, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleApproval(approval.id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredApprovals.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No approval requests found</h3>
            <p className="text-muted-foreground">
              {searchValue ? 'Try adjusting your search terms' : 'No requests match your current filters'}
            </p>
          </div>
        )}
      </div>
    </AppLayoutNew>
  );
};

export default Approvals;