import React from 'react';
import { UserRole } from '../../types';
import { sampleQueries } from '../../data/mockData';

interface QuerySuggestionsProps {
  userRole: UserRole;
  onSelectQuery: (query: string) => void;
}

export const QuerySuggestions: React.FC<QuerySuggestionsProps> = ({ userRole, onSelectQuery }) => {
  const suggestions = sampleQueries[userRole] || [];

  return (
    <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
      <h3 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">Quick actions</h3>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((query, index) => (
          <button
            key={index}
            onClick={() => onSelectQuery(query)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-700 hover:bg-amazon-orange hover:text-white hover:border-amazon-orange transition-all duration-200 font-medium"
          >
            {query}
          </button>
        ))}
      </div>
    </div>
  );
};
