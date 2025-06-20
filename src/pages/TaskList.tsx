
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppSelector';
import { fetchTasks, selectTasks, selectTasksLoading } from '@/store/slices/taskSlice';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, User } from 'lucide-react';

const TaskList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const isLoading = useAppSelector(selectTasksLoading);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTasks({}));
  }, [dispatch]);

  const statusColors: Record<string, string> = {
    'todo': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'on-hold': 'bg-yellow-100 text-yellow-800'
  };

  const priorityColors: Record<string, string> = {
    'low': 'bg-gray-100 text-gray-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800'
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchValue.toLowerCase()) ||
                         task.assigned_to_name?.toLowerCase().includes(searchValue.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || task.project_id?.toString() === projectFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  // Get unique projects for filter with proper type checking
  const projects = Array.from(
    new Set(
      tasks
        .filter(task => task.project_id !== null && task.project_id !== undefined && task.project_name !== null && task.project_name !== undefined)
        .map(task => {
          const project = { id: task.project_id!, name: task.project_name! };
          return `${project.id}:${project.name}`;
        })
    )
  ).map((projectStr: string) => {
    const [id, name] = projectStr.split(':');
    return { id: parseInt(id), name };
  });

  return (
    <AppLayoutNew searchValue={searchValue} onSearchChange={setSearchValue} searchPlaceholder="Search tasks...">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task List</h1>
            <p className="text-gray-600">View and manage all tasks across projects</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label>Status:</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label>Priority:</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Label>Project:</Label>
                <Select value={projectFilter} onValueChange={setProjectFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map((task) => (
                  <TableRow key={task.task_id} className="hover:bg-gray-50 cursor-pointer">
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{task.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-xs">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{task.project_name || 'No Project'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{task.assigned_to_name || 'Unassigned'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[task.status]}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(task.due_date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/task/${task.task_id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {filteredTasks.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">
              {searchValue ? 'Try adjusting your search terms' : 'No tasks match your current filters'}
            </p>
          </div>
        )}
      </div>
    </AppLayoutNew>
  );
};

export default TaskList;
