import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import ProgressionBar from "@/components/ui/ProgressionBar";
import TaskApprovalActions from "@/components/ui/TaskApprovalActions";
import { highlightSearchTerm, searchInObject } from "@/utils/searchUtils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Grid, List, RefreshCw, Clock, Kanban as KanbanIcon, Calendar as GanttIcon } from 'lucide-react';
import GanttChart from '@/components/gantt/GanttChart';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTaskList, fetchTaskCount } from '@/store/slices/ticketsSlice';
import { convertTicketToDisplayFormat, getStatusColor, getPriorityColor } from '@/utils/ticketUtils';
import { TicketPagination } from '@/components/ui/TicketPagination';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import KanbanBoard from '@/components/kanban/KanbanBoard';

const TaskList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'card' | 'kanban' | 'gantt'>('card');

  const dispatch = useAppDispatch();
  const { taskList, taskCount } = useAppSelector((state) => state.tickets);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTaskList(1));
    dispatch(fetchTaskCount());
  }, [dispatch]);

  const tasks = taskList.data.map(convertTicketToDisplayFormat);

  const filteredTasks = tasks.filter(task => {
    const statusFilter = filterStatus === 'all' || task.status === filterStatus;
    const priorityFilter = filterPriority === 'all' || task.priority === filterPriority;
    const searchFilter = searchInObject(task, searchValue);

    return statusFilter && priorityFilter && searchFilter;
  });

  const handleRowClick = (taskId: string) => {
    navigate(`/ticket/${taskId}`);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchTaskList(page));
  };

  const handleRefresh = () => {
    dispatch(fetchTaskList(taskList.currentPage));
    dispatch(fetchTaskCount());
  };

  const renderHighlightedText = (text: string) => {
    return (
      <span 
        dangerouslySetInnerHTML={{ 
          __html: highlightSearchTerm(text, searchValue) 
        }}
      />
    );
  };

  // Helper function to check if current user can approve a specific step
  const canUserApprove = (ticket: any, approvalOrder: number): boolean => {
    if (!ticket.list_approval) return false;
    
    const currentUserApproval = ticket.list_approval.find((approval: any) => 
      approval.approval_order === approvalOrder && approval.approval_status === 0
    );
    
    return !!currentUserApproval;
  };

  // Get the current user's pending approval order for a ticket
  const getUserApprovalOrder = (ticket: any): number | null => {
    if (!ticket.list_approval) return null;
    
    const userApproval = ticket.list_approval.find((approval: any) => 
      approval.approval_status === 0
    );
    
    return userApproval ? userApproval.approval_order : null;
  };

  const TableView = () => (
    <Card className="border-border shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 border-b border-border">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Ticket ID</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Type</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Requester</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Department</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Priority</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Progress</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow 
                  key={task.id}
                  className="hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(task.id)}
                >
                  <TableCell className="font-medium text-primary">
                    {renderHighlightedText(task.id)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {renderHighlightedText(task.type)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {renderHighlightedText(task.requester)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {renderHighlightedText(task.department)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(task.priority)} border`}>
                      {renderHighlightedText(task.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ProgressionBar steps={task.approvalSteps} />
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(task.status)} border`}>
                      {renderHighlightedText(task.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  const CardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredTasks.map((task) => {
        const originalTicket = taskList.data.find(t => t.ticket_id.toString() === task.id);
        const userApprovalOrder = getUserApprovalOrder(originalTicket);
        const canApprove = userApprovalOrder !== null;
        
        return (
          <div key={task.id} className="space-y-4">
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle 
                    className="text-lg font-medium text-primary cursor-pointer hover:underline"
                    onClick={() => handleRowClick(task.id)}
                  >
                    {renderHighlightedText(task.id)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {canApprove && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <Clock className="w-3 h-3 mr-1" />
                        Action Required
                      </Badge>
                    )}
                    <Badge className={`${getPriorityColor(task.priority)} border text-xs`}>
                      {renderHighlightedText(task.priority)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {renderHighlightedText(task.type)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Requester: {renderHighlightedText(task.requester)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Department: {renderHighlightedText(task.department)}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Approval Progress</p>
                  <ProgressionBar steps={task.approvalSteps} showDetails={true} />
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`${getStatusColor(task.status)} border text-xs`}>
                    {renderHighlightedText(task.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(originalTicket?.creation_date || '').toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {canApprove && userApprovalOrder && (
              <TaskApprovalActions
                ticketId={task.id}
                approvalOrder={userApprovalOrder}
                canApprove={canApprove}
                currentStatus={0}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  if (taskList.isLoading && taskList.data.length === 0) {
    return (
      <AppLayout searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search tasks...">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search tasks...">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={taskList.isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${taskList.isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
              {taskList.totalData} Tasks
            </Badge>
            {taskCount > 0 && (
              <Badge variant="destructive" className="px-3 py-1">
                {taskCount} Pending Actions
              </Badge>
            )}
          </div>
        </div>

        {/* Error display */}
        {taskList.error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-600">{taskList.error}</p>
            </CardContent>
          </Card>
        )}

        {/* Filters and View Toggle */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status-filter" className="text-muted-foreground">Status:</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="priority-filter" className="text-muted-foreground">Priority:</Label>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-40 border-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="px-3"
                >
                  <List className="w-4 h-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                  className="px-3"
                >
                  <Grid className="w-4 h-4 mr-1" />
                  Cards
                </Button>
                <Button
                  variant={viewMode === 'kanban' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('kanban')}
                  className="px-3"
                >
                  <KanbanIcon className="w-4 h-4 mr-1" />
                  Kanban
                </Button>
                <Button
                  variant={viewMode === 'gantt' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('gantt')}
                  className="px-3"
                >
                  <GanttIcon className="w-4 h-4 mr-1" />
                  Gantt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === 'gantt' ? (
          <GanttChart />
        ) : viewMode === 'kanban' ? (
          <KanbanBoard />
        ) : viewMode === 'table' ? (
          <TableView />
        ) : (
          <CardView />
        )}

        {/* Pagination - only show for table and card views */}
        {(viewMode === 'table' || viewMode === 'card') && taskList.totalPage > 1 && (
          <TicketPagination
            currentPage={taskList.currentPage}
            totalPages={taskList.totalPage}
            totalItems={taskList.totalData}
            onPageChange={handlePageChange}
          />
        )}

        {filteredTasks.length === 0 && !taskList.isLoading && viewMode !== 'kanban' && (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No tasks found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default TaskList;
