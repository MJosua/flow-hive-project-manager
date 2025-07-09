
import React, { useState, useEffect } from 'react';
import { Building, Users, Crown, Plus, Settings, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { ProjectJoinModal } from '@/components/projects/ProjectJoinModal';
import { useAppSelector } from '@/hooks/useAppSelector';
import { apiService } from '@/services/apiService';
import type { Department, Team, User } from '@/types/organizationTypes';

const Department = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [department, setDepartment] = useState<Department | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.department_id) {
      fetchDepartmentInfo();
    }
  }, [user]);

  const fetchDepartmentInfo = async () => {
    if (!user?.department_id) return;
    
    setIsLoading(true);
    try {
      const [deptResponse, teamsResponse, membersResponse] = await Promise.all([
        apiService.getDepartmentDetail(user.department_id.toString()),
        apiService.getTeams({ department_id: user.department_id }),
        apiService.getUsersbyDepartment({}, user.department_id);
      ]);

      setDepartment(deptResponse.data);
      setTeams(teamsResponse.data || []);
      console.log("membersResponse.data.packet",membersResponse)
      setMembers(membersResponse || []);
    } catch (error) {
      console.error('Error fetching department info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayoutNew>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading department information...</div>
        </div>
      </AppLayoutNew>
    );
  }

  if (!department) {
    return (
      <AppLayoutNew>
        <div className="text-center py-12">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Department not found</h3>
          <p className="text-gray-600">Unable to load department information</p>
        </div>
      </AppLayoutNew>
    );
  }

  const isLeader = department.department_head === user?.user_id;

  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-6 h-6" />
              {department.department_name}
              {isLeader && <Crown className="w-5 h-5 text-yellow-500" />}
            </h1>
            <p className="text-gray-600">{department.description}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsJoinModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Join Projects
            </Button>
            {isLeader && (
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            )}
          </div>
        </div>

        {/* Department Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Teams</p>
                  <p className="text-2xl font-bold">{teams.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Department Head</p>
                  <p className="text-lg font-semibold">{department.head_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Department Tags</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {department.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    )) || <span className="text-sm text-muted-foreground">No tags</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="teams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="teams">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <Card key={team.team_id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold">{team.team_name}</h3>
                        <Badge variant="outline">{team.member_count} members</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {team.description || 'No description'}
                      </p>
                      
                      {team.team_leader_name && (
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium">{team.team_leader_name}</span>
                        </div>
                      )}

                      {team.tags && team.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {team.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.user_id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">
                          {member.firstname} {member.lastname}
                        </h3>
                        {member.user_id === department.department_head && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{member.job_title}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{member.role_name}</Badge>
                        {member.team_name && (
                          <Badge variant="secondary">{member.team_name}</Badge>
                        )}
                      </div>

                      {member.tags && member.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {member.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ProjectJoinModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        departmentId={department.department_id}
      />
    </AppLayoutNew>
  );
};

export default Department;
