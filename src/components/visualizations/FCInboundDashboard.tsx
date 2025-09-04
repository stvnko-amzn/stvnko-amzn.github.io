import React, { useState } from 'react';
import { Truck, Clock, AlertTriangle, CheckCircle, MapPin, Users, BarChart3, RefreshCw, Activity, Wrench, Timer } from 'lucide-react';
import { FCInboundData, TrailerYardPosition, DockStatus, InteractiveAction, QueuedTrailer } from '../../types';
import { QuickActionButton } from './components/QuickActionButton';
import { MetricCard } from './components/MetricCard';
import { StatusBadge } from './components/StatusBadge';

interface FCInboundDashboardProps {
  data: FCInboundData;
  onActionClick?: (actionId: string, data?: any) => void;
}

const FCInboundDashboard: React.FC<FCInboundDashboardProps> = ({
  data,
  onActionClick
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'yard' | 'docks' | 'analytics'>('overview');
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'arrived':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'unloading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDwellTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    return `${Math.round(hours * 10) / 10}h`;
  };

  const quickActions: InteractiveAction[] = [
    {
      id: 'refresh-data',
      label: 'Refresh',
      type: 'secondary',
      requiresConfirmation: false,
      icon: '🔄',
      metadata: { fcId: data.fcId }
    },
    {
      id: 'optimize-yard',
      label: 'Optimize Yard',
      type: 'primary',
      requiresConfirmation: true,
      confirmationMessage: 'This will reorganize trailer positions for optimal efficiency. Continue?',
      metadata: { fcId: data.fcId }
    },
    {
      id: 'schedule-maintenance',
      label: 'Schedule Maintenance',
      type: 'warning',
      requiresConfirmation: false,
      metadata: { fcId: data.fcId }
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Trailers"
          value={data.trailers.length}
          subtitle="In yard"
        />
        <MetricCard
          title="Available Docks"
          value={data.capacityMetrics.availableDocks}
          subtitle={`of ${data.capacityMetrics.totalDocks}`}
        />
        <MetricCard
          title="Utilization"
          value={`${Math.round(data.capacityMetrics.utilizationPercentage)}%`}
          subtitle="Dock capacity"
          status={data.capacityMetrics.utilizationPercentage > 90 ? 'warning' : 'success'}
        />
        <MetricCard
          title="Queue Length"
          value={data.capacityMetrics.queueLength}
          subtitle="Waiting trailers"
          status={data.capacityMetrics.queueLength > 5 ? 'warning' : 'success'}
        />
      </div>

      {/* Trailer Status Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Trailer Status Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['arrived', 'unloading', 'en-route', 'delayed'].map((status) => {
            const count = data.trailers.filter(t => t.trailer.status === status).length;
            return (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`text-sm capitalize ${getStatusColor(status).split(' ')[1]}`}>
                  {status.replace('-', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Priority Trailers */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">High Priority Trailers</h4>
        <div className="space-y-3">
          {data.trailers
            .filter(t => t.trailer.priority === 'high')
            .slice(0, 5)
            .map((trailerPos) => (
              <div
                key={trailerPos.trailer.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="font-medium text-gray-900">{trailerPos.trailer.id}</div>
                    <div className="text-sm text-gray-600">{trailerPos.trailer.carrier}</div>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={trailerPos.trailer.status} />
                  <div className="text-xs text-gray-600 mt-1">
                    Dwell: {formatDwellTime(trailerPos.dwellTime)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderYardView = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Yard Layout</h4>
        
        {/* Simplified yard visualization */}
        <div className="grid grid-cols-8 gap-2 mb-6">
          {data.yardMap.zones.map((zone) =>
            zone.spots.map((spot) => (
              <div
                key={spot.id}
                className={`aspect-square rounded border-2 border-dashed flex items-center justify-center text-xs cursor-pointer transition-all ${
                  spot.occupied
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-300 text-gray-500'
                } ${selectedTrailer === spot.trailerId ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedTrailer(spot.trailerId || null)}
                title={spot.occupied ? `Trailer: ${spot.trailerId}` : 'Empty spot'}
              >
                {spot.occupied ? <Truck className="w-4 h-4" /> : spot.id.split('-')[1]}
              </div>
            ))
          )}
        </div>

        {/* Zone Legend */}
        <div className="flex gap-4 text-sm">
          {data.yardMap.zones.map((zone) => (
            <div key={zone.id} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded border ${
                zone.type === 'inbound' ? 'bg-blue-100 border-blue-300' :
                zone.type === 'outbound' ? 'bg-green-100 border-green-300' :
                'bg-yellow-100 border-yellow-300'
              }`}></div>
              <span className="capitalize">{zone.name} ({zone.type})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trailer Details */}
      {selectedTrailer && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Trailer Details</h4>
          {(() => {
            const trailerData = data.trailers.find(t => t.trailer.id === selectedTrailer);
            if (!trailerData) return <p className="text-gray-500">Trailer not found</p>;
            
            return (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Trailer ID</div>
                  <div className="font-medium">{trailerData.trailer.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Carrier</div>
                  <div className="font-medium">{trailerData.trailer.carrier}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <StatusBadge status={trailerData.trailer.status} />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Priority</div>
                  <div className={`font-medium capitalize ${getPriorityColor(trailerData.trailer.priority)}`}>
                    {trailerData.trailer.priority}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dwell Time</div>
                  <div className="font-medium">{formatDwellTime(trailerData.dwellTime)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Priority Score</div>
                  <div className="font-medium">{trailerData.priorityScore}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );

  const renderDocksView = () => (
    <div className="space-y-4">
      {/* Enhanced Dock Floor Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Interactive Dock Layout</h4>
        <div className="relative bg-gray-50 rounded-lg p-6 min-h-[300px]">
          {/* North Section */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
            North Section
          </div>
          {data.dockUtilization
            .filter(dock => dock.position?.section === 'north')
            .map((dock) => (
              <div
                key={dock.dockId}
                className={`absolute rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                  dock.status === 'available' ? 'bg-green-100 border-green-300 text-green-800' :
                  dock.status === 'occupied' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                  'bg-red-100 border-red-300 text-red-800'
                }`}
                style={{
                  left: `${dock.position?.x}px`,
                  top: `${dock.position?.y}px`,
                  width: `${dock.position?.width}px`,
                  height: `${dock.position?.height}px`
                }}
                title={`Dock ${dock.dockId} - ${dock.status} - ${dock.efficiency}% efficiency`}
              >
                {dock.dockId}
              </div>
            ))}
          
          {/* South Section */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
            South Section
          </div>
          {data.dockUtilization
            .filter(dock => dock.position?.section === 'south')
            .map((dock) => (
              <div
                key={dock.dockId}
                className={`absolute rounded border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                  dock.status === 'available' ? 'bg-green-100 border-green-300 text-green-800' :
                  dock.status === 'occupied' ? 'bg-blue-100 border-blue-300 text-blue-800' :
                  'bg-red-100 border-red-300 text-red-800'
                }`}
                style={{
                  left: `${dock.position?.x}px`,
                  top: `${dock.position?.y}px`,
                  width: `${dock.position?.width}px`,
                  height: `${dock.position?.height}px`
                }}
                title={`Dock ${dock.dockId} - ${dock.status} - ${dock.efficiency}% efficiency`}
              >
                {dock.dockId}
              </div>
            ))}
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Queue Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Queue Management</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <MetricCard
            title="Current Queue"
            value={data.queueManagement.currentQueueLength}
            subtitle="Waiting trailers"
          />
          <MetricCard
            title="Avg Wait Time"
            value={`${data.queueManagement.averageWaitTime}m`}
            subtitle="Minutes"
          />
          <MetricCard
            title="Est. Processing"
            value={`${Math.round(data.queueManagement.estimatedProcessingTime / 60)}h`}
            subtitle="Hours"
          />
          <MetricCard
            title="Max Queue Today"
            value={data.queueManagement.maxQueueLength}
            subtitle="Peak capacity"
          />
        </div>
        
        {/* Waiting Trailers */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Waiting Trailers</h5>
          {data.queueManagement.waitingTrailers.map((trailer) => (
            <div key={trailer.trailerId} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-yellow-600" />
                <div>
                  <div className="font-medium text-gray-900">{trailer.trailerId}</div>
                  <div className="text-sm text-gray-600">
                    Arrived: {new Date(trailer.arrivalTime).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getPriorityColor(trailer.priority)}`}>
                  {trailer.priority.toUpperCase()}
                </div>
                <div className="text-xs text-gray-600">
                  Wait: {trailer.estimatedWaitTime}m
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Dock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.dockUtilization.map((dock) => (
          <div
            key={dock.dockId}
            className={`bg-white rounded-lg border-2 p-4 ${
              dock.status === 'available' ? 'border-green-200' :
              dock.status === 'occupied' ? 'border-blue-200' :
              'border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Dock {dock.dockId}</h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                dock.status === 'available' ? 'bg-green-100 text-green-800' :
                dock.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {dock.status.charAt(0).toUpperCase() + dock.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2">
              {dock.currentTrailer && (
                <div>
                  <div className="text-sm text-gray-600">Current Trailer</div>
                  <div className="font-medium">{dock.currentTrailer}</div>
                </div>
              )}
              
              <div>
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dock.efficiency >= 80 ? 'bg-green-500' :
                        dock.efficiency >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${dock.efficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{dock.efficiency}%</span>
                </div>
              </div>
              
              {dock.estimatedFreeTime && (
                <div>
                  <div className="text-sm text-gray-600">Est. Free Time</div>
                  <div className="font-medium">
                    {new Date(dock.estimatedFreeTime).toLocaleTimeString()}
                  </div>
                </div>
              )}

              {/* Quick Actions for Dock */}
              <div className="flex gap-2 mt-3">
                {dock.status === 'available' && (
                  <QuickActionButton
                    action={{
                      id: 'assign-trailer',
                      label: 'Assign',
                      type: 'primary',
                      requiresConfirmation: false,
                      metadata: { dockId: dock.dockId }
                    }}
                    onAction={onActionClick || (() => {})}
                  />
                )}
                {dock.status === 'occupied' && (
                  <QuickActionButton
                    action={{
                      id: 'expedite-unload',
                      label: 'Expedite',
                      type: 'warning',
                      requiresConfirmation: true,
                      confirmationMessage: 'Expedite unloading for this dock?',
                      metadata: { dockId: dock.dockId, trailerId: dock.currentTrailer }
                    }}
                    onAction={onActionClick || (() => {})}
                  />
                )}
                <QuickActionButton
                  action={{
                    id: 'schedule-dock-maintenance',
                    label: 'Maintenance',
                    type: 'secondary',
                    requiresConfirmation: false,
                    metadata: { dockId: dock.dockId }
                  }}
                  onAction={onActionClick || (() => {})}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      {/* Utilization Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Unload Time"
          value={`${data.capacityMetrics.averageUnloadTime}m`}
          subtitle="Minutes per trailer"
        />
        <MetricCard
          title="Processing Rate"
          value={`${data.capacityMetrics.processingRate}%`}
          subtitle="Efficiency"
        />
        <MetricCard
          title="Peak Utilization"
          value="95%"
          subtitle="Today's maximum"
        />
        <MetricCard
          title="Throughput"
          value="24"
          subtitle="Trailers/day"
        />
      </div>

      {/* Utilization Heatmap */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Hourly Utilization Pattern</h4>
        <div className="grid grid-cols-24 gap-1">
          {Array.from({ length: 24 }, (_, hour) => {
            const utilization = Math.random() * 100; // Mock data
            return (
              <div
                key={hour}
                className={`h-8 rounded text-xs flex items-center justify-center text-white font-medium ${
                  utilization >= 80 ? 'bg-red-500' :
                  utilization >= 60 ? 'bg-yellow-500' :
                  utilization >= 40 ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                title={`${hour}:00 - ${Math.round(utilization)}% utilization`}
              >
                {hour}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Dock Efficiency Comparison</h4>
          <div className="space-y-3">
            {data.dockUtilization.slice(0, 6).map((dock) => (
              <div key={dock.dockId} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dock {dock.dockId}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dock.efficiency >= 80 ? 'bg-green-500' :
                        dock.efficiency >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${dock.efficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium w-10">{dock.efficiency}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Maintenance Schedule</h4>
          <div className="space-y-3">
            {data.dockUtilization
              .filter(dock => dock.maintenanceSchedule?.scheduledMaintenance.length)
              .slice(0, 3)
              .map((dock) => (
                <div key={dock.dockId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Dock {dock.dockId}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-600">
                      {dock.maintenanceSchedule?.scheduledMaintenance[0]?.type}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(dock.maintenanceSchedule?.scheduledMaintenance[0]?.scheduledDate || '').toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FC Inbound Dashboard</h3>
          <p className="text-sm text-gray-600">Fulfillment Center: {data.fcId}</p>
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

      {/* View Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'yard', label: 'Yard View', icon: MapPin },
          { id: 'docks', label: 'Dock Status', icon: Users },
          { id: 'analytics', label: 'Analytics', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedView === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'yard' && renderYardView()}
      {selectedView === 'docks' && renderDocksView()}
      {selectedView === 'analytics' && renderAnalyticsView()}
    </div>
  );
};

export default FCInboundDashboard;
