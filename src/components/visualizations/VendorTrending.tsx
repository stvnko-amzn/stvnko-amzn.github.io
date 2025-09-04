import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Calendar, Filter, Download } from 'lucide-react';
import { VendorTrendData, TrendPoint, ComparisonMetric, RiskIndicator, InteractiveAction } from '../../types';
import { QuickActionButton } from './components/QuickActionButton';
import { MetricCard } from './components/MetricCard';

interface VendorTrendingProps {
  data: VendorTrendData;
  onActionClick?: (actionId: string, data?: any) => void;
}

const VendorTrending: React.FC<VendorTrendingProps> = ({
  data,
  onActionClick
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'compliance' | 'onTime' | 'volume'>('compliance');

  const getRiskColor = (severity: RiskIndicator['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatPercentage = (value: number) => `${Math.round(value * 100) / 100}%`;

  const getFilteredTrendData = () => {
    const days = selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return data.trendData.filter(point => new Date(point.date) >= cutoffDate);
  };

  const quickActions: InteractiveAction[] = [
    {
      id: 'export-report',
      label: 'Export Report',
      type: 'secondary',
      requiresConfirmation: false,
      icon: '📊',
      metadata: { vendorId: data.vendor.vendorId, timeframe: selectedTimeframe }
    },
    {
      id: 'schedule-review',
      label: 'Schedule Review',
      type: 'primary',
      requiresConfirmation: false,
      metadata: { vendorId: data.vendor.vendorId }
    },
    {
      id: 'escalate-issues',
      label: 'Escalate Issues',
      type: 'warning',
      requiresConfirmation: true,
      confirmationMessage: 'This will create tickets for all high-severity issues. Continue?',
      metadata: { vendorId: data.vendor.vendorId, risks: data.riskIndicators }
    }
  ];

  const renderTrendChart = () => {
    const filteredData = getFilteredTrendData();
    const maxValue = Math.max(...filteredData.map(d => {
      switch (selectedMetric) {
        case 'compliance':
          return d.compliance;
        case 'onTime':
          return d.onTimeDeliveries;
        case 'volume':
          return d.totalShipments;
        default:
          return d.compliance;
      }
    }));

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900">Performance Trend</h4>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className={`px-3 py-1 text-xs rounded-md ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          {[
            { id: 'compliance', label: 'Compliance %', color: 'blue' },
            { id: 'onTime', label: 'On-Time %', color: 'green' },
            { id: 'volume', label: 'Volume', color: 'purple' }
          ].map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`px-3 py-2 text-sm rounded-lg border ${
                selectedMetric === metric.id
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {metric.label}
            </button>
          ))}
        </div>

        {/* Simple trend visualization */}
        <div className="h-48 flex items-end justify-between gap-1 bg-gray-50 rounded p-4">
          {filteredData.map((point, index) => {
            const value = selectedMetric === 'compliance' ? point.compliance :
                         selectedMetric === 'onTime' ? point.onTimeDeliveries :
                         point.totalShipments;
            const height = (value / maxValue) * 100;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t ${
                    selectedMetric === 'compliance' ? 'bg-blue-500' :
                    selectedMetric === 'onTime' ? 'bg-green-500' :
                    'bg-purple-500'
                  } transition-all duration-300 hover:opacity-80`}
                  style={{ height: `${height}%`, minHeight: '4px' }}
                  title={`${new Date(point.date).toLocaleDateString()}: ${
                    selectedMetric === 'volume' ? value : formatPercentage(value)
                  }`}
                ></div>
                <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderComparisonMetrics = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Performance vs Benchmark</h4>
      <div className="space-y-4">
        {data.comparisonMetrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm font-medium ${
                    metric.variance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.variance >= 0 ? '+' : ''}{formatPercentage(metric.variance)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>Current: {formatPercentage(metric.value)}</span>
                <span>Benchmark: {formatPercentage(metric.benchmark)}</span>
              </div>
              <div className="mt-2 flex gap-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 rounded-l-full"
                  style={{ width: `${(metric.value / (metric.benchmark * 1.2)) * 100}%` }}
                ></div>
                <div
                  className="bg-gray-400"
                  style={{ width: `${((metric.benchmark - metric.value) / (metric.benchmark * 1.2)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiskIndicators = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Risk Indicators</h4>
      <div className="space-y-3">
        {data.riskIndicators.map((risk, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${getRiskColor(risk.severity)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium text-sm capitalize">{risk.type.replace('-', ' ')}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(risk.severity)}`}>
                {risk.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-sm mb-2">{risk.description}</p>
            <div className="text-xs">
              <span className="font-medium">Recommendation: </span>
              <span>{risk.recommendation}</span>
            </div>
          </div>
        ))}
        
        {data.riskIndicators.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-800">No active risk indicators</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Vendor Performance Trending</h3>
          <p className="text-sm text-gray-600">{data.vendor.vendorName} ({data.vendor.vendorId})</p>
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

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Overall Compliance"
          value={formatPercentage(data.vendor.compliancePercentage)}
          status={data.vendor.compliancePercentage >= 95 ? 'success' : 
                 data.vendor.compliancePercentage >= 85 ? 'warning' : 'error'}
        />
        <MetricCard
          title="Delivery Window"
          value={formatPercentage(data.vendor.deliveryWindowCompliance)}
          status={data.vendor.deliveryWindowCompliance >= 90 ? 'success' : 
                 data.vendor.deliveryWindowCompliance >= 80 ? 'warning' : 'error'}
        />
        <MetricCard
          title="Total Shipments"
          value={data.vendor.totalShipments}
          subtitle="This period"
        />
        <MetricCard
          title="On-Time Rate"
          value={formatPercentage((data.vendor.onTimeDeliveries / data.vendor.totalShipments) * 100)}
          status={((data.vendor.onTimeDeliveries / data.vendor.totalShipments) * 100) >= 90 ? 'success' : 
                 ((data.vendor.onTimeDeliveries / data.vendor.totalShipments) * 100) >= 80 ? 'warning' : 'error'}
        />
      </div>

      {/* Performance Trend */}
      <div className="mb-6">
        {renderTrendChart()}
      </div>

      {/* Comparison and Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderComparisonMetrics()}
        {renderRiskIndicators()}
      </div>

      {/* Performance Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {getTrendIcon(data.vendor.performanceTrend)}
          <span className="font-medium text-gray-900">Performance Trend: </span>
          <span className={`capitalize ${
            data.vendor.performanceTrend === 'improving' ? 'text-green-600' :
            data.vendor.performanceTrend === 'declining' ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {data.vendor.performanceTrend}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          {data.vendor.performanceTrend === 'improving' 
            ? 'Vendor performance has shown consistent improvement over the selected timeframe.'
            : data.vendor.performanceTrend === 'declining'
            ? 'Vendor performance has declined and may require intervention.'
            : 'Vendor performance has remained stable with no significant changes.'
          }
        </p>
      </div>
    </div>
  );
};

export default VendorTrending;
