import React from 'react';
import { Trailer } from '../../types';
import { Truck, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface TrailerYardViewProps {
  trailers: Trailer[];
  title: string;
  description?: string;
}

export const TrailerYardView: React.FC<TrailerYardViewProps> = ({ 
  trailers, 
  title, 
  description 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'arrived':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'delayed':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'en-route':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Truck className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived': return 'border-green-500 bg-green-50';
      case 'delayed': return 'border-red-500 bg-red-50';
      case 'en-route': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDwellTime = (eta: Date) => {
    const now = new Date();
    const diffHours = Math.abs(now.getTime() - eta.getTime()) / (1000 * 60 * 60);
    return Math.round(diffHours);
  };

  // Group trailers by status for better organization
  const arrivedTrailers = trailers.filter(t => t.status === 'arrived');
  const enRouteTrailers = trailers.filter(t => t.status === 'en-route');
  const delayedTrailers = trailers.filter(t => t.status === 'delayed');

  return (
    <div className="visualization-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Yard Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <Truck className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-900">{trailers.length}</div>
              <div className="text-sm text-blue-600">Total Trailers</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-900">{arrivedTrailers.length}</div>
              <div className="text-sm text-green-600">Arrived</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-yellow-900">{enRouteTrailers.length}</div>
              <div className="text-sm text-yellow-600">En Route</div>
            </div>
          </div>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <div className="text-2xl font-bold text-red-900">{delayedTrailers.length}</div>
              <div className="text-sm text-red-600">Delayed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Grid */}
      <div className="space-y-6">
        {/* Arrived Trailers */}
        {arrivedTrailers.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Arrived Trailers ({arrivedTrailers.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {arrivedTrailers.map((trailer) => (
                <div key={trailer.id} className={`border-2 rounded-lg p-4 ${getStatusColor(trailer.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getStatusIcon(trailer.status)}
                      <span className="ml-2 font-semibold text-gray-900">{trailer.id}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(trailer.priority)}`}>
                      {trailer.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Carrier:</span>
                      <span className="ml-2 text-gray-600">{trailer.carrier}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contents:</span>
                      <span className="ml-2 text-gray-600">{trailer.contents.length} ASINs</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Dwell Time:</span>
                      <span className="ml-2 text-gray-600">{getDwellTime(trailer.eta)}h</span>
                    </div>
                  </div>
                  
                  {/* High priority items indicator */}
                  {trailer.contents.some(c => c.priority === 'high') && (
                    <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
                      <span className="text-orange-800 font-medium">
                        ⚡ Contains high-priority items
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* En Route Trailers */}
        {enRouteTrailers.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              En Route Trailers ({enRouteTrailers.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {enRouteTrailers.map((trailer) => (
                <div key={trailer.id} className={`border-2 rounded-lg p-4 ${getStatusColor(trailer.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getStatusIcon(trailer.status)}
                      <span className="ml-2 font-semibold text-gray-900">{trailer.id}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(trailer.priority)}`}>
                      {trailer.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Carrier:</span>
                      <span className="ml-2 text-gray-600">{trailer.carrier}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">ETA:</span>
                      <span className="ml-2 text-gray-600">
                        {trailer.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contents:</span>
                      <span className="ml-2 text-gray-600">{trailer.contents.length} ASINs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delayed Trailers */}
        {delayedTrailers.length > 0 && (
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              Delayed Trailers ({delayedTrailers.length})
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {delayedTrailers.map((trailer) => (
                <div key={trailer.id} className={`border-2 rounded-lg p-4 ${getStatusColor(trailer.status)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getStatusIcon(trailer.status)}
                      <span className="ml-2 font-semibold text-gray-900">{trailer.id}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(trailer.priority)}`}>
                      {trailer.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Carrier:</span>
                      <span className="ml-2 text-gray-600">{trailer.carrier}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Delayed ETA:</span>
                      <span className="ml-2 text-red-600">
                        {trailer.eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Contents:</span>
                      <span className="ml-2 text-gray-600">{trailer.contents.length} ASINs</span>
                    </div>
                  </div>
                  
                  {trailer.delayReason && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs">
                      <span className="text-red-800 font-medium">Reason:</span>
                      <span className="ml-1 text-red-700">{trailer.delayReason}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
