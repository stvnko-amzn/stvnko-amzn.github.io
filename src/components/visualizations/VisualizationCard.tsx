import React from 'react';
import { VisualizationData } from '../../types';
import { BarChart3, Map, Clock, TrendingUp, Truck, Pin, PinOff, ExternalLink } from 'lucide-react';

interface VisualizationCardProps {
  visualization: VisualizationData;
  messageId: string;
  isPinned: boolean;
  onPin: (messageId: string, visualization: VisualizationData) => void;
  onUnpin: (messageId: string) => void;
  onView: (messageId: string, visualization: VisualizationData) => void;
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

const getVisualizationTypeLabel = (type: string) => {
  switch (type) {
    case 'network-map':
      return 'Network Map';
    case 'timeline':
      return 'Timeline';
    case 'compliance-dashboard':
      return 'Compliance Dashboard';
    case 'trailer-yard':
      return 'Trailer Yard';
    case 'logistics-dashboard':
      return 'Logistics Dashboard';
    default:
      return 'Visualization';
  }
};

export const VisualizationCard: React.FC<VisualizationCardProps> = ({
  visualization,
  messageId,
  isPinned,
  onPin,
  onUnpin,
  onView
}) => {
  const IconComponent = getVisualizationIcon(visualization.type);
  const typeLabel = getVisualizationTypeLabel(visualization.type);

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPinned) {
      onUnpin(messageId);
    } else {
      onPin(messageId, visualization);
    }
  };

  const handleView = () => {
    onView(messageId, visualization);
  };

  return (
    <div 
      className="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
      onClick={handleView}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <IconComponent className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {visualization.title}
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {typeLabel}
              </span>
            </div>
            
            {visualization.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {visualization.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <ExternalLink className="w-3 h-3" />
                <span>Click to view</span>
              </div>
              
              {isPinned && (
                <div className="flex items-center space-x-1 text-xs text-blue-600">
                  <Pin className="w-3 h-3" />
                  <span>Pinned</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={handlePin}
          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
            isPinned
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
          title={isPinned ? 'Unpin visualization' : 'Pin visualization'}
        >
          {isPinned ? (
            <PinOff className="w-4 h-4" />
          ) : (
            <Pin className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
