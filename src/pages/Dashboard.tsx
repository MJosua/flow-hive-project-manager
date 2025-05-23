
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  folder as Folder,
  users as Users,
  calendar as Calendar,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { projects, tasks, users, notifications } = useApp();

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const pendingApprovals = notifications.filter(n => !n.read && n.type === 'warning').length;

  const recentProjects = projects.slice(0, 5);
  const recentTasks = tasks.slice(0, 8);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          change="+12% from last month"
          changeType="positive"
          icon={Folder}
          color="#10B981"
        />
        <MetricCard
          title="Team Members"
          value={users.length}
          change="2 new this week"
          changeType="positive"
          icon={Users}
          color="#F59E0B"
        />
        <MetricCard
          title="Completed Tasks"
          value={`${completedTasks}/${totalTasks}`}
          change={`${Math.round((completedTasks / totalTasks) * 100)}% completion rate`}
          changeType="positive"
          icon={CheckCircle}
          color="#8B5CF6"
        />
        <MetricCard
          title="Pending Approvals"
          value={pendingApprovals}
          change="Requires attention"
          changeType={pendingApprovals > 0 ? "negative" : "neutral"}
          icon={Calendar}
          color="#EF4444"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Folder className="h-5 w-5" />
              <span>Recent Projects</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {project.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Due: {project.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <Progress value={project.progress} className="mt-2 h-2" />
                </div>
                <div className="ml-4 text-right">
                  <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                  <p className="text-xs text-gray-500">{project.teamMembers.length} members</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Recent Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTasks.map((task) => {
              const assignee = users.find(u => u.id === task.assigneeId);
              return (
                <div key={task.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    task.status === 'done' ? 'bg-green-500' :
                    task.status === 'in-progress' ? 'bg-yellow-500' :
                    task.status === 'review' ? 'bg-purple-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.projectId}</p>
                  </div>
                  {assignee && (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={assignee.avatar} alt={assignee.name} />
                      <AvatarFallback className="text-xs">
                        {assignee.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
