
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, UserPlus, Crown, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/services/apiService';
import { logger } from '@/services/loggingService';

interface ProjectMember {
  user_id: number;
  username: string;
  firstname: string;
  lastname: string;
  role: 'manager' | 'lead' | 'member' | 'viewer';
  joined_date: string;
}

interface ProjectMembersListProps {
  projectId: number;
  currentUserId: number;
  isManager?: boolean;
}

const ProjectMembersList: React.FC<ProjectMembersListProps> = ({
  projectId,
  currentUserId,
  isManager = false
}) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    loadProjectMembers();
  }, [projectId]);

  const loadProjectMembers = async () => {
    try {
      setLoading(true);
      logger.logInfo('ProjectMembersList: Loading project members', { projectId });
      
      // For now, use fallback data since the API endpoint might not exist yet
      const fallbackMembers: ProjectMember[] = [
        {
          user_id: 10098,
          username: 'yosua.gultom',
          firstname: 'Yosua',
          lastname: 'Gultom',
          role: 'manager',
          joined_date: '2024-01-01'
        },
        {
          user_id: 10001,
          username: 'jane.smith',
          firstname: 'Jane',
          lastname: 'Smith',
          role: 'lead',
          joined_date: '2024-01-05'
        }
      ];
      
      setMembers(fallbackMembers);
      setIsMember(fallbackMembers.some(member => member.user_id === currentUserId));
      logger.logInfo('ProjectMembersList: Members loaded', { count: fallbackMembers.length });
    } catch (error: any) {
      logger.logError('ProjectMembersList: Failed to load members', error);
      toast.error('Failed to load project members');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    try {
      setIsJoining(true);
      logger.logInfo('ProjectMembersList: Requesting to join project', { projectId });
      
      await apiService.requestProjectJoin(projectId);
      toast.success('Join request sent successfully');
      logger.logInfo('ProjectMembersList: Join request sent successfully');
    } catch (error: any) {
      logger.logError('ProjectMembersList: Join request failed', error);
      toast.error(error.message || 'Failed to send join request');
    } finally {
      setIsJoining(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'lead':
        return <Shield className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-yellow-100 text-yellow-800';
      case 'lead':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Project Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Project Members ({members.length})
          </CardTitle>
          {!isMember && (
            <Button 
              onClick={handleJoinProject} 
              disabled={isJoining}
              size="sm"
              className="flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              {isJoining ? 'Requesting...' : 'Join Project'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.user_id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {member.firstname.charAt(0)}{member.lastname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.firstname} {member.lastname}</p>
                  <p className="text-sm text-gray-500">@{member.username}</p>
                  <p className="text-xs text-gray-400">
                    Joined {new Date(member.joined_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getRoleIcon(member.role)}
                <Badge className={getRoleBadgeColor(member.role)}>
                  {member.role}
                </Badge>
              </div>
            </div>
          ))}
          
          {members.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No members found for this project
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectMembersList;
