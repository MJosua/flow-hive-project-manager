import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Layout } from '@/components/layout/Layout';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { NoResults } from '@/components/team/NoResults';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Team = () => {
  const { users, isLoading, error } = useApp();
  const { searchQuery, highlightText } = useSearch();

  // Apply search filtering
  const filteredUsers = searchQuery.trim()
    ? users.filter(user => {
        const searchLower = searchQuery.toLowerCase();
        
        return user.name.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               (user.firstname + ' ' + user.lastname).toLowerCase().includes(searchLower) ||
               user.skills?.some(skill => skill.toLowerCase().includes(searchLower));
      })
    : users;

  if (error) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load team members: {error}
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <TeamHeader filteredUsersCount={filteredUsers.length} searchQuery={searchQuery} />

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Team Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <TeamMemberCard
              key={user.user_id}
              user={user}
              highlightText={highlightText}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      {/* No results message */}
      {!isLoading && filteredUsers.length === 0 && searchQuery && (
        <NoResults searchQuery={searchQuery} />
      )}

      {/* No users at all */}
      {!isLoading && users.length === 0 && !searchQuery && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600">
            There are no team members in the system yet.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Team;
