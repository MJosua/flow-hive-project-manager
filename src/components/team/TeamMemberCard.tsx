
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Phone, Mail, Calendar, TrendingUp } from 'lucide-react';
import { User } from '@/types';
import { format } from 'date-fns';

interface TeamMemberCardProps {
  user: User;
  highlightText: (text: string, query: string) => React.ReactNode;
  searchQuery: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  user, 
  highlightText, 
  searchQuery 
}) => {
  const fullName = user.name || `${user.firstname} ${user.lastname}`;
  const workload = user.workload || 0;
  
  const getStatusColor = (active: boolean) => {
    return active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white';
  };

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'text-red-500';
    if (workload >= 75) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={fullName} />
            <AvatarFallback>
              {user.firstname[0]}{user.lastname[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {highlightText(fullName, searchQuery)}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getStatusColor(user.active)}>
                {user.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span className="truncate">{highlightText(user.email, searchQuery)}</span>
          </div>
          {user.phone && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>

        {/* Department & Role */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Department:</span>
            <span className="font-medium">{user.department_id}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium">{user.role_id}</span>
          </div>
        </div>

        {/* Join Date */}
        {user.registration_date && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Joined {format(new Date(user.registration_date), 'MMM yyyy')}</span>
          </div>
        )}

        {/* Workload */}
        {workload > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Workload</span>
              </div>
              <span className={`font-medium ${getWorkloadColor(workload)}`}>
                {workload}%
              </span>
            </div>
            <Progress value={workload} className="h-2" />
          </div>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm text-gray-600">Skills:</span>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {highlightText(skill, searchQuery)}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{user.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
