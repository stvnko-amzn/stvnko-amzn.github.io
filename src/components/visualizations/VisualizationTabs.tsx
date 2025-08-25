import React from 'react';
import { PinnedVisualization } from '../../types';
import { X, BarChart3, Map, Clock, TrendingUp, Truck } from 'lucide-react';

interface VisualizationTabsProps {
  pinnedVisualizations: PinnedVisualization[];
  activeTabId: string | null;
  onTabSelect: (tabId: string | null) => void;
  onTabClose: (tabId: string) => void;
}

const getVisualizationIcon = (type: string) => {
  switch (type) {
    case 'network-map':
      return Map;
    case 'timeline':
      return Clock;
    case 'compliance-dashboard':
      return BarChart3;
    case 'trailer-yard':
      return Truck;
    case 'logistics-dashboard':
      return TrendingUp;
    default:
      return BarChart3;
  }
};

export const VisualizationTabs: React.FC<VisualizationTabsProps> = ({
  pinnedVisualizations,
  activeTabId,
  onTabSelect,
  onTabClose
}) => {
  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        {/* Overview Tab */}
        <button
          onClick={() => onTabSelect(null)}
          className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTabId === null
              ? 'border-blue-500 text-blue-600 bg-blue-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Overview
        </button>

        {/* Pinned Visualization Tabs */}
        {pinnedVisualizations.map((pinned) => {
          const IconComponent = getVisualizationIcon(pinned.data.type);
          const isActive = activeTabId === pinned.id;
          
          return (
            <div
              key={pinned.id}
              className={`flex-shrink-0 flex items-center border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <button
                onClick={() => onTabSelect(pinned.id)}
                className={`flex items-center space-x-2 px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="max-w-32 truncate">
                  {pinned.title}
                </span>
              </button>
              
              <button
                onClick={(e) => handleTabClose(e, pinned.id)}
                className={`p-1 rounded-full transition-colors ${
                  isActive
                    ? 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title="Close tab"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* Add visual indicator if there are many tabs */}
        {pinnedVisualizations.length > 3 && (
          <div className="flex-shrink-0 px-2 py-3 text-xs text-gray-400">
            {pinnedVisualizations.length} tabs
          </div>
        )}
      </div>
    </div>
  );
};
