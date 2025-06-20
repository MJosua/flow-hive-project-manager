
import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, User, Calendar, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/components/layout/AppLayout";
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { 
  fetchMyTasks, 
  selectMyTasks, 
  selectTasksLoading, 
  selectTasksError,
  useFallbackTaskData,
  updateTaskStatus
} from '@/store/slices/taskSlice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Status color mapping
const statusColors: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'done': 'bg-green-100 text-green-800',
  'blocked': 'bg-red-100 text-red-800',
};

// Priority color mapping
const priorityColors: Record<string, string> = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-orange-100 text-orange-800',
  'critical': 'bg-red-100 text-red-800',
};

const MyTasks = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const dispatch = useAppDispatch();
  const myTasks = useAppSelector(selectMyTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);

  useEffect(() => {
    // Try to fetch real data, fallback to dummy data if API fails
    dispatch(fetchMyTasks());
    
    // Initialize with fallback data immediately if no tasks
    if (myTasks.length === 0) {
      dispatch(useFallbackTaskData());
    }
  }, [dispatch]);

  // Filter tasks based on search and active tab
  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = 
      task.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.project_name?.toLowerCase().includes(searchValue.toLowerCase());

    const matchesTab = activeTab === 'all' || task.status === activeTab;

    return matchesSearch && matchesTab;
  });

  // Group tasks by status for stats
  const todoTasks = myTasks.filter(t => t.status === 'todo');
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress');
  const reviewTasks = myTasks.filter(t => t.status === 'review');
  const doneTasks = myTasks.filter(t => t.status === 'done');
  const overdueTasks = myTasks.filter(t => 
    new Date(t.due_date) < new Date() && t.status !== 'done'
  );

  const handleStatusChange = async (taskId: number, newStatus: any) => {
    try {
      await dispatch(updateTaskStatus({ taskId, status: newStatus }));
      toast({
        title: "Success",
        description: "Task status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <User className="w-4 h-4" />;
      case 'review': return <AlertCircle className="w-4 h-4" />;
      case 'done': return <CheckSquare className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    return <Flag className={`w-4 h-4 ${
      priority === 'critical' ? 'text-red-600' :
      priority === 'high' ? 'text-orange-600' :
      priority === 'medium' ? 'text-blue-600' : 'text-gray-600'
    }`} />;
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== 'done';
  };

  return (
    <AppLayout searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search tasks...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-gray-600">Track and manage your assigned tasks</p>
          </div>
          <Button onClick={() => navigate('/project/create')}>
            Request New Project
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">To Do</p>
                  <p className="text-2xl font-bold">{todoTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Review</p>
                  <p className="text-2xl font-bold">{reviewTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Done</p>
                  <p className="text-2xl font-bold">{doneTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold">{overdueTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All ({myTasks.length})</TabsTrigger>
                <TabsTrigger value="todo">To Do ({todoTasks.length})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({inProgressTasks.length})</TabsTrigger>
                <TabsTrigger value="review">Review ({reviewTasks.length})</TabsTrigger>
                <TabsTrigger value="done">Done ({doneTasks.length})</TabsTrigger>
                <TabsTrigger value="blocked">Blocked</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow 
                        key={task.task_id} 
                        className={`cursor-pointer hover:bg-gray-50 ${isOverdue(task.due_date, task.status) ? 'bg-red-50' : ''}`}
                        onClick={() => navigate(`/task/${task.task_id}`)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{task.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-1">{task.description}</div>
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {task.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{task.project_name}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[task.status]}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(task.status)}
                              <span>{task.status.replace('-', ' ')}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={priorityColors[task.priority]}>
                            <div className="flex items-center space-x-1">
                              {getPriorityIcon(task.priority)}
                              <span>{task.priority}</span>
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center space-x-1 ${isOverdue(task.due_date, task.status) ? 'text-red-600 font-medium' : ''}`}>
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                            {isOverdue(task.due_date, task.status) && (
                              <Badge variant="destructive" className="ml-2">Overdue</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {task.actual_hours ? `${task.actual_hours}h` : '0h'} / {task.estimated_hours}h
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {task.status !== 'done' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const nextStatus = 
                                    task.status === 'todo' ? 'in-progress' :
                                    task.status === 'in-progress' ? 'review' :
                                    task.status === 'review' ? 'done' : task.status;
                                  handleStatusChange(task.task_id, nextStatus);
                                }}
                              >
                                {task.status === 'todo' ? 'Start' :
                                 task.status === 'in-progress' ? 'Review' :
                                 task.status === 'review' ? 'Done' : 'Update'}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredTasks.length === 0 && (
                  <div className="text-center py-8">
                    <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                    <p className="text-gray-600">
                      {activeTab === 'all' ? 'You have no assigned tasks' : `No tasks in ${activeTab.replace('-', ' ')} status`}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MyTasks;
