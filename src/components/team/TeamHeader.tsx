
import React from 'react';

interface TeamHeaderProps {
  filteredUsersCount: number;
  searchQuery: string;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ 
  filteredUsersCount, 
  searchQuery 
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-600">
          Manage your team and their roles
          {searchQuery && (
            <span className="ml-2 text-sm text-yellow-600">
              • Filtering by: "{searchQuery}" ({filteredUsersCount} members)
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
