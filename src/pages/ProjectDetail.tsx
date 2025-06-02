import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  CheckCircle,
  Clock,
  AlertCircle,
  Circle
} from 'lucide-react';
import { format } from 'date-fns';

// Import all modal components
import AddTaskModal from '@/components/modals/AddTaskModal';
import AddMemberModal from '@/components/modals/AddMemberModal';
import EditProjectModal from '@/components/modals/EditProjectModal';
import BudgetSettingsModal from '@/components/modals/BudgetSettingsModal';
import ManageCategoriesModal from '@/components/modals/ManageCategoriesModal';
import TimelineSettingsModal from '@/components/modals/TimelineSettingsModal';
import DeleteProjectModal from '@/components/modals/DeleteProjectModal';

// Dummy task data for now
const dummyTasks = [
  {
    id: 'task-1',
    title: 'Design Homepage Layout',
    description: 'Create wireframes and mockups for the homepage',
    status: 'in-progress',
    priority: 'high',
    assigneeId: '3',
    dueDate: new Date(2024, 11, 15),
    category: 'Design'
  },
  {
    id: 'task-2',
    title: 'Setup Database Schema',
    description: 'Initialize database and create necessary tables',
    status: 'done',
    priority: 'high',
    assigneeId: '2',
    dueDate: new Date(2024, 11, 10),
    category: 'Backend'
  },
  {
    id: 'task-3',
    title: 'User Authentication',
    description: 'Implement login and registration functionality',
    status: 'todo',
    priority: 'medium',
    assigneeId: '3',
    dueDate: new Date(2024, 11, 20),
    category: 'Frontend'
  },
  {
    id: 'task-4',
    title: 'Payment Integration',
    description: 'Integrate Stripe payment gateway',
    status: 'review',
    priority: 'critical',
    assigneeId: '2',
    dueDate: new Date(2024, 11, 25),
    category: 'Backend'
  }
];

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, users } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [modals, setModals] = useState({
    addTask: false,
    addMember: false,
    editProject: false,
    budgetSettings: false,
    manageCategories: false,
    timelineSettings: false,
    deleteProject: false
  });

  const openModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName: keyof typeof modals) => {
    setModals({ ...modals, [modalName]: false });
  };

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <Button onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
      </div>
    );
  }

  const manager = users.find(u => u.id === project.managerId);
  const teamMembers = users.filter(u => project.teamMembers.includes(u.id));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'review': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${project.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
            {project.status.replace('-', ' ')}
          </Badge>
          <Badge variant="outline">{project.priority}</Badge>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold">{project.progress}%</p>
              </div>
              <Progress value={project.progress} className="w-16" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-2xl font-bold">${project.budget.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Date</p>
                <p className="text-lg font-bold">{format(project.endDate, 'MMM dd')}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{format(project.startDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{format(project.endDate, 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">90 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Task "Setup Database Schema" completed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">New team member added</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Budget updated</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={() => openModal('addTask')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="grid gap-4">
            {dummyTasks.map((task) => {
              const assignee = users.find(u => u.id === task.assigneeId);
              return (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-semibold">{task.title}</h3>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {assignee && (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignee.avatar} alt={assignee.name} />
                                  <AvatarFallback className="text-xs">
                                    {assignee.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600">{assignee.name}</span>
                              </div>
                            )}
                            <Badge variant="secondary">{task.category}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            <span>Due {format(task.dueDate, 'MMM dd')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Team Members</h2>
            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
              onClick={() => openModal('addMember')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="grid gap-4">
            {manager && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={manager.avatar} alt={manager.name} />
                        <AvatarFallback>
                          {manager.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{manager.name}</h3>
                        <p className="text-gray-600">{manager.email}</p>
                        <Badge className="bg-purple-100 text-purple-800">Project Manager</Badge>
                      </div>
                    </div>
                    <Badge variant="outline">{manager.department}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-gray-600">{member.email}</p>
                        <Badge variant="outline">{member.role}</Badge>
                      </div>
                    </div>
                    <Badge variant="outline">{member.department}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline"
                  onClick={() => openModal('editProject')}
                >
                  Edit Project Details
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openModal('manageCategories')}
                >
                  Manage Categories
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openModal('budgetSettings')}
                >
                  Budget Settings
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => openModal('timelineSettings')}
                >
                  Timeline Settings
                </Button>
              </div>
              <div className="pt-4 border-t">
                <Button 
                  variant="destructive"
                  onClick={() => openModal('deleteProject')}
                >
                  Delete Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* All Modal Components */}
      <AddTaskModal
        open={modals.addTask}
        onOpenChange={(open) => setModals({ ...modals, addTask: open })}
        projectId={projectId!}
      />
      
      <AddMemberModal
        open={modals.addMember}
        onOpenChange={(open) => setModals({ ...modals, addMember: open })}
        projectId={projectId!}
      />
      
      <EditProjectModal
        open={modals.editProject}
        onOpenChange={(open) => setModals({ ...modals, editProject: open })}
        projectId={projectId!}
      />
      
      <BudgetSettingsModal
        open={modals.budgetSettings}
        onOpenChange={(open) => setModals({ ...modals, budgetSettings: open })}
        projectId={projectId!}
      />
      
      <ManageCategoriesModal
        open={modals.manageCategories}
        onOpenChange={(open) => setModals({ ...modals, manageCategories: open })}
        projectId={projectId!}
      />
      
      <TimelineSettingsModal
        open={modals.timelineSettings}
        onOpenChange={(open) => setModals({ ...modals, timelineSettings: open })}
        projectId={projectId!}
      />
      
      <DeleteProjectModal
        open={modals.deleteProject}
        onOpenChange={(open) => setModals({ ...modals, deleteProject: open })}
        projectId={projectId!}
      />
    </div>
  );
};

export default ProjectDetail;
