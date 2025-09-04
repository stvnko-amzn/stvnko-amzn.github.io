import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertTriangle, Truck, Zap, RefreshCw } from 'lucide-react';
import { LocationTrackingData, TrackedTrailer, TrafficCondition, InteractiveAction } from '../../types';
import { QuickActionButton } from './components/QuickActionButton';
import { StatusBadge } from './components/StatusBadge';

interface RealTimeLocationProps {
  data: LocationTrackingData;
  onActionClick?: (actionId: string, data?: any) => void;
}

const RealTimeLocation: React.FC<RealTimeLocationProps> = ({
  data,
  onActionClick
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);
  const [mapView, setMapView] = useState<'overview' | 'detailed'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // In a real implementation, this would trigger data refresh
      console.log('Refreshing location data...');
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getTrafficColor = (condition: TrafficCondition['condition']) => {
    switch (condition) {
      case 'clear':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'light':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'heavy':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSpeed = (speed: number) => `${Math.round(speed)} mph`;
  const formatETA = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const quickActions: InteractiveAction[] = [
    {
      id: 'refresh-locations',
      label: 'Refresh',
      type: 'secondary',
      requiresConfirmation: false,
      icon: '🔄',
      metadata: { timestamp: new Date().toISOString() }
    },
    {
      id: 'optimize-routes',
      label: 'Optimize Routes',
      type: 'primary',
      requiresConfirmation: true,
      confirmationMessage: 'This will recalculate optimal routes for all active trailers. Continue?',
      metadata: { trailerCount: data.trailers.length }
    },
    {
      id: 'traffic-alerts',
      label: 'Traffic Alerts',
      type: 'warning',
      requiresConfirmation: false,
      metadata: { alertsEnabled: true }
    }
  ];

  const renderMapView = () => {
    // Simplified map representation
    const mapWidth = 600;
    const mapHeight = 400;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">Live Tracking Map</h4>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 text-xs rounded-md ${
                autoRefresh
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {autoRefresh ? 'Live' : 'Paused'}
            </button>
            <div className="flex gap-1">
              {['overview', 'detailed'].map((view) => (
                <button
                  key={view}
                  onClick={() => setMapView(view as any)}
                  className={`px-3 py-1 text-xs rounded-md ${
                    mapView === view
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Simplified map visualization */}
        <div 
          className="relative bg-gray-100 rounded-lg overflow-hidden"
          style={{ width: mapWidth, height: mapHeight }}
        >
          {/* Background grid */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Routes */}
          {data.routes.map((route, index) => {
            const trailer = data.trailers.find(t => t.id === route.trailerId);
            if (!trailer) return null;

            return (
              <svg key={route.trailerId} className="absolute inset-0 w-full h-full">
                <path
                  d={`M ${route.origin.lat * 5} ${route.origin.lng * 3} L ${route.destination.lat * 5} ${route.destination.lng * 3}`}
                  stroke={selectedTrailer === route.trailerId ? '#3b82f6' : '#9ca3af'}
                  strokeWidth={selectedTrailer === route.trailerId ? '3' : '2'}
                  strokeDasharray="5,5"
                  fill="none"
                />
              </svg>
            );
          })}

          {/* Trailers */}
          {data.trailers.map((trailer, index) => {
            const x = (trailer.currentLocation.lat % 100) * 6;
            const y = (trailer.currentLocation.lng % 100) * 4;
            const isSelected = selectedTrailer === trailer.id;

            return (
              <div
                key={trailer.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all ${
                  isSelected ? 'scale-125 z-10' : 'z-5'
                }`}
                style={{ left: x, top: y }}
                onClick={() => setSelectedTrailer(isSelected ? null : trailer.id)}
                title={`${trailer.id} - ${trailer.carrier}`}
              >
                <div className={`relative ${isSelected ? 'animate-pulse' : ''}`}>
                  <Truck 
                    className={`w-6 h-6 ${
                      trailer.status === 'delayed' ? 'text-red-600' :
                      trailer.status === 'en-route' ? 'text-blue-600' :
                      'text-green-600'
                    }`}
                    style={{ transform: `rotate(${trailer.heading}deg)` }}
                  />
                  {isSelected && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {trailer.id}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-green-600" />
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>En Route</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-red-600" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-400" style={{ borderStyle: 'dashed' }}></div>
            <span>Route</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTrailerList = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Active Trailers</h4>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.trailers.map((trailer) => {
          const route = data.routes.find(r => r.trailerId === trailer.id);
          const isSelected = selectedTrailer === trailer.id;
          
          return (
            <div
              key={trailer.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTrailer(isSelected ? null : trailer.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{trailer.id}</span>
                </div>
                <StatusBadge status={trailer.status} size="sm" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div>
                  <div className="font-medium">Carrier</div>
                  <div>{trailer.carrier}</div>
                </div>
                <div>
                  <div className="font-medium">Speed</div>
                  <div>{formatSpeed(trailer.speed)}</div>
                </div>
                <div>
                  <div className="font-medium">ETA</div>
                  <div>{formatETA(trailer.eta)}</div>
                </div>
                <div>
                  <div className="font-medium">Location</div>
                  <div className="truncate">{trailer.currentLocation.address}</div>
                </div>
              </div>

              {route && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      {route.origin.name} → {route.destination.name}
                    </span>
                    {route.trafficDelay > 0 && (
                      <span className="text-red-600 font-medium">
                        +{route.trafficDelay}min delay
                      </span>
                    )}
                  </div>
                </div>
              )}

              {isSelected && trailer.trafficConditions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-2">Traffic Conditions</div>
                  <div className="space-y-1">
                    {trailer.trafficConditions.slice(0, 3).map((condition, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{condition.segment}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getTrafficColor(condition.condition)}`}>
                          {condition.condition}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTrafficAlerts = () => {
    const activeAlerts = data.trailers.flatMap(trailer => 
      trailer.trafficConditions.filter(condition => 
        condition.condition === 'heavy' || condition.condition === 'blocked'
      ).map(condition => ({ ...condition, trailerId: trailer.id }))
    );

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Traffic Alerts</h4>
        
        {activeAlerts.length === 0 ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <Navigation className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">No active traffic alerts</span>
          </div>
        ) : (
          <div className="space-y-3">
            {activeAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.condition === 'blocked' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${
                      alert.condition === 'blocked' ? 'text-red-600' : 'text-orange-600'
                    }`} />
                    <span className="font-medium text-sm">Trailer {alert.trailerId}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTrafficColor(alert.condition)}`}>
                    {alert.condition.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{alert.segment}</div>
                <div className="text-xs text-gray-600">{alert.description}</div>
                {alert.delay > 0 && (
                  <div className="text-xs text-red-600 font-medium mt-1">
                    Estimated delay: {alert.delay} minutes
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Real-Time Location Tracking</h3>
          <p className="text-sm text-gray-600">
            Last updated: {data.lastUpdated.toLocaleTimeString()} 
            {data.realTimeUpdates && <span className="ml-2 text-green-600">● Live</span>}
          </p>
        </div>
        <div className="flex gap-2">
          {quickActions.map((action) => (
            <QuickActionButton
              key={action.id}
              action={action}
              onAction={onActionClick || (() => {})}
            />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{data.trailers.length}</div>
          <div className="text-sm text-blue-800">Active Trailers</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-600">
            {data.trailers.filter(t => t.status === 'en-route').length}
          </div>
          <div className="text-sm text-green-800">On Schedule</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-2xl font-bold text-red-600">
            {data.trailers.filter(t => t.status === 'delayed').length}
          </div>
          <div className="text-sm text-red-800">Delayed</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-2xl font-bold text-orange-600">
            {data.trailers.flatMap(t => t.trafficConditions).filter(c => c.condition === 'heavy' || c.condition === 'blocked').length}
          </div>
          <div className="text-sm text-orange-800">Traffic Alerts</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderMapView()}
        </div>
        <div className="space-y-6">
          {renderTrailerList()}
          {renderTrafficAlerts()}
        </div>
      </div>
    </div>
  );
};

export default RealTimeLocation;
