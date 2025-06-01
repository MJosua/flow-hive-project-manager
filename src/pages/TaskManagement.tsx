
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TaskAssignmentDialog } from '@/components/tasks/TaskAssignmentDialog';
import { TaskStatusCard } from '@/components/tasks/TaskStatusCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';

const TaskManagement = () => {
  const { projects, tasks, users, currentUser, selectedProject, setSelectedProject } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');

  const isTeamLead = currentUser.role === 'admin' || currentUser.role === 'manager';
  
  // Filter tasks based on selected project and filters
  const filteredTasks = tasks.filter(task => {
    if (selectedProject && task.projectId !== selectedProject.id) return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) return false;
    return true;
  });

  // Get tasks assigned to current user
  const myTasks = tasks.filter(task => task.assigneeId === currentUser.id);

  // Get team tasks (if user is team lead)
  const teamTasks = isTeamLead ? filteredTasks : [];

  // Calculate statistics
  const getTaskStats = (taskList: typeof tasks) => {
    return {
      total: taskList.length,
      todo: taskList.filter(t => t.status === 'todo').length,
      inProgress: taskList.filter(t => t.status === 'in-progress').length,
      review: taskList.filter(t => t.status === 'review').length,
      done: taskList.filter(t => t.status === 'done').length,
    };
  };

  const myStats = getTaskStats(myTasks);
  const teamStats = getTaskStats(teamTasks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">
            {isTeamLead ? 'Manage team tasks and assignments' : 'View and update your assigned tasks'}
          </p>
        </div>
        
        {isTeamLead && (
          <div className="flex items-center space-x-3">
            <TaskAssignmentDialog />
          </div>
        )}
      </div>

      {/* Project Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {isTeamLead && (
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Team Members</SelectItem>
              {users.filter(u => u.status === 'active').map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs defaultValue="my-tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-tasks">My Tasks ({myTasks.length})</TabsTrigger>
          {isTeamLead && (
            <TabsTrigger value="team-tasks">Team Tasks ({teamTasks.length})</TabsTrigger>
          )}
        </TabsList>

        {/* My Tasks Tab */}
        <TabsContent value="my-tasks" className="space-y-6">
          {/* My Task Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">{myStats.total}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{myStats.todo}</div>
                <div className="text-sm text-gray-600">To Do</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{myStats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{myStats.review}</div>
                <div className="text-sm text-gray-600">Review</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{myStats.done}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* My Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTasks.map((task) => (
              <TaskStatusCard 
                key={task.id} 
                task={task} 
                isAssignedToCurrentUser={true}
              />
            ))}
          </div>

          {myTasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h3>
              <p className="text-gray-600">You don't have any tasks assigned to you yet.</p>
            </div>
          )}
        </TabsContent>

        {/* Team Tasks Tab (Team Leads Only) */}
        {isTeamLead && (
          <TabsContent value="team-tasks" className="space-y-6">
            {/* Team Task Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{teamStats.total}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{teamStats.todo}</div>
                  <div className="text-sm text-gray-600">To Do</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{teamStats.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{teamStats.review}</div>
                  <div className="text-sm text-gray-600">Review</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{teamStats.done}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
            </div>

            {/* Team Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamTasks.map((task) => (
                <TaskStatusCard 
                  key={task.id} 
                  task={task} 
                  isAssignedToCurrentUser={task.assigneeId === currentUser.id}
                />
              ))}
            </div>

            {teamTasks.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No team tasks</h3>
                <p className="text-gray-600 mb-4">
                  {selectedProject 
                    ? 'No tasks found for the selected project and filters.' 
                    : 'Start by creating and assigning tasks to your team members.'
                  }
                </p>
                <TaskAssignmentDialog />
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default TaskManagement;
