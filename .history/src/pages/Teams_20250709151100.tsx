
import React, { useState, useEffect } from 'react';
import { Users, Crown, Plus, Tag, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLayoutNew from '@/components/layout/AppLayoutNew';
import { useAppSelector } from '@/hooks/useAppSelector';
import { apiService } from '@/services/apiService';
import type { Team, User } from '@/types/organizationTypes';

const Teams = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [teams, setTeams] = useState<Team[]>([]);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.department_id) {
      fetchTeamsInfo();
    }
  }, [user]);

  const fetchTeamsInfo = async () => {
    if (!user?.department_id) return;

    setIsLoading(true);
    try {
      const [allTeamsResponse, userTeamsResponse] = await Promise.all([
        apiService.getTeams({ department_id: user.department_id }),
        apiService.getUserTeams(user.department_id)
      ]);

      setTeams(allTeamsResponse.data || []);
      setUserTeams(userTeamsResponse.data || []);
    } catch (error) {
      console.error('Error fetching teams info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTeam = async (teamId: number) => {
    try {
      await apiService.requestTeamJoin(teamId);
      // Refresh data after join request
      fetchTeamsInfo();
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  if (isLoading) {
    return (
      <AppLayoutNew>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading teams information...</div>
        </div>
      </AppLayoutNew>
    );
  }

  const myTeams = teams.filter(team =>
    team.members?.some((member: any) => member.user_id === user.user_id)
  );

  const availableTeams = teams.filter(team =>
    !team.members?.some((member: any) => member.user_id === user.user_id)
  );
  console.log("myTeams", teams)
  return (
    <AppLayoutNew>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Teams
            </h1>
            <p className="text-gray-600">Manage your team memberships and explore available teams</p>
          </div>
        </div>

        {/* My Teams */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Teams</h2>
          {myTeams.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
                <p className="text-gray-600">You're not a member of any teams yet. Join a team below.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTeams.map((team) => (
                <Card key={team.team_id} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-blue-900">{team.team_name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          Member
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {team.description || 'No description'}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {team.member_count} members
                        </span>
                        {team.team_leader_name && (
                          <div className="flex items-center gap-1">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span>{team.team_leader_name}</span>
                          </div>
                        )}
                      </div>

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
          )}
        </div>

        {/* Available Teams */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Teams</h2>
          {availableTeams.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No available teams</h3>
                <p className="text-gray-600">All teams in your department have been joined.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTeams.map((team) => (
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
                        <div className="flex flex-wrap gap-1 mb-2">
                          {team.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <Button
                        onClick={() => handleJoinTeam(team.team_id)}
                        className="w-full"
                        size="sm"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Request to Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayoutNew>
  );
};

export default Teams;
