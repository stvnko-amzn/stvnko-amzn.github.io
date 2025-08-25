import React from 'react';
import { MetricCard } from './components/MetricCard';
import { StatusBadge } from './components/StatusBadge';
import { HeatmapCalendar } from './components/HeatmapCalendar';
import { Truck, Package, AlertTriangle, MapPin, Users } from 'lucide-react';

interface LogisticsDashboardProps {
  data: {
    metrics: {
      totalShipments: { value: number; trend: { direction: 'up' | 'down' | 'stable'; percentage: number; period: string } };
      completed: { value: number; trend: { direction: 'up' | 'down' | 'stable'; percentage: number; period: string } };
      pending: { value: number; trend: { direction: 'up' | 'down' | 'stable'; percentage: number; period: string } };
      delayed: { value: number; trend: { direction: 'up' | 'down' | 'stable'; percentage: number; period: string } };
    };
    shipments: Array<{
      id: string;
      customerName: string;
      shippingId: string;
      date: string;
      location: string;
      status: 'complete' | 'pending' | 'in-progress' | 'delayed';
    }>;
    activityData: Array<{
      date: string;
      value: number;
      label?: string;
    }>;
    trailerStatus: {
      total: number;
      byStatus: {
        'en-route': number;
        'arrived': number;
        'unloading': number;
        'delayed': number;
      };
    };
  };
  title: string;
  description?: string;
}

export const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({
  data,
  title,
  description
}) => {
  const getStatusFromString = (status: string) => {
    switch (status) {
      case 'complete': return 'complete';
      case 'pending': return 'pending';
      case 'in-progress': return 'in-progress';
      case 'delayed': return 'delayed';
      default: return 'pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-cloudscape-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-cloudscape-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Shipments"
          value={data.metrics.totalShipments.value}
          trend={data.metrics.totalShipments.trend}
          status="info"
          subtitle="All shipments"
        />
        <MetricCard
          title="Completed"
          value={data.metrics.completed.value}
          trend={data.metrics.completed.trend}
          status="success"
          subtitle="Successfully delivered"
        />
        <MetricCard
          title="Pending"
          value={data.metrics.pending.value}
          trend={data.metrics.pending.trend}
          status="warning"
          subtitle="Awaiting processing"
        />
        <MetricCard
          title="Delayed"
          value={data.metrics.delayed.value}
          trend={data.metrics.delayed.trend}
          status="error"
          subtitle="Behind schedule"
        />
      </div>

      {/* Activity Heatmap and Trailer Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Heatmap */}
        <HeatmapCalendar
          data={data.activityData}
          title="Shipment Activity (Last 12 Weeks)"
          colorScheme="blue"
        />

        {/* Trailer Status Overview */}
        <div className="bg-cloudscape-bg-primary border border-cloudscape-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-cloudscape-gray-700 mb-4">
            Trailer Status Overview
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-cloudscape-blue-600" />
                <span className="text-sm text-cloudscape-gray-700">En Route</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-cloudscape-gray-900">
                  {data.trailerStatus.byStatus['en-route']}
                </span>
                <StatusBadge status="en-route" size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cloudscape-green-600" />
                <span className="text-sm text-cloudscape-gray-700">Arrived</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-cloudscape-gray-900">
                  {data.trailerStatus.byStatus.arrived}
                </span>
                <StatusBadge status="arrived" size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-cloudscape-orange-600" />
                <span className="text-sm text-cloudscape-gray-700">Unloading</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-cloudscape-gray-900">
                  {data.trailerStatus.byStatus.unloading}
                </span>
                <StatusBadge status="unloading" size="sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-cloudscape-red-600" />
                <span className="text-sm text-cloudscape-gray-700">Delayed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-cloudscape-gray-900">
                  {data.trailerStatus.byStatus.delayed}
                </span>
                <StatusBadge status="delayed" size="sm" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-cloudscape-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-cloudscape-gray-700">Total Trailers</span>
              <span className="text-lg font-bold text-cloudscape-blue-600">
                {data.trailerStatus.total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Shipments Table */}
      <div className="bg-cloudscape-bg-primary border border-cloudscape-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-cloudscape-gray-200">
          <h4 className="text-sm font-medium text-cloudscape-gray-700">Recent Shipments</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cloudscape-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-cloudscape-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-cloudscape-gray-600 uppercase tracking-wider">
                  Shipping ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-cloudscape-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-cloudscape-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-cloudscape-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cloudscape-gray-200">
              {data.shipments.map((shipment, index) => (
                <tr key={shipment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-cloudscape-gray-50'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-cloudscape-blue-100 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-cloudscape-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-cloudscape-gray-900">
                        {shipment.customerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-cloudscape-gray-700">
                    {shipment.shippingId}
                  </td>
                  <td className="px-4 py-3 text-sm text-cloudscape-gray-700">
                    {new Date(shipment.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-cloudscape-gray-700">
                    {shipment.location}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={getStatusFromString(shipment.status)} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
