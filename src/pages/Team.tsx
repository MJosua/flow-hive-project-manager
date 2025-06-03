
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, Calendar, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '@/components/layout/Layout';

const Team = () => {
  const { users, currentUser } = useApp();
  const { searchQuery, highlightText } = useSearch();
  
  const isTeamLead = currentUser.role === 'admin' || currentUser.role === 'manager';

  // Apply search filtering
  const filteredUsers = searchQuery.trim()
    ? users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               user.role.toLowerCase().includes(searchLower) ||
               user.department.toLowerCase().includes(searchLower) ||
               user.skills.some(skill => skill.toLowerCase().includes(searchLower));
      })
    : users;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'manager': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'developer': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'designer': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600">
            Manage your team and their roles
            {searchQuery && (
              <span className="ml-2 text-sm text-yellow-600">
                • Filtering by: "{searchQuery}" ({filteredUsers.length} members)
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}
                    title={user.status}
                  />
                </div>
                
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {highlightText(user.name, searchQuery)}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getRoleColor(user.role)}>
                      {highlightText(user.role, searchQuery)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{highlightText(user.email, searchQuery)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{highlightText(user.department, searchQuery)}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(user.joinDate, 'MMM yyyy')}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {highlightText(skill, searchQuery)}
                    </Badge>
                  ))}
                  {user.skills.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.skills.length - 4}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Workload */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Workload</span>
                  <span className="font-medium">{user.workload}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      user.workload > 90 ? 'bg-red-500' :
                      user.workload > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${user.workload}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No results message */}
      {filteredUsers.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600">
            No team members match your search for "{searchQuery}". Try adjusting your search terms.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Team;
