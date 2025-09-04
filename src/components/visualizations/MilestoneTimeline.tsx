import React, { useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, XCircle, Calendar, MapPin } from 'lucide-react';
import { MilestoneEvent, InteractiveAction } from '../../types';
import { QuickActionButton } from './components/QuickActionButton';

interface MilestoneTimelineProps {
  milestones: MilestoneEvent[];
  shipmentId: string;
  onActionClick?: (actionId: string, data?: any) => void;
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  shipmentId,
  onActionClick
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);

  const getStatusIcon = (status: MilestoneEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'at-risk':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: MilestoneEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'delayed':
        return 'border-yellow-500 bg-yellow-50';
      case 'at-risk':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateVariance = (planned: Date, actual?: Date) => {
    if (!actual) return null;
    const plannedDate = new Date(planned);
    const actualDate = new Date(actual);
    const diffHours = Math.round((actualDate.getTime() - plannedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours === 0) return null;
    return diffHours > 0 ? `+${diffHours}h` : `${diffHours}h`;
  };

  const quickActions: InteractiveAction[] = [
    {
      id: 'update-eta',
      label: 'Update ETA',
      type: 'primary',
      requiresConfirmation: false,
      metadata: { shipmentId }
    },
    {
      id: 'escalate-delay',
      label: 'Escalate Delay',
      type: 'warning',
      requiresConfirmation: true,
      confirmationMessage: 'This will notify the operations team about the delay. Continue?',
      metadata: { shipmentId }
    },
    {
      id: 'view-route',
      label: 'View Route',
      type: 'secondary',
      requiresConfirmation: false,
      metadata: { shipmentId }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Milestone Timeline</h3>
          <p className="text-sm text-gray-600">Shipment {shipmentId}</p>
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

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const variance = calculateVariance(milestone.plannedDate, milestone.actualDate);
            const isSelected = selectedMilestone === milestone.id;

            return (
              <div
                key={milestone.id}
                className={`relative flex items-start cursor-pointer transition-all duration-200 ${
                  isSelected ? 'transform scale-105' : ''
                }`}
                onClick={() => setSelectedMilestone(isSelected ? null : milestone.id)}
              >
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${getStatusColor(milestone.status)}`}>
                  {getStatusIcon(milestone.status)}
                </div>

                {/* Content */}
                <div className={`ml-4 flex-1 pb-6 ${isSelected ? 'bg-blue-50 -mx-4 px-4 py-3 rounded-lg' : ''}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{milestone.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(milestone.plannedDate)}</span>
                      {variance && (
                        <span className={`px-2 py-1 rounded-full ${
                          variance.startsWith('+') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {variance}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-600">
                    {milestone.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{milestone.location}</span>
                      </div>
                    )}
                    {milestone.actualDate && (
                      <div>
                        Actual: {formatDate(milestone.actualDate)}
                      </div>
                    )}
                  </div>

                  {milestone.description && (
                    <p className="mt-2 text-sm text-gray-600">{milestone.description}</p>
                  )}

                  {isSelected && milestone.details && (
                    <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">Additional Details</h5>
                      <div className="space-y-1 text-xs text-gray-600">
                        {Object.entries(milestone.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Progress indicator for current milestone */}
                  {milestone.status === 'in-progress' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-green-600">
              {milestones.filter(m => m.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {milestones.filter(m => m.status === 'in-progress').length}
            </div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-600">
              {milestones.filter(m => m.status === 'delayed').length}
            </div>
            <div className="text-xs text-gray-600">Delayed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-red-600">
              {milestones.filter(m => m.status === 'at-risk').length}
            </div>
            <div className="text-xs text-gray-600">At Risk</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneTimeline;
