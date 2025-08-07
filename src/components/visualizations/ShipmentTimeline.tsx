import React from 'react';
import { CheckCircle, Clock, AlertCircle, Package } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  location?: string;
}

interface ShipmentTimelineProps {
  events: TimelineEvent[];
  title: string;
  description?: string;
}

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ 
  events, 
  title, 
  description 
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'delayed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'in-progress': return 'border-blue-500 bg-blue-50';
      case 'delayed': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getConnectorColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="visualization-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      <div className="relative">
        {events.map((event, index) => (
          <div key={event.id} className="relative flex items-start mb-8 last:mb-0">
            {/* Timeline connector */}
            {index < events.length - 1 && (
              <div 
                className={`absolute left-6 top-12 w-0.5 h-16 ${getConnectorColor(event.status)}`}
              />
            )}
            
            {/* Status icon */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${getStatusColor(event.status)}`}>
              {getStatusIcon(event.status)}
            </div>
            
            {/* Event content */}
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                <span className="text-sm text-gray-500">
                  {event.timestamp.toLocaleString([], { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">{event.description}</p>
              
              {event.location && (
                <div className="flex items-center text-sm text-gray-500">
                  <Package className="w-4 h-4 mr-1" />
                  <span>{event.location}</span>
                </div>
              )}
              
              {/* Status badge */}
              <div className="mt-3">
                <span className={`status-badge ${
                  event.status === 'completed' ? 'on-time' :
                  event.status === 'delayed' ? 'delayed' :
                  event.status === 'in-progress' ? 'arrived' : ''
                }`}>
                  {event.status.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {events.filter(e => e.status === 'delayed').length}
            </div>
            <div className="text-sm text-gray-600">Delayed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">
              {events.filter(e => e.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock timeline data generator
export const generateMockTimeline = (asin: string): TimelineEvent[] => {
  const now = new Date();
  return [
    {
      id: '1',
      title: 'PO Created',
      description: `Purchase order created for ASIN ${asin}`,
      timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed',
      location: 'Vendor Portal'
    },
    {
      id: '2',
      title: 'Vendor Confirmation',
      description: 'Vendor confirmed order and provided estimated ship date',
      timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      status: 'completed',
      location: 'TechSupply Corp'
    },
    {
      id: '3',
      title: 'Shipment Dispatched',
      description: 'Items picked up from vendor facility',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: 'completed',
      location: 'Vendor Facility - Portland, OR'
    },
    {
      id: '4',
      title: 'In Transit',
      description: 'Shipment en route to fulfillment center',
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      status: 'in-progress',
      location: 'Trailer T12345 - I-5 Corridor'
    },
    {
      id: '5',
      title: 'FC Arrival',
      description: 'Expected arrival at fulfillment center',
      timestamp: new Date(now.getTime() + 3 * 60 * 60 * 1000),
      status: 'delayed',
      location: 'SEA4 Fulfillment Center'
    },
    {
      id: '6',
      title: 'Receive & Stow',
      description: 'Items will be received and stowed in inventory',
      timestamp: new Date(now.getTime() + 6 * 60 * 60 * 1000),
      status: 'pending',
      location: 'SEA4 Fulfillment Center'
    }
  ];
};
