
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Folder,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';

const Dashboard = () => {
  const { projects, tasks, users, notifications } = useApp();
  const { searchQuery, highlightText } = useSearch();

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const pendingApprovals = notifications.filter(n => !n.read && n.type === 'warning').length;

  // Apply search filtering
  const filteredProjects = searchQuery.trim() 
    ? projects.filter(project => {
        const searchLower = searchQuery.toLowerCase();
        const manager = users.find(u => u.id === project.managerId);
        
        return project.name.toLowerCase().includes(searchLower) ||
               project.description.toLowerCase().includes(searchLower) ||
               project.status.toLowerCase().includes(searchLower) ||
               project.priority.toLowerCase().includes(searchLower) ||
               project.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               (manager && manager.name.toLowerCase().includes(searchLower));
      })
    : projects;

  const filteredTasks = searchQuery.trim()
    ? tasks.filter(task => {
        const assignee = users.find(u => u.id === task.assigneeId);
        const searchLower = searchQuery.toLowerCase();
        
        return task.title.toLowerCase().includes(searchLower) ||
               task.description.toLowerCase().includes(searchLower) ||
               task.status.toLowerCase().includes(searchLower) ||
               task.priority.toLowerCase().includes(searchLower) ||
               task.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
               (assignee && assignee.name.toLowerCase().includes(searchLower));
      })
    : tasks;

  const recentProjects = filteredProjects.slice(0, 5);
  const recentTasks = filteredTasks.slice(0, 8);

  return (
    <Layout>
      {/* Search indicator */}
      {searchQuery && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            Showing results for: "<span className="font-medium">{searchQuery}</span>"
            {" "}({filteredProjects.length} projects, {filteredTasks.length} tasks)
          </p>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="space-y-6">
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
              <span>Recent Projects {searchQuery && `(${recentProjects.length})`}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {highlightText(project.name, searchQuery)}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge 
                      variant={project.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {highlightText(project.status, searchQuery)}
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
            {recentProjects.length === 0 && searchQuery && (
              <p className="text-center text-gray-500 py-4">No projects found matching "{searchQuery}"</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Recent Tasks {searchQuery && `(${recentTasks.length})`}</span>
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
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {highlightText(task.title, searchQuery)}
                    </p>
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
            {recentTasks.length === 0 && searchQuery && (
              <p className="text-center text-gray-500 py-4">No tasks found matching "{searchQuery}"</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
