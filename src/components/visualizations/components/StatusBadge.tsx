import React from 'react';

interface StatusBadgeProps {
  status: 'complete' | 'pending' | 'in-progress' | 'delayed' | 'cancelled' | 'arrived' | 'en-route' | 'unloading';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'complete':
        return {
          label: 'Complete',
          bgColor: 'bg-cloudscape-green-100',
          textColor: 'text-cloudscape-green-600',
          borderColor: 'border-cloudscape-green-200',
          icon: '✓'
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-cloudscape-orange-100',
          textColor: 'text-cloudscape-orange-600',
          borderColor: 'border-cloudscape-orange-200',
          icon: '⏳'
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          bgColor: 'bg-cloudscape-blue-100',
          textColor: 'text-cloudscape-blue-600',
          borderColor: 'border-cloudscape-blue-200',
          icon: '🔄'
        };
      case 'delayed':
        return {
          label: 'Delayed',
          bgColor: 'bg-cloudscape-red-100',
          textColor: 'text-cloudscape-red-600',
          borderColor: 'border-cloudscape-red-200',
          icon: '⚠️'
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-cloudscape-gray-100',
          textColor: 'text-cloudscape-gray-600',
          borderColor: 'border-cloudscape-gray-200',
          icon: '✕'
        };
      case 'arrived':
        return {
          label: 'Arrived',
          bgColor: 'bg-cloudscape-green-100',
          textColor: 'text-cloudscape-green-600',
          borderColor: 'border-cloudscape-green-200',
          icon: '📍'
        };
      case 'en-route':
        return {
          label: 'En Route',
          bgColor: 'bg-cloudscape-blue-100',
          textColor: 'text-cloudscape-blue-600',
          borderColor: 'border-cloudscape-blue-200',
          icon: '🚛'
        };
      case 'unloading':
        return {
          label: 'Unloading',
          bgColor: 'bg-cloudscape-orange-100',
          textColor: 'text-cloudscape-orange-600',
          borderColor: 'border-cloudscape-orange-200',
          icon: '📦'
        };
      default:
        return {
          label: status,
          bgColor: 'bg-cloudscape-gray-100',
          textColor: 'text-cloudscape-gray-600',
          borderColor: 'border-cloudscape-gray-200',
          icon: '•'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`
        inline-flex items-center space-x-1 rounded-full border font-medium
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${getSizeClasses()}
      `}
    >
      {showIcon && (
        <span className="text-xs">{config.icon}</span>
      )}
      <span>{config.label}</span>
    </span>
  );
};
