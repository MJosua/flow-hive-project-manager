
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { useSearch } from '@/contexts/SearchContext';
import { Layout } from '@/components/layout/Layout';
import { TeamHeader } from '@/components/team/TeamHeader';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { NoResults } from '@/components/team/NoResults';

const Team = () => {
  const { users } = useApp();
  const { searchQuery, highlightText } = useSearch();

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

  return (
    <Layout>
      <TeamHeader filteredUsersCount={filteredUsers.length} searchQuery={searchQuery} />

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <TeamMemberCard
            key={user.id}
            user={user}
            highlightText={highlightText}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredUsers.length === 0 && searchQuery && (
        <NoResults searchQuery={searchQuery} />
      )}
    </Layout>
  );
};

export default Team;
