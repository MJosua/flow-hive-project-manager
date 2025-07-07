
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  FolderOpen, 
  Clock,
  Plus,
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { useAppSelector } from '@/hooks/useAppSelector';
import { apiService } from '@/services/apiService';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import type { Project } from '@/types/projectTypes';
import type { Department, Team } from '@/types/organizationTypes';

const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [department, setDepartment] = useState<Department | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [projectsResponse, departmentResponse, teamsResponse] = await Promise.all([
        apiService.getProjects({ 
          department_id: user.department_id,
          limit: 5 
        }),
        apiService.getDepartment(user.department_id),
        apiService.getTeams({ department_id: user.department_id })
      ]);

      setProjects(projectsResponse.data || []);
      setDepartment(departmentResponse.data);
      setTeams(teamsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      title: "Active Projects",
      value: projects.filter(p => p.status === 'active').length,
      icon: FolderOpen,
      color: "text-blue-600"
    },
    {
      title: "Team Members",
      value: teams.reduce((acc, team) => acc + team.member_count, 0),
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Completed Tasks",
      value: "24", // This would come from API
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "This Month",
      value: new Date().toLocaleDateString('en-US', { month: 'long' }),
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  if (isLoading) {
    return (
      <AppLayoutNew>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </AppLayoutNew>
    );
  }

  return (
    <AppLayoutNew>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-gray-600">
              {department?.department_name} Department Dashboard
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Recent Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No projects yet. Create your first project!
                </div>
              ) : (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.project_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(project.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          project.status === 'active' ? 'default' : 
                          project.status === 'completed' ? 'secondary' : 'outline'
                        }>
                          {project.status}
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          {project.progress}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teams Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Teams Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teams found in your department.
                </div>
              ) : (
                <div className="space-y-3">
                  {teams.map((team) => (
                    <div key={team.team_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{team.team_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {team.team_leader_name ? `Led by ${team.team_leader_name}` : 'No leader assigned'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {team.member_count} members
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </AppLayoutNew>
  );
};

export default Dashboard;
