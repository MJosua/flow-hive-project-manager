
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, AlertTriangle, CheckCircle, Play, Pause } from 'lucide-react';
import { format } from 'date-fns';
import { TaskAssignmentDialog } from '@/components/tasks/TaskAssignmentDialog';
import { TaskStatusCard } from '@/components/tasks/TaskStatusCard';
import { Layout } from '@/components/layout/Layout';

const TaskManagement = () => {
  const { tasks, users, projects, selectedProject, setSelectedProject, currentUser } = useApp();
  const { searchQuery } = useSearch();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Add null check and default role check using role_id
  const isTeamLead = currentUser && (currentUser.role_id === 'admin' || currentUser.role_id === 'manager');

  // Filter tasks based on selected project, search query, and filters
  const projectFilteredTasks = selectedProject 
    ? tasks.filter(task => task.projectId === selectedProject.id)
    : tasks;

  const searchFilteredTasks = searchQuery.trim()
    ? projectFilteredTasks.filter(task => {
        const assignee = users.find(u => u.user_id === task.assigneeId);
        const searchLower = searchQuery.toLowerCase();
        
        return task.title.toLowerCase().includes(searchLower) ||
               task.description.toLowerCase().includes(searchLower) ||
               task.status.toLowerCase().includes(searchLower) ||
               task.priority.toLowerCase().includes(searchLower) ||
               task.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               (assignee && assignee.name.toLowerCase().includes(searchLower));
      })
    : projectFilteredTasks;

  const filteredTasks = searchFilteredTasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusMatch && priorityMatch;
  });

  // Task statistics
  const taskStats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter(t => t.status === 'todo').length,
    inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
    review: filteredTasks.filter(t => t.status === 'review').length,
    done: filteredTasks.filter(t => t.status === 'done').length,
    overdue: filteredTasks.filter(t => new Date(t.endDate) < new Date() && t.status !== 'done').length,
    critical: filteredTasks.filter(t => t.priority === 'critical').length
  };

  // Group tasks by status for display
  const tasksByStatus = {
    todo: filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    review: filteredTasks.filter(t => t.status === 'review'),
    done: filteredTasks.filter(t => t.status === 'done')
  };

  // Get team members for selected project
  const getProjectTeamMembers = () => {
    if (!selectedProject) return [];
    return users.filter(user => selectedProject.teamMembers.includes(user.user_id));
  };

  const teamMembers = getProjectTeamMembers();
  const teamWorkload = teamMembers.map(user => {
    const userTasks = filteredTasks.filter(task => task.assigneeId === user.user_id);
    const activeTasks = userTasks.filter(task => task.status === 'in-progress' || task.status === 'review');
    
    return {
      user,
      totalTasks: userTasks.length,
      activeTasks: activeTasks.length,
      completedTasks: userTasks.filter(task => task.status === 'done').length,
      overdueTasks: userTasks.filter(task => 
        new Date(task.endDate) < new Date() && task.status !== 'done'
      ).length
    };
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-400 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <Play className="h-4 w-4" />;
      case 'review': return <Pause className="h-4 w-4" />;
      case 'done': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">
            Organize and track project tasks
            {searchQuery && (
              <span className="ml-2 text-sm text-yellow-600">
                • Filtering by: "{searchQuery}" ({filteredTasks.length} tasks)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Select 
            value={selectedProject?.id || 'all'} 
            onValueChange={(value) => {
              const project = value === 'all' ? null : projects.find(p => p.id === value);
              setSelectedProject(project || null);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {isTeamLead && <TaskAssignmentDialog />}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{taskStats.todo}</div>
            <div className="text-sm text-gray-600">To Do</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{taskStats.review}</div>
            <div className="text-sm text-gray-600">Review</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{taskStats.done}</div>
            <div className="text-sm text-gray-600">Done</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-800">{taskStats.critical}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center space-x-4 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Priority:</label>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="kanban" className="space-y-4">
        <TabsList>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="team">Team Workload</TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(tasksByStatus).map(([status, tasks]) => (
              <TaskStatusCard
                key={status}
                status={status as any}
                tasks={tasks}
                title={status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const assignee = users.find(u => u.user_id === task.assigneeId);
              const project = projects.find(p => p.id === task.projectId);
              const isOverdue = new Date(task.endDate) < new Date() && task.status !== 'done';
              
              return (
                <Card key={task.id} className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {assignee && (
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                <AvatarFallback className="text-xs">
                                  {assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-gray-600">{assignee.name}</span>
                            </div>
                          )}
                          
                          {project && (
                            <div className="flex items-center space-x-1">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: project.color }}
                              />
                              <span className="text-gray-600">{project.name}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Due {format(task.endDate, 'MMM dd, yyyy')}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{task.actualHours}h / {task.estimatedHours}h</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">
                          {task.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid gap-4">
            {teamWorkload.map((member) => (
              <Card key={member.user.user_id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.user.avatar} alt={member.user.name} />
                        <AvatarFallback>
                          {member.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.user.name}</h3>
                        <p className="text-gray-600">{member.user.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{member.totalTasks}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">{member.activeTasks}</div>
                        <div className="text-sm text-gray-600">Active</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{member.completedTasks}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">{member.overdueTasks}</div>
                        <div className="text-sm text-gray-600">Overdue</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default TaskManagement;
