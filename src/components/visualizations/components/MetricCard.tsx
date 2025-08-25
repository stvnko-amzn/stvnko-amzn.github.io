import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  status = 'info',
  subtitle
}) => {
  const getStatusColors = () => {
    switch (status) {
      case 'success':
        return 'border-cloudscape-green-200 bg-cloudscape-green-50';
      case 'warning':
        return 'border-cloudscape-orange-200 bg-cloudscape-orange-50';
      case 'error':
        return 'border-cloudscape-red-200 bg-cloudscape-red-50';
      default:
        return 'border-cloudscape-blue-200 bg-cloudscape-blue-50';
    }
  };

  const getValueColor = () => {
    switch (status) {
      case 'success':
        return 'text-cloudscape-green-600';
      case 'warning':
        return 'text-cloudscape-orange-600';
      case 'error':
        return 'text-cloudscape-red-600';
      default:
        return 'text-cloudscape-blue-600';
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-cloudscape-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-cloudscape-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-cloudscape-gray-600" />;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-cloudscape-green-600';
      case 'down':
        return 'text-cloudscape-red-600';
      default:
        return 'text-cloudscape-gray-600';
    }
  };

  return (
    <div className={`bg-cloudscape-bg-primary border rounded-lg p-4 ${getStatusColors()}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-cloudscape-gray-700 mb-1">
            {title}
          </h3>
          <div className={`text-2xl font-bold ${getValueColor()} mb-1`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-cloudscape-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        
        {trend && (
          <div className="flex items-center space-x-1 ml-4">
            {getTrendIcon()}
            <div className="text-right">
              <div className={`text-sm font-medium ${getTrendColor()}`}>
                {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
                {trend.percentage}%
              </div>
              <div className="text-xs text-cloudscape-gray-600">
                {trend.period}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
