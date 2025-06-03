
import React from 'react';
import { Users } from 'lucide-react';

interface NoResultsProps {
  searchQuery: string;
}

export const NoResults: React.FC<NoResultsProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <Users className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
      <p className="text-gray-600">
        No team members match your search for "{searchQuery}". Try adjusting your search terms.
      </p>
    </div>
  );
};
