import React from 'react';
import { BarChart3, Map, Clock, TrendingUp, Truck } from 'lucide-react';

export const VisualizationEmptyState: React.FC = () => {
  const visualizationTypes = [
    {
      icon: Map,
      name: 'Network Map',
      description: 'View trailer locations and routes'
    },
    {
      icon: Clock,
      name: 'Shipment Timeline',
      description: 'Track shipment progress over time'
    },
    {
      icon: BarChart3,
      name: 'Compliance Dashboard',
      description: 'Monitor vendor performance metrics'
    },
    {
      icon: Truck,
      name: 'Trailer Yard View',
      description: 'Visualize yard operations and capacity'
    },
    {
      icon: TrendingUp,
      name: 'Logistics Dashboard',
      description: 'Comprehensive operational insights'
    }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <BarChart3 className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Visualizations
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        Ask ATLAS about your supply chain data to generate interactive visualizations. 
        You can pin visualizations to keep them accessible in tabs above.
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <div className="text-left">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Available Visualizations:</h4>
          <div className="space-y-3">
            {visualizationTypes.map((viz, index) => {
              const IconComponent = viz.icon;
              return (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{viz.name}</div>
                    <div className="text-xs text-gray-600">{viz.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-md">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Try asking "Show me trailer locations" or "Display vendor compliance metrics" to generate visualizations.
        </p>
      </div>
    </div>
  );
};
